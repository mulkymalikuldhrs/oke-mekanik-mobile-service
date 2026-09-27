import fetch from 'node-fetch';

const API_BASE_URL = 'http://localhost:3001/api';

async function verifyV701() {
  console.log('--- Starting Version 7.0.1 Integration Verification ---');

  // 1. Health Check
  try {
    const healthRes = await fetch(`${API_BASE_URL}/health`);
    const healthData = await healthRes.json();
    if (healthRes.ok && healthData.status === 'ok' && healthData.version === '7.0.1') {
      console.log(`✅ Health Check: PASSED (Version: ${healthData.version}, Online Mechanics: ${healthData.stats.onlineMechanics})`);
    } else {
      console.error('❌ Health Check: FAILED', healthData);
      process.exit(1);
    }
  } catch (err) {
    console.error('❌ Health Check: ERROR', err.message);
    process.exit(1);
  }

  // 2. Authenticate to get JWT Token for AI Diagnostic
  let authToken = '';
  try {
    const loginRes = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'customer@example.com',
        password: 'password123',
        role: 'customer'
      })
    });
    const loginData = await loginRes.json();
    if (loginRes.ok && loginData.token) {
      authToken = loginData.token;
      console.log('✅ Authentication: PASSED (JWT Token Obtained)');
    } else {
      console.error('❌ Authentication: FAILED', loginData);
      process.exit(1);
    }
  } catch (err) {
    console.error('❌ Authentication: ERROR', err.message);
    process.exit(1);
  }

  // 3. AI Diagnostic Cases (v7.0.1 ULTIMATE+)
  const testCases = [
    { problem: 'mesin mobil saya brebet dan mogok di jalan', expected: 'Tune Up' },
    { problem: 'aki soak tidak bisa stater', expected: 'Cek Aki' },
    { problem: 'ban bocor kena paku', expected: 'Ganti Ban' },
    { problem: 'rem bunyi mencit dan tidak pakem', expected: 'Ganti Kampas Rem' },
    { problem: 'ac panas tidak dingin', expected: 'Isi Freon AC' },
    { problem: 'mesin ganti seher dan turun setengah ngebul parah', expected: 'Overhaul / Turun Mesin' },
    { problem: 'mobil wuling ev kabel orange port cas tidak mengisi bms error', expected: 'Servis Mobil Listrik / EV' }
  ];

  console.log('\n--- Verifying AI Diagnostic Engine v7.0.1 ULTIMATE+ ---');
  for (const tc of testCases) {
    try {
      const aiRes = await fetch(`${API_BASE_URL}/ai/diagnose`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authToken}`
        },
        body: JSON.stringify({ problem: tc.problem })
      });
      const aiData = await aiRes.json();
      if (aiRes.ok && aiData.suggestion === tc.expected && aiData.version === 'v7.0.1 ULTIMATE+') {
        console.log(`✅ AI Case "${tc.problem}": PASSED (Got: ${aiData.suggestion}, Version: ${aiData.version}, Confidence: ${aiData.confidence}%)`);
      } else {
        console.error(`❌ AI Case "${tc.problem}": FAILED (Expected: ${tc.expected}, Got: ${aiData.suggestion}, Version: ${aiData.version})`);
        process.exit(1);
      }
    } catch (err) {
      console.error(`❌ AI Case "${tc.problem}": ERROR`, err.message);
      process.exit(1);
    }
  }

  console.log('\n--- Version 7.0.1 Verification Complete: ALL SYSTEMS NOMINAL ---');
}

verifyV701();
