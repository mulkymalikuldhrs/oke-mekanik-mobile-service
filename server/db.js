import Database from 'better-sqlite3';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import bcrypt from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';

const __dirname = dirname(fileURLToPath(import.meta.url));
const db = new Database(join(__dirname, 'okemekanik.db'));

// Enable WAL mode for better concurrent read performance
db.pragma('journal_mode = WAL');

// Initialize tables
db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    role TEXT NOT NULL CHECK(role IN ('customer', 'mechanic', 'workshop', 'admin')),
    phone TEXT,
    avatar TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS workshops (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL,
    name TEXT NOT NULL,
    address TEXT,
    lat REAL,
    lng REAL,
    phone TEXT,
    speciality TEXT,
    rating REAL DEFAULT 4.5,
    is_online INTEGER DEFAULT 1,
    operating_hours TEXT DEFAULT '07:00-21:00',
    description TEXT,
    identity_number TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(user_id) REFERENCES users(id)
  );

  CREATE TABLE IF NOT EXISTS mechanics (
    id TEXT PRIMARY KEY,
    user_id TEXT,
    workshop_id TEXT,
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
    vehicle_type TEXT DEFAULT 'motorcycle',
    vehicle_plate TEXT,
    is_workshop INTEGER DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(user_id) REFERENCES users(id),
    FOREIGN KEY(workshop_id) REFERENCES workshops(id)
  );

  CREATE TABLE IF NOT EXISTS services (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT,
    base_price INTEGER NOT NULL,
    category TEXT DEFAULT 'general',
    icon TEXT DEFAULT 'wrench',
    estimated_duration INTEGER DEFAULT 60,
    is_emergency_available INTEGER DEFAULT 1
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
    status TEXT NOT NULL DEFAULT 'pending' CHECK(status IN ('pending', 'accepted', 'otw', 'arrived', 'working', 'completed', 'cancelled')),
    location_lat REAL,
    location_lng REAL,
    location_address TEXT,
    estimated_cost INTEGER,
    final_cost INTEGER,
    is_emergency INTEGER DEFAULT 0,
    eta_minutes INTEGER DEFAULT 15,
    cancelled_by TEXT,
    cancel_reason TEXT,
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
    status TEXT NOT NULL DEFAULT 'pending',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(booking_id) REFERENCES bookings(id)
  );

  CREATE TABLE IF NOT EXISTS reviews (
    id TEXT PRIMARY KEY,
    booking_id TEXT NOT NULL,
    user_id TEXT NOT NULL,
    mechanic_id TEXT NOT NULL,
    rating INTEGER NOT NULL CHECK(rating BETWEEN 1 AND 5),
    comment TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(booking_id) REFERENCES bookings(id),
    FOREIGN KEY(user_id) REFERENCES users(id),
    FOREIGN KEY(mechanic_id) REFERENCES mechanics(id)
  );

  -- Performance Indexes
  CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
  CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);
  CREATE INDEX IF NOT EXISTS idx_mechanics_online ON mechanics(is_online);
  CREATE INDEX IF NOT EXISTS idx_mechanics_workshop ON mechanics(workshop_id);
  CREATE INDEX IF NOT EXISTS idx_bookings_user_id ON bookings(user_id);
  CREATE INDEX IF NOT EXISTS idx_bookings_mechanic_id ON bookings(mechanic_id);
  CREATE INDEX IF NOT EXISTS idx_bookings_status ON bookings(status);
  CREATE INDEX IF NOT EXISTS idx_bookings_emergency ON bookings(is_emergency);
  CREATE INDEX IF NOT EXISTS idx_messages_booking_id ON messages(booking_id);
  CREATE INDEX IF NOT EXISTS idx_reviews_mechanic_id ON reviews(mechanic_id);
  CREATE INDEX IF NOT EXISTS idx_workshops_online ON workshops(is_online);
