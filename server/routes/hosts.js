import express from 'express';
import { Host } from '../models.js';

const router = express.Router();

// Get all hosts for a workspace
router.get('/:workspaceId', async (req, res) => {
  try {
    const { workspaceId } = req.params;
    if (!Host.find) return res.json([]); // Mock fallback
    
    const hosts = await Host.find({ workspaceId }).sort({ lastPing: -1 });
    res.json(hosts);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// Register or update a host
router.post('/register', async (req, res) => {
  try {
    const { workspaceId, hostname, osInfo } = req.body;
    if (!Host.findOne) return res.json({ id: 'mock_host', hostname, status: 'online' });
    
    let host = await Host.findOne({ workspaceId, hostname });
    if (host) {
      host.osInfo = osInfo;
      host.lastPing = new Date();
      host.status = 'online';
      await host.save();
    } else {
      host = new Host({ workspaceId, hostname, osInfo, status: 'online' });
      await host.save();
    }
    res.json(host);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

export default router;
