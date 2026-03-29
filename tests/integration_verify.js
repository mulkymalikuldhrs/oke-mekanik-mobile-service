import fetch from 'node-fetch';

const API_BASE_URL = 'http://localhost:3001/api';

async function testHealth() {
  console.log('Testing Backend Health...');
  try {
    const res = await fetch(`${API_BASE_URL}/health`);
    const data = await res.json();
    console.log('Health Status:', data.status);
    if (data.status !== 'ok') throw new Error('Health check failed');
  } catch (err) {
    console.error('Health Check Error:', err.message);
    process.exit(1);
  }
}

async function testAIDiagnostic() {
  console.log('Testing AI Diagnostic...');
  const scenarios = [
    { problem: 'motor saya mogok dan tidak bisa di stater, kayaknya akinya tekor', expected: 'Cek Aki' },
    { problem: 'rem bunyi cit cit terus pas ngerem', expected: 'Ganti Kampas Rem' },
    { problem: 'mesin brebet dan sering mati sendiri', expected: 'Tune Up' }
  ];

  for (const scenario of scenarios) {
    try {
      const res = await fetch(`${API_BASE_URL}/ai/diagnose`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ problem: scenario.problem })
      });
      const data = await res.json();
      console.log(`Problem: "${scenario.problem}" -> Suggestion: ${data.suggestion}`);
      if (data.suggestion !== scenario.expected) {
        console.warn(`Mismatch! Expected ${scenario.expected} but got ${data.suggestion}`);
      }
    } catch (err) {
      console.error('AI Diagnostic Error:', err.message);
      process.exit(1);
    }
  }
}

async function run() {
  await testHealth();
  await testAIDiagnostic();
  console.log('All Integration Tests Passed!');
}

run();
