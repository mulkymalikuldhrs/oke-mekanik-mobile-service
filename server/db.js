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

  -- Performance Indexes
  CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
  CREATE INDEX IF NOT EXISTS idx_bookings_user_id ON bookings(user_id);
  CREATE INDEX IF NOT EXISTS idx_bookings_mechanic_id ON bookings(mechanic_id);
  CREATE INDEX IF NOT EXISTS idx_messages_booking_id ON messages(booking_id);
  CREATE INDEX IF NOT EXISTS idx_reviews_mechanic_id ON reviews(mechanic_id);
`);

// Seed initial data if empty
const seedData = async () => {
  const userCount = db.prepare('SELECT count(*) as count FROM users').get().count;
  if (userCount === 0) {
    console.log('Seeding initial data...');

    const salt = await bcrypt.genSalt(10);
    const hashedPass = await bcrypt.hash('password123', salt);

    // Seed Users
    const insertUser = db.prepare('INSERT INTO users (id, name, email, password_hash, role, phone) VALUES (?, ?, ?, ?, ?, ?)');
    insertUser.run('cust-1', 'John Customer', 'customer@example.com', hashedPass, 'customer', '08111111111');
    insertUser.run('mech-1-user', 'Jane Mechanic', 'mechanic@example.com', hashedPass, 'mechanic', '08123456789');
    insertUser.run('mech-2-user', 'Budi Santoso', 'budi@example.com', hashedPass, 'mechanic', '08987654321');
    insertUser.run('mech-3-user', 'Siti Aminah', 'siti@example.com', hashedPass, 'mechanic', '081222333444');
    insertUser.run('mech-4-user', 'Agus Pratama', 'agus@example.com', hashedPass, 'mechanic', '081555666777');
    insertUser.run('mech-5-user', 'Rina Wijaya', 'rina@example.com', hashedPass, 'mechanic', '081999888777');
    insertUser.run('mech-6-user', 'Dedi Kurniawan', 'dedi@example.com', hashedPass, 'mechanic', '081333444555');
    insertUser.run('mech-7-user', 'Sari Putri', 'sari@example.com', hashedPass, 'mechanic', '081777888999');

    // Seed Admin User
    insertUser.run('admin-1', 'Admin OkeMekanik', 'admin@okemekanik.com', hashedPass, 'admin', '081000000000');

    // Seed Mechanics (Jakarta locations)
    const insertMechanic = db.prepare('INSERT INTO mechanics (id, user_id, name, speciality, rating, price_per_hour, is_online, lat, lng, avatar, years_of_experience, phone, bio) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)');
    insertMechanic.run('mech-1', 'mech-1-user', 'Jane Mechanic', 'Ganti Oli, Ban', 4.8, 75000, 1, -6.2200, 106.8300, '👩‍🔧', 5, '08123456789', 'Berpengalaman menangani berbagai jenis kendaraan roda dua dan roda empat.');
    insertMechanic.run('mech-2', 'mech-2-user', 'Budi Santoso', 'Servis Mesin, Aki', 4.9, 85000, 1, -6.1500, 106.9000, '👨‍🔧', 10, '08987654321', 'Spesialis mesin mobil Eropa dan Jepang.');
    insertMechanic.run('mech-3', 'mech-3-user', 'Siti Aminah', 'Spesialis Rem, Suspensi', 4.7, 90000, 1, -6.2000, 106.8100, '👩‍🔧', 7, '081222333444', 'Ahli dalam sistem pengereman dan kaki-kaki kendaraan.');
    insertMechanic.run('mech-4', 'mech-4-user', 'Agus Pratama', 'Kelistrikan, AC', 4.6, 80000, 1, -6.2500, 106.8500, '👨‍🔧', 8, '081555666777', 'Solusi tepat untuk masalah kelistrikan dan AC mobil Anda.');
    insertMechanic.run('mech-5', 'mech-5-user', 'Rina Wijaya', 'Tune Up, Scanner', 4.9, 95000, 1, -6.1800, 106.8800, '👩‍🔧', 12, '081999888777', 'Tune up profesional untuk performa mesin maksimal.');
    insertMechanic.run('mech-6', 'mech-6-user', 'Dedi Kurniawan', 'Ban, Rantai, Gir', 4.7, 60000, 1, -6.2300, 106.8000, '👨‍🔧', 6, '081333444555', 'Spesialis motor bebek dan sport.');
    insertMechanic.run('mech-7', 'mech-7-user', 'Sari Putri', 'Interior, Cuci AC', 4.8, 85000, 1, -6.1700, 106.8400, '👩‍🔧', 4, '081777888999', 'Menjadikan interior mobil Anda bersih dan nyaman.');

    // Seed Services
    const insertService = db.prepare('INSERT INTO services (id, name, description, base_price) VALUES (?, ?, ?, ?)');
    insertService.run('svc-1', 'Ganti Oli', 'Penggantian oli mesin berkualitas', 50000);
    insertService.run('svc-2', 'Servis Rutin', 'Pengecekan menyeluruh kendaraan', 150000);
    insertService.run('svc-3', 'Ganti Ban', 'Penggantian ban bocor atau aus', 100000);
    insertService.run('svc-4', 'Tune Up', 'Pembersihan ruang bakar dan optimasi mesin', 200000);
    insertService.run('svc-5', 'Cek Kelistrikan', 'Diagnosa masalah kelistrikan kendaraan', 75000);
    insertService.run('svc-6', 'Ganti Kampas Rem', 'Penggantian kampas kampas rem depan atau belakang', 120000);
    insertService.run('svc-7', 'Cek Aki', 'Pengecekan tegangan dan kondisi aki', 30000);
    insertService.run('svc-8', 'Isi Freon AC', 'Pengisian ulang freon AC mobil', 150000);

    // Seed Bookings (Historic and Current)
    const insertBooking = db.prepare(`
      INSERT INTO bookings (id, user_id, mechanic_id, service_id, status, vehicle_brand, vehicle_model, problem, estimated_cost, created_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    // Get dates for last week
    const now = new Date();
    const getPastDate = (daysAgo) => {
      const d = new Date(now);
      d.setDate(d.getDate() - daysAgo);
      return d.toISOString();
    };

    insertBooking.run('seed-book-1', 'cust-1', 'mech-1', 'svc-1', 'completed', 'Toyota', 'Avanza', 'Ganti Oli', 150000, getPastDate(7));
    insertBooking.run('seed-book-2', 'cust-1', 'mech-2', 'svc-2', 'completed', 'Honda', 'Civic', 'Servis Rutin', 250000, getPastDate(6));
    insertBooking.run('seed-book-3', 'cust-1', 'mech-3', 'svc-6', 'completed', 'Suzuki', 'Ertiga', 'Rem Berdecit', 180000, getPastDate(5));
    insertBooking.run('seed-book-4', 'cust-1', 'mech-4', 'svc-5', 'completed', 'Mitsubishi', 'Xpander', 'Lampu Mati', 120000, getPastDate(4));
    insertBooking.run('seed-book-5', 'cust-1', 'mech-5', 'svc-4', 'completed', 'Daihatsu', 'Sigra', 'Mesin Pincang', 300000, getPastDate(3));
    insertBooking.run('seed-book-6', 'cust-1', 'mech-1', 'svc-3', 'completed', 'Honda', 'Vario', 'Ban Bocor', 100000, getPastDate(2));
    insertBooking.run('seed-book-7', 'cust-1', 'mech-2', 'svc-2', 'completed', 'Yamaha', 'NMAX', 'Servis Rutin', 200000, getPastDate(1));

    // Seed Reviews
    const insertReview = db.prepare('INSERT INTO reviews (id, booking_id, user_id, mechanic_id, rating, comment, created_at) VALUES (?, ?, ?, ?, ?, ?, ?)');
    insertReview.run('rev-1', 'seed-book-1', 'cust-1', 'mech-1', 5, 'Sangat cepat dan profesional! Mesin jadi halus lagi.', getPastDate(7));
    insertReview.run('rev-2', 'seed-book-2', 'cust-1', 'mech-2', 4, 'Bagus, tapi datangnya agak telat 10 menit.', getPastDate(6));
    insertReview.run('rev-3', 'seed-book-3', 'cust-1', 'mech-3', 5, 'Pengerjaan rem sangat rapi, sekarang sudah tidak berdecit lagi.', getPastDate(5));
    insertReview.run('rev-4', 'seed-book-4', 'cust-1', 'mech-4', 4, 'Kelistrikan sudah normal kembali. Terima kasih Agus.', getPastDate(4));
    insertReview.run('rev-5', 'seed-book-5', 'cust-1', 'mech-5', 5, 'Rina sangat ahli, mesin mobil saya tarikannya jadi enteng banget.', getPastDate(3));
    insertReview.run('rev-6', 'seed-book-6', 'cust-1', 'mech-1', 5, 'Cepat sekali ganti bannya, sangat membantu di saat darurat.', getPastDate(2));
  }
};

seedData();

export default db;
