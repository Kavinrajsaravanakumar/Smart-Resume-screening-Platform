# 🚀 Smart Resume Screening Platform

A cloud-native recruitment platform that automates resume screening, candidate ranking, and HR management using AWS services, DevOps practices, and Infrastructure as Code (IaC).

---

## 📌 Overview

The Smart Resume Screening Platform streamlines the hiring process by enabling candidates to upload resumes and allowing HR teams to efficiently review, rank, and manage applications through a centralized dashboard.

The platform integrates cloud storage, resume parsing, candidate ranking, CI/CD automation, and secure deployment to deliver a scalable and production-ready recruitment solution.

---

## 🏗️ System Architecture

### Frontend

* React.js
* JavaScript
* AWS Amplify

### Backend

* Node.js
* Express.js
* Docker

### Database

* Amazon DynamoDB

### Storage

* Amazon S3

### DevOps & Infrastructure

* Jenkins
* Docker
* Terraform
* AWS EC2
* Nginx
* SSL/TLS (Let's Encrypt)
* DuckDNS

---

# 📋 Workflow

## Candidate Workflow

### 1. Resume Upload

Candidates upload their resumes through the web application.

Supported Formats:

* PDF
* DOCX
* PNG/JPG

---

### 2. Resume Storage

Uploaded resumes are securely stored in Amazon S3.

```text
S3 Bucket
└── resumes/
```

---

### 3. Resume Parsing

The system automatically detects the file type and extracts resume content.

| File Type | Processing Tool |
| --------- | --------------- |
| PDF       | pdf-parse       |
| DOCX      | Mammoth         |
| PNG/JPG   | Tesseract OCR   |

---

### 4. Skill Extraction

The extracted content is analyzed to identify:

* Technical Skills
* Programming Languages
* Frameworks
* Certifications
* Educational Qualifications

---

### 5. Candidate Ranking

Candidates are evaluated and assigned a ranking score based on extracted skills and qualifications.

---

### 6. Data Storage

Candidate information is stored in DynamoDB.

#### candidates Table

```text
candidateId
name
email
skills
rankingScore
resumeS3Key
status
createdAt
```

---

## HR Workflow

### Authentication

HR users authenticate using JWT-based login.

#### hr-users Table

```text
hrUserId
name
email
passwordHash
role
createdAt
```

---

### Dashboard

After login, HR users can:

* View candidate statistics
* Review ranked candidates
* Access uploaded resumes
* Manage application status
* Monitor recruitment progress

---

# ☁️ AWS Architecture

```text
Candidate
    │
    ▼
React Frontend
(AWS Amplify)
    │
    ▼
HTTPS API Requests
    │
    ▼
Nginx Reverse Proxy
    │
    ▼
Node.js Backend
(Docker Container)
    │
 ┌──┴──────────────┐
 │                 │
 ▼                 ▼
Amazon S3      DynamoDB
Resumes        Candidate Data
 │                 │
 └──────┬──────────┘
        ▼
 Resume Processing
        ▼
 Candidate Ranking
        ▼
 HR Dashboard
```

---

# 🔄 CI/CD Pipeline

## Frontend Deployment

```text
GitHub
   │
   ▼
AWS Amplify
   │
   ▼
Automatic Frontend Deployment
```

---

## Backend Deployment

```text
GitHub
   │
   ▼
Jenkins
   │
   ▼
Docker Build
   │
   ▼
Docker Deployment
   │
   ▼
AWS EC2
```

### Jenkins Pipeline Stages

1. Pull latest code from GitHub
2. Build Docker image
3. Stop existing container
4. Deploy updated container
5. Start new backend service

---

# 🏗️ Infrastructure as Code (Terraform)

Terraform provisions and manages AWS resources including:

* EC2 Instance
* Security Groups
* IAM Roles
* S3 Bucket
* DynamoDB Tables
* SNS Topic

## Terraform Structure

```text
terraform/
├── provider.tf
├── variables.tf
├── s3.tf
├── dynamodb.tf
├── iam.tf
├── security.tf
├── ec2.tf
└── outputs.tf
```

---

# 🔐 Security Features

## HTTPS

The backend is secured using:

* Nginx Reverse Proxy
* Let's Encrypt SSL Certificates
* DuckDNS Domain

```text
Internet
    │
 HTTPS (443)
    │
    ▼
 Nginx
    │
    ▼
 Backend API (5000)
```

---

## IAM Security

The application accesses AWS resources using IAM Roles and Policies.

Permissions include:

* Amazon S3 Access
* DynamoDB Operations
* SNS Publish Permissions

---

## S3 Security

* Private Bucket
* Public Access Blocked
* Server-Side Encryption (AES256)
* Versioning Enabled

---

# 🗄️ Database Design

## Candidates Table

```text
Partition Key:
candidateId
```

### Global Secondary Indexes

```text
StatusRankingScoreIndex
StatusCreatedAtIndex
```

---

## HR Users Table

```text
Partition Key:
hrUserId
```

---

# 📂 Project Structure

```text
Smart-Resume-Screening-Platform
│
├── frontend/
│   ├── src/
│   ├── public/
│   └── package.json
│
├── backend/
│   ├── src/
│   ├── routes/
│   ├── services/
│   ├── middleware/
│   └── package.json
│
├── terraform/
│   ├── provider.tf
│   ├── variables.tf
│   ├── s3.tf
│   ├── dynamodb.tf
│   ├── iam.tf
│   ├── security.tf
│   ├── ec2.tf
│   └── outputs.tf
│
├── Jenkinsfile
├── Dockerfile
└── README.md
```

---

# ✨ Key Features

* Resume Upload & Storage
* Automated Resume Parsing
* Skill Extraction
* Candidate Ranking
* HR Authentication
* Dashboard Analytics
* Secure Resume Management
* AWS Cloud Integration
* Dockerized Deployment
* Jenkins CI/CD Automation
* Infrastructure as Code (Terraform)
* HTTPS Security

---

# 🛠️ Technology Stack

### Frontend

* React.js
* JavaScript
* AWS Amplify

### Backend

* Node.js
* Express.js

### Database

* Amazon DynamoDB

### Storage

* Amazon S3

### DevOps

* Docker
* Jenkins
* Terraform

### Cloud Services

* AWS EC2
* AWS IAM
* AWS SNS
* AWS Amplify

### Security

* Nginx
* SSL/TLS
* DuckDNS

---

# 🚀 Future Enhancements

* AI-Based Candidate Matching
* Resume Recommendation Engine
* Interview Scheduling
* Email Notifications
* Advanced Analytics Dashboard
* Multi-Role Access Control
* Real-Time Notifications

---

## 👨‍💻 Author

**Kavin Raj**

Cloud | DevOps | Full Stack Development | AWS | Terraform | Docker | Jenkins
