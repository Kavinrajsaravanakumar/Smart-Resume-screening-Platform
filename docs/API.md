# API Documentation

Base URL: `http://localhost:5000/api`

## POST `/resumes/upload`

Uploads a PDF or DOCX resume, extracts candidate data, and stores a ranked candidate profile.

Request type: `multipart/form-data`

Fields:

- `resume`: PDF or DOCX file, required.
- `requiredSkills`: comma-separated list of required skills, optional.

Response `201`:

```json
{
  "message": "Resume uploaded and processed successfully.",
  "data": {
    "candidateId": "uuid",
    "name": "Jane Doe",
    "email": "jane@example.com",
    "phone": "+1 555 0100",
    "skills": ["Java", "AWS", "Docker"],
    "education": "Bachelor",
    "experience": 5,
    "rankingScore": 75,
    "resumeUrl": "uploads/resume.pdf",
    "createdAt": "2026-06-07T10:00:00.000Z"
  }
}
```

## GET `/candidates`

Returns candidates sorted by ranking score.

Query parameters:

- `search`
- `skills`
- `education`
- `minExperience`
- `minScore`

## GET `/candidates/:id`

Returns a single candidate by `candidateId`.

## DELETE `/candidates/:id`

Deletes a candidate profile.

## GET `/dashboard/stats`

Returns dashboard totals, top candidates, and recent uploads.

## Health and Metrics

- `GET /health`
- `GET /metrics`
