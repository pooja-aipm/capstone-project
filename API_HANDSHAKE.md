# Recruit-AI API Handshake Documentation

This document describes how the React Frontend communicates with the Node.js Express Backend, and how the Backend integrates with the n8n Agent workflow.

## 1. Frontend to Backend Communication

### A. Uploading Resumes & Job Description
The frontend uses `FormData` to send multipart/form-data.

**Endpoint:** `POST /api/upload-batch`

**Request Payload (FormData):**
- `jdText` (string) - The parsed text of the job description (or a file if needed).
- `resumes` (file array) - Up to 50 PDF/DOCX files.

**Response (JSON):**
```json
{
  "success": true,
  "message": "Resumes parsed and scored successfully by n8n workflow.",
  "processed_candidates": [
    {
      "id": "1",
      "name": "Rashmi Varma",
      "score": 85,
      ...
    }
  ]
}
```

### B. Fetching Processed Candidates
Used to populate the "Candidate Comparison" dashboard.

**Endpoint:** `GET /api/candidates`

**Response (JSON):**
```json
{
  "kpis": { "total": 124, "avg_score": 78, "top_matches": 12, "interviews": 5 },
  "candidates": [ ... ]
}
```

### C. Scheduling an Interview
Triggers after the user reviews the AI draft email and available calendar slots.

**Endpoint:** `POST /api/schedule`

**Request Payload (JSON):**
```json
{
  "candidateId": "1",
  "timeSlot": "Oct 24, 2:00 PM - 2:30 PM",
  "draftContent": "Hi Rashmi, ..."
}
```

---

## 2. Backend to n8n Agent Workflow Communication

In a production scenario, the Node.js backend would forward the text data to an n8n webhook instead of using the local simulator.

### A. Triggering the Workflow
**Endpoint:** `POST https://your-n8n-instance/webhook/analyze-resume`

**Request Payload:**
```json
{
  "jd": "Senior Frontend Engineer requirements...",
  "resume": "Rashmi Varma Resume text..."
}
```

### B. n8n Expected Action
1. The n8n Webhook node receives the payload.
2. It passes the text into an OpenAI node with a strict prompt defining the JSON schema.
3. The OpenAI node returns the structured analysis (Score, Summary, Key Matches, Gaps, Skills, Recommendation).
4. The Webhook Response node returns the JSON back to the Node backend.

*Note: For this MVP demonstration, we mock this delayed execution in `backend/services/n8nSimulator.js` to avoid requiring active OpenAI keys and an n8n host environment.*
