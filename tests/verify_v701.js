import fetch from 'node-fetch';

const API_URL = 'http://localhost:3001/api';

async function getAuthToken() {
  const response = await fetch(`${API_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      email: 'customer@example.com',
      password: 'password123',
      role: 'customer'
    })
  });
  const data = await response.json();
  return data.token;
}

async function testDiagnostic(token, problem) {
  console.log(`Testing: "${problem}"`);
  const response = await fetch(`${API_URL}/ai/diagnose`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify({ problem })
  });
  const data = await response.json();
  console.log(`Result: ${data.suggestion} (ID: ${data.serviceId}, Version: ${data.version}, Confidence: ${data.confidence}%)`);
  return data;
}

async function runTests() {
  console.log('--- AI Diagnostic Engine v7.0.1 Verification ---');

  try {
    const token = await getAuthToken();

    // Test Case 1: Overhaul
    const res1 = await testDiagnostic(token, 'mobil saya harus turun mesin dan skir klep');
    if (res1.serviceId === 'svc-9') console.log('✅ Overhaul match successful');
    else console.error('❌ Overhaul match failed');

    // Test Case 2: EV/Hybrid
    const res2 = await testDiagnostic(token, 'baterai hv saya bermasalah di mobil hybrid');
    if (res2.serviceId === 'svc-13') console.log('✅ EV/Hybrid match successful');
    else console.error('❌ EV/Hybrid match failed');

    // Test Case 3: Battery (Aki)
    const res3 = await testDiagnostic(token, 'mobil susah stater pagi hari aki soak');
    if (res3.serviceId === 'svc-7') console.log('✅ Battery match successful');
    else console.error('❌ Battery match failed');

    console.log('--- Verification Complete ---');
  } catch (err) {
    console.error('Verification failed: Make sure the backend is running on port 3001');
    console.error(err);
    process.exit(1);
  }
}

runTests();
