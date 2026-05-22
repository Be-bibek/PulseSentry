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
        const mockDiagnosis = `### Simulated Clinical Root Cause Analysis
**Diagnosis**: EMR Database transaction queue deadlock (HL7 transmission backlog) detected on \`${hostData?.hostname || 'emr-database-main'}\`.
**Uptime Impact**: Moderate - HL7 buffer queue holding 1,500 pending patient record syncs.
**Confidence**: 92%

**Recommended Action Steps**:
1. SSH into EMR server: \`ssh administrator@${hostData?.hostname || 'emr-database-main'}\`
2. Run database analyzer to find HIPAA log query locks: \`grep -i "LOCK" /var/log/emr-db-audit.log | tail -n 20\`
3. Force restart the HL7 message gateway thread: \`systemctl restart hl7-broker-daemon.service\`
4. Optimize database index parameters for EMR search collections.

*Note: You are seeing this clinical template because GEMINI_API_KEY is not set in your environment variables.*`;
        
        if (alertData.save) {
            alertData.aiDiagnosis = mockDiagnosis;
            await alertData.save();
        }
        return res.json({ diagnosis: mockDiagnosis });
    }

    // Call Gemini
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    
    const prompt = `You are PulseSentry Health, an expert Healthcare IT, Clinical Systems, and SRE AI assistant. Analyze the following medical server infrastructure alert incident and provide a Root Cause Analysis (RCA) and actionable debugging steps in Markdown format.

Host: ${hostData?.hostname}
OS: ${JSON.stringify(hostData?.osInfo || {})}
Alert Message: ${alertData.message}
Metrics Snapshot: ${JSON.stringify(alertData.metricsSnapshot || {})}

Provide a professional, concise clinical systems diagnosis (considering HIPAA compliance guidelines, HL7 formats, PACS DICOM constraints) and concrete bash commands to fix or investigate the issue.`;

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
