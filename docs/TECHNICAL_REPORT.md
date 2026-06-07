# Smart Resume Screening Platform - Technical Analysis Report

## 1. Executive Summary

The Smart Resume Screening Platform is a generated full-stack demonstration project with a React/Vite frontend, Node.js/Express backend, local JSON persistence, resume parsing for PDF and DOCX files, candidate ranking by required-skill matching, Docker support, Kubernetes manifests, Terraform AWS starter resources, Jenkins CI/CD, and Prometheus/Grafana monitoring assets.

The project is suitable as a final-year, portfolio, or interview demonstration. It is not production-enterprise ready yet because authentication, authorization, real database wiring, S3 upload integration, CI registry publishing, test coverage, secret management, and production-grade resume extraction are incomplete.

## 2. Project Overview

- **Project name:** Smart Resume Screening Platform.
- **Purpose:** Help HR users upload resumes, extract candidate profiles, rank candidates by skills, and view candidates through recruiter pages and dashboards.
- **Scope:** Frontend UI, backend REST APIs, basic resume parsing, local candidate storage, deployment templates, infrastructure starters, and monitoring starters.
- **Target users:** HR recruiters, hiring managers, technical evaluators, DevOps portfolio reviewers, and academic project evaluators.

## 3. Complete Folder Structure Analysis

- **`frontend/`:** React/Vite application. Contains UI pages, reusable components, API client, CSS, Nginx config, Dockerfile, Vite config, ESLint config, package files, and generated `dist/` after build.
- **`frontend/src/`:** Main frontend source. `main.jsx` mounts React with `BrowserRouter`; `App.jsx` defines routes; `styles.css` contains all styling.
- **`frontend/src/pages/`:** Five route-level screens: `Home.jsx`, `ResumeUpload.jsx`, `CandidateList.jsx`, `CandidateDetails.jsx`, and `Dashboard.jsx`.
- **`frontend/src/components/`:** Shared UI components: `AppLayout.jsx`, `LoadingState.jsx`, `StatCard.jsx`, and `StatusBadge.jsx`.
- **`frontend/src/api/`:** Axios API setup in `client.js` and candidate/resume/dashboard API functions in `candidates.js`.
- **`backend/`:** Express API service with Dockerfile, package files, ESLint config, `.env.example`, upload folder, local data folder, and source modules.
- **`backend/src/`:** Backend application source. `server.js` starts the server; `app.js` configures Express middleware, health, metrics, and API routes.
- **`backend/src/controllers/`:** Request/response handlers for resume upload, candidates, and dashboard stats.
- **`backend/src/routes/`:** Express route definitions for `/api/resumes`, `/api/candidates`, and `/api/dashboard`.
- **`backend/src/services/`:** Business logic for candidate filtering/stats, resume parsing, and score calculation.
- **`backend/src/middlewares/`:** Upload validation, error handling, and Prometheus metrics middleware.
- **`backend/src/models/`:** Candidate model functions for create, find, find by ID, and delete.
- **`backend/src/repositories/`:** Local JSON repository used by the app, plus a DynamoDB repository that exists but is not wired into the model.
- **`backend/src/validators/`:** Joi schemas for resume upload body, candidate query filters, and candidate ID params.
- **`kubernetes/`:** Seven Kubernetes manifests: namespace, ConfigMap, backend deployment/service, frontend deployment/service, and ingress.
- **`terraform/`:** AWS provider, variables, outputs, and starter resources for S3, DynamoDB, SNS, IAM role, and IAM policy.
- **`jenkins/`:** Jenkinsfile with install, build, Docker image build, and Kubernetes deployment stages.
- **`monitoring/`:** Prometheus scrape config and a Grafana dashboard JSON.
- **`docs/`:** API documentation, architecture overview, and this technical report.
- **Root files:** `README.md`, `.gitignore`, and `docker-compose.yml`.

## 4. Frontend Analysis

