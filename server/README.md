# 🚀 Smart Resume Screening Server (Backend API)

Node.js + Express + MongoDB backend with Gemini AI resume parsing.

---

## 🛠️ Setup Steps

### 1. Install Dependencies
```bash
cd server
npm install
```

### 2. Configure Environment Variables
Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```
Open `.env` and fill in:
- `MONGO_URI`: Your MongoDB Atlas connection string (or local `mongodb://localhost:27017/smart_resume_screening`)
- `PORT`: `5000` (default)
- `JWT_SECRET`: Any secure random secret
- `GEMINI_API_KEY`: Your Google Gemini API key (optional — if omitted, regex-based fallback extraction is used automatically)
- `CLIENT_URL`: `http://localhost:5173`

### 3. Seed Database with Initial Data
Seeds the database with:
- 1 HR Director user: `sarah@company.com` / `password123`
- Default scoring settings (100% weights)
- 12 candidates matching frontend mock data (5 Shortlisted, 3 In Review, 2 Pending, 2 Rejected)
- Initial recruitment activities

```bash
npm run seed
```

### 4. Run Development Server
```bash
npm run dev
```
Server runs at [http://localhost:5000](http://localhost:5000).

---

## 📡 API Endpoints Overview

| Method | Endpoint | Description | Auth Required |
|---|---|---|---|
| `POST` | `/api/auth/register` | Register new user | No |
| `POST` | `/api/auth/login` | Login user and get JWT | No |
| `GET` | `/api/auth/me` | Get current logged-in user | Yes |
| `GET` | `/api/candidates` | List candidates (`?search=`, `?status=`) | Yes |
| `GET` | `/api/candidates/:id` | Get candidate details by ID | Yes |
| `PUT` | `/api/candidates/:id` | Update candidate details | Yes |
| `PATCH` | `/api/candidates/:id/status` | Update candidate status & log activity | Yes |
| `DELETE` | `/api/candidates/:id` | Delete candidate & logs | Yes |
| `POST` | `/api/resumes/upload` | Upload & evaluate PDF resumes (Gemini + fallback) | Yes |
| `GET` | `/api/resumes/:candidateId` | Serve PDF resume file | Yes |
| `GET` | `/api/dashboard` | Dashboard metrics, top candidates & activities | Yes |
| `GET` | `/api/analytics` | Candidate distributions, skills & hiring pipeline | Yes |
| `GET` | `/api/settings` | Get scoring weights & required skills | Yes |
| `PUT` | `/api/settings` | Update scoring weights & required skills | Yes |
