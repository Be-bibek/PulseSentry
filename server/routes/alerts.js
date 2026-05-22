import express from 'express';
import { AlertRule, AlertHistory } from '../models.js';

const router = express.Router();

// Get rules for workspace
router.get('/rules/:workspaceId', async (req, res) => {
  try {
    if (!AlertRule.find) return res.json([]);
    const rules = await AlertRule.find({ workspaceId: req.params.workspaceId });
    res.json(rules);
  } catch (err) {
    res.status(500).send('Server error');
  }
});

// Create rule
router.post('/rules', async (req, res) => {
  try {
    const { workspaceId, name, metric, condition, threshold, durationMs } = req.body;
    if (!AlertRule.create) return res.json({ id: 'mock_rule', name, metric });
    
    const rule = new AlertRule({ workspaceId, name, metric, condition, threshold, durationMs });
    await rule.save();
    res.json(rule);
  } catch (err) {
    res.status(500).send('Server error');
  }
});

// Get alert history
router.get('/history/:workspaceId', async (req, res) => {
  try {
    if (!AlertHistory.find) return res.json([]);
    const history = await AlertHistory.find({ workspaceId: req.params.workspaceId })
        .populate('hostId', 'hostname')
        .populate('ruleId', 'name')
        .sort({ createdAt: -1 })
        .limit(50);
    res.json(history);
  } catch (err) {
    res.status(500).send('Server error');
  }
});

export default router;
