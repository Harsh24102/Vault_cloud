# ☁️ Vault Cloud — Secure File-Sharing Rooms

![Next.js](https://img.shields.io/badge/Next.js-13-000000?logo=nextdotjs&logoColor=white)
![AWS S3](https://img.shields.io/badge/Storage-AWS%20S3-FF9900?logo=amazons3&logoColor=white)
![MongoDB](https://img.shields.io/badge/Database-MongoDB-47A248?logo=mongodb&logoColor=white)
![Firebase](https://img.shields.io/badge/Chat-Firestore-FFCA28?logo=firebase&logoColor=black)

A Next.js web app where users create private **rooms**, invite other users by email, and share
files inside the room. Files go straight from the browser to **AWS S3**; room chat runs on
**Firestore**.

## Features

- **Accounts** — register and sign in with NextAuth (credentials); passwords hashed with `bcrypt`.
- **Password reset by email** — single-use random reset links sent with Nodemailer.
- **Rooms** — each room gets a random name and short id; only the owner can invite, remove
  members or delete it.
- **Invites** — the owner invites a registered user by email; the user accepts from the Requests page.
- **File sharing** — uploads use short-lived S3 **pre-signed POST URLs** (60 s, up to 1 MB per file),
  so files never pass through the server; each user's files live under their own S3 prefix.
- **Room chat** — real-time messages stored in Firestore.

## How it works

```
Browser ──(sign in)──► Next.js API routes ──► MongoDB (users, rooms, invites)
   │                          │
   │                          └─► S3 pre-signed POST URL
   ├──────────── upload file directly ────────► AWS S3
   └──────────── room chat ───────────────────► Firestore
```

## Tech stack

Next.js 13 · React 18 · NextUI · NextAuth · MongoDB / Mongoose · AWS S3 (aws-sdk) ·
Firebase Firestore · bcrypt · Nodemailer

## Project structure

| Path | Purpose |
|---|---|
| `pages/` | Pages: login, register, dashboard, rooms, room/[id], upload, listfiles, requests, password reset |
| `pages/api/auth/` | NextAuth sign-in; forgot / check / reset password |
| `pages/api/room/` | Create, list, check access to, and delete rooms |
| `pages/api/invite/` | Create, list and accept invites; remove members |
| `pages/api/files/` | S3 pre-signed upload URL and file listing |
| `libs/models/` | Mongoose models (User, Room, Request, File) |
| `libs/utils/` | Database connection, mailer, helpers |
| `firebase.js` | Firestore client (keys read from environment variables) |

## Run locally

```bash
git clone https://github.com/Harsh24102/Vault_cloud.git
cd Vault_cloud
yarn install
cp .env.example .env.local     # then fill in your own values
yarn dev                       # http://localhost:3000
```

You need a MongoDB database, an S3 bucket (region `ap-south-1`, with CORS allowing POST from
your site), a Firebase project with Firestore, and an email account for sending mail (for Gmail,
use an App Password). All settings are listed in [`.env.example`](.env.example). `.env.local` is
git-ignored; never commit real keys.

## Security fixes (Oct 2026)

A review of the API fixed these issues:

- Email credentials moved out of the code into environment variables.
- Password reset: a request without a token could reset the **first user's** password; tokens were
  only 5 random characters; the response returned the password hash. All fixed.
- Rooms: any signed-in user could delete any room, remove members or send invites to rooms they
  didn't own. Now owner-only.
- Every room was created with the **same** name and short id (the defaults were computed once at
  startup), so rooms after the first one could not be opened. Each room now gets its own.
- Accepting an invite added the member as a nested array and crashed on an invalid invite id.
- Removed an unused upload helper that could not run, an empty API route and an unprotected
  "delete all rooms" route.
