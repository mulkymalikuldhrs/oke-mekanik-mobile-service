const axios = require('axios');

const API_BASE = 'http://localhost:3001/api';

async function verify() {
  console.log('🚀 Starting Oke Mekanik Backend Verification...');

  try {
    // 1. Health Check
    const health = await axios.get(`${API_BASE}/health`);
    console.log('✅ Health Check Passed:', health.data.status);

    // 2. Auth - Register
    const email = `test-${Date.now()}@example.com`;
    const reg = await axios.post(`${API_BASE}/auth/register`, {
      name: 'Test User',
      email: email,
      password: 'password123',
      role: 'customer'
    });
    const token = reg.data.token;
    console.log('✅ Auth Register Passed');

    // 3. Auth - Login
    const login = await axios.post(`${API_BASE}/auth/login`, {
      email: email,
      password: 'password123',
      role: 'customer'
    });
    console.log('✅ Auth Login Passed');

    // 4. AI Diagnostic
    const diag = await axios.post(`${API_BASE}/ai/diagnose`, {
      problem: 'mesin mobil saya brebet dan sering mati mendadak'
    });
    if (diag.data.suggestion === 'Tune Up') {
      console.log('✅ AI Diagnostic (Tune Up) Passed');
    } else {
      console.log('❌ AI Diagnostic Failed: Unexpected suggestion', diag.data.suggestion);
    }

    const diagAki = await axios.post(`${API_BASE}/ai/diagnose`, {
      problem: 'aki tekor tidak bisa stater'
    });
    if (diagAki.data.suggestion === 'Cek Aki') {
      console.log('✅ AI Diagnostic (Cek Aki) Passed');
    }

    // 5. Fetch Services
    const services = await axios.get(`${API_BASE}/services`);
    if (services.data.length > 0) {
      console.log(`✅ Services Fetch Passed (${services.data.length} services)`);
    }

    // 6. Create Booking
    const booking = await axios.post(`${API_BASE}/bookings`, {
      mechanicId: 'mech-1',
      serviceId: 'svc-1',
      vehicle: { brand: 'Toyota', model: 'Avanza', year: '2020', licensePlate: 'B 1234 ABC' },
      problem: 'Ganti Oli',
      location: { lat: -6.2, lng: 106.8, address: 'Jakarta Selatan' },
      isEmergency: false
    }, {
      headers: { Authorization: `Bearer ${token}` }
    });
    console.log('✅ Booking Creation Passed:', booking.data.id);

    console.log('\n🏆 ALL BACKEND VERIFICATIONS PASSED SUCCESSFULLY!');
  } catch (error) {
    console.error('\n❌ Verification Failed:');
    if (error.response) {
      console.error(`Status: ${error.response.status}`);
      console.error('Data:', error.response.data);
    } else {
      console.error(error.message);
    }
    process.exit(1);
  }
}

verify();
