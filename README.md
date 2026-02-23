# Recruit-AI

An Agentic AI solution that automates the "Screening & Scheduling" phase of hiring.

## Project Structure
- `frontend/` - React Vite application (UI based on Mockups 1-5).
- `backend/` - Node.js Express server with an n8n Agent workflow simulator.
- `API_HANDSHAKE.md` - Documentation of the frontend <-> backend <-> n8n data flow.

## How to Run Locally

You will need two terminal windows to run both the frontend and backend.

### 1. Start the Backend Server
```bash
cd backend
npm install
```

**Configuration (Important):**
Rename `.env.example` to `.env` inside the `backend/` directory and add your Google Gemini API Key:
```env
GEMINI_API_KEY=your_real_key_here
```

Then start the server:
```bash
node server.js
```
The backend will run at `http://localhost:3001`. It now uses real Google Gemini via `@google/genai` to parse the attached Job Descriptions and Resumes to generate dynamic Candidate profiles.

### 2. Start the Frontend Application
```bash
cd frontend
npm install
npm run dev
```
The Vite app will likely start at `http://localhost:5173`. Open this URL in your browser.

## Using the Prototype
1. **Login**: Click "Log In" on the welcome screen.
2. **Dashboard**: Navigate to Batch Upload.
3. **Candidates**: Click the "Candidates" tab to view the list of ATS-parsed applicants.
4. **Candidate Profile**: Click "View Details" on Rashmi Varma to see the Mockup 5 Application view (AI Score, Agent Recommendation).
5. **Schedule**: Click "Schedule Interview" to reach the Mockup 4 Interview Automation space.

## Notes
- To test real Agent logic, import `backend/n8n-agent-workflow.json` into an n8n instance and replace the `n8nSimulator.js` logic to forward the webhook payload.
