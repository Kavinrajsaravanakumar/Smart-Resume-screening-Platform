# Architecture

The platform is split into a React frontend and an Express.js backend using MVC boundaries.

## Frontend

- React Router pages for home, upload, candidate list, candidate details, and dashboard.
- Axios API client configured by `VITE_API_BASE_URL`.
- Reusable layout, stats, loading, and score badge components.

## Backend

- Controllers handle REST request and response flow.
- Services contain parsing, ranking, candidate filtering, and dashboard logic.
- Models and repositories isolate persistence.
- Middleware handles security headers, CORS, rate limits, uploads, metrics, and errors.

## Cloud Readiness

- Resume files can move from local upload storage to S3.
- Candidate persistence can move from the local JSON repository to DynamoDB.
- SNS can publish resume processing events.
- CloudFront can serve the static frontend.
- IAM role and policy templates are provided in Terraform.
