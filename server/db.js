import Database from 'better-sqlite3';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import bcrypt from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';

const __dirname = dirname(fileURLToPath(import.meta.url));
const db = new Database(join(__dirname, 'okemekanik.db'));

// Initialize tables
db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    role TEXT NOT NULL,
    phone TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS mechanics (
    id TEXT PRIMARY KEY,
    user_id TEXT,
    name TEXT NOT NULL,
    speciality TEXT,
    rating REAL DEFAULT 4.5,
    price_per_hour INTEGER DEFAULT 50000,
    is_online INTEGER DEFAULT 1,
    lat REAL,
    lng REAL,
    avatar TEXT,
    identity_number TEXT,
    phone TEXT,
    years_of_experience INTEGER,
    bio TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(user_id) REFERENCES users(id)
  );

  CREATE TABLE IF NOT EXISTS services (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT,
    base_price INTEGER NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS bookings (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL,
    mechanic_id TEXT NOT NULL,
    service_id TEXT NOT NULL,
    vehicle_brand TEXT,
    vehicle_model TEXT,
    vehicle_year TEXT,
    vehicle_license_plate TEXT,
    problem TEXT,
    status TEXT NOT NULL,
    location_lat REAL,
    location_lng REAL,
    location_address TEXT,
    estimated_cost INTEGER,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(user_id) REFERENCES users(id),
    FOREIGN KEY(mechanic_id) REFERENCES mechanics(id),
    FOREIGN KEY(service_id) REFERENCES services(id)
  );

  CREATE TABLE IF NOT EXISTS messages (
    id TEXT PRIMARY KEY,
    booking_id TEXT NOT NULL,
    sender_id TEXT NOT NULL,
    text TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(booking_id) REFERENCES bookings(id)
  );

  CREATE TABLE IF NOT EXISTS payments (
    id TEXT PRIMARY KEY,
    booking_id TEXT NOT NULL,
    amount INTEGER NOT NULL,
    payment_method TEXT,
    status TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(booking_id) REFERENCES bookings(id)
  );

  CREATE TABLE IF NOT EXISTS reviews (
    id TEXT PRIMARY KEY,
    booking_id TEXT NOT NULL,
    user_id TEXT NOT NULL,
    mechanic_id TEXT NOT NULL,
    rating INTEGER NOT NULL,
    comment TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(booking_id) REFERENCES bookings(id),
    FOREIGN KEY(user_id) REFERENCES users(id),
    FOREIGN KEY(mechanic_id) REFERENCES mechanics(id)
  );
`);

// Seed initial data if empty
const seedData = () => {
  const userCount = db.prepare('SELECT count(*) as count FROM users').get().count;
  if (userCount === 0) {
    console.log('Seeding robust initial data...');

    const salt = bcrypt.genSaltSync(10);
    const hashedPass = bcrypt.hashSync('password123', salt);

    // Seed Users
    const insertUser = db.prepare('INSERT INTO users (id, name, email, password_hash, role, phone) VALUES (?, ?, ?, ?, ?, ?)');
    const cust1Id = uuidv4();
    const mech1UserId = uuidv4();

    insertUser.run(cust1Id, 'Ahmad Customer', 'customer@example.com', hashedPass, 'customer', '08111111111');
    insertUser.run(mech1UserId, 'Bambang Mekanik', 'mechanic@example.com', hashedPass, 'mechanic', '08222222222');

    // Create 8 more random customers
    for (let i = 0; i < 8; i++) {
      insertUser.run(uuidv4(), `Customer ${i+2}`, `customer${i+2}@example.com`, hashedPass, 'customer', `081234567${i+20}`);
    }

    // Seed Services
    const insertService = db.prepare('INSERT INTO services (id, name, description, base_price) VALUES (?, ?, ?, ?)');
    const services = [
      { id: 'svc-1', name: 'Ganti Oli', desc: 'Penggantian oli mesin berkualitas (Shell/Castrol)', price: 50000 },
      { id: 'svc-2', name: 'Servis Rutin', desc: 'Pengecekan menyeluruh, tune up, dan pembersihan filter', price: 150000 },
      { id: 'svc-3', name: 'Ganti Ban', desc: 'Penggantian ban bocor atau aus di lokasi', price: 100000 },
      { id: 'svc-4', name: 'Masalah Aki', desc: 'Jumper aki atau penggantian aki baru', price: 75000 },
      { id: 'svc-5', name: 'Rem Blong', desc: 'Perbaikan sistem pengereman darurat', price: 200000 }
    ];
    services.forEach(s => insertService.run(s.id, s.name, s.desc, s.price));

    // Seed Mechanics (Jakarta area locations)
    const insertMechanic = db.prepare('INSERT INTO mechanics (id, user_id, name, speciality, rating, price_per_hour, is_online, lat, lng, avatar, years_of_experience, phone, bio) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)');

    const mech1Id = uuidv4();
    insertMechanic.run(mech1Id, mech1UserId, 'Bambang Mekanik', 'Ganti Oli, Servis Rutin', 4.8, 75000, 1, -6.2200, 106.8300, '👨‍🔧', 5, '08222222222', 'Mekanik berpengalaman spesialis mesin Jepang.');

    const otherMechanics = [
      { name: 'Siti Rahma', spec: 'Aki, Kelistrikan', rate: 4.9, price: 85000, lat: -6.1500, lng: 106.9000, avatar: '👩‍🔧', exp: 8, bio: 'Ahli kelistrikan mobil dan motor.' },
      { name: 'Budi Santoso', spec: 'Ban, Suspensi', rate: 4.7, price: 65000, lat: -6.1800, lng: 106.8200, avatar: '👨‍🔧', exp: 12, bio: 'Spesialis kaki-kaki kendaraan.' },
      { name: 'Agus Prayogo', spec: 'Servis Rutin, Ganti Oli', rate: 4.6, price: 70000, lat: -6.2500, lng: 106.7800, avatar: '👨‍🔧', exp: 4, bio: 'Cepat, handal, dan jujur.' },
      { name: 'Dewi Lestari', spec: 'Ganti Oli, Rem', rate: 4.9, price: 90000, lat: -6.1200, lng: 106.8500, avatar: '👩‍🔧', exp: 15, bio: 'Mekanik senior dengan sertifikasi internasional.' },
      { name: 'Eko Wahyudi', spec: 'Mesin, Transmisi', rate: 4.5, price: 100000, lat: -6.3000, lng: 106.8800, avatar: '👨‍🔧', exp: 20, bio: 'Ahli turun mesin dan transmisi matic.' },
      { name: 'Fajar Shidiq', spec: 'Ban, Aki', rate: 4.4, price: 60000, lat: -6.1700, lng: 106.9200, avatar: '👨‍🔧', exp: 3, bio: 'Layanan cepat untuk keadaan darurat.' },
      { name: 'Gita Permata', spec: 'Kelistrikan, AC', rate: 4.8, price: 95000, lat: -6.2100, lng: 106.8000, avatar: '👩‍🔧', exp: 7, bio: 'Spesialis AC dan kenyamanan kabin.' },
      { name: 'Hadi Wijaya', spec: 'Tune Up, Injeksi', rate: 4.7, price: 80000, lat: -6.1900, lng: 106.8600, avatar: '👨‍🔧', exp: 10, bio: 'Ahli optimasi performa mesin injeksi.' },
      { name: 'Indra Kusuma', spec: 'Ganti Oli, Servis Rutin', rate: 4.6, price: 75000, lat: -6.2300, lng: 106.8400, avatar: '👨‍🔧', exp: 6, bio: 'Melayani dengan sepenuh hati.' }
    ];

    otherMechanics.forEach(m => {
      insertMechanic.run(uuidv4(), null, m.name, m.spec, m.rate, m.price, 1, m.lat, m.lng, m.avatar, m.exp, '0898' + Math.floor(10000000 + Math.random() * 90000000), m.bio);
    });

    // Seed Bookings
    const insertBooking = db.prepare(`
      INSERT INTO bookings (id, user_id, mechanic_id, service_id, status, vehicle_brand, vehicle_model, vehicle_year, vehicle_license_plate, problem, estimated_cost, created_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    const booking1Id = 'BOOK-' + Math.floor(10000 + Math.random() * 90000);
    const booking2Id = 'BOOK-' + Math.floor(10000 + Math.random() * 90000);
    const booking3Id = 'BOOK-' + Math.floor(10000 + Math.random() * 90000);
    const booking4Id = 'BOOK-' + Math.floor(10000 + Math.random() * 90000);
    const booking5Id = 'BOOK-' + Math.floor(10000 + Math.random() * 90000);

    // Some completed bookings for analytics
    insertBooking.run(booking1Id, cust1Id, mech1Id, 'svc-1', 'completed', 'Toyota', 'Avanza', '2019', 'B 1234 ABC', 'Ganti Oli', 150000, '2024-11-20 10:00:00');
    insertBooking.run(booking2Id, cust1Id, mech1Id, 'svc-2', 'completed', 'Honda', 'Vario', '2021', 'B 5678 DEF', 'Servis Rutin', 250000, '2024-11-21 14:30:00');
    insertBooking.run(booking3Id, cust1Id, mech1Id, 'svc-1', 'completed', 'Toyota', 'Avanza', '2019', 'B 1234 ABC', 'Ganti Oli', 125000, '2024-11-22 09:15:00');
    insertBooking.run(booking4Id, cust1Id, mech1Id, 'svc-3', 'completed', 'Yamaha', 'NMAX', '2022', 'B 9012 GHI', 'Ganti Ban', 180000, '2024-11-23 16:45:00');
    insertBooking.run(booking5Id, cust1Id, mech1Id, 'svc-5', 'working', 'Suzuki', 'Ertiga', '2018', 'B 3456 JKL', 'Rem Blong', 350000, '2024-11-24 11:00:00');

    // Seed Reviews
    const insertReview = db.prepare('INSERT INTO reviews (id, booking_id, user_id, mechanic_id, rating, comment) VALUES (?, ?, ?, ?, ?, ?)');
    insertReview.run(uuidv4(), booking1Id, cust1Id, mech1Id, 5, 'Sangat cepat dan profesional! Mesin jadi halus lagi.');
    insertReview.run(uuidv4(), booking2Id, cust1Id, mech1Id, 4, 'Bagus, tapi datangnya agak telat 10 menit.');
    insertReview.run(uuidv4(), booking3Id, cust1Id, mech1Id, 5, 'Mantap, ganti oli cuma 15 menit selesai.');
    insertReview.run(uuidv4(), booking4Id, cust1Id, mech1Id, 5, 'Ban saya diganti dengan rapi. Terima kasih!');

    // Seed Payments
    const insertPayment = db.prepare('INSERT INTO payments (id, booking_id, amount, payment_method, status) VALUES (?, ?, ?, ?, ?)');
    insertPayment.run(uuidv4(), booking1Id, 150000, 'gopay', 'completed');
    insertPayment.run(uuidv4(), booking2Id, 250000, 'bank_transfer', 'completed');
    insertPayment.run(uuidv4(), booking3Id, 125000, 'qris', 'completed');
    insertPayment.run(uuidv4(), booking4Id, 180000, 'gopay', 'completed');
  }
};

seedData();

export default db;
