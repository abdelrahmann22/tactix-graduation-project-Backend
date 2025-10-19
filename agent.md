# Tactix - Sports Analysis Application

## Overview

Tactix is a sports analysis application inspired by LongoMatch and Metrica Sports, designed to provide comprehensive match analysis tools for sports professionals and enthusiasts.

## Tech Stack

### Backend Technologies

- Node.js
- Express.js (ESM modules)
- MongoDB (Database)
- Mongoose (ODM)

### Database Schema

```
- Users
- Tokens
```

## Core Features

### 1. Authentication

- register
- verify email using nodemailer

## Project Structure

```
server/
├── controllers/
        auth/
├── models/
├── routes/
├── config/
├── middleware/
├── services/
        auth/
└── utils/

```

## API Endpoints

```
  auth
    POST /api/auth/register
    GET /api/auth/verify
```

## Dependencies

```json
{
  "bcryptjs": "^3.0.2",
  "crypto": "^1.0.1",
  "dotenv": "^17.2.3",
  "express": "^5.1.0",
  "express-async-handler": "^1.2.0",
  "express-validator": "^7.2.1",
  "jsonwebtoken": "^9.0.2",
  "mongoose": "^8.19.1",
  "nodemailer": "^7.0.9",
  "nodemon": "^3.1.10"
}
```
