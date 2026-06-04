const http = require('http');

const testCases = [
  {
    problem: 'baterai hv saya inverter panas',
    expectedSuggestion: 'Cek Sistem EV/Hybrid',
    expectedId: 'svc-9'
  },
  {
    problem: 'mesin mobil saya harus turun mesin dan skir klep',
    expectedSuggestion: 'Overhaul / Turun Mesin',
    expectedId: 'svc-13'
  },
  {
    problem: 'piston macet asap ngebul',
    expectedSuggestion: 'Overhaul / Turun Mesin',
    expectedId: 'svc-13'
  },
  {
    problem: 'mobil saya brebet dan ngelitik',
    expectedSuggestion: 'Tune Up',
    expectedId: 'svc-4'
  },
  {
    problem: 'aki tekor pagi susah nyala',
    expectedSuggestion: 'Cek Aki',
    expectedId: 'svc-7'
  }
];

async function runTests() {
  console.log('--- Starting AI v5.8.2 ULTIMATE+ Verification ---');
  let passed = 0;

  for (const tc of testCases) {
    const data = JSON.stringify({ problem: tc.problem });
    const options = {
      hostname: 'localhost',
      port: 3001,
      path: '/api/ai/diagnose',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(data)
      }
    };

    try {
      const result = await new Promise((resolve, reject) => {
        const req = http.request(options, (res) => {
          let body = '';
          res.on('data', (chunk) => body += chunk);
          res.on('end', () => {
            try {
              resolve(JSON.parse(body));
            } catch (e) {
              reject(new Error(`Failed to parse response: ${body}`));
            }
          });
        });
        req.on('error', (e) => reject(e));
        req.write(data);
        req.end();
      });

      if (result && result.serviceId === tc.expectedId) {
        console.log(`[PASS] "${tc.problem}" -> ${result.suggestion} (${result.version})`);
        passed++;
      } else {
        console.log(`[FAIL] "${tc.problem}" -> Expected ${tc.expectedId}, got ${result ? result.serviceId : 'ERROR'}`);
      }
    } catch (e) {
      console.error(`Error testing "${tc.problem}": ${e.message}`);
    }
  }

  console.log(`--- Result: ${passed}/${testCases.length} Passed ---`);
  return passed === testCases.length;
}

// Start backend before running tests
const { spawn } = require('child_process');
console.log('Starting server...');
const server = spawn('node', ['server/index.js']);

server.stdout.on('data', (data) => {
  const output = data.toString();
  console.log(`Server: ${output.trim()}`);
  if (output.includes('Server: http://localhost:3001')) {
    console.log('Server is ready. Running tests...');
    runTests().then((success) => {
      console.log(success ? 'All tests passed!' : 'Some tests failed.');
      server.kill();
      process.exit(success ? 0 : 1);
    }).catch(err => {
      console.error('Test execution error:', err);
      server.kill();
      process.exit(1);
    });
  }
});

server.stderr.on('data', (data) => {
  console.error(`Server Error: ${data}`);
});

setTimeout(() => {
  console.error('Timeout waiting for server to start');
  server.kill();
  process.exit(1);
}, 30000);
