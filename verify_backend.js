
import http from 'http';

const API_BASE = 'http://localhost:3001/api';

async function post(path, data, token = null) {
  return new Promise((resolve, reject) => {
    const body = JSON.stringify(data);
    const options = {
      hostname: 'localhost',
      port: 3001,
      path,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': body.length,
        ...(token ? { 'Authorization': `Bearer ${token}` } : {})
      }
    };

    const req = http.request(options, (res) => {
      let responseBody = '';
      res.on('data', (chunk) => responseBody += chunk);
      res.on('end', () => {
        try {
          resolve({ status: res.statusCode, data: JSON.parse(responseBody) });
        } catch (e) {
          resolve({ status: res.statusCode, raw: responseBody });
        }
      });
    });

    req.on('error', reject);
    req.write(body);
    req.end();
  });
}

async function runTests() {
  console.log('🚀 Starting Backend Verification...\n');

  try {
    // 1. Test Login
    console.log('Testing Authentication (Login)...');
    const loginRes = await post('/api/auth/login', {
      email: 'customer@example.com',
      password: 'password123',
      role: 'customer'
    });

    if (loginRes.status === 200 && loginRes.data.token) {
      console.log('✅ Auth successful. Token received.');
      const token = loginRes.data.token;

      // 2. Test AI Diagnostic
      console.log('\nTesting AI Diagnostic (Neural Engine)...');
      const aiRes = await post('/api/ai/diagnose', {
        problem: 'mesin mobil saya brebet dan sering mati'
      }, token);

      if (aiRes.status === 200 && aiRes.data.suggestion === 'Tune Up') {
        console.log('✅ AI Diagnostic successful. Result: Tune Up');
      } else {
        console.error('❌ AI Diagnostic failed or incorrect result:', aiRes);
      }

      // 3. Test Validation (Too short description)
      console.log('\nTesting Input Validation (Too short problem)...');
      const failAiRes = await post('/api/ai/diagnose', {
        problem: 'fix'
      }, token);

      if (failAiRes.status === 400) {
        console.log('✅ Validation successful. Error 400 caught for short description.');
      } else {
        console.error('❌ Validation failed. Expected 400 but got:', failAiRes.status);
      }

    } else {
      console.error('❌ Auth failed:', loginRes);
    }

  } catch (error) {
    console.error('❌ Verification Error:', error);
  }

  console.log('\nVerification complete.');
}

// Check if server is running first
const req = http.get('http://localhost:3001/api/health', (res) => {
    runTests();
}).on('error', (err) => {
    console.error('❌ Server is not running on port 3001. Start the backend first.');
    process.exit(1);
});
