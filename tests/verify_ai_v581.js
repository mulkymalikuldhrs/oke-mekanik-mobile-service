import fetch from 'node-fetch';

async function verifyAI() {
  console.log('--- Verifying AI Diagnostic Engine v7.0.1 ---');

  const testCases = [
    { problem: 'mesin ngobos dan knalpot keluar asap putih', expected: 'Turun Mesin (Overhaul)' },
    { problem: 'baterai high voltage tesla bermasalah kabel orange', expected: 'Servis EV / Hybrid' },
    { problem: 'mesin mati mendadak saat jalan', expected: 'Servis Darurat / Mogok' },
    { problem: 'rem bunyi berdecit saat diinjak', expected: 'Perbaikan Rem' },
    { problem: 'rack steer oblak dan gluduk', expected: 'Servis Rutin' }
  ];

  // Login first to get token
  let token = '';
  try {
    const loginRes = await fetch('http://localhost:3001/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'customer@example.com', password: 'password123', role: 'customer' })
    });
    const loginData = await loginRes.json();
    token = loginData.token;
  } catch (err) {
    console.error('Failed to log in for AI test:', err.message);
  }

  for (const tc of testCases) {
    try {
      const response = await fetch('http://localhost:3001/api/ai/diagnose', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ problem: tc.problem })
      });
      const data = await response.json();

      console.log(`Case: "${tc.problem}"`);
      if (data.suggestion === tc.expected && (data.version === 'v5.8.1-ultimate' || data.version === 'v7.0.1 ULTIMATE+' || data.version === 'v7.0.0')) {
        console.log(`✅ PASSED (Got: ${data.suggestion}, Urgency: ${data.urgency_level}, Confidence: ${data.confidence}%)`);
      } else {
        console.log(`❌ FAILED (Got: ${data.suggestion}, Version: ${data.version})`);
      }
    } catch (err) {
      console.error(`❌ ERROR: ${err.message}`);
    }
  }
}

verifyAI();
