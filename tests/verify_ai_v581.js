import fetch from 'node-fetch';

async function verifyAI() {
  console.log('--- Verifying AI Diagnostic Engine ---');

  // Login first to get JWT token
  const loginRes = await fetch('http://localhost:3001/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: 'customer@example.com', password: 'password123', role: 'customer' })
  });
  const loginData = await loginRes.json();
  const token = loginData.token;

  if (!token) {
    console.error('Login failed, no token returned:', loginData);
    process.exit(1);
  }

  const testCases = [
    { problem: 'mesin mobil saya brebet dan mogok di jalan', expected: 'Tune Up' },
    { problem: 'aki soak tidak bisa stater', expected: 'Cek Aki' },
    { problem: 'rem bunyi mencit dan tidak pakem', expected: 'Ganti Kampas Rem' },
    { problem: 'mobil saya brebet dan boros bensin', expected: 'Tune Up' },
    { problem: 'indikator check engine nyala dan limp mode', expected: 'Cek Kelistrikan' },
    { problem: 'mobil saya ngeden dan asap putih', expected: 'Tune Up' },
    { problem: 'suara gluduk di kaki-kaki depan', expected: 'Servis Rutin' },
    { problem: 'asap knalpot ngebul banget', expected: 'Tune Up' },
    { problem: 'mobil saya ngobos dan tarikan berat', expected: 'Tune Up' },
    { problem: 'ada oli meler di bawah mesin', expected: 'Ganti Oli' },
    { problem: 'klakson mati dan sekring putus', expected: 'Cek Kelistrikan' },
    { problem: 'mobil turun mesin total', expected: 'Tune Up' },
    { problem: 'rack steer oblak dan gluduk', expected: 'Servis Rutin' }
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
      if (data.suggestion === tc.expected) {
        console.log(`✅ PASSED (Got: ${data.suggestion}, Urgency: ${data.urgency_level}, Confidence: ${data.confidence}%)`);
      } else {
        console.log(`❌ FAILED (Expected: ${tc.expected}, Got: ${data.suggestion}, Version: ${data.version})`);
        console.log('Data:', JSON.stringify(data, null, 2));
        process.exit(1);
      }
    } catch (err) {
      console.error('Error during AI verification:', err.message);
      process.exit(1);
    }
  }

  console.log('--- AI Diagnostic Verification Complete: ALL SYSTEMS NOMINAL ---');
}

verifyAI();
