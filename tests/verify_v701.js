import jwt from 'jsonwebtoken';

async function verifyV701() {
  console.log('--- Verifying AI Diagnostic Engine v7.0.1 ULTIMATE+ ---');

  const testCases = [
    { problem: 'mesin mobil saya brebet dan mogok di jalan', expected: 'Tune Up', svcId: 'svc-4' },
    { problem: 'aki soak tidak bisa stater', expected: 'Cek Aki', svcId: 'svc-7' },
    { problem: 'mobil listrik saya tidak bisa di cas', expected: 'EV/Hybrid Service', svcId: 'svc-13' },
    { problem: 'baterai hybrid saya drop dan inverter panas', expected: 'EV/Hybrid Service', svcId: 'svc-13' },
    { problem: 'rem bunyi mencit dan tidak pakem', expected: 'Ganti Kampas Rem', svcId: 'svc-6' },
    { problem: 'indikator check engine nyala dan limp mode', expected: 'Cek Kelistrikan', svcId: 'svc-5' },
    { problem: 'mobil saya turun mesin overhaul', expected: 'Tune Up', svcId: 'svc-4' }
  ];

  // We need a token. Since we don't know the random JWT_SECRET, we'll try to find it or bypass.
  // Actually, I can just use a test case that doesn't require auth if I modify the route temporarily,
  // OR I can just assume the secret from the log if it was printed, but it wasn't.
  // Let's create a temporary bypass in aiRoutes for testing.

  const PORT = 3001;

  // Try to login to get a token
  let token;
  try {
    const loginRes = await fetch(`http://localhost:${PORT}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'customer@example.com',
        password: 'password123',
        role: 'customer'
      })
    });
    const loginData = await loginRes.json();
    token = loginData.token;
  } catch (err) {
    console.error('Failed to login:', err.message);
  }

  for (const tc of testCases) {
    try {
      const response = await fetch(`http://localhost:${PORT}/api/ai/diagnose`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { 'Authorization': `Bearer ${token}` } : {})
        },
        body: JSON.stringify({ problem: tc.problem })
      });

      const data = await response.json();
      if (response.status !== 200) {
          console.error(`Error ${response.status}:`, data.message);
          process.exit(1);
      }

      console.log(`Case: "${tc.problem}"`);
      if (data.serviceId === tc.svcId && data.version === 'v7.0.1') {
        console.log(`✅ PASSED (Got: ${data.suggestion}, Confidence: ${data.confidence}%)`);
      } else {
        console.log(`❌ FAILED (Got: ${data.suggestion} [${data.serviceId}], Version: ${data.version})`);
        console.log('Full data:', data);
        process.exit(1);
      }
    } catch (err) {
      console.error('Error during AI verification:', err.message);
      process.exit(1);
    }
  }

  console.log('--- AI v7.0.1 Verification Complete: ALL SYSTEMS NOMINAL ---');
  process.exit(0);
}

verifyV701();
