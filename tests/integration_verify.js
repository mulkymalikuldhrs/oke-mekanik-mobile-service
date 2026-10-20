import fetch from 'node-fetch';

const API_BASE_URL = 'http://localhost:3001/api';

async function verifyBackend() {
  console.log('--- Starting Integration Verification ---');

  // 1. Verify Health Check Endpoint
  try {
    const healthRes = await fetch(`${API_BASE_URL}/health`);
    const healthData = await healthRes.json();
    console.log('Health Check Response:', healthData);
    if (healthRes.ok && healthData.status === 'ok') {
      console.log('✅ Health Check Endpoint: PASSED');
    } else {
      console.error('❌ Health Check Endpoint: FAILED');
    }
  } catch (err) {
    console.error('❌ Health Check Endpoint Error:', err.message);
  }

  // 2. Verify AI Diagnostic Engine
  const testCases = [
    { problem: 'mesin ngobos dan knalpot keluar asap putih', expected: 'Turun Mesin (Overhaul)' },
    { problem: 'baterai high voltage tesla bermasalah kabel orange', expected: 'Servis EV / Hybrid' },
    { problem: 'mesin mati mendadak saat jalan', expected: 'Servis Darurat / Mogok' },
    { problem: 'rem bunyi berdecit saat diinjak', expected: 'Perbaikan Rem' },
    { problem: 'suara meledak keras di mesin', expected: 'Turun Mesin (Overhaul)' }
  ];

  console.log('\n--- Verifying AI Diagnostic Engine ---');
  // Login first to get bearer token
  let token = '';
  try {
    const loginRes = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'customer@example.com', password: 'password123', role: 'customer' })
    });
    const loginData = await loginRes.json();
    token = loginData.token;
  } catch (err) {
    console.error('Failed to log in for integration tests:', err.message);
  }

  for (const tc of testCases) {
    try {
      const aiRes = await fetch(`${API_BASE_URL}/ai/diagnose`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ problem: tc.problem })
      });
      const aiData = await aiRes.json();
      console.log(`Problem: "${tc.problem}"`);
      console.log(`Expected: ${tc.expected} | Suggestion: ${aiData.suggestion} | Confidence: ${aiData.confidence}%`);
      if (aiData.suggestion === tc.expected && aiData.confidence >= 80) {
        console.log('✅ AI Diagnostic Case: PASSED');
      } else {
        console.error('❌ AI Diagnostic Case: FAILED');
      }
    } catch (err) {
      console.error('❌ AI Diagnostic Error:', err.message);
    }
  }
}

verifyBackend();
