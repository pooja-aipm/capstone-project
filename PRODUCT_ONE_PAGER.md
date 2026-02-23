# Recruit-AI: Product One-Pager

## 🎯 Value Proposition
Recruit-AI is an intelligent Applicant Tracking System (ATS) that leverages AI (Google Gemini / n8n) to automate the most time-consuming aspects of hiring: resume screening, candidate scoring, and personalized outreach. By shifting human effort from manual parsing to strategic interviewing, Recruit-AI accelerates team scaling without compromising on the quality of hire.

---

## 📈 Key Success Metrics (KPIs)
To ensure Recruit-AI is delivering on its core value, we will track the following 4 primary metrics:

1. **Time-to-Hire (TTH) Reduction**
   - *What:* The average duration from a candidate submitting their application to the first interview being scheduled.
   - *Target:* Decrease TTH by 40% compared to manual screening baselines.
   
2. **Screening Accuracy (Quality of Match)**
   - *What:* The correlation between the AI's generated "Fit Score" and the hiring manager's eventual rating after the technical interview.
   - *Target:* >85% of candidates scored as 80+ by the AI should pass the initial technical screen.

3. **Recruiter Hours Saved**
   - *What:* The total hours saved per week by automating the resume parsing, skill matching, and email drafting processes.
   - *Target:* Save 15+ hours per week per HR team member.

4. **Candidate Engagement Rate**
   - *What:* The response and booking rate of candidates who receive our highly personalized, AI-generated email invitations.
   - *Target:* >75% interview acceptance rate within 48 hours of email dispatch.

---

## 🗺️ Product Roadmap

### **Phase 1: MVP (Current Phase)**
*Focus: Core AI Analysis & Workflow Automation*
- [x] Batch resume uploading and job description intake.
- [x] AI-powered comparative scoring (Fit Score, Skills Confidence, Cultural Fit).
- [x] Web dashboard for at-a-glance candidate evaluation.
- [x] One-click automated email drafting (scheduling/rejection) via direct Gmail linking.
- [x] Exportable n8n workflows for decoupled backend processing.

### **Phase 2: Deep Integrations & Scalability**
*Focus: Seamless Data Flow & Sourcing*
- **Candidate Data Extraction:** Automatically parse phone numbers, emails, and LinkedIn URLs from resumes to fully populate CRM fields without human entry.
- **Bi-directional Calendar Sync:** Direct Google Calendar / Outlook Graph API integration for one-click interview slot booking directly within the app.
- **Job Board Webhooks:** Auto-ingest candidates as they apply on LinkedIn, Indeed, or Workable via n8n webhooks.
- **Applicant Status Tracking:** Visual Kanban board linking candidates to their current stage (Applied, Phone Screen, Technical, Offer).

### **Phase 3: Advanced Intelligence & Enterprise Features**
*Focus: Proactive Insights & Unbiased Hiring*
- **Agentic Chat Interface:** Allow recruiters to query the database naturally (e.g., *"Show me all candidates from last month who had strong React skills but lacked AWS."*).
- **Auto-Generated Interview Guides:** Generate custom interview questions for the hiring manager based on the candidate's specific "AI-identified Gaps."
- **Bias Reduction Mode:** Anonymize candidate PII (names, ages, universities) during the screening phase to promote equitable evaluation based purely on skill alignment.
- **Multi-Role Dashboards:** Support concurrent hiring pipelines for entirely different departments (Engineering, Sales, Marketing) within the same workspace.
