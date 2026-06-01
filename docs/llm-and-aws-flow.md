# AI Chat & AWS Clip Upload

Base URL: `http://localhost:3000`  
All endpoints require `Authorization: Bearer <token>` unless noted.

---

## 1. AI Chat System

### Source Files

| Layer | File |
|-------|------|
| Routes | `src/routes/llm.router.js` |
| Controllers | `src/controllers/llm/create-chat.controller.js` |
| | `src/controllers/llm/send-message.controller.js` |
| | `src/controllers/llm/get-chats.controller.js` |
| | `src/controllers/llm/get-chat.controller.js` |
| | `src/controllers/llm/delete-chat.controller.js` |
| Services | `src/services/llm/create-chat.service.js` |
| | `src/services/llm/send-message.service.js` |
| | `src/services/llm/get-chats.service.js` |
| | `src/services/llm/get-chat.service.js` |
| | `src/services/llm/delete-chat.service.js` |
| Models | `src/models/chat.model.js` |
| | `src/models/message.model.js` |
| LLM Utils | `src/utils/llm.js` — `aiModel()`, `buildSystemPrompt()` |

### Overview

Multi-turn conversations with an AI football analyst. Three chat types, each with a different system prompt:

| Type | Linked Resource | System Prompt Context |
|------|----------------|----------------------|
| `general` | None | Football analyst persona only |
| `clip` | `tagId` (required) | Analyst + clip metadata (event, notes, timestamps, match teams) |
| `board` | `boardId` (required) | Analyst + tactical board state (scenes, teams, field config) |

Chat titles are auto-generated:  
- `general` → `"New Chat"`  
- `clip` → `"Clip: Barcelona vs Real Madrid — Goal"`  
- `board` → `"Board: Barcelona Attack Setup"`

### Data Models

**Chat**

| Field | Type | Required | Notes |
|-------|------|----------|-------|
| `userId` | ObjectId → User | yes | Set from JWT |
| `type` | `"general"` \| `"clip"` \| `"board"` | yes | Determines system prompt |
| `tagId` | ObjectId → Tag | clip only | Required when type is `clip` |
| `boardId` | ObjectId → TacticalBoard | board only | Required when type is `board` |
| `title` | String | yes | Auto-generated from type + linked resource |

**Message** (separate collection, not embedded)

| Field | Type | Required | Notes |
|-------|------|----------|-------|
| `chatId` | ObjectId → Chat | yes | Compound index with `createdAt` |
| `role` | `"system"` \| `"user"` \| `"assistant"` | yes | |
| `content` | String | yes | |

### Endpoints

#### Create Chat

```
POST /api/llm/chat
```

**Body:**

```json
{ "type": "general" }
```

```json
{ "type": "clip", "tagId": "67a1..." }
```

```json
{ "type": "board", "boardId": "67a2..." }
```

**Response** `201`:

```json
{
  "success": true,
  "message": "Chat created successfully",
  "data": {
    "_id": "6a1d...",
    "userId": "6a1d...",
    "type": "clip",
    "tagId": "67a1...",
    "title": "Clip: Barcelona vs Real Madrid — Goal",
    "createdAt": "2026-06-01T20:32:51.876Z",
    "updatedAt": "2026-06-01T20:32:51.876Z"
  }
}
```

**Errors:**  
- `400` — `tagId is required for clip chats` / `boardId is required for board chats`  
- `403` — not authorized to access the linked tag/board  
- `404` — linked tag/board not found

---

#### List Chats

```
GET /api/llm/chat?type=clip
```

| Query | Values | Default |
|-------|--------|---------|
| `type` | `general`, `clip`, `board` | all types |

**Response** `200`:

```json
{
  "success": true,
  "data": [
    { "_id": "...", "type": "general", "title": "New Chat", "updatedAt": "..." },
    { "_id": "...", "type": "clip", "tagId": "...", "title": "Clip: ...", "updatedAt": "..." }
  ]
}
```

---

#### Get Chat with Messages

```
GET /api/llm/chat/:chatId?page=1&limit=50
```

| Query | Default |
|-------|---------|
| `page` | 1 |
| `limit` | 50 |

**Response** `200`:

```json
{
  "success": true,
  "data": {
    "chat": { "_id": "...", "type": "clip", "tagId": "...", "title": "Clip: ..." },
    "messages": [
      { "role": "user", "content": "What can you tell me about this goal?", "createdAt": "..." },
      { "role": "assistant", "content": "This counter-attack goal from...", "createdAt": "..." }
    ],
    "pagination": { "page": 1, "limit": 50, "total": 4, "pages": 1 }
  }
}
```

