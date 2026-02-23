const { GoogleGenAI } = require('@google/genai');
const pdf = require('pdf-parse');

// Initialize Gemini API (Requires process.env.GEMINI_API_KEY)
const ai = new GoogleGenAI({ apiKey: 'AIzaSyDn9n16r2vaIFpEj16M3TnKI_vKIQueT34' });

const mockCandidatesFallback = [
    {
        id: '1',
        initials: 'RV',
        name: 'Rashmi Varma',
        role: 'Senior Frontend Eng.',
        score: 85,
        strength: 'React Architecture',
        gap: 'GCP Experience',
        status: 'New',
        color: 'bg-indigo-100 text-indigo-700',
        summary: 'Rashmi demonstrates strong expertise...',
        key_matches: [{ title: 'React Expert', desc: '6+ years' }],
        potential_gaps: [{ title: 'GCP Familiarity', desc: 'Mostly AWS' }],
        skill_confidence: [{ name: 'Frontend', score: 95 }],
        action: 'Proceed to Technical Interview'
    }
];

// In-memory store for demo
let processResultCache = mockCandidatesFallback;

async function parsePdf(fileBuffer) {
    try {
        const data = await pdf(fileBuffer);
        return data.text;
    } catch (e) {
        console.error("PDF Parsing error:", e);
        return "Could not parse PDF text.";
    }
}

const simulateN8nProcessing = async (jobDescription, resumesArray) => {

    // Process each resume
    const candidatesPromises = resumesArray.map(async (file, index) => {
        let resumeText = 'No text parsed';

        if (file.mimetype === 'application/pdf') {
            resumeText = await parsePdf(file.buffer);
        } else if (file.mimetype === 'text/plain') {
            resumeText = file.buffer.toString('utf-8');
        } else {
            resumeText = file.buffer.toString('utf-8'); // Attempt generic read
        }

        try {
            const prompt = `
            You are an expert HR ATS AI Agent.
            Analyze the following resume against the job description.
            Extract the candidate's name. Determine a fit score (0-100).
            Identify 3 key matches (strengths) and up to 2 potential gaps.
            Identify 3 core skills and give them a confidence score (0-100).
            Determine the Cultural Fit (Low/Medium/High/Excellent) and Experience Level (Entry/Solid/Expert).
            Provide an executive summary and an action recommendation (e.g., "Proceed to Technical Interview" or "Reject Candidate").
            
            Return ONLY a valid JSON object matching this schema:
            {
              "name": "Full Name",
              "role": "Current/Applied Role",
              "score": 85,
              "strength": "1-2 word summary of top strength",
              "gap": "1-2 word summary of top gap",
              "status": "New",
              "color": "bg-indigo-100 text-indigo-700",
              "summary": "2 sentence summary...",
              "key_matches": [{"title": "Short Title", "desc": "Description"}],
              "potential_gaps": [{"title": "Short Title", "desc": "Description"}],
              "skill_confidence": [{"name": "Skill", "score": 90}],
              "action": "Proceed to Technical Interview",
              "cultural_fit": "High",
              "experience_level": "Solid"
            }
            
            Job Description:
            ${jobDescription}
            
            Resume:
            ${resumeText.substring(0, 3000)}
            `;

            const response = await ai.models.generateContent({
                model: 'gemini-2.5-flash',
                contents: prompt,
            });

            // Extract JSON from response text (which might contain markdown chunks)
            const textResponse = response.text;
            let jsonString = textResponse;
            if (textResponse.includes('```json')) {
                jsonString = textResponse.split('```json')[1].split('```')[0];
            } else if (textResponse.includes('```')) {
                jsonString = textResponse.split('```')[1].split('```')[0];
            }

            const parsedData = JSON.parse(jsonString.trim());
            return {
                id: Math.random().toString(36).substr(2, 9),
                initials: parsedData.name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase(),
                ...parsedData,
                color: 'bg-indigo-100 text-indigo-700' // Setting default color for simplicity
            };

        } catch (err) {
            console.error("Gemini Error processing resume:", err);
            // Fallback for this candidate if AI fails
            return {
                id: Math.random().toString(36).substr(2, 9),
                initials: 'XX',
                name: 'Unknown Candidate',
                role: 'Unparsed',
                score: 50,
                status: 'Error'
            };
        }
    });

    const processedCandidates = await Promise.all(candidatesPromises);

    // Save to our in-memory "Database"
    processResultCache = processedCandidates;

    return {
        success: true,
        message: 'Resumes parsed and scored successfully by Gemini.',
        processed_candidates: processedCandidates
    };
};

const getCandidateById = (id) => {
    return processResultCache.find(c => c.id === id) || processResultCache[0];
};

const getAllCandidates = () => {
    return processResultCache;
};

module.exports = {
    simulateN8nProcessing,
    getCandidateById,
    getAllCandidates
};
