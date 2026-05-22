import express from 'express';
import mongoose from 'mongoose';
import { Host } from '../models.js';

const router = express.Router();

// Get all hosts for a workspace
router.get('/:workspaceId', async (req, res) => {
  try {
    const { workspaceId } = req.params;
    
    // Default clinical hosts to return if DB is empty or using mock DB
    const defaultHosts = [
      { _id: '1', hostname: 'emr-database-main', status: 'online', osInfo: { platform: 'linux', release: 'Ubuntu 22.04' }, lastPing: new Date() },
      { _id: '2', hostname: 'pacs-imaging-mri', status: 'incident', osInfo: { platform: 'linux', release: 'RedHat Enterprise 9' }, lastPing: new Date() },
      { _id: '3', hostname: 'lab-analyzer-chemistry', status: 'online', osInfo: { platform: 'win32', release: 'Windows Server 2022' }, lastPing: new Date() },
    ];

    if (!Host.find || mongoose.connection.readyState !== 1) {
      return res.json(defaultHosts);
    }
    
    let hosts = await Host.find({ workspaceId }).sort({ lastPing: -1 });
    if (hosts.length === 0) {
      // Seed them if database is connected but empty
      for (const h of defaultHosts) {
        try {
          const newHost = new Host({
            workspaceId: new mongoose.Types.ObjectId(workspaceId === 'mock_ws' ? undefined : workspaceId),
            hostname: h.hostname,
            status: h.status,
            osInfo: h.osInfo,
            lastPing: h.lastPing
          });
          await newHost.save();
        } catch (e) {
          console.warn('Failed to seed host in db:', e.message);
        }
      }
      hosts = await Host.find({ workspaceId }).sort({ lastPing: -1 });
    }
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
