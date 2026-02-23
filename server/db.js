import Database from 'better-sqlite3';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import bcrypt from 'bcryptjs';

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
    phone TEXT
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
    FOREIGN KEY(user_id) REFERENCES users(id)
  );

  CREATE TABLE IF NOT EXISTS services (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT,
    base_price INTEGER NOT NULL
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
    console.log('Seeding initial data...');

    const salt = bcrypt.genSaltSync(10);
    const hashedPass = bcrypt.hashSync('password123', salt);

    // Seed Users
    const insertUser = db.prepare('INSERT INTO users (id, name, email, password_hash, role) VALUES (?, ?, ?, ?, ?)');
    insertUser.run('cust-1', 'John Customer', 'customer@example.com', hashedPass, 'customer');
    insertUser.run('mech-1-user', 'Jane Mechanic', 'mechanic@example.com', hashedPass, 'mechanic');

    // Seed Mechanics (Jakarta locations)
    const insertMechanic = db.prepare('INSERT INTO mechanics (id, user_id, name, speciality, rating, price_per_hour, is_online, lat, lng, avatar, years_of_experience, phone) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)');
    insertMechanic.run('mech-1', 'mech-1-user', 'Jane Mechanic', 'Ganti Oli, Ban', 4.8, 75000, 1, -6.2200, 106.8300, '👩‍🔧', 5, '08123456789');
    insertMechanic.run('mech-2', null, 'Budi Santoso', 'Servis Mesin, Aki', 4.9, 85000, 1, -6.1500, 106.9000, '👨‍🔧', 10, '08987654321');

    // Seed Services
    const insertService = db.prepare('INSERT INTO services (id, name, description, base_price) VALUES (?, ?, ?, ?)');
    insertService.run('svc-1', 'Ganti Oli', 'Penggantian oli mesin berkualitas', 50000);
    insertService.run('svc-2', 'Servis Rutin', 'Pengecekan menyeluruh kendaraan', 150000);
    insertService.run('svc-3', 'Ganti Ban', 'Penggantian ban bocor atau aus', 100000);

    // Seed Bookings
    const insertBooking = db.prepare(`
      INSERT INTO bookings (id, user_id, mechanic_id, service_id, status, vehicle_brand, vehicle_model, problem, estimated_cost)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);
    insertBooking.run('seed-book-1', 'cust-1', 'mech-1', 'svc-1', 'completed', 'Toyota', 'Avanza', 'Ganti Oli', 150000);
    insertBooking.run('seed-book-2', 'cust-1', 'mech-2', 'svc-2', 'completed', 'Honda', 'Civic', 'Servis Rutin', 250000);

    // Seed Reviews
    const insertReview = db.prepare('INSERT INTO reviews (id, booking_id, user_id, mechanic_id, rating, comment) VALUES (?, ?, ?, ?, ?, ?)');
    insertReview.run('rev-1', 'seed-book-1', 'cust-1', 'mech-1', 5, 'Sangat cepat dan profesional! Mesin jadi halus lagi.');
    insertReview.run('rev-2', 'seed-book-2', 'cust-1', 'mech-2', 4, 'Bagus, tapi datangnya agak telat 10 menit.');
  }
};

seedData();

export default db;
