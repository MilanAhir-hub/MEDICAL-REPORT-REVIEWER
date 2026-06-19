import { describe, it, expect, beforeAll } from '@jest/globals';

const API_BASE = process.env.API_URL || 'http://localhost:5001';

let serverRunning = false;

beforeAll(async () => {
  try {
    const res = await fetch(`${API_BASE}/api/health`);
    serverRunning = res.ok;
  } catch {
    serverRunning = false;
  }
});

const itIf = (condition) => condition ? it : it.skip;

describe('Core API Workflow', () => {
  itIf(serverRunning)('GET /api/health returns system status', async () => {
    const res = await fetch(`${API_BASE}/api/health`);
    const data = await res.json();
    expect(res.status).toBe(200);
    expect(data).toHaveProperty('status', 'ok');
    expect(data).toHaveProperty('db');
    expect(data).toHaveProperty('correlationId');
  });

  itIf(serverRunning)('POST /api/auth/signup rejects invalid input', async () => {
    const res = await fetch(`${API_BASE}/api/auth/signup`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: '', email: 'invalid', password: '12' }),
    });
    expect(res.status).toBe(422);
    const data = await res.json();
    expect(data.success).toBe(false);
  });

  itIf(serverRunning)('POST /api/auth/login rejects invalid credentials', async () => {
    const res = await fetch(`${API_BASE}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'nonexistent@test.com', password: 'wrong' }),
    });
    expect(res.status).toBe(401);
    const data = await res.json();
    expect(data.success).toBe(false);
  });

  itIf(serverRunning)('GET /api/reports requires auth token', async () => {
    const res = await fetch(`${API_BASE}/api/reports`);
    expect(res.status).toBe(401);
    const data = await res.json();
    expect(data.message).toContain('token');
  });

  itIf(serverRunning)('DELETE /api/reports/:id returns 401 without auth', async () => {
    const res = await fetch(`${API_BASE}/api/reports/000000000000000000000000`, { method: 'DELETE' });
    expect(res.status).toBe(401);
  });
});