- **Framework used:** React 18 with Vite, React Router DOM, Axios, and Lucide React icons.
- **Routing implementation:** `App.jsx` uses `<Routes>` and `<Route>` for `/`, `/upload`, `/candidates`, `/candidates/:id`, and `/dashboard`. `main.jsx` wraps the app in `BrowserRouter`.
- **Components:** `AppLayout` provides sidebar navigation and content shell; `LoadingState` displays loading text; `StatCard` renders dashboard metrics; `StatusBadge` converts ranking score into strong/moderate/low visual tone.
- **Pages:** `Home` is an entry page; `ResumeUpload` handles file upload and required skills; `CandidateList` handles search/filter/delete; `CandidateDetails` displays one profile; `Dashboard` shows summary cards, top candidates, and recent uploads.
- **State management:** Local React `useState`, `useEffect`, and `useMemo`. There is no Redux, Context state, or query cache.
- **API integration:** `frontend/src/api/client.js` creates an Axios instance using `VITE_API_BASE_URL` or `http://localhost:5000/api`. `candidates.js` wraps all REST calls.
- **UI architecture:** A single CSS file defines enterprise-style layout, sidebar navigation, responsive grids, table styling, badges, cards, upload form, and mobile behavior.

## 5. Backend Analysis

- **Architecture pattern:** Express MVC-like structure: routes call controllers, controllers call services, services call models/repositories.
- **Controllers:** `resumeController` validates upload body, parses resume, computes score, and creates candidate; `candidateController` handles list/detail/delete; `dashboardController` returns aggregate stats.
- **Routes:** `resumeRoutes.js`, `candidateRoutes.js`, and `dashboardRoutes.js` expose the business APIs.
- **Services:** `resumeParserService` extracts text and candidate fields; `rankingService` calculates matching score; `candidateService` creates, filters, sorts, deletes, and aggregates candidates.
- **Middleware:** Helmet, CORS, JSON body parsing, Morgan logging, Express rate limiting, Prometheus metrics, Multer upload handling, 404 handler, and centralized error handler.
- **Models:** `candidateModel.js` shapes the Candidate record and delegates persistence to `localJsonRepository`.
- **Validation:** Joi validates request body, query filters, and UUID route params. Multer validates file size, MIME type, and extension.

## 6. Resume Processing Analysis

- **PDF parsing approach:** `pdf-parse` reads the uploaded PDF buffer and returns extracted text.
- **DOCX parsing approach:** `mammoth.extractRawText({ path })` extracts raw text from DOCX files.
- **Candidate data extraction logic:** Name is the first non-empty text line with non-letter characters stripped. Email and phone use regex. Skills are matched against a hardcoded list. Education is matched against a small hardcoded term list. Experience uses a regex for `N years` or `N yrs`.
- **Skill matching logic:** Required skills are split from comma-separated upload input; candidate skills come from known-skill text detection.
- **Ranking score calculation:** `round((matchedRequiredSkills / requiredSkills.length) * 100)`. If no required skills are supplied, score is `0`.

## 7. API Analysis

### Business APIs

| Route | Method | Purpose | Request | Response | Validation | Error handling |
|---|---:|---|---|---|---|---|
| `/api/resumes/upload` | POST | Upload and parse resume | `multipart/form-data` with `resume` and optional `requiredSkills` | `201` with created candidate | Joi body schema; Multer file size, MIME, extension checks | 400 for missing/invalid file/body; 500 via central handler |
| `/api/candidates` | GET | List candidates sorted by score | Query: `search`, `skills`, `education`, `minExperience`, `minScore` | `200 { data: Candidate[] }` | Joi query schema | 400 for invalid query; 500 via central handler |
| `/api/candidates/:id` | GET | Fetch one candidate | UUID path param | `200 { data: Candidate }` | Joi UUID param schema | 400 invalid ID; 404 missing candidate; 500 central |
| `/api/candidates/:id` | DELETE | Delete one candidate | UUID path param | `200 { message }` | Joi UUID param schema | 400 invalid ID; 404 missing candidate; 500 central |
| `/api/dashboard/stats` | GET | Dashboard totals and lists | None | `200 { data: { totalCandidates, topCandidates, recentUploads } }` | None beyond route | 500 central |

### Operational APIs

| Route | Method | Purpose | Response |
|---|---:|---|---|
| `/health` | GET | Health probe for Docker/Kubernetes checks | `{ "status": "ok", "service": "resume-screening-api" }` |
| `/metrics` | GET | Prometheus metrics endpoint | Prometheus text exposition format |

## 8. Security Analysis

- **Helmet:** Enabled with default Helmet protections in `app.js`.
- **Rate limiting:** Global rate limit of 300 requests per 15 minutes.
- **Input validation:** Joi validates API request data; Multer validates upload type and size.
- **CORS:** Uses `FRONTEND_ORIGIN`. If set to `*`, code passes `origin: true`, effectively reflecting origins.
- **Security strengths:** Helmet, rate limiting, file type checks, upload size limit, centralized error responses, no hardcoded AWS secrets, and environment-driven configuration.
- **Security improvements:** Add authentication, role-based authorization, CSRF strategy if cookies are introduced, virus scanning for uploaded resumes, S3 private object handling, stronger file signature validation, request correlation IDs, stricter production CORS, secret manager usage, and audit logs.

