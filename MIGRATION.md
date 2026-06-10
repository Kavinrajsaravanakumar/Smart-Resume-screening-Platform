# Migration Guide: CloudFront/S3 Frontend → AWS Amplify

This guide moves the Smart Resume Screening Platform from Jenkins-managed frontend deployment (S3 + CloudFront) to AWS Amplify, while keeping backend deployment on Jenkins → Docker → EC2.

## Target Architecture

| Layer | Service |
|-------|---------|
| Frontend | GitHub → AWS Amplify → React + Vite |
| Backend | GitHub → Jenkins → Docker → EC2 |
| Resume storage | Amazon S3 (private, presigned URLs) |
| Candidate data | Amazon DynamoDB |
| Infrastructure | Terraform |

---

## Phase 1: Terraform (Infrastructure)

```bash
cd terraform
terraform init
terraform plan -var="ssh_key_name=your-ec2-key"
terraform apply -var="ssh_key_name=your-ec2-key"
```

Capture outputs:

```bash
terraform output ec2_public_ip
terraform output resume_bucket_name
terraform output candidate_table_name
terraform output sns_topic_arn
```

### Resources provisioned

- S3 bucket: `resume-screening-platform-resumes` (private)
- DynamoDB table: `Candidates` with GSIs
- IAM role + instance profile for EC2
- Security group (22, 8080, 5000)
- EC2 instance (default VPC)
- SNS topic for resume events

---

## Phase 2: AWS Amplify (Frontend)

### 1. Create Amplify app

1. Open **AWS Amplify Console** → **New app** → **Host web app**
2. Connect your **GitHub** repository
3. Select branch (e.g. `main`)
4. Set **Monorepo root directory** to repository root (where `amplify.yml` lives)

### 2. Build settings

Amplify reads `amplify.yml` automatically:

```yaml
version: 1
applications:
  - appRoot: frontend
    frontend:
      phases:
        preBuild:
          commands:
            - npm ci
        build:
          commands:
            - npm run build
      artifacts:
        baseDirectory: dist
        files:
          - '**/*'
```

### 3. Amplify environment variables

| Variable | Example | Required |
|----------|---------|----------|
| `VITE_API_BASE_URL` | `http://<EC2_PUBLIC_IP>:5000/api` | Yes |

> Use HTTPS for production if you add a load balancer or reverse proxy in front of EC2.

### 4. Deploy

- Amplify builds and deploys on every push to the connected branch
- HTTPS is enabled automatically on the `*.amplifyapp.com` domain
- Optional: add a custom domain in Amplify Console

### 5. Update backend CORS

Set `FRONTEND_ORIGIN` on the backend to your Amplify URL:

```env
FRONTEND_ORIGIN=https://main.d1234567890.amplifyapp.com
```

Redeploy the backend container after updating.

---

## Phase 3: Jenkins (Backend Only)

### Removed stages

- Install Frontend
- Build Frontend
- Deploy Frontend to S3
- CloudFront Invalidation

### Current pipeline

```
GitHub Push → Jenkins
  → Install Dependencies (backend)
  → Run Tests (npm test / lint)
  → Build Docker Image
  → Push Docker Image (optional, if DOCKER_REGISTRY_URL is set)
  → Deploy Backend Container on EC2
```

### Jenkins credentials / environment

| Variable | Source |
|----------|--------|
| `JWT_SECRET` | Jenkins credential |
| `SNS_TOPIC_ARN` | `terraform output sns_topic_arn` |
| `FRONTEND_ORIGIN` | Amplify app URL |
| `S3_BUCKET_NAME` | `terraform output resume_bucket_name` |
| `DYNAMODB_TABLE` | `terraform output candidate_table_name` |
| `AWS_REGION` | `us-east-1` |
| `DOCKER_REGISTRY_URL` | Optional (ECR/Docker Hub) |

Point Jenkins to the root `Jenkinsfile` in the repository.

---

## Phase 4: Backend Configuration (EC2)

On EC2, the Docker container uses the IAM instance profile for AWS access. Required env vars:

```env
NODE_ENV=production
PORT=5000
AWS_REGION=us-east-1
S3_BUCKET_NAME=resume-screening-platform-resumes
DYNAMODB_TABLE=Candidates
SNS_TOPIC_ARN=arn:aws:sns:...
FRONTEND_ORIGIN=https://main.d1234567890.amplifyapp.com
JWT_SECRET=<secure-secret>
S3_PRESIGNED_URL_EXPIRY_SECONDS=900
```

---

## Phase 5: Resume Storage Changes

### Before

- Resumes stored on EC2 filesystem or public S3 URLs in DynamoDB

### After

- Resumes stored in S3: `resumes/{uuid}.pdf`
- DynamoDB stores `resumeS3Key` only (no public URL)
- Viewing resumes uses presigned URLs via:

```
GET /api/candidates/:id/resume
→ { "url": "https://...presigned..." }
```

Presigned URLs expire after 15 minutes by default.

---

## Phase 6: DynamoDB Data Migration (if needed)

If you have existing candidates in `data/candidates.json`:

1. Export local records
2. For each candidate with a local resume file:
   - Upload file to S3 under `resumes/{uuid}.pdf`
   - Set `resumeS3Key` on the record
   - Remove `resumeUrl`
3. Import records into DynamoDB using `PutItem`

Example AWS CLI upload:

```bash
aws s3 cp ./uploads/resume.pdf s3://resume-screening-platform-resumes/resumes/<uuid>.pdf
```

---

## Phase 7: Decommission Old Frontend Stack

After Amplify is verified:

1. Disable Jenkins frontend stages (already removed from `Jenkinsfile`)
2. Optional: delete CloudFront distribution used for frontend
3. Optional: delete frontend S3 bucket (`srs-platform`) if no longer needed
4. Update DNS/custom domains to point to Amplify

---

## Verification Checklist

- [ ] `terraform apply` succeeded
- [ ] EC2 instance reachable on port 5000
- [ ] `GET http://<EC2_IP>:5000/health` returns 200
- [ ] Amplify app builds and deploys on push
- [ ] `VITE_API_BASE_URL` points to backend API
- [ ] Resume upload works (`POST /api/resumes/upload`)
- [ ] Candidate list loads from DynamoDB
- [ ] Resume view works via presigned URL (`GET /api/candidates/:id/resume`)
- [ ] Candidate delete removes DynamoDB record and S3 object
- [ ] Jenkins backend pipeline deploys successfully

---

## API Summary

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/resumes/upload` | Upload resume → S3 → parse → DynamoDB |
| GET | `/api/candidates` | List candidates (paginated) |
| GET | `/api/candidates/:id` | Candidate details |
| GET | `/api/candidates/:id/resume` | Presigned resume URL |
| DELETE | `/api/candidates/:id` | Delete candidate + S3 resume |
