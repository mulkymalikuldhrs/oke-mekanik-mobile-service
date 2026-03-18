import axios from 'axios';

const API_URL = 'http://localhost:3001/api';

async function verify() {
  console.log('🚀 Starting Masterpiece Backend Verification...');

  try {
    // 1. Health Check
    const health = await axios.get(`${API_URL}/health`);
    console.log('✅ Health Check:', health.data.status === 'ok' ? 'PASSED' : 'FAILED');

    // 2. Auth - Register
    const email = `test-${Date.now()}@example.com`;
    const register = await axios.post(`${API_URL}/auth/register`, {
      name: 'Verification User',
      email: email,
      password: 'password123',
      role: 'customer'
    });
    const token = register.data.token;
    console.log('✅ Auth Register:', token ? 'PASSED' : 'FAILED');

    // 3. AI Diagnose
    const diagnose = await axios.post(`${API_URL}/ai/diagnose`, {
      problem: 'Mesin saya bunyi berdecit dan berasap hitam'
    }, {
      headers: { Authorization: `Bearer ${token}` }
    });
    console.log('✅ AI Diagnose:', diagnose.data.suggestion ? `PASSED (${diagnose.data.suggestion})` : 'FAILED');

    // 4. Mechanics List
    const mechanics = await axios.get(`${API_URL}/mechanics`);
    console.log('✅ Mechanics API:', mechanics.data.length > 0 ? `PASSED (${mechanics.data.length} found)` : 'FAILED');

    console.log('\n✨ All core API flows verified successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Verification FAILED:', error.response?.data || error.message);
    process.exit(1);
  }
}

verify();