## 9. Database Analysis

- **Actual persistence:** Local file storage in `backend/data/candidates.json` through `localJsonRepository.js`.
- **Data model:** Candidate records contain `candidateId`, `name`, `email`, `phone`, `skills`, `education`, `experience`, `rankingScore`, `resumeUrl`, and `createdAt`.
- **Collections/tables:** Runtime uses a JSON array, not a real database. Terraform defines a DynamoDB table named `Candidates`, but the running app does not switch to the DynamoDB repository.
- **Relationships:** No relationships; candidate is a standalone entity.
- **Indexing recommendations:** For DynamoDB, keep `candidateId` as partition key; add GSIs for `email`, `rankingScore`, and possibly `createdAt`. For richer search, use OpenSearch or a normalized skill index.

## 10. AWS Readiness Analysis

- **EC2:** Terraform has an `ec2_instance_type` variable but no EC2 resource. Dockerfiles allow EC2 container hosting manually.
- **S3:** Terraform creates a private S3 bucket and IAM permissions, but backend uploads remain local and do not use S3.
- **DynamoDB:** Terraform creates a `Candidates` table, and a DynamoDB repository exists. The main model still imports local JSON storage, so DynamoDB is not active.
- **SNS:** Terraform creates an SNS topic and IAM publish permission. The backend does not publish SNS events.
- **CloudFront:** Mentioned in docs only. No Terraform CloudFront distribution exists.
- **IAM:** Terraform creates an EC2-assumable IAM role and inline policy for S3, DynamoDB, and SNS.

## 11. Docker Analysis

- **Backend Dockerfile:** Uses `node:20-alpine`, installs production dependencies, copies source, creates `uploads` and `data`, exposes 5000, and runs `npm start`.
- **Frontend Dockerfile:** Multi-stage build with Node for Vite build and Nginx for static serving.
- **Docker Compose:** Builds frontend/backend and runs Prometheus/Grafana. Backend volumes persist uploads and JSON data.
- **Optimization suggestions:** Use `npm ci` when lockfiles are present, add `.dockerignore`, run containers as non-root users, add healthchecks, pin exact base image digests, and avoid baking unused files into images.

## 12. Kubernetes Analysis

- **Deployment manifests:** Backend and frontend deployments each run two replicas.
- **Services:** Backend uses a ClusterIP-style service on port 5000; frontend uses a LoadBalancer service on port 80.
- **Scaling strategy:** Static `replicas: 2`; no HorizontalPodAutoscaler.
- **Production readiness:** Includes probes and resource requests/limits for backend; frontend has resources but no probes. Missing Secrets, persistent volumes for local uploads/data, image registry names, TLS ingress, autoscaling, service account/IAM integration, and network policies.

## 13. Terraform Analysis

- **Resources created:** 6 resources: S3 bucket, S3 public access block, DynamoDB table, SNS topic, IAM role, IAM role policy.
- **Infrastructure structure:** Simple provider/variables/main/outputs layout.
- **Security review:** S3 public access is blocked and IAM is scoped to specific resources. Missing encryption settings, bucket versioning, lifecycle policies, CloudFront, EC2/EKS resources, remote state backend, least-privilege refinement, and secret management.

## 14. Jenkins Pipeline Analysis

- **CI stages:** Install Backend, Install Frontend, Quality Gates.
- **CD stages:** Build Images and Deploy Kubernetes.
- **Build process:** Uses `npm ci || npm install`, builds frontend, then Docker-builds backend/frontend images.
- **Deployment process:** On `main`, runs `kubectl apply -f kubernetes/`.
- **Gaps:** No backend lint/test stage, no frontend lint stage, no Docker registry push, no credentials handling, no image tag injection into manifests, no Terraform stage, and no rollback strategy.

## 15. Monitoring Analysis

- **Prometheus metrics exposed:** `prom-client` default metrics and custom `http_request_duration_seconds` histogram labeled by method, route/path, and status code.
- **Grafana dashboards:** Two panels: HTTP request duration and Node.js resident memory.
- **Observability coverage:** Basic backend metrics only. No structured tracing, frontend monitoring, logs dashboard, alert rules, uptime checks, business metrics, or Kubernetes scrape annotations.

## 16. Performance Analysis