---

#### Send Message

```
POST /api/llm/chat/:chatId/message
```

**Body:**

```json
{ "content": "What formation works best against a high press?" }
```

**Response** `200`:

```json
{
  "success": true,
  "message": "Message sent successfully",
  "data": {
    "chatId": "6a1d...",
    "role": "assistant",
    "content": "Combating a high press is one of the most...",
    "createdAt": "2026-06-01T20:31:22.016Z"
  }
}
```

**Errors:**  
- `400` — `Message content is required`  
- `403` — chat belongs to another user  
- `404` — chat not found

---

#### Delete Chat

```
DELETE /api/llm/chat/:chatId
```

Deletes the chat and **all its messages** (cascade via model pre-hook).

**Response** `200`:

```json
{ "success": true, "message": "Chat deleted successfully" }
```

---

### Message Flow

```
Client                     Server                          LLM
  │                          │                              │
  │  POST /chat/:id/message  │                              │
  │  { content: "..." }      │                              │
  │ ───────────────────────► │                              │
  │                          │  Persist user message        │
  │                          │  Load last 20 messages       │
  │                          │  Build system prompt by type │
  │                          │                              │
  │                          │  chat.completions.create     │
  │                          │  { messages: [sys + history] }│
  │                          │ ────────────────────────────►│
  │                          │                              │
  │                          │         assistant reply       │
  │                          │ ◄────────────────────────────│
  │                          │                              │
  │                          │  Persist assistant message   │
  │                          │                              │
  │      { data: assistant } │                              │
  │ ◄─────────────────────── │                              │
```

**System prompt construction by type:**

- **general** — Base analyst persona: *"You are a professional football analyst. Help coaches with match strategy, formations, player roles, and tactical decisions."*
- **clip** — Base + injected clip context: tag event, notes, start/end time, match teams.  
  Example: *"You are analyzing a specific clip from 'Barcelona vs Real Madrid'. Clip event: Goal. Notes: Counter-attack from the right. Time: 120-145 seconds."*
- **board** — Base + injected board context: board name, field type, home/away team names and colors, serialized scenes array.

The last 20 messages are loaded as conversation history. The system prompt is **not** persisted — it is rebuilt on every request so it always reflects the current state of the linked tag/board.

### Cascade Deletes

| Trigger | What gets deleted |
|---------|-------------------|
| User deleted | All user's Chats → each chat's Messages |
| Tag deleted | Chats with `type: "clip"` and matching `tagId` → their Messages |
| TacticalBoard deleted | Chats with `type: "board"` and matching `boardId` → their Messages |
| Chat deleted | All Messages with matching `chatId` |

---

## 2. AWS S3 Clip Upload Flow

### Source Files

| Layer | File |
|-------|------|
| Routes | `src/routes/tag.router.js` |
| Controllers | `src/controllers/tag/send-upload-url.controller.js` |
| | `src/controllers/tag/verify-upload.controller.js` |
| | `src/controllers/tag/link-tacticalborad-to-tag.controller.js` |
| | `src/controllers/tag/create-tag.controller.js` |
| Services | `src/services/tag/upload-tag-clip.service.js` — gets presigned URL |
| | `src/services/tag/verify-tag-upload.service.js` — confirms upload, writes clipURL |
| | `src/services/tag/link-tacticalborad-to-tag.service.js` — creates board from tag |
| | `src/services/tag/create-tag.service.js` |
| AWS | `src/services/aws/aws.service.js` — `generateUploadURL()` |
| | `src/services/aws/aws-confirm-upload.service.js` — `AWSHeadObject()` |
| Config | `src/config/aws.config.js` — S3Client instance |
| Model | `src/models/tags.model.js` — `clipKey`, `clipURL` fields |
| | `src/models/tactical-borad.model.js` — created via link endpoint |

### Overview

Video clips are uploaded **directly from the client to S3** using presigned URLs. The server never handles video bytes — it only generates the upload URL and later verifies the object exists.

**Why presigned URLs?** No server memory/CPU overhead for large video files, direct S3 transfer with the client.

### Sequence

