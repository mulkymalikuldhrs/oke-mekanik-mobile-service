const AI_MODEL = [
  {
    id: 'svc-7',
    name: 'Cek Aki',
    keywords: { aki: 12, battery: 12, stater: 10, tekor: 11, soak: 12, mati: 2, 'nggak nyala': 8, drop: 10, 'stater berat': 11, 'voltase': 9, 'alternator': 7, 'dinamo starter': 10, 'accu': 12, 'terminal aki': 8, 'amper': 9, 'jumper': 10, 'starter panjang': 11, 'klakson lemah': 9, 'lampu redup': 8, 'pagi susah nyala': 12, 'dinamo ampre': 9 },
    causes: ['Aki sudah berumur (lebih dari 2 tahun)', 'Terminal aki kotor atau longgar', 'Alternator bermasalah (tidak mengisi)', 'Ada kebocoran arus listrik (parasitic draw)'],
    urgency: 'HIGH'
  },
  {
    id: 'svc-1',
    name: 'Ganti Oli',
    keywords: { oli: 12, oil: 12, pelumas: 10, bocor: 6, hitam: 7, kental: 7, 'suara kasar': 8, 'mesin panas': 6, 'filter oli': 10, 'seal': 7, 'drain plug': 8, 'viskositas': 7, 'kuras': 8, 'pelumasan': 9, 'indikator oli': 11, 'oli berkurang': 10 },
    causes: ['Sudah melewati batas kilometer pemakaian', 'Kualitas oli menurun akibat panas mesin', 'Seal mesin mulai getas menyebabkan rembesan', 'Filter oli tersumbat kotoran'],
    urgency: 'MEDIUM'
  },
  {
    id: 'svc-3',
    name: 'Ganti Ban',
    keywords: { ban: 12, bocor: 11, tire: 12, kempes: 11, gundul: 10, pecah: 9, meletus: 11, 'kurang angin': 7, 'velg': 6, 'pentil': 7, 'tubeless': 8, 'tambal': 10, 'baling': 6, 'spooring': 5, 'balancing': 5, 'benjol': 12, 'makan dalam': 10, 'setir narik': 11, 'getar': 8, 'tekanan ban': 7, 'oleng': 9, 'zig zag': 8 },
    causes: ['Terkena benda tajam (paku/kaca)', 'Tekanan angin sering kurang', 'Sudut kemiringan roda tidak tepat (butuh spooring)', 'Faktor usia ban (karet mengeras)'],
    urgency: 'HIGH'
  },
  {
    id: 'svc-6',
    name: 'Ganti Kampas Rem',
    keywords: { rem: 12, brake: 12, cit: 10, mencit: 11, pakem: 10, bunyi: 6, decit: 12, blong: 12, 'rem bunyi': 11, 'piringan': 8, 'minyak rem': 9, 'kaliper': 7, 'disk brake': 10, 'master rem': 9, 'pedal dalam': 11, 'getar': 8, 'rem ngempos': 12, 'rem keras': 11 },
    causes: ['Kampas rem sudah tipis/habis', 'Kualitas kampas rem menurun (terbakar)', 'Piringan cakram tidak rata', 'Udara terjebak di sistem rem (masuk angin)'],
    urgency: 'CRITICAL'
  },
  {
    id: 'svc-8',
    name: 'Isi Freon AC',
    keywords: { ac: 12, freon: 12, panas: 9, dingin: 10, bau: 7, gerah: 6, 'ac mati': 11, 'nggak dingin': 12, 'kompresor': 8, 'evaporator': 8, 'filter ac': 7, 'kondensor': 9, 'magnetic clutch': 9, 'leak': 7, 'bocor halus': 8, 'ekstra fan': 9, 'ngorok': 10, 'ac bau': 8 },
    causes: ['Bocor halus pada sambungan pipa/evaporator', 'Filter AC tersumbat debu tebal', 'Magnetic clutch kompresor lemah', 'Ekstra fan radiator mati'],
    urgency: 'LOW'
  },
  {
    id: 'svc-5',
    name: 'Cek Kelistrikan',
    keywords: { listrik: 12, lampu: 11, kabel: 10, konslet: 12, sekring: 11, mati: 4, sensor: 12, 'putus': 8, 'korslet': 12, 'ecu': 15, 'koil': 9, 'busi': 10, 'spul': 9, 'wiring': 11, 'harness': 10, 'relay': 9, 'alternator': 10, 'dinamo ampere': 10, 'short': 11, 'indikator nyala': 12, 'limp mode': 15, 'check engine': 12, 'ngeden': 14, 'sensor o2': 11, 'maf sensor': 11 },
    causes: ['Ada kabel yang terkelupas/digigit tikus', 'Soket kabel longgar atau berkarat', 'Sekring putus akibat beban berlebih', 'Modul elektronik (ECU) mengalami malfungsi'],
    urgency: 'HIGH'
  },
  {
    id: 'svc-4',
    name: 'Tune Up',
    keywords: { mesin: 10, overheat: 12, asap: 10, brebet: 15, berebet: 15, pincang: 15, mati: 6, ngadat: 12, bensin: 6, boros: 11, 'mogok': 12, 'tarikan berat': 11, 'injeksi': 11, 'karburator': 11, 'piston': 10, 'klep': 10, 'radiator': 11, 'kopling': 10, 'transmisi': 9, 'throttle body': 11, 'carbon clean': 10, 'water pump': 11, 'head gasket': 11, 'fan belt': 9, 'ngelitik': 15, 'detonasi': 11, 'asap putih': 13, 'asap hitam': 13, 'nyendal': 12, 'nyentak': 12, 'suara tek tek': 11, 'boros bensin': 14, 'ngeden': 13, 'pagi-pagi susah nyala': 14, 'tunggakan gas': 11, 'ngebul': 14, 'ngobos': 15, 'turun mesin': 20, 'overhaul': 20, 'bore up': 15, 'injector': 12 },
    causes: ['Throttle body kotor berkerak', 'Busi sudah lemah atau kotor', 'Saringan bahan bakar tersumbat', 'Kompresi mesin rendah (ngobos)', 'Sistem pendingin (radiator) tidak optimal'],
    urgency: 'HIGH'
  },
  {
    id: 'svc-2',
    name: 'Servis Rutin',
    keywords: { rutin: 12, servis: 12, service: 12, berkala: 11, checkup: 10, 'ganti sparepart': 9, 'maintenance': 11, 'tahunan': 7, 'bulanan': 6, 'perawatan': 9, 'km': 8, 'kilometer': 8, 'inspeksi': 10, 'gluduk': 14, 'kaki-kaki': 13, 'shockbreaker': 12, 'tierod': 11, 'balljoint': 11, 'bunyi mendengung': 12, 'setir goyang': 10, 'bunyi kaki-kaki': 15, 'setir narik': 12 },
    causes: ['Sudah waktunya perawatan berkala', 'Mencegah kerusakan komponen lebih lanjut', 'Menjaga performa kendaraan tetap optimal', 'Memastikan keselamatan berkendara'],
    urgency: 'MEDIUM'
  }
];