- **Potential bottlenecks:** Local JSON file read/write on each operation, full-array scans, no pagination, PDF/DOCX parsing on request thread, no upload queue, no cache, and client-side table rendering for all candidates returned.
- **Scalability assessment:** Good enough for demo scale. Poor for multi-instance Kubernetes because each pod has independent local files unless shared storage is added.
- **Optimization opportunities:** Wire DynamoDB, add S3 uploads, add pagination, offload parsing to background workers, add SNS/SQS event flow, introduce search indexing, add API response caching where useful, and add batch upload support.

## 17. Production Readiness Score

| Area | Score | Rationale |
|---|---:|---|
| Frontend | 7/10 | Clean responsive UI and routing, but no auth, tests, or query cache. |
| Backend | 6/10 | Clear MVC structure and validation, but local storage and limited extraction logic. |
| Security | 5/10 | Basic middleware exists, but no identity, RBAC, malware scanning, or secrets management. |
| DevOps | 7/10 | Docker, Kubernetes, Jenkins, Terraform starters exist; registry/rollback/test stages missing. |
| Monitoring | 5/10 | Metrics endpoint and basic dashboard exist; alerts/tracing/logging absent. |
| Scalability | 4/10 | Local JSON storage and synchronous parsing limit scale. |
| Maintainability | 7/10 | Modular structure and linting are good; tests and stronger repository abstraction needed. |

## 18. Architecture Diagram

```text
User / Recruiter
      |
      v
React Frontend (Vite, React Router)
  |       |        |         |
Home   Upload   Candidate   Dashboard
        |       List/Detail      |
        +-----------+------------+
                    |
                    v
Axios API Client (VITE_API_BASE_URL)
                    |
                    v
Express Backend
  +-----------------+------------------+
  | app.js middleware stack            |
  | Helmet, CORS, JSON, Morgan, Rate   |
  | Limit, Metrics, Error Handling     |
  +-----------------+------------------+
                    |
        +-----------+------------+
        |                        |
        v                        v
Routes / Controllers       /health and /metrics
        |
        v
Services
  |-- resumeParserService: pdf-parse, mammoth, regex extraction
  |-- rankingService: required skill match percentage
  |-- candidateService: filter, sort, stats
        |
        v
candidateModel
        |
        v
localJsonRepository -> backend/data/candidates.json

AWS-ready but not wired at runtime:
DynamoDB repository, Terraform S3/DynamoDB/SNS/IAM resources
```

## 19. DevOps Workflow Diagram

```text
Developer
   |
   v
GitHub Repository
   |
   v
Jenkins Pipeline
   |
   +--> Install Backend dependencies
   +--> Install Frontend dependencies
   +--> Build Frontend
   +--> Docker build backend image
   +--> Docker build frontend image
   |
   v
Docker Registry (intended; not implemented in Jenkinsfile)
   |
   v
Kubernetes Cluster
   |
   +--> backend Deployment -> backend Service -> /api, /health, /metrics
   +--> frontend Deployment -> frontend Service -> browser UI
   +--> Ingress routes / to frontend and /api to backend
```

## 20. Project Statistics

- **Number of source folders:** 23, excluding `node_modules` and `dist`.
- **Number of source/config files:** 67, excluding `node_modules`, `dist`, and `package-lock.json`.
- **Number of business APIs:** 5.
- **Number of exposed backend endpoints including health/metrics:** 7.
- **Number of pages:** 5.
- **Number of reusable components in `src/components`:** 4.
- **Number of Docker artifacts:** 3 primary artifacts: backend Dockerfile, frontend Dockerfile, and Docker Compose file. `frontend/nginx.conf` supports the frontend image.
- **Number of Kubernetes manifests:** 7.
- **Number of Terraform resources:** 6.

## 21. Resume Explanation

- **Resume:** Built a full-stack Smart Resume Screening Platform using React, Node.js, Express, PDF/DOCX parsing, candidate ranking, Docker, Kubernetes, Jenkins, Terraform, Prometheus, and Grafana.
- **LinkedIn:** Developed a cloud-ready HR automation platform that uploads resumes, extracts candidate details, ranks candidates by required skills, and provides recruiter dashboards with DevOps deployment assets.
- **Placement interview:** This project demonstrates frontend development, REST API design, MVC backend architecture, resume parsing, ranking algorithms, containerization, Kubernetes deployment, CI/CD design, AWS infrastructure planning, and monitoring setup.

## 22. Viva Questions and Answers

