const express = require('express');
const multer = require('multer');
const router = express.Router();
const { simulateN8nProcessing, getAllCandidates, getCandidateById } = require('../services/n8nSimulator');

// Configure multer for file uploads
const storage = multer.memoryStorage(); // Use memory storage for demo
const upload = multer({ storage: storage });

/**
 * Endpoint for Batch Resume Uploads
 * Receives the JD (text or file) and multiple resume files.
 */
router.post('/upload-batch', upload.array('resumes', 50), async (req, res) => {
    try {
        const jdText = req.body.jdText || 'Fallback JD';
        const resumes = req.files; // Array of uploaded files

        // Pass to our n8n Simulator
        const results = await simulateN8nProcessing(jdText, resumes);

        res.json(results);
    } catch (error) {
        console.error('Error during batch analysis:', error);
        res.status(500).json({ error: 'Failed to process batch via agent workflow.' });
    }
});

/**
 * Fetch list of processed candidates
 */
router.get('/candidates', (req, res) => {
    res.json({
        kpis: {
            total: 124,
            avg_score: 78,
            top_matches: 12,
            interviews: 5
        },
        candidates: getAllCandidates()
    });
});

/**
 * Fetch specific candidate details
 */
router.get('/candidates/:id', (req, res) => {
    const candidate = getCandidateById(req.params.id);
    if (!candidate) return res.status(404).json({ error: 'Candidate not found' });
    res.json(candidate);
});

/**
 * Endpoint to "Schedule Interview" and save draft
 */
router.post('/schedule', (req, res) => {
    const { candidateId, timeSlot, draftContent } = req.body;

    // Simulate scheduling delay
    setTimeout(() => {
        res.json({
            success: true,
            message: `Interview scheduled successfully for candidate ${candidateId} at ${timeSlot}`,
            calendarEventCreated: true
        });
    }, 1000);
});

module.exports = router;
