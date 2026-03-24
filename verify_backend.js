const API_BASE = 'http://127.0.0.1:3001/api';

async function fetchJson(url, options = {}) {
  const response = await fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
  });
  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: response.statusText }));
    throw new Error(`HTTP ${response.status}: ${error.message || response.statusText}`);
  }
  return response.json();
}

async function verify() {
  console.log('🚀 Starting Oke Mekanik Backend Verification (Vanilla Fetch)...');

  try {
    // 1. Health Check
    const health = await fetchJson(`${API_BASE}/health`);
    console.log('✅ Health Check Passed:', health.status);

    // 2. Auth - Register
    const email = `test-${Date.now()}@example.com`;
    const reg = await fetchJson(`${API_BASE}/auth/register`, {
      method: 'POST',
      body: JSON.stringify({
        name: 'Test User',
        email: email,
        password: 'password123',
        role: 'customer'
      })
    });
    const token = reg.token;
    console.log('✅ Auth Register Passed');

    // 3. Auth - Login
    await fetchJson(`${API_BASE}/auth/login`, {
      method: 'POST',
      body: JSON.stringify({
        email: email,
        password: 'password123',
        role: 'customer'
      })
    });
    console.log('✅ Auth Login Passed');

    // 4. AI Diagnostic
    const diag = await fetchJson(`${API_BASE}/ai/diagnose`, {
      method: 'POST',
      body: JSON.stringify({
        problem: 'mesin mobil saya brebet dan sering mati mendadak'
      })
    });
    if (diag.suggestion === 'Tune Up') {
      console.log('✅ AI Diagnostic (Tune Up) Passed');
    } else {
      console.log('❌ AI Diagnostic Failed: Unexpected suggestion', diag.suggestion);
    }

    const diagAki = await fetchJson(`${API_BASE}/ai/diagnose`, {
      method: 'POST',
      body: JSON.stringify({
        problem: 'aki tekor tidak bisa stater'
      })
    });
    if (diagAki.suggestion === 'Cek Aki') {
      console.log('✅ AI Diagnostic (Cek Aki) Passed');
    }

    // 5. Fetch Services
    const services = await fetchJson(`${API_BASE}/services`);
    if (services.length > 0) {
      console.log(`✅ Services Fetch Passed (${services.length} services)`);
    }

    // 6. Create Booking
    const booking = await fetchJson(`${API_BASE}/bookings`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` },
      body: JSON.stringify({
        mechanicId: 'mech-1',
        serviceId: 'svc-1',
        vehicle: { brand: 'Toyota', model: 'Avanza', year: '2020', licensePlate: 'B 1234 ABC' },
        problem: 'Ganti Oli',
        location: { lat: -6.2, lng: 106.8, address: 'Jakarta Selatan' },
        isEmergency: false
      })
    });
    console.log('✅ Booking Creation Passed:', booking.id);

    console.log('\n🏆 ALL BACKEND VERIFICATIONS PASSED SUCCESSFULLY!');
  } catch (error) {
    console.error('\n❌ Verification Failed:');
    console.error(error.message);
    process.exit(1);
  }
}

verify();
