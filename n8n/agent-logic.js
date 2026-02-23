// n8n Code Node Logic
// Place this inside a "Code" node after your LLM (Gemini/OpenAI) extraction node
// Purpose: Parse the Markdown-wrapped JSON response from the LLM into a clean Array of Candidate Objects that the React Frontend expects.

const candidates = [];

// Assuming your LLM node outputs text to `$input.item.json.response`
// and you've looped over an array of resumes.
for (const item of $input.all()) {
    try {
        const textResponse = item.json.response;

        // Strip markdown formatting if the LLM wrapped it in ```json
        let jsonString = textResponse;
        if (textResponse.includes('```json')) {
            jsonString = textResponse.split('```json')[1].split('```')[0];
        } else if (textResponse.includes('```')) {
            jsonString = textResponse.split('```')[1].split('```')[0];
        }

        const parsedData = JSON.parse(jsonString.trim());

        // Format the candidate object to match the Frontend UI schema requirements
        const formattedCandidate = {
            id: Math.random().toString(36).substr(2, 9), // Auto-generate an ID
            initials: parsedData.name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase(),
            name: parsedData.name || "Unknown Candidate",
            role: parsedData.role || "Unparsed",
            score: parsedData.score || 0,
            strength: parsedData.strength || "N/A",
            gap: parsedData.gap || "None detected",
            status: parsedData.status || "New",
            color: "bg-indigo-100 text-indigo-700", // Default styling
            summary: parsedData.summary || "",
            key_matches: parsedData.key_matches || [],
            potential_gaps: parsedData.potential_gaps || [],
            skill_confidence: parsedData.skill_confidence || [],
            action: parsedData.action || "Needs Manual Review",
            cultural_fit: parsedData.cultural_fit || "Medium",
            experience_level: parsedData.experience_level || "Solid"
        };

        candidates.push({ json: formattedCandidate });

    } catch (error) {
        // If JSON parsing fails for a specific resume, output an error stub
        candidates.push({
            json: {
                id: Math.random().toString(36).substr(2, 9),
                initials: "XX",
                name: "Error Parsing",
                role: "Unknown",
                score: 0,
                status: "Error",
                error: error.message
            }
        });
    }
}

return candidates;
