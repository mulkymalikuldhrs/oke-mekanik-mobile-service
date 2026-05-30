import { diagnoseProblem } from '../server/controllers/aiController.js';

const testCases = [
  {
    problem: 'baterai hv saya panas sekali dan inverter bunyi',
    expected: 'Cek Sistem EV/Hybrid',
    serviceId: 'svc-9'
  },
  {
    problem: 'mesin mobil saya brebet dan keluar asap putih',
    expected: 'Tune Up',
    serviceId: 'svc-4'
  },
  {
    problem: 'rem bunyi mencit dan pedal terasa dalam',
    expected: 'Ganti Kampas Rem',
    serviceId: 'svc-6'
  },
  {
    problem: 'aki saya soak pagi ini susah nyala',
    expected: 'Cek Aki',
    serviceId: 'svc-7'
  },
  {
    problem: 'mesin mati total sepertinya harus turun mesin atau overhaul',
    expected: 'Overhaul / Turun Mesin',
    serviceId: 'svc-13'
  }
];

console.log('--- Verifying AI Diagnostic Engine v5.8.2 ULTIMATE+ ---');

let passed = 0;
testCases.forEach(tc => {
  const req = { body: { problem: tc.problem } };
  const res = {
    json: (data) => {
      if (data.suggestion === tc.expected && data.serviceId === tc.serviceId) {
        console.log(`✅ PASSED: "${tc.problem}" -> ${data.suggestion} (Confidence: ${data.confidence}%)`);
        passed++;
      } else {
        console.error(`❌ FAILED: "${tc.problem}"`);
        console.error(`   Expected: ${tc.expected} (${tc.serviceId})`);
        console.error(`   Got: ${data.suggestion} (${data.serviceId})`);
      }
    },
    status: () => ({ json: (err) => console.error(err) })
  };
  diagnoseProblem(req, res);
});

if (passed === testCases.length) {
  console.log('\n--- AI v5.8.2 Verification Complete: ALL SYSTEMS NOMINAL ---');
} else {
  console.error(`\n--- AI Verification Failed: ${testCases.length - passed} failures ---`);
  process.exit(1);
}