```
Client                          Server                         AWS S3
  │                               │                              │
  │  1. POST /tag/:tagId/upload-url│                              │
  │ ─────────────────────────────►│                              │
  │                               │  Verify tag ownership        │
  │                               │  Generate presigned PUT URL  │
  │                               │  (key: tags/{tagId}.mp4)     │
  │                               │  (TTL: 10 minutes)           │
  │                               │                              │
  │    { url, key }               │                              │
  │ ◄─────────────────────────────│                              │
  │                               │                              │
  │  2. PUT {presigned url}                                      │
  │  Body: video/mp4 binary                                       │
  │ ─────────────────────────────────────────────────────────────►│
  │                               │                              │
  │    200 OK                     │                              │
  │ ◄────────────────────────────────────────────────────────────│
  │                               │                              │
  │  3. POST /tag/:tagId/verify-upload                            │
  │ ─────────────────────────────►│                              │
  │                               │  Verify tag ownership        │
  │                               │  HeadObject(tags/{tagId}.mp4)│
  │                               │ ────────────────────────────►│
  │                               │                              │
  │                               │    200 (object exists)       │
  │                               │ ◄────────────────────────────│
  │                               │                              │
  │                               │  Write clipURL on Tag doc    │
  │                               │  clipURL = https://{bucket}  │
  │                               │    .s3.{region}.amazonaws.com│
  │                               │    /tags/{tagId}.mp4         │
  │                               │                              │
  │    { data: clipURL }          │                              │
  │ ◄─────────────────────────────│                              │
```

### Step 1: Get Presigned Upload URL

```
POST /api/tag/:tagId/upload-url
```

No request body.

**Response** `200`:

```json
{
  "success": true,
  "message": "url successfully sent",
  "data": {
    "url": "https://bucket.s3.region.amazonaws.com/tags/67a1....mp4?X-Amz-...",
    "key": "tags/67a1....mp4"
  }
}
```

The `url` is valid for **10 minutes**. The client must PUT the video before it expires.

**Errors:**  
- `403` — tag belongs to another user  
- `404` — tag not found

**Client upload (step 2, not a server endpoint):**

```bash
curl -X PUT "{presigned url}" \
  -H "Content-Type: video/mp4" \
  --data-binary @clip.mp4
```

### Step 3: Verify Upload

```
POST /api/tag/:tagId/verify-upload
```

No request body. Server calls `HeadObject` on S3 to confirm the file exists, then writes `clipURL` on the Tag document.

**Response** `200`:

```json
{
  "success": true,
  "message": "Clip Uploaded Successfully",
  "data": "https://tactix-clips.s3.eu-west-1.amazonaws.com/tags/67a1....mp4"
}
```

**Errors:**  
- `403` — tag belongs to another user  
- `404` — tag not found  
- `500` — object not found in S3 yet (upload may still be in progress)

### Link Tag to Tactical Board

After uploading a clip, you can create a tactical board linked to it:

```
POST /api/tag/:tagId/link
```

No request body. Creates a new TacticalBoard with `tagId` set. One-to-one — a tag can only have one board.

**Response** `201`:

```json
{
  "success": true,
  "message": "Tag Linked To a new tactical board successfully",
  "data": {
    "_id": "67b2...",
    "userId": "67a0...",
    "tagId": "67a1...",
    "name": "67a1... board",
    "scenes": [],
    "fieldType": "full",
    "fieldRotation": 0
  }
}
```

**Errors:**  
- `403` — tag belongs to another user  
- `404` — tag not found  
- `409` — `tactical board already exists` for this tag

### S3 Key Format

| Pattern | Example |
|---------|---------|
| Key | `tags/{tagId}.mp4` |
| Clip URL | `https://{AWS_S3_BUCKET}.s3.{AWS_REGION}.amazonaws.com/tags/{tagId}.mp4` |
| Content-Type | `video/mp4` |
| Presigned TTL | 10 minutes |

### Required Environment Variables

| Variable | Purpose |
|----------|---------|
| `AWS_REGION` | S3 bucket region |
| `AWS_ACCESS_KEY_ID` | IAM credentials |
| `AWS_SECRET_ACCESS_KEY` | IAM credentials |
| `AWS_S3_BUCKET` | Target bucket name |

### Tag Document After Upload

```json
{
  "_id": "67a1...",
  "matchId": "67a0...",
  "startTime": 120,
  "endTime": 145,
  "event": "Goal",
  "notes": "Counter-attack from the right wing",
  "clipKey": "tags/67a1....mp4",
  "clipURL": "https://tactix-clips.s3.eu-west-1.amazonaws.com/tags/67a1....mp4"
}
```

`clipKey` and `clipURL` are empty until step 3 (verify-upload) succeeds.
