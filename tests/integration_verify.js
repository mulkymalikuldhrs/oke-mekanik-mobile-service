
import fetch from 'node-fetch';

const API_BASE = 'http://localhost:3001/api';

async function testHealth() {
  console.log('Testing /api/health...');
  try {
    const res = await fetch(`${API_BASE}/health`);
    const data = await res.json();
    if (res.ok && data.status === 'ok') {
      console.log('✅ Health check passed');
    } else {
      console.error('❌ Health check failed', data);
      process.exit(1);
    }
  } catch (e) {
    console.error('❌ Could not connect to backend', e.message);
    process.exit(1);
  }
}

async function testAiDiagnostic() {
  console.log('Testing /api/ai/diagnose...');
  const testCases = [
    { problem: 'mesin mobil saya mogok di jalan', expected: 'Tune Up' },
    { problem: 'rem bunyi cit cit blong', expected: 'Ganti Kampas Rem' },
    { problem: 'ban bocor kena paku', expected: 'Ganti Ban' },
    { problem: 'ac mobil panas tidak dingin', expected: 'Isi Freon AC' },
    { problem: 'aki soak tidak bisa stater', expected: 'Cek Aki' }
  ];

  for (const tc of testCases) {
    const res = await fetch(`${API_BASE}/ai/diagnose`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ problem: tc.problem })
    });
    const data = await res.json();
    if (data.suggestion === tc.expected) {
      console.log(`✅ AI Match: "${tc.problem}" -> ${data.suggestion}`);
    } else {
      console.error(`❌ AI Mismatch: "${tc.problem}" -> Expected ${tc.expected}, got ${data.suggestion}`);
      process.exit(1);
    }
  }
}

async function runAll() {
  await testHealth();
  await testAiDiagnostic();
  console.log('All integration health checks passed! 🚀');
}

runAll();
