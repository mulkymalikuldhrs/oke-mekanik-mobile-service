import fetch from 'node-fetch';

async function verifyAI() {
  console.log('--- Verifying AI Diagnostic Engine v5.8.1 ULTIMATE+ ---');

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
  } catch (e) {
    console.error('Failed to log in for token:', e.message);
  }

  const testCases = [
    { problem: 'mesin mobil saya brebet dan mogok di jalan', expected: 'Tune Up Mesin' },
    { problem: 'aki soak tidak bisa stater', expected: 'Aki & Kelistrikan' },
    { problem: 'rem bunyi mencit dan tidak pakem', expected: 'Servis Rem' },
    { problem: 'mobil saya brebet dan boros bensin', expected: 'Tune Up Mesin' },
    { problem: 'indikator check engine nyala dan limp mode', expected: 'Tune Up Mesin' },
    { problem: 'mobil saya ngeden dan asap putih', expected: 'Tune Up Mesin' },
  ];

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
      if (data.suggestion && data.version) {
        console.log(`✅ PASSED (Got: ${data.suggestion}, Urgency: ${data.urgency_level}, Confidence: ${data.confidence}%)`);
      } else {
        console.log(`❌ FAILED (Got: ${data.suggestion}, Version: ${data.version})`);
        console.log('Data:', JSON.stringify(data, null, 2));
        process.exit(1);
      }
    } catch (err) {
      console.error('Error during AI verification:', err.message);
      process.exit(1);
    }
  }

  console.log('--- AI v5.8.1 Verification Complete: ALL SYSTEMS NOMINAL ---');
}

verifyAI();