export const diagnose = (req, res) => {
  const { problem } = req.body;
  if (!problem || problem.length < 5) {
    return res.status(400).json({ message: 'Deskripsi masalah terlalu pendek' });
  }

  const p = problem.toLowerCase();
  let scores = AI_MODEL.map(service => {
    let score = 0;
    let matches = 0;
    for (const [keyword, weight] of Object.entries(service.keywords)) {
      if (p.includes(keyword)) {
        score += weight;
        matches++;
      }
    }
    if (matches > 1) {
      score += Math.pow(matches, 2);
    }

    const technicalBoosts = {
      'svc-1': ['oli meler', 'oli rembes', 'oil seal', 'karter'],
      'svc-4': ['brebet', 'berebet', 'ngelitik', 'pincang', 'ngeden', 'asap hitam', 'asap putih', 'nyendal', 'ngebul', 'ngobos', 'injector', 'bore up', 'overhaul', 'skir klep', 'turun mesin'],
      'svc-5': ['limp mode', 'check engine', 'konslet', 'korslet', 'ecu', 'wiring', 'sekring putus', 'short circuit', 'grounding', 'sensor tps', 'sensor iat', 'carbon brush habis'],
      'svc-7': ['pagi susah nyala', 'stater berat', 'aki tekor', 'dinamo ampre', 'alternator bench'],
      'svc-2': ['gluduk', 'kaki-kaki', 'bunyi kaki-kaki', 'setir narik', 'v-belt', 'cv joint', 'bushing arm', 'link stabilizer', 'rack steer']
    };

    for (const [svcId, terms] of Object.entries(technicalBoosts)) {
      if (terms.some(term => p.includes(term)) && service.id === svcId) {
        score += 30;
      }
    }

    return { ...service, score };
  });

  scores.sort((a, b) => b.score - a.score);
  const bestMatch = scores[0].score > 0 ? scores[0] : AI_MODEL.find(s => s.id === 'svc-2');

  res.json({
    suggestion: bestMatch.name,
    serviceId: bestMatch.id,
    confidence: bestMatch.score > 0 ? Math.min(Math.round((bestMatch.score / 100) * 100), 99) : 40,
    possible_causes: bestMatch.causes,
    urgency_level: bestMatch.urgency,
    version: 'v5.8.1-ultimate'
  });
};
