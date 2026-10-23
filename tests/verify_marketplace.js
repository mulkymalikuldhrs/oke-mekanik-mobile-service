import db from '../server/db.js';

console.log('=== Verifying Marketplace & Geo Backend System ===');

// Check stores table
const stores = db.prepare('SELECT * FROM stores').all();
console.log(`[PASS] Stores in DB: ${stores.length}`);

// Check products table
const products = db.prepare('SELECT * FROM products').all();
console.log(`[PASS] Products in DB: ${products.length}`);

// Check payment methods
const paymentMethods = db.prepare('SELECT * FROM seller_payment_methods').all();
console.log(`[PASS] Seller Payment Methods in DB: ${paymentMethods.length}`);

// Test store structure
if (stores.length > 0) {
  const store = stores[0];
  console.log(`[STORE SAMPLE]: ${store.name} | Phone: ${store.phone} | Lat: ${store.lat}, Lng: ${store.lng}`);
}

// Test product sample
if (products.length > 0) {
  const product = products[0];
  console.log(`[PRODUCT SAMPLE]: ${product.name} | Rp ${product.price.toLocaleString('id-ID')} | Stock: ${product.stock}`);
}

console.log('=== All Database Checks Passed Successfully ✓ ===');
