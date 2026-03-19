/**
 * Verify Backend API - Automated Non-Interactive Test Suite
 * Oke Mekanik Full-Stack Integrity Check
 */

const BASE_URL = 'http://localhost:3001/api';
let authToken = '';

async function testAuth() {
  console.log('--- Testing Auth Endpoints ---');
  try {
    const loginRes = await fetch(`${BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'customer@example.com', password: 'password123', role: 'customer' })
    });

    const data = await loginRes.json();
    if (loginRes.ok && data.token) {
      authToken = data.token;
      console.log('✅ Login Successful');
    } else {
      console.error('❌ Login Failed:', data.message);
    }
  } catch (err) {
    console.error('❌ Auth Test Error:', err.message);
  }
}

async function testAiDiagnostic() {
  console.log('\n--- Testing AI Diagnostic ---');
  try {
    const res = await fetch(`${BASE_URL}/ai/diagnose`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${authToken}`
      },
      body: JSON.stringify({ problem: 'Rem saya bunyi mencit saat diinjak' })
    });

    const data = await res.json();
    if (res.ok && data.suggestion.includes('Rem')) {
      console.log('✅ AI Diagnostic: Correct suggestion for brakes');
    } else {
      console.error('❌ AI Diagnostic Unexpected Response:', data);
    }
  } catch (err) {
    console.error('❌ AI Test Error:', err.message);
  }
}

async function testHealth() {
    console.log('\n--- Testing Health Check ---');
    try {
        const res = await fetch(`${BASE_URL}/health`);
        const data = await res.json();
        if (res.ok && data.status === 'ok') {
            console.log('✅ Backend Health: Healthy');
        } else {
            console.error('❌ Backend Health: Unhealthy', data);
        }
    } catch (err) {
        console.error('❌ Health Test Error:', err.message);
    }
}

async function run() {
  console.log('Starting API Verification...');
  await testHealth();
  await testAuth();
  if (authToken) {
    await testAiDiagnostic();
  }
  console.log('\nVerification Complete.');
}

run();
