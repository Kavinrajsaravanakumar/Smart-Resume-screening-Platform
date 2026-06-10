# Smart Resume Screening Platform

Full-stack cloud-native resume screening demo for HR teams. Candidates upload resumes, the backend extracts profile data, ranks candidates against required skills, and recruiters review the results in a responsive dashboard.

## Tech Stack

- Frontend: React, Vite, React Router, Axios
- Backend: Node.js, Express.js, MVC structure
- Resume parsing: PDF and DOCX extraction
- Storage: local JSON for demos, AWS-ready DynamoDB/S3 templates
- DevOps: Docker, Docker Compose, Kubernetes, Jenkins, Terraform,

## Project Structure

```text
resume-screening-platform/
├── frontend/
├── backend/
├── kubernetes/
├── terraform/
├── jenkins/
├── monitoring/
└── docs/
```

## Local Setup

Backend:

```bash
cd backend
cp .env.example .env
npm install
npm run dev
```

Frontend:

```bash
cd frontend
cp .env.example .env
npm install
npm run dev
```

Open `http://localhost:5173`.

## Docker Compose

Create `backend/.env` from `backend/.env.example`, then run:

```bash
docker compose up --build
```

Frontend runs on `http://localhost:8080`; backend runs on `http://localhost:5000`.

## API

See [docs/API.md](docs/API.md).

## Ranking Logic

The backend compares required skills with extracted candidate skills:

```text
Required: Java, AWS, Docker, Kubernetes
Candidate: Java, AWS, Docker
Score: 3 / 4 = 75%
```

## Deployment Notes

- Build and push images for the frontend and backend.
- Update image names in `kubernetes/*.yaml`.
- Provision AWS S3, DynamoDB, SNS, and IAM resources with Terraform.
- Serve the frontend through CloudFront when moving beyond the demo environment.
- Scrape `/metrics` with Prometheus and import `monitoring/grafana-dashboard.json` into Grafana.

## Security Practices Included

- Helmet security headers
- CORS configuration through environment variables
- Rate limiting
- Upload MIME type and extension validation
- File size limits
- Request validation with Joi
- Centralized error handling
- Environment-driven configuration
