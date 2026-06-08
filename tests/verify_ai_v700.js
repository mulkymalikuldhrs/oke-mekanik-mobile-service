// Mocking the diagnose function logic for testing
import { diagnoseProblem } from '../server/controllers/aiController.js';

const tests = [
  {
    input: "mesin saya brebet dan keluar asap putih",
    expected: "svc-4"
  },
  {
    input: "rem bunyi mencit dan blong",
    expected: "svc-6"
  },
  {
    input: "aki soak pagi susah nyala",
    expected: "svc-7"
  },
  {
    input: "mesin mati total sepertinya harus turun mesin skir klep",
    expected: "svc-9"
  },
  {
    input: "inverter mobil listrik saya error dan baterai hv panas",
    expected: "svc-13"
  }
];

console.log("--- AI Diagnostic Engine v7.0.0 Verification ---");

let passed = 0;
for (const test of tests) {
  let result = null;
  const mockRes = {
    json: (data) => { result = data; return mockRes; },
    status: function(code) { this.statusCode = code; return this; }
  };

  const req = { body: { problem: test.input } };
  diagnoseProblem(req, mockRes);

  if (result && result.serviceId === test.expected) {
    console.log(`✅ PASS: "${test.input}" -> ${result.suggestion} (${result.serviceId}) [Confidence: ${result.confidence}%]`);
    passed++;
  } else {
    console.log(`❌ FAIL: "${test.input}" -> Expected ${test.expected}, got ${result ? result.serviceId : 'NULL'} (${result ? result.suggestion : 'N/A'})`);
  }
}

console.log(`\nResult: ${passed}/${tests.length} tests passed.`);
if (passed === tests.length) {
  console.log("AI v7.0.0 ULTIMATE+ Verified Successfully.");
} else {
  process.exit(1);
}
