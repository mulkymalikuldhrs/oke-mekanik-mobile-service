
import db from '../server/db.js';

async function verify() {
  console.log('--- Verifying Database ---');
  const service = db.prepare('SELECT * FROM services WHERE id = ?').get('svc-13');
  if (service) {
    console.log('✓ svc-13 found in database:', service.name);
  } else {
    console.error('✗ svc-13 NOT found in database');
    process.exit(1);
  }

  console.log('\n--- Verifying AI Diagnostic Logic ---');
  const { diagnoseProblem } = await import('../server/controllers/aiController.js');

  const mockReq = {
    body: { problem: 'Mobil saya tesla ada masalah dengan inverter dan baterai hv' }
  };

  const mockRes = {
    status: function(s) { this.statusCode = s; return this; },
    json: function(data) {
      console.log('AI Response:', JSON.stringify(data, null, 2));
      if (data.serviceId === 'svc-13' && data.version === 'v7.0.1') {
        console.log('✓ AI correctly identified EV problem with v7.0.1');
      } else {
        console.error('✗ AI failed to identify EV problem or wrong version');
        process.exit(1);
      }
    }
  };

  await diagnoseProblem(mockReq, mockRes);
}

verify().catch(err => {
  console.error(err);
  process.exit(1);
});
