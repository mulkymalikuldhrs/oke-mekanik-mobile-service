import fetch from 'node-fetch';

async function verifyAI() {
  console.log('--- Verifying AI Diagnostic Engine v5.8.1 ULTIMATE+ ---');

  const testCases = [
    { problem: 'mesin mobil saya brebet dan mogok di jalan', expected: 'Tune Up' },
    { problem: 'aki soak tidak bisa stater', expected: 'Cek Aki' },
    { problem: 'rem bunyi mencit dan tidak pakem', expected: 'Ganti Kampas Rem' },
    { problem: 'mobil turun mesin total', expected: 'Overhaul / Turun Mesin' },
    { problem: 'baterai hv saya bermasalah di mobil hybrid', expected: 'Cek Sistem EV/Hybrid' }
  ];

  for (const tc of testCases) {
    try {
      const response = await fetch('http://localhost:3001/api/ai/diagnose', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ problem: tc.problem })
      });
      const data = await response.json();

      console.log(`Case: "${tc.problem}"`);
      if (data.suggestion === tc.expected && data.version === 'v7.0.1 ULTIMATE+') {
        console.log(`✅ PASSED (Got: ${data.suggestion}, Urgency: ${data.urgency_level}, Confidence: ${data.confidence}%)`);
      } else {
        console.log(`❌ FAILED (Got: ${data.suggestion}, Version: ${data.version})`);
        console.log('Data:', JSON.stringify(data, null, 2));
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
