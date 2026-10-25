import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { ShoppingBag, Search, CreditCard, Store, MapPin, CheckCircle, ExternalLink, QrCode } from 'lucide-react';
import { productApi, storeApi } from '@/lib/api';
import { toast } from 'sonner';
import { motion } from 'framer-motion';

export default function StoreCatalogPage() {
  const [products, setProducts] = useState<any[]>([]);
  const [stores, setStores] = useState<any[]>([]);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedProduct, setSelectedProduct] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadCatalog();
  }, [search, selectedCategory]);

  const loadCatalog = async () => {
    try {
      setIsLoading(true);
      const prodData = await productApi.getProducts({ category: selectedCategory, search });
      const storeData = await storeApi.getNearbyStores();
      setProducts(prodData);
      setStores(storeData);
    } catch (error) {
      toast.error('Gagal memuat katalog sparepart');
    } finally {
      setIsLoading(false);
    }
  };

  const categories = [
    { id: 'all', label: 'Semua Produk' },
    { id: 'Oli & Pelumas', label: '🛢️ Oli & Pelumas' },
    { id: 'Rem & Suspensi', label: '🧱 Rem & Kaki-kaki' },
    { id: 'Kelistrikan', label: '⚡ Kelistrikan' },
    { id: 'Aki & Baterai', label: '🔋 Aki & Baterai' },
    { id: 'EV / Hybrid Parts', label: '🔌 EV / Hybrid' },
  ];

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white p-4 md:p-8 relative">
      <div className="max-w-7xl mx-auto space-y-8">

        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/10 pb-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Badge className="bg-emerald-500/20 text-emerald-400 border-0 font-bold">
                Oke Marketplace v7.0.1
              </Badge>
              <Badge className="bg-blue-500/20 text-blue-400 border-0">
                Direct Seller Payment
              </Badge>
            </div>
            <h1 className="text-3xl font-black tracking-tight text-white flex items-center gap-3">
              <ShoppingBag className="h-8 w-8 text-emerald-400" />
              Suku Cadang & Toko Sparepart Terdekat
            </h1>
            <p className="text-gray-400 text-sm mt-1">
              Beli suku cadang original langsung dari toko terdekat dengan pembayaran ke rekening toko secara langsung.
            </p>
          </div>
        </div>

        {/* Search & Categories */}
        <div className="space-y-4">
          <div className="relative max-w-xl">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5" />
            <Input
              placeholder="Cari sparepart, oli, kampas rem, charger EV..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-12 bg-white/5 border-white/10 text-white rounded-2xl h-12 text-base"
            />
          </div>

          <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none">
            {categories.map((cat) => (
              <Button
                key={cat.id}
                variant={selectedCategory === cat.id ? 'default' : 'outline'}
                className={selectedCategory === cat.id
                  ? 'bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-bold'
                  : 'bg-white/5 hover:bg-white/10 text-gray-300 border-white/10 rounded-xl'}
                onClick={() => setSelectedCategory(cat.id)}
              >
                {cat.label}
              </Button>
            ))}
          </div>
        </div>

        {/* Product Grid */}
        {isLoading ? (
          <div className="text-center py-12 text-gray-400">Memuat katalog sparepart...</div>
        ) : products.length === 0 ? (
          <Card className="bg-black/40 border-white/10 text-center py-12">
            <CardContent>
              <p className="text-gray-400">Suku cadang yang Anda cari belum ditemukan.</p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {products.map((p) => (
              <motion.div whileHover={{ y: -4 }} key={p.id}>
                <Card className="bg-white/5 border-white/10 hover:border-emerald-500/50 transition-all rounded-2xl overflow-hidden flex flex-col justify-between h-full">
                  <CardHeader className="p-4 pb-2">
                    <div className="text-4xl mb-2 flex justify-between items-start">
                      <span>{p.image || '📦'}</span>
                      <Badge className="bg-emerald-500/20 text-emerald-400 border-0 text-xs">
                        Stok: {p.stock}
                      </Badge>
                    </div>
                    <CardTitle className="text-lg font-bold text-white line-clamp-1">{p.name}</CardTitle>
                    <CardDescription className="text-xs text-gray-400 flex items-center gap-1">
                      <Store className="h-3 w-3 text-emerald-400" />
                      {p.store_name}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="p-4 pt-0 space-y-3">
                    <p className="text-xs text-gray-400 line-clamp-2">{p.description}</p>
                    <div className="text-xs text-gray-500">
                      Kompatibilitas: <span className="text-gray-300">{p.vehicle_compatibility || 'Universal'}</span>
                    </div>
                    <div className="flex items-center justify-between pt-2 border-t border-white/5">
                      <div>
                        <p className="text-xs text-gray-400">Harga Direct</p>
                        <p className="text-lg font-black text-emerald-400">
                          Rp {p.price.toLocaleString('id-ID')}
                        </p>
                      </div>
                      <Button
                        size="sm"
                        className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl"
                        onClick={() => setSelectedProduct(p)}
                      >
                        Beli & Bayar
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        )}

        {/* Product Modal & Direct Seller Payment Details */}
        {selectedProduct && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
            <motion.div initial={{ scale: 0.95 }} animate={{ scale: 1 }} className="max-w-lg w-full">
              <Card className="bg-[#121212] border-emerald-500/30 text-white rounded-3xl overflow-hidden">
                <CardHeader className="border-b border-white/10 pb-4">
                  <div className="flex justify-between items-center">
                    <Badge className="bg-emerald-500/20 text-emerald-400 border-0">Direct Seller Payment</Badge>
                    <Button variant="ghost" size="sm" onClick={() => setSelectedProduct(null)} className="text-gray-400 hover:text-white">✕</Button>
                  </div>
                  <CardTitle className="text-xl font-black text-white mt-2">{selectedProduct.name}</CardTitle>
                  <CardDescription className="text-gray-400 text-xs">
                    Dijual oleh: <span className="text-emerald-400 font-bold">{selectedProduct.store_name}</span> ({selectedProduct.store_phone})
                  </CardDescription>
                </CardHeader>

                <CardContent className="p-6 space-y-6">
                  <div className="flex items-center justify-between bg-white/5 p-4 rounded-2xl border border-white/5">
                    <div>
                      <p className="text-xs text-gray-400">Total Pembayaran</p>
                      <p className="text-2xl font-black text-emerald-400">Rp {selectedProduct.price.toLocaleString('id-ID')}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-gray-400">Lokasi Toko</p>
                      <p className="text-xs text-gray-300 flex items-center gap-1 justify-end">
                        <MapPin className="h-3 w-3 text-red-400" />
                        {selectedProduct.store_address}
                      </p>
                    </div>
                  </div>

                  {/* Payment Methods instructions */}
                  <div className="space-y-3 bg-emerald-500/10 p-4 rounded-2xl border border-emerald-500/20">
                    <p className="font-bold text-emerald-400 text-sm flex items-center gap-2">
                      <CreditCard className="h-4 w-4" />
                      Instruksi Pembayaran Rekening Toko:
                    </p>
                    <div className="bg-black/50 p-3 rounded-xl border border-white/10 space-y-1 font-mono text-xs">
                      <p className="text-gray-300">Bank / E-Wallet: BCA / Mandiri / BRI</p>
                      <p className="text-emerald-400 font-bold">Transfer ke Rekening Penjual</p>
                      <p className="text-gray-400">Sertakan bukti transfer saat konfirmasi WhatsApp toko.</p>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <a
                      href={`https://wa.me/${selectedProduct.store_phone?.replace(/[^0-9]/g, '')}?text=Halo%20${encodeURIComponent(selectedProduct.store_name)},%20saya%20ingin%20membeli%20${encodeURIComponent(selectedProduct.name)}%20seharga%20Rp%20${selectedProduct.price.toLocaleString('id-ID')}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full"
                    >
                      <Button className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold h-12 rounded-xl flex items-center justify-center gap-2">
                        <ExternalLink className="h-4 w-4" />
                        Hubungi Toko & Konfirmasi Pembayaran
                      </Button>
                    </a>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        )}

      </div>
    </div>
  );
}
