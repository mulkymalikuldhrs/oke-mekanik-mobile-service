import fetch from 'node-fetch';

async function verifyAI() {
  console.log('--- Verifying AI Diagnostic Engine v5.8.2 ULTIMATE+ ---');

  const testCases = [
    { problem: 'mesin mobil saya brebet dan mogok di jalan', expected: 'Tune Up' },
    { problem: 'aki soak tidak bisa stater', expected: 'Cek Aki' },
    { problem: 'rem bunyi mencit dan tidak pakem', expected: 'Ganti Kampas Rem' },
    { problem: 'baterai hv saya inverter panas', expected: 'Cek Sistem EV/Hybrid' },
    { problem: 'mobil saya harus turun mesin total', expected: 'Overhaul / Turun Mesin' },
    { problem: 'skir klep dan ganti piston', expected: 'Overhaul / Turun Mesin' },
    { problem: 'motor listrik bunyi dengung keras', expected: 'Cek Sistem EV/Hybrid' },
    { problem: 'indikator check engine nyala dan limp mode', expected: 'Cek Kelistrikan' },
    { problem: 'asap knalpot ngebul banget', expected: 'Tune Up' },
    { problem: 'mobil saya ngobos dan tarikan berat', expected: 'Tune Up' },
    { problem: 'ada oli meler di bawah mesin', expected: 'Ganti Oli' },
    { problem: 'rack steer oblak dan gluduk', expected: 'Servis Rutin' }
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
      if (data.suggestion === tc.expected && data.version === 'v5.8.2-ultimate') {
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

  console.log('--- AI v5.8.2 Verification Complete: ALL SYSTEMS NOMINAL ---');
}

verifyAI();
