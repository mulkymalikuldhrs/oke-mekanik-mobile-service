// import fetch from 'node-fetch';

const API_BASE_URL = 'http://localhost:3001/api';

async function verifyBackend() {
  console.log('--- Starting Backend Verification ---');

  // 1. Health Check
  try {
    const healthRes = await fetch(`${API_BASE_URL}/health`);
    const healthData = await healthRes.json();
    if (healthRes.ok && healthData.status === 'ok') {
      console.log('✅ Health Check: PASSED');
    } else {
      console.error('❌ Health Check: FAILED', healthData);
    }
  } catch (err) {
    console.error('❌ Health Check: ERROR', err.message);
  }

  // 2. AI Diagnostic Logic Verification
  const testCases = [
    { problem: 'mesin mobil saya brebet dan mogok di jalan', expected: 'Tune Up' },
    { problem: 'aki soak tidak bisa stater', expected: 'Cek Aki' },
    { problem: 'ban bocor kena paku', expected: 'Ganti Ban' },
    { problem: 'rem bunyi mencit dan tidak pakem', expected: 'Ganti Kampas Rem' },
    { problem: 'ac panas tidak dingin', expected: 'Isi Freon AC' }
  ];

  console.log('\n--- Verifying AI Diagnostic Engine ---');
  for (const tc of testCases) {
    try {
      const aiRes = await fetch(`${API_BASE_URL}/ai/diagnose`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ problem: tc.problem })
      });
      const aiData = await aiRes.json();
      if (aiRes.ok && aiData.suggestion === tc.expected) {
        console.log(`✅ AI Case "${tc.problem}": PASSED (Got: ${aiData.suggestion})`);
      } else {
        console.error(`❌ AI Case "${tc.problem}": FAILED (Expected: ${tc.expected}, Got: ${aiData.suggestion})`);
      }
    } catch (err) {
      console.error(`❌ AI Case "${tc.problem}": ERROR`, err.message);
    }
  }

  console.log('\n--- Backend Verification Complete ---');
}

verifyBackend();