`);

// Seed initial data if empty
const seedData = async () => {
  const userCount = db.prepare('SELECT count(*) as count FROM users').get().count;
  if (userCount === 0) {
    console.log('[OkeMekanik] Seeding initial data...');

    const salt = await bcrypt.genSalt(10);
    const hashedPass = await bcrypt.hash('password123', salt);

    // Seed Users
    const insertUser = db.prepare('INSERT INTO users (id, name, email, password_hash, role, phone) VALUES (?, ?, ?, ?, ?, ?)');
    insertUser.run('cust-1', 'Ahmad Pelanggan', 'customer@example.com', hashedPass, 'customer', '081111111111');
    insertUser.run('cust-2', 'Siti Pengguna', 'siti.cust@example.com', hashedPass, 'customer', '081222222222');
    
    // Mechanics
    insertUser.run('mech-1-user', 'Jane Mechanic', 'mechanic@example.com', hashedPass, 'mechanic', '081234567890');
    insertUser.run('mech-2-user', 'Budi Santoso', 'budi@example.com', hashedPass, 'mechanic', '089876543210');
    insertUser.run('mech-3-user', 'Siti Aminah', 'siti@example.com', hashedPass, 'mechanic', '081222333444');
    insertUser.run('mech-4-user', 'Agus Pratama', 'agus@example.com', hashedPass, 'mechanic', '081555666777');
    insertUser.run('mech-5-user', 'Rina Wijaya', 'rina@example.com', hashedPass, 'mechanic', '081999888777');
    insertUser.run('mech-6-user', 'Dedi Kurniawan', 'dedi@example.com', hashedPass, 'mechanic', '081333444555');
    insertUser.run('mech-7-user', 'Sari Putri', 'sari@example.com', hashedPass, 'mechanic', '081777888999');
    insertUser.run('mech-8-user', 'Hendra Gunawan', 'hendra@example.com', hashedPass, 'mechanic', '081444555666');
    insertUser.run('mech-9-user', 'Wati Susilowati', 'wati@example.com', hashedPass, 'mechanic', '081666777888');
    insertUser.run('mech-10-user', 'Rudi Hartono', 'rudi@example.com', hashedPass, 'mechanic', '081888999000');

    // Workshop
    insertUser.run('workshop-1-user', 'Bengkel Sejahtera', 'bengkel1@example.com', hashedPass, 'workshop', '081000111222');
    insertUser.run('workshop-2-user', 'Auto Service Pro', 'bengkel2@example.com', hashedPass, 'workshop', '081000333444');

    // Admin
    insertUser.run('admin-1', 'Admin OkeMekanik', 'admin@okemekanik.com', hashedPass, 'admin', '081000000000');

    // Seed Workshops
    const insertWorkshop = db.prepare('INSERT INTO workshops (id, user_id, name, address, lat, lng, phone, speciality, rating, is_online, description) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)');
    insertWorkshop.run('ws-1', 'workshop-1-user', 'Bengkel Sejahtera Motor', 'Jl. Raya Bogor No. 45, Jakarta Timur', -6.2350, 106.8550, '081000111222', 'Servis Umum, Tune Up, Ganti Oli', 4.8, 1, 'Bengkel terpercaya sejak 2005 dengan mekanik berpengalaman');
    insertWorkshop.run('ws-2', 'workshop-2-user', 'Auto Service Pro', 'Jl. Gatot Subroto No. 88, Jakarta Selatan', -6.2450, 106.8250, '081000333444', 'Kelistrikan, AC, Injeksi', 4.9, 1, 'Spesialis kendaraan injeksi dan kelistrikan modern');

    // Seed Mechanics (Jakarta locations - spread around the city)
    const insertMechanic = db.prepare('INSERT INTO mechanics (id, user_id, workshop_id, name, speciality, rating, price_per_hour, is_online, lat, lng, avatar, years_of_experience, phone, bio, vehicle_type, vehicle_plate, is_workshop) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)');
    insertMechanic.run('mech-1', 'mech-1-user', null, 'Jane Mechanic', 'Ganti Oli, Servis Rutin', 4.8, 75000, 1, -6.2200, 106.8300, '👩‍🔧', 5, '081234567890', 'Berpengalaman menangani berbagai jenis kendaraan roda dua dan roda empat.', 'motorcycle', 'B 5678 JK', 0);
    insertMechanic.run('mech-2', 'mech-2-user', null, 'Budi Santoso', 'Servis Mesin, Tune Up, Overhaul', 4.9, 85000, 1, -6.1500, 106.9000, '👨‍🔧', 10, '089876543210', 'Spesialis mesin mobil Eropa dan Jepang. 10 tahun pengalaman.', 'car', 'B 1234 XY', 0);
    insertMechanic.run('mech-3', 'mech-3-user', null, 'Siti Aminah', 'Rem, Suspensi, Kaki-kaki', 4.7, 90000, 1, -6.2000, 106.8100, '👩‍🔧', 7, '081222333444', 'Ahli dalam sistem pengereman dan kaki-kaki kendaraan.', 'motorcycle', 'B 9012 AB', 0);
    insertMechanic.run('mech-4', 'mech-4-user', null, 'Agus Pratama', 'Kelistrikan, AC, Injeksi', 4.6, 80000, 1, -6.2500, 106.8500, '👨‍🔧', 8, '081555666777', 'Solusi tepat untuk masalah kelistrikan dan AC mobil Anda.', 'motorcycle', 'B 3456 CD', 0);
    insertMechanic.run('mech-5', 'mech-5-user', null, 'Rina Wijaya', 'Tune Up, Scanner, Diagnosa', 4.9, 95000, 1, -6.1800, 106.8800, '👩‍🔧', 12, '081999888777', 'Tune up profesional untuk performa mesin maksimal.', 'car', 'B 7890 EF', 0);
    insertMechanic.run('mech-6', 'mech-6-user', null, 'Dedi Kurniawan', 'Ban, Rantai, Gir, Motor', 4.7, 60000, 1, -6.2300, 106.8000, '👨‍🔧', 6, '081333444555', 'Spesialis motor bebek dan sport. Cepat dan tepat.', 'motorcycle', 'B 2345 GH', 0);
    insertMechanic.run('mech-7', 'mech-7-user', null, 'Sari Putri', 'Interior, Cuci AC, Detailing', 4.8, 85000, 1, -6.1700, 106.8400, '👩‍🔧', 4, '081777888999', 'Menjadikan interior mobil Anda bersih dan nyaman.', 'motorcycle', 'B 6789 IJ', 0);
    insertMechanic.run('mech-8', 'mech-8-user', null, 'Hendra Gunawan', 'Darak, Mogok, Darurat', 4.9, 100000, 1, -6.2100, 106.8600, '👨‍🔧', 15, '081444555666', 'Spesialis penanganan darurat kendaraan mogok. Respon cepat 24/7.', 'motorcycle', 'B 0123 KL', 0);
    insertMechanic.run('mech-9', 'mech-9-user', null, 'Wati Susilowati', 'Aki, Kelistrikan, Starter', 4.6, 70000, 1, -6.1900, 106.8200, '👩‍🔧', 5, '081666777888', 'Ahli masalah aki dan sistem kelistrikan kendaraan.', 'motorcycle', 'B 4567 MN', 0);
    insertMechanic.run('mech-10', 'mech-10-user', null, 'Rudi Hartono', 'Transmisi, Kopling, Mesin', 4.8, 95000, 0, -6.2600, 106.8700, '👨‍🔧', 9, '081888999000', 'Spesialis transmisi manual dan matic. Pengerjaan teliti.', 'car', 'B 8901 OP', 0);
    
    // Workshop-affiliated mechanics
    insertMechanic.run('mech-ws1-1', null, 'ws-1', 'Tono Bengkel Sejahtera', 'Servis Umum, Tune Up', 4.7, 70000, 1, -6.2350, 106.8550, '👨‍🔧', 8, '081000111223', 'Mekanik resmi Bengkel Sejahtera Motor', null, null, 1);
    insertMechanic.run('mech-ws2-1', null, 'ws-2', 'Doni Auto Service', 'Injeksi, Kelistrikan, AC', 4.8, 85000, 1, -6.2450, 106.8250, '👨‍🔧', 11, '081000333445', 'Mekanik resmi Auto Service Pro', null, null, 1);

    // Seed Services with categories & icons
    const insertService = db.prepare('INSERT INTO services (id, name, description, base_price, category, icon, estimated_duration, is_emergency_available) VALUES (?, ?, ?, ?, ?, ?, ?, ?)');
    // Emergency / Roadside
    insertService.run('svc-darurat', 'Darak / Mogok', 'Penanganan darurat kendaraan mogok di jalan', 150000, 'emergency', 'sos', 30, 1);
    insertService.run('svc-bantuan', 'Bantuan Jalan', 'Bantuan darurat di lokasi (dongkrak, pengisian aki, dll)', 100000, 'emergency', 'life-buoy', 20, 1);
    
    // Engine & Tune Up
    insertService.run('svc-1', 'Ganti Oli', 'Penggantian oli mesin + filter oli berkualitas', 75000, 'engine', 'droplets', 30, 0);
    insertService.run('svc-4', 'Tune Up', 'Pembersihan ruang bakar dan optimasi mesin', 200000, 'engine', 'gauge', 120, 0);
    insertService.run('svc-2', 'Servis Rutin', 'Pengecekan menyeluruh kendaraan secara berkala', 150000, 'engine', 'clipboard-check', 90, 0);
    insertService.run('svc-9', 'Overhaul / Turun Mesin', 'Perbaikan mesin besar (overhaul)', 500000, 'engine', 'cog', 480, 0);
    
    // Brakes & Suspension
    insertService.run('svc-6', 'Ganti Kampas Rem', 'Penggantian kampas rem depan atau belakang', 120000, 'brakes', 'disc', 60, 0);
    insertService.run('svc-10', 'Servis Suspensi', 'Perbaikan shockbreaker, per daun, bushing', 200000, 'brakes', 'arrow-down-up', 120, 0);
    
    // Tires
    insertService.run('svc-3', 'Ganti Ban', 'Penggantian ban bocor atau aus + balancing', 100000, 'tires', 'circle', 30, 1);
    insertService.run('svc-11', 'Tambal Ban', 'Penambalan ban bocor (tubeless/conventional)', 25000, 'tires', 'circle-dot', 15, 1);
    
    // Electrical & AC
    insertService.run('svc-5', 'Cek Kelistrikan', 'Diagnosa dan perbaikan masalah kelistrikan', 75000, 'electrical', 'zap', 45, 0);
    insertService.run('svc-7', 'Cek Aki', 'Pengecekan tegangan dan kondisi aki + isi', 50000, 'electrical', 'battery', 20, 1);
    insertService.run('svc-8', 'Isi Freon AC', 'Pengisian ulang freon AC mobil', 150000, 'electrical', 'snowflake', 60, 0);
    insertService.run('svc-12', 'Ganti Busi', 'Penggantian busi + pengecekan coil', 60000, 'electrical', 'flame', 20, 0);

    // Seed Bookings (Historic)
    const insertBooking = db.prepare(`
      INSERT INTO bookings (id, user_id, mechanic_id, service_id, status, vehicle_brand, vehicle_model, problem, estimated_cost, location_lat, location_lng, location_address, is_emergency, created_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    const now = new Date();
    const getPastDate = (daysAgo) => {
      const d = new Date(now);
      d.setDate(d.getDate() - daysAgo);
      return d.toISOString();
    };

    insertBooking.run('seed-book-1', 'cust-1', 'mech-1', 'svc-1', 'completed', 'Toyota', 'Avanza', 'Ganti Oli', 150000, -6.2088, 106.8456, 'Jl. Sudirman, Jakarta', 0, getPastDate(7));
    insertBooking.run('seed-book-2', 'cust-1', 'mech-2', 'svc-4', 'completed', 'Honda', 'Civic', 'Tune Up', 300000, -6.2088, 106.8456, 'Jl. Gatot Subroto, Jakarta', 0, getPastDate(6));
    insertBooking.run('seed-book-3', 'cust-1', 'mech-3', 'svc-6', 'completed', 'Suzuki', 'Ertiga', 'Rem Berdecit', 180000, -6.2088, 106.8456, 'Jl. Rasuna Said, Jakarta', 0, getPastDate(5));
    insertBooking.run('seed-book-4', 'cust-1', 'mech-8', 'svc-darurat', 'completed', 'Mitsubishi', 'Xpander', 'Mogok di jalan', 200000, -6.2200, 106.8300, 'Jl. MT Haryono, Jakarta', 1, getPastDate(4));
    insertBooking.run('seed-book-5', 'cust-1', 'mech-5', 'svc-4', 'completed', 'Daihatsu', 'Sigra', 'Mesin Pincang', 300000, -6.2088, 106.8456, 'Jl. Kuningan, Jakarta', 0, getPastDate(3));
    insertBooking.run('seed-book-6', 'cust-1', 'mech-6', 'svc-3', 'completed', 'Yamaha', 'NMAX', 'Ban Bocor', 100000, -6.2088, 106.8456, 'Jl. HR Rasuna Said, Jakarta', 1, getPastDate(2));
    insertBooking.run('seed-book-7', 'cust-1', 'mech-1', 'svc-2', 'completed', 'Toyota', 'Avanza', 'Servis Rutin', 200000, -6.2088, 106.8456, 'Jl. Sudirman, Jakarta', 0, getPastDate(1));
    insertBooking.run('seed-book-8', 'cust-1', 'mech-7', 'svc-8', 'completed', 'Honda', 'Brio', 'AC Tidak Dingin', 175000, -6.2088, 106.8456, 'Jl. TB Simatupang, Jakarta', 0, getPastDate(0));

    // Seed Reviews
    const insertReview = db.prepare('INSERT INTO reviews (id, booking_id, user_id, mechanic_id, rating, comment, created_at) VALUES (?, ?, ?, ?, ?, ?, ?)');
    insertReview.run('rev-1', 'seed-book-1', 'cust-1', 'mech-1', 5, 'Sangat cepat dan profesional! Mesin jadi halus lagi.', getPastDate(7));
    insertReview.run('rev-2', 'seed-book-2', 'cust-1', 'mech-2', 5, 'Budi top! Mesin sekarang tarikannya enteng banget.', getPastDate(6));
    insertReview.run('rev-3', 'seed-book-3', 'cust-1', 'mech-3', 5, 'Pengerjaan rem sangat rapi, sekarang sudah tidak berdecit lagi.', getPastDate(5));
    insertReview.run('rev-4', 'seed-book-4', 'cust-1', 'mech-8', 5, 'Mogok di tengah jalan, Hendra datang cuma 10 menit! Selamet!', getPastDate(4));
    insertReview.run('rev-5', 'seed-book-5', 'cust-1', 'mech-5', 5, 'Rina sangat ahli, mesin mobil saya tarikannya jadi enteng banget.', getPastDate(3));
    insertReview.run('rev-6', 'seed-book-6', 'cust-1', 'mech-6', 5, 'Cepat sekali ganti bannya, sangat membantu di saat darurat.', getPastDate(2));
    insertReview.run('rev-7', 'seed-book-7', 'cust-1', 'mech-1', 4, 'Servis bagus, tapi datangnya agak telat.', getPastDate(1));
    insertReview.run('rev-8', 'seed-book-8', 'cust-1', 'mech-7', 5, 'AC dingin lagi! Terima kasih Sari.', getPastDate(0));

    console.log('[OkeMekanik] Seed data complete ✓');
  }
};

seedData();

export default db;
