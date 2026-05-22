import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, default: 'admin' }, // admin, viewer
  createdAt: { type: Date, default: Date.now }
});

const workspaceSchema = new mongoose.Schema({
  name: { type: String, required: true },
  owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  members: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  apiKey: { type: String, required: true, unique: true },
  createdAt: { type: Date, default: Date.now }
});

const hostSchema = new mongoose.Schema({
  workspaceId: { type: mongoose.Schema.Types.ObjectId, ref: 'Workspace' },
  hostname: { type: String, required: true },
  osInfo: { type: Object },
  status: { type: String, default: 'offline' }, // online, offline, incident
  lastPing: { type: Date, default: Date.now }
});

const alertRuleSchema = new mongoose.Schema({
  workspaceId: { type: mongoose.Schema.Types.ObjectId, ref: 'Workspace' },
  name: { type: String, required: true },
  metric: { type: String, required: true }, // cpu, memory, disk, process
  condition: { type: String, required: true }, // >, <, =
  threshold: { type: Number, required: true },
  durationMs: { type: Number, default: 10000 }, // how long condition must be met to trigger
  active: { type: Boolean, default: true }
});

const alertHistorySchema = new mongoose.Schema({
  workspaceId: { type: mongoose.Schema.Types.ObjectId, ref: 'Workspace' },
  hostId: { type: mongoose.Schema.Types.ObjectId, ref: 'Host' },
  ruleId: { type: mongoose.Schema.Types.ObjectId, ref: 'AlertRule' },
  message: { type: String, required: true },
  metricsSnapshot: { type: Object }, // The metrics at the time of the alert
  status: { type: String, default: 'active' }, // active, resolved
  aiDiagnosis: { type: String }, // Output from Gemini RCA
  createdAt: { type: Date, default: Date.now },
  resolvedAt: { type: Date }
});

export const User = mongoose.model('User', userSchema);
export const Workspace = mongoose.model('Workspace', workspaceSchema);
export const Host = mongoose.model('Host', hostSchema);
export const AlertRule = mongoose.model('AlertRule', alertRuleSchema);
export const AlertHistory = mongoose.model('AlertHistory', alertHistorySchema);
