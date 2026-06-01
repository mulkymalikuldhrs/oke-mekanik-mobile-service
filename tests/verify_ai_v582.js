import { diagnoseProblem } from '../server/controllers/aiController.js';

const mockRes = {
  json: (data) => {
    console.log('Result:', JSON.stringify(data, null, 2));
    return data;
  },
  status: (code) => ({
    json: (data) => {
      console.log(`Error ${code}:`, data);
      return data;
    }
  })
};

const scenarios = [
  { name: 'EV/Hybrid Case', problem: 'baterai hv saya inverter panas' },
  { name: 'Overhaul Case', problem: 'mesin mati total mau turun mesin skir klep' },
  { name: 'Tune Up Case', problem: 'mesin brebet ngelitik' },
  { name: 'Battery Case', problem: 'pagi susah nyala aki tekor' }
];

console.log('--- AI DIAGNOSTIC v5.8.2 VERIFICATION ---');

scenarios.forEach(s => {
  console.log(`\nScenario: ${s.name}`);
  console.log(`Input: "${s.problem}"`);
  diagnoseProblem({ body: { problem: s.problem } }, mockRes);
});
