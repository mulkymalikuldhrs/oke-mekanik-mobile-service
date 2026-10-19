import fetch from 'node-fetch';

async function verifyV701() {
  console.log('--- Verifying Oke Mekanik v7.0.1 Masterpiece v28.2 ULTIMATE+ ---');

  const API_BASE_URL = 'http://localhost:3001/api';

  // 1. Health check
  const healthRes = await fetch(`${API_BASE_URL}/health`);
  const healthData = await healthRes.json();
  console.log('Health status:', healthData.status, 'Version:', healthData.version);

  // 2. Auth login
  const loginRes = await fetch(`${API_BASE_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: 'customer@example.com', password: 'password123', role: 'customer' })
  });
  const loginData = await loginRes.json();
  const token = loginData.token;

  // 3. Test AI diagnostic engine with specialized categories
  const cases = [
    { problem: 'ganti seher dan turun mesin total', expected: 'Overhaul / Turun Mesin' },
    { problem: 'baterai tinggi tesla ioniq wuling ev port cas rusak', expected: 'Servis EV & Hybrid' },
    { problem: 'mesin mobil brebet dan ngeden', expected: 'Tune Up' },
    { problem: 'aki tekor dan stater berat', expected: 'Cek Aki' }
  ];

  for (const c of cases) {
    const aiRes = await fetch(`${API_BASE_URL}/ai/diagnose`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ problem: c.problem })
    });
    const data = await aiRes.json();
    console.log(`[AI Check] Case: "${c.problem}" => ${data.suggestion} (Confidence: ${data.confidence}%, Version: ${data.version})`);
    if (data.suggestion !== c.expected) {
      throw new Error(`Mismatch! Expected ${c.expected}, got ${data.suggestion}`);
    }
  }

  console.log('--- v7.0.1 Verification SUCCESS ---');
}

verifyV701().catch((err) => {
  console.error('v7.0.1 Verification Failed:', err);
  process.exit(1);
});
