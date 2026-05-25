import db from '../db.js';

export const getAllServices = (req, res) => {
  const services = db.prepare('SELECT * FROM services').all();
  res.json(services.map(s => ({
    id: s.id,
    name: s.name,
    description: s.description,
    basePrice: s.base_price,
    category: s.category,
    icon: s.icon,
    estimatedDuration: s.estimated_duration,
    isEmergencyAvailable: !!s.is_emergency_available
  })));
};
