import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { User, Workspace } from '../models.js';

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || 'fallback_secret_for_local_dev_only';

// Register
router.post('/register', async (req, res) => {
  try {
    const { name, email, password, workspaceName } = req.body;
    
    // Fallback Mock Logic
    if (!User.findOne) {
        return res.json({ token: 'mock_token', user: { name, email } });
    }

    let user = await User.findOne({ email });
    if (user) return res.status(400).json({ msg: 'User already exists' });

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    user = new User({ name, email, password: hashedPassword });
    await user.save();

    // Create default workspace for user
    const workspace = new Workspace({
      name: workspaceName || `${name}'s Workspace`,
      owner: user._id,
      members: [user._id],
      apiKey: `pulse_${Math.random().toString(36).substring(2, 15)}`
    });
    await workspace.save();

    const payload = { user: { id: user.id, workspaceId: workspace.id } };
    const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '1d' });

    res.json({ token, user: { id: user.id, name, email }, workspace: { id: workspace.id, name: workspace.name, apiKey: workspace.apiKey } });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// Login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // Fallback Mock Logic
    if (!User.findOne) {
        return res.json({ 
            token: 'mock_token', 
            user: { id: 'mock_id', name: 'Demo User', email },
            workspace: { id: 'mock_ws', name: 'Demo Workspace', apiKey: 'pulse_demo_key' }
        });
    }

    let user = await User.findOne({ email });
    if (!user) return res.status(400).json({ msg: 'Invalid Credentials' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ msg: 'Invalid Credentials' });

    const workspace = await Workspace.findOne({ members: user.id });

    const payload = { user: { id: user.id, workspaceId: workspace ? workspace.id : null } };
    const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '1d' });

    res.json({ token, user: { id: user.id, name: user.name, email }, workspace: workspace ? { id: workspace.id, name: workspace.name, apiKey: workspace.apiKey } : null });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

export default router;