1. **What is the project objective?** To automate resume intake, extract candidate profiles, rank candidates by required skills, and show recruiter dashboards.
2. **Which frontend framework is used?** React 18 with Vite.
3. **How is routing implemented?** React Router DOM defines five routes in `App.jsx`.
4. **How does the frontend call the backend?** Through an Axios instance configured in `frontend/src/api/client.js`.
5. **Where is the API base URL configured?** `VITE_API_BASE_URL`, with fallback to `http://localhost:5000/api`.
6. **What pages exist?** Home, Resume Upload, Candidate List, Candidate Details, and Dashboard.
7. **What state management is used?** Local React hooks: `useState`, `useEffect`, and `useMemo`.
8. **What backend framework is used?** Express.js on Node.js.
9. **What architecture does the backend follow?** MVC-like routing/controllers/services/models/repositories.
10. **Which endpoint uploads resumes?** `POST /api/resumes/upload`.
11. **How are uploads handled?** Multer disk storage saves files to the configured upload directory.
12. **Which files are accepted?** PDF and DOCX files only, checked by MIME type and extension.
13. **How is PDF text extracted?** `pdf-parse` parses a file buffer and returns text.
14. **How is DOCX text extracted?** Mammoth extracts raw text from the DOCX path.
15. **How is candidate name extracted?** The first non-empty text line is cleaned and used as the name.
16. **How is email extracted?** A case-insensitive email regex is applied to resume text.
17. **How are skills extracted?** Resume text is checked against a hardcoded known-skills list.
18. **How is experience extracted?** A regex looks for numeric values followed by `years` or `yrs`.
19. **How is education extracted?** The parser searches for predefined terms such as `B.Tech`, `MBA`, `Bachelor`, and `PhD`.
20. **How is ranking score calculated?** Matched required skills divided by total required skills, multiplied by 100 and rounded.
21. **What happens if no required skills are supplied?** The ranking score is `0`.
22. **Where are candidates stored at runtime?** In `backend/data/candidates.json` through the local JSON repository.
23. **Is DynamoDB active in runtime code?** No. A DynamoDB repository exists, but the model imports the local JSON repository.
24. **What security middleware is used?** Helmet, CORS, rate limiting, Joi validation, and Multer upload validation.
25. **What metrics are exposed?** Default Node.js metrics and an HTTP request duration histogram.
26. **Which endpoint exposes metrics?** `GET /metrics`.
27. **What Kubernetes probes exist?** Backend readiness and liveness probes call `/health`.
28. **What Terraform resources are defined?** S3 bucket, S3 public access block, DynamoDB table, SNS topic, IAM role, and IAM policy.
29. **What does Jenkins deploy?** On `main`, it applies all manifests in the `kubernetes/` directory.
30. **What is the biggest production gap?** Runtime persistence and uploads are still local; authentication, S3, DynamoDB wiring, tests, and secure CI/CD are missing.

## 23. Gap Analysis

- Authentication and authorization are absent.
- No user roles for HR admin, recruiter, or viewer.
- Candidate storage uses local JSON instead of DynamoDB in runtime code.
- Resume files are stored locally instead of S3.
- SNS topic exists in Terraform but backend does not publish events.
- No CloudFront Terraform resource.
- No EC2, ECS, or EKS provisioning.
- No automated tests.
- No backend lint/build/test stage in Jenkins.
- No Docker registry push stage.
- No Kubernetes Secrets.
- No TLS configuration for ingress.
- No malware scanning for resumes.
- No pagination or server-side result limits.
- No advanced parsing/NLP model for robust resume extraction.
- No audit logging or compliance controls.
- No alert rules in Prometheus/Grafana.
- No centralized logs or tracing.
- No database migration/versioning strategy.
- No backup/restore strategy.

## 24. Final Verdict

- **Final year project:** Suitable. It demonstrates full-stack development, REST APIs, file upload, parsing, ranking, dashboard UI, and deployment concepts.
- **DevOps portfolio:** Suitable as a starter portfolio project because Docker, Kubernetes, Jenkins, Terraform, Prometheus, and Grafana assets exist.
- **Cloud portfolio:** Suitable as an AWS-readiness demo, but not as a complete deployed AWS system because EC2, CloudFront, S3 runtime upload, SNS events, and DynamoDB runtime persistence are incomplete.
- **Internship applications:** Suitable. It shows broad practical exposure and a clean modular structure.
- **Placement interviews:** Suitable. The implementation provides concrete talking points across frontend, backend, cloud, DevOps, monitoring, and system design, with honest gaps to discuss as improvement areas.
