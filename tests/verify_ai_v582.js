import { diagnoseProblem } from '../server/controllers/aiController.js';

const mockRes = {
  json: (data) => {
    // console.log('Result:', JSON.stringify(data, null, 2));
    return data;
  },
  status: (code) => ({
    json: (data) => {
      console.log(`Error ${code}:`, data);
      return data;
    }
  })
};

const testCases = [
  {
    name: 'EV Inverter Issue',
    problem: 'Mobil listrik saya muncul peringatan inverter panas dan range baterai drop',
    expectedSvcId: 'svc-13'
  },
  {
    name: 'Overhaul / Turun Mesin',
    problem: 'Mesin suara kasar sekali, ada oli campur air di radiator, harus turun mesin kayaknya',
    expectedSvcId: 'svc-9'
  },
  {
    name: 'Hybrid BMS',
    problem: 'Sistem hybrid error, bms sensor malfungsi',
    expectedSvcId: 'svc-13'
  }
];

async function runTests() {
  console.log('--- AI Diagnostic Engine v5.8.2 Verification (Corrected IDs) ---');
  let passed = 0;
  for (const tc of testCases) {
    console.log(`\nTest Case: ${tc.name}`);
    console.log(`Problem: ${tc.problem}`);

    let result;
    const res = {
      json: (data) => {
        result = data;
        return data;
      },
      status: (code) => ({
        json: (data) => {
          result = data;
          return data;
        }
      })
    };

    await diagnoseProblem({ body: { problem: tc.problem } }, res);

    console.log('Result SvcId:', result.serviceId);
    if (result.serviceId === tc.expectedSvcId) {
      console.log('✅ PASSED');
      passed++;
    } else {
      console.log(`❌ FAILED (Expected ${tc.expectedSvcId}, got ${result.serviceId})`);
    }
  }
  console.log(`\nResults: ${passed}/${testCases.length} Passed`);
  if (passed !== testCases.length) process.exit(1);
}

runTests();
