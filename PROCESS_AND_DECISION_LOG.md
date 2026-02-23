# Recruit-AI: Process & Decision Log

This document records the core architectural decisions, the evolution of the AI prompt, and the primary technical learnings discovered while building the Recruit-AI MVP.

---

## 1. Architectural Decisions

### **1.1 Frontend Framework & Styling**
*   **Choice:** React (Vite) + Tailwind CSS + Lucide React (Icons).
*   **Reasoning:** Vite provides lightning-fast HMR and build times compared to heavier frameworks like Next.js, making it ideal for rapid prototyping of a Single Page Application (SPA). Tailwind CSS allowed us to rapidly iterate on a highly customized, clean, applicant-tracking "B2B SaaS" aesthetic without writing cumbersome global stylesheets.

### **1.2 Backend API & Simulation**
*   **Choice:** Node.js (Express) with an in-memory `n8nSimulator`.
*   **Reasoning:** To launch the MVP swiftly while waiting for complete n8n deployment bandwidth, we opted to build a Node.js simulator (`n8nSimulator.js`). This encapsulated the exact HTTP webhook requests, PDF parsing (`pdf-parse`), and Google Gemini API calls that an n8n workflow would natively handle. 
*   **Outcome:** This abstraction allowed the frontend to be developed entirely against what *will* be the n8n API endpoints, meaning when the team switches to the real n8n instance (exported in `n8n/workflow.json`), the React frontend will require zero code changes.

### **1.3 Email Automation Integration**
*   **Choice:** Client-side HTML Mailto generation opening a direct `mail.google.com` window.
*   **Reasoning:** Initially considering a backend SMTP library (like Nodemailer), we realized that for MVP users (recruiters), *reviewing* an automated email is arguably more important than silent automatic sending. By using `window.open` with a heavily parameterized Gmail URL, the recruiter gets the AI draft instantly in their own secure Gmail tab, requiring zero OAuth or SMTP setup on our backend while keeping human-in-the-loop oversight.

---

## 2. Prompt Iterations & AI Tuning

A massive amount of the value in Recruit-AI relies on how Google Gemini parses unstructured resumes.

### **Version 1: The General Summary**
*   *Prompt logic:* "Read this resume and summarize it against this job description. Give me a score and a few strengths."
*   *Result:* The LLM was excessively verbose. It provided excellent summaries but in block paragraphs. The frontend couldn't parse the unstructured text to build the dynamic candidate comparison table or the progress rings.

### **Version 2: Enforcing JSON Schemas**
*   *Prompt logic:* "Return ONLY a valid JSON object matching [Specific Schema]. No markdown."
*   *Result:* Significant improvement. We forced the model to return specifically mapped arrays like `key_matches`, `potential_gaps`, and integers for `score`. However, there was a bug where the LLM still occasionally wrapped the JSON in ` ```json ... ``` ` markdown blocks.
*   *Fix:* We wrote a robust `agent-logic.js` parser that manually strips markdown backticks before calling `JSON.parse()`.

### **Version 3: Adding Subjective Intelligence (Final)**
*   *Prompt logic:* "Determine the Cultural Fit (Low/Medium/High/Excellent) and Experience Level (Entry/Solid/Expert). Provide an action recommendation (e.g., 'Proceed to Technical Interview' or 'Reject Candidate')."
*   *Result:* This completely changed the frontend UI. Instead of hardcoding generic labels, the UI now actively reads the LLM's categorized outputs to dynamically color-code UI elements and even switch the primary action buttons (from a blue Schedule button to a red Reject button) directly based on the agent's recommendation.

---

## 3. Key Technical Learnings

1. **Handling legacy PDF-Parse:**
   *   *Challenge:* The application crashed when trying to read resumes natively. `pdf-parse@2.4.5` restructured its function exports, breaking standard Node.js imports (`TypeError: pdf is not a function`). 
   *   *Learning:* When writing rapid prototypes, pinning package versions to known stable releases (downgrading `pdf-parse` to `1.1.1`) is vastly superior to attempting to rewrite core abstractions just to appease a new, undocumented minor update.

2. **The "Human API" Concept:**
   *   *Challenge:* Transferring complex state (like a rich-text AI evaluation) from an app to an email client.
   *   *Learning:* Standard `mailto:` tags do not support HTML rendering in the body. However, passing plain text scraped dynamically from a React `ref` (using `editorRef.current.innerText`) into a dynamically constructed `https://mail.google.com/mail/?view=cm&...` string behaves exactly like a deeply integrated enterprise API, but with 1% of the setup effort.

3. **Decoupled Business Logic:**
   *   *Learning:* Forcing the backend to return exactly what the UI expected (rather than the UI bending to format messy AI strings) resulted in incredibly clean React components (`Dashboard.jsx`, `CandidateProfile.jsx`). The heavy lifting was entirely quarantined in the `n8nSimulator`, proving the thesis that a workflow automation tool like n8n is the absolute right choice for managing AI routing long-term.
