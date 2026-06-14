import fetch from 'node-fetch';

async function verifyAI() {
  console.log('--- Verifying AI Diagnostic Engine v7.0.1 ULTIMATE+ ---');

  const testCases = [
    { problem: 'mesin mobil saya brebet dan mogok di jalan', expected: 'Tune Up' },
    { problem: 'aki soak tidak bisa stater', expected: 'Cek Aki' },
    { problem: 'rem bunyi mencit dan tidak pakem', expected: 'Ganti Kampas Rem' },
    { problem: 'indikator check engine nyala dan limp mode', expected: 'Cek Kelistrikan' },
    { problem: 'mobil saya turun mesin total', expected: 'Overhaul / Turun Mesin' },
    { problem: 'asap putih dan mesin kasar', expected: 'Overhaul / Turun Mesin' },
    { problem: 'baterai hv saya drop dan inverter panas', expected: 'Cek Sistem EV/Hybrid' },
    { problem: 'mobil listrik saya tidak bisa di cas', expected: 'Cek Sistem EV/Hybrid' },
    { problem: 'suara gluduk di kaki-kaki depan', expected: 'Servis Rutin' },
    { problem: 'oli meler di bawah mesin', expected: 'Ganti Oli' }
  ];

  let passed = 0;
  for (const tc of testCases) {
    try {
      const response = await fetch('http://localhost:3001/api/ai/diagnose', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ problem: tc.problem })
      });
      const data = await response.json();

      console.log(`Case: "${tc.problem}"`);
      if (data.suggestion === tc.expected && data.version === 'v7.0.1') {
        console.log(`✅ PASSED (Got: ${data.suggestion}, Urgency: ${data.urgency_level}, Confidence: ${data.confidence}%)`);
        passed++;
      } else {
        console.log(`❌ FAILED (Got: ${data.suggestion}, Expected: ${tc.expected}, Version: ${data.version})`);
        // console.log('Data:', JSON.stringify(data, null, 2));
      }
    } catch (err) {
      console.error('Error during AI verification:', err.message);
      console.log('Is the backend server running? (npm run backend)');
      process.exit(1);
    }
  }

  console.log(`\nVerification Summary: ${passed}/${testCases.length} Passed`);
  if (passed === testCases.length) {
    console.log('--- AI v7.0.1 Verification Complete: ALL SYSTEMS NOMINAL ---');
  } else {
    console.log('--- AI v7.0.1 Verification Failed: Regressions Detected ---');
    process.exit(1);
  }
}

verifyAI();
