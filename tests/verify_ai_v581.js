import fetch from 'node-fetch';

const API_BASE_URL = 'http://localhost:3001/api';

async function verifyAI() {
  console.log('--- Verifying AI Diagnostic Engine ---');

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
    { problem: 'rack steer oblak dan gluduk', expected: 'Servis Rutin' }
  ];

  let token = '';
  try {
    const loginRes = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'customer@example.com', password: 'password123', role: 'customer' })
    });
    const loginData = await loginRes.json();
    token = loginData.token;
  } catch (e) {
    console.error('Login failed:', e.message);
  }

  for (const tc of testCases) {
    try {
      const res = await fetch(`${API_BASE_URL}/ai/diagnose`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ problem: tc.problem })
      });
      const data = await res.json();

      console.log(`Case: "${tc.problem}"`);
      if (data.suggestion === tc.expected) {
        console.log(`✅ PASSED (Got: ${data.suggestion}, Urgency: ${data.urgency_level}, Confidence: ${data.confidence}%)`);
      } else {
        console.log(`❌ FAILED (Expected: ${tc.expected}, Got: ${data.suggestion})`);
        process.exit(1);
      }
    } catch (err) {
      console.error('Error during AI verification:', err.message);
      process.exit(1);
    }
  }

  console.log('--- AI Verification Complete: ALL SYSTEMS NOMINAL ---');
}

verifyAI();
