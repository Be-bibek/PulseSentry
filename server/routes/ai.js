import express from 'express';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { AlertHistory, Host } from '../models.js';

const router = express.Router();
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || 'mock_key');

router.post('/analyze/:alertId', async (req, res) => {
  try {
    const { alertId } = req.params;
    let alertData = null;
    let hostData = null;

    if (AlertHistory.findById) {
        alertData = await AlertHistory.findById(alertId).populate('ruleId');
        if (alertData) hostData = await Host.findById(alertData.hostId);
    } else {
        // Fallback for mock db
        alertData = req.body.mockAlertData || { message: 'CPU Spike detected', metricsSnapshot: { cpu: 95 } };
        hostData = { hostname: 'sim-web-server-01', osInfo: { platform: 'linux' } };
    }

    if (!alertData) return res.status(404).json({ msg: 'Alert not found' });

    // Ensure we don't crash if Gemini API key isn't provided
    if (!process.env.GEMINI_API_KEY) {
        const mockDiagnosis = `### Simulated Root Cause Analysis
**Diagnosis**: Based on the metrics, this appears to be a runaway process consuming excessive resources on \`${hostData?.hostname || 'the host'}\`.
**Confidence**: 85%

**Recommended Action Steps**:
1. SSH into the server: \`ssh user@${hostData?.hostname || 'server'}\`
2. Identify the exact PID: \`top -o %CPU\` or \`htop\`
3. Restart the offending service or gracefully kill the process: \`kill -15 <PID>\`
4. Inspect the application logs in \`/var/log/app.log\` around the time of the incident.

*Note: You are seeing this mock response because GEMINI_API_KEY is not set in your environment variables.*`;
        
        if (alertData.save) {
            alertData.aiDiagnosis = mockDiagnosis;
            await alertData.save();
        }
        return res.json({ diagnosis: mockDiagnosis });
    }

    // Call Gemini
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    
    const prompt = `You are PulseSentry, an expert DevOps and SRE AI assistant. Analyze the following server alert incident and provide a Root Cause Analysis (RCA) and actionable debugging steps in Markdown format.

Host: ${hostData?.hostname}
OS: ${JSON.stringify(hostData?.osInfo || {})}
Alert Message: ${alertData.message}
Metrics Snapshot: ${JSON.stringify(alertData.metricsSnapshot || {})}

Provide a professional, concise diagnosis and concrete bash commands to fix or investigate the issue.`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    if (alertData.save) {
        alertData.aiDiagnosis = text;
        await alertData.save();
    }

    res.json({ diagnosis: text });
  } catch (err) {
    console.error('AI Analysis Error:', err);
    res.status(500).json({ msg: 'Failed to generate AI diagnosis', error: err.message });
  }
});

export default router;
