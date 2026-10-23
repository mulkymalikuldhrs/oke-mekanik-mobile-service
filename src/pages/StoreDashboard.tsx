import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { ShoppingBag, Plus, CreditCard, Trash2, Edit3, Store, DollarSign } from 'lucide-react';
import { productApi, storeApi } from '@/lib/api';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

export default function StoreDashboard() {
  const { user } = useAuth();
  const [products, setProducts] = useState<any[]>([]);
  const [storeData, setStoreData] = useState<any | null>(null);
  const [paymentMethods, setPaymentMethods] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // New product form
  const [newProduct, setNewProduct] = useState({
    name: '',
    category: 'Oli & Pelumas',
    price: 0,
    stock: 10,
    image: '📦',
    description: '',
    vehicleCompatibility: 'Universal',
  });

  // Payment method form
  const [newPayment, setNewPayment] = useState({
    bankName: '',
    accountNumber: '',
    accountHolder: '',
  });

  useEffect(() => {
    loadStoreDashboard();
  }, []);

  const loadStoreDashboard = async () => {
    try {
      setIsLoading(true);
      const prods = await productApi.getProducts({});
      setProducts(prods);
      if (user?.id) {
        const store = await storeApi.getStoreById(user.id);
        setStoreData(store);
        if (store.id) {
          const payments = await storeApi.getPaymentMethods(store.id);
          setPaymentMethods(payments);
        }
      }
    } catch (error) {
      console.error('Store dashboard load error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await productApi.createProduct(newProduct);
      toast.success('Produk / Sparepart berhasil ditambahkan!');
      setNewProduct({
        name: '',
        category: 'Oli & Pelumas',
        price: 0,
        stock: 10,
        image: '📦',
        description: '',
        vehicleCompatibility: 'Universal',
      });
      loadStoreDashboard();
    } catch (error) {
      toast.error('Gagal menambahkan produk');
    }
  };

  const handleDeleteProduct = async (id: string) => {
    try {
      await productApi.deleteProduct(id);
      toast.success('Produk telah dihapus');
      loadStoreDashboard();
    } catch (error) {
      toast.error('Gagal menghapus produk');
    }
  };

  const handleAddPayment = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await storeApi.addPaymentMethod({
        ...newPayment,
        storeId: storeData?.id
      });
      toast.success('Metode pembayaran seller berhasil ditambahkan!');
      setNewPayment({ bankName: '', accountNumber: '', accountHolder: '' });
      loadStoreDashboard();
    } catch (error) {
      toast.error('Gagal menambahkan pembayaran');
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white p-4 md:p-8 space-y-8">
      <div className="max-w-7xl mx-auto space-y-8">

        {/* Top Banner */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-gradient-to-r from-emerald-900/40 to-black p-6 rounded-3xl border border-emerald-500/20">
          <div>
            <Badge className="bg-emerald-500/20 text-emerald-400 border-0 mb-2 font-bold">Store & Marketplace Dashboard</Badge>
            <h1 className="text-3xl font-black text-white flex items-center gap-3">
              <Store className="h-8 w-8 text-emerald-400" />
              {storeData?.name || 'Dashboard Toko Suku Cadang'}
            </h1>
            <p className="text-gray-400 text-sm mt-1">
              Kelola daftar sparepart, stok, dan rekening/metode pembayaran langsung toko Anda.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* Add Product & Payment Methods Form */}
          <div className="space-y-6">

            {/* Add Product Card */}
            <Card className="bg-white/5 border-white/10 rounded-2xl">
              <CardHeader>
                <CardTitle className="text-lg font-bold text-white flex items-center gap-2">
                  <Plus className="h-5 w-5 text-emerald-400" />
                  Tambah Produk / Sparepart
                </CardTitle>
                <CardDescription className="text-xs text-gray-400">
                  Daftarkan barang atau suku cadang baru di toko Anda
                </CardDescription>
              </CardHeader>
              <form onSubmit={handleCreateProduct}>
                <CardContent className="space-y-4">
                  <div className="space-y-1">
                    <Label className="text-xs text-gray-300">Nama Sparepart / Barang</Label>
                    <Input
                      placeholder="Contoh: Oli Motul 10W-40 Synthetic"
                      value={newProduct.name}
                      onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                      required
                      className="bg-black/40 border-white/10 text-white text-sm"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div className="space-y-1">
                      <Label className="text-xs text-gray-300">Kategori</Label>
                      <select
                        value={newProduct.category}
                        onChange={(e) => setNewProduct({ ...newProduct, category: e.target.value })}
                        className="w-full bg-black/40 border border-white/10 text-white text-sm rounded-md p-2"
                      >
                        <option value="Oli & Pelumas">Oli & Pelumas</option>
                        <option value="Rem & Suspensi">Rem & Kaki-kaki</option>
                        <option value="Kelistrikan">Kelistrikan</option>
                        <option value="Aki & Baterai">Aki & Baterai</option>
                        <option value="EV / Hybrid Parts">EV / Hybrid</option>
                      </select>
                    </div>

                    <div className="space-y-1">
                      <Label className="text-xs text-gray-300">Harga (Rp)</Label>
                      <Input
                        type="number"
                        value={newProduct.price}
                        onChange={(e) => setNewProduct({ ...newProduct, price: parseInt(e.target.value) || 0 })}
                        required
                        className="bg-black/40 border-white/10 text-white text-sm"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div className="space-y-1">
                      <Label className="text-xs text-gray-300">Jumlah Stok</Label>
                      <Input
                        type="number"
                        value={newProduct.stock}
                        onChange={(e) => setNewProduct({ ...newProduct, stock: parseInt(e.target.value) || 0 })}
                        required
                        className="bg-black/40 border-white/10 text-white text-sm"
                      />
                    </div>
                    <div className="space-y-1">
                      <Label className="text-xs text-gray-300">Ikon / Emoji</Label>
                      <Input
                        value={newProduct.image}
                        onChange={(e) => setNewProduct({ ...newProduct, image: e.target.value })}
                        className="bg-black/40 border-white/10 text-white text-sm"
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <Label className="text-xs text-gray-300">Kompatibilitas Kendaraan</Label>
                    <Input
                      placeholder="Contoh: Avanza, Vario, Universal"
                      value={newProduct.vehicleCompatibility}
                      onChange={(e) => setNewProduct({ ...newProduct, vehicleCompatibility: e.target.value })}
                      className="bg-black/40 border-white/10 text-white text-sm"
                    />
                  </div>

                  <div className="space-y-1">
                    <Label className="text-xs text-gray-300">Deskripsi Barang</Label>
                    <Textarea
                      placeholder="Detail spesifikasi..."
                      value={newProduct.description}
                      onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
                      className="bg-black/40 border-white/10 text-white text-sm min-h-[60px]"
                    />
                  </div>

                  <Button type="submit" className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl h-10">
                    + Publish Produk Ke Katalog
                  </Button>
                </CardContent>
              </form>
            </Card>

            {/* Add Payment Method */}
            <Card className="bg-white/5 border-white/10 rounded-2xl">
              <CardHeader>
                <CardTitle className="text-lg font-bold text-white flex items-center gap-2">
                  <CreditCard className="h-5 w-5 text-emerald-400" />
                  Rekening Pembayaran Seller
                </CardTitle>
              </CardHeader>
              <form onSubmit={handleAddPayment}>
                <CardContent className="space-y-3">
                  <Input
                    placeholder="Nama Bank (BCA, Mandiri, BRI, QRIS)"
                    value={newPayment.bankName}
                    onChange={(e) => setNewPayment({ ...newPayment, bankName: e.target.value })}
                    required
                    className="bg-black/40 border-white/10 text-white text-sm"
                  />
                  <Input
                    placeholder="Nomor Rekening / HP"
                    value={newPayment.accountNumber}
                    onChange={(e) => setNewPayment({ ...newPayment, accountNumber: e.target.value })}
                    required
                    className="bg-black/40 border-white/10 text-white text-sm"
                  />
                  <Input
                    placeholder="Nama Pemilik Rekening"
                    value={newPayment.accountHolder}
                    onChange={(e) => setNewPayment({ ...newPayment, accountHolder: e.target.value })}
                    required
                    className="bg-black/40 border-white/10 text-white text-sm"
                  />
                  <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl h-9 text-xs">
                    + Tambah Rekening Pembayaran
                  </Button>
                </CardContent>
              </form>
            </Card>

          </div>

          {/* Product Listing */}
          <div className="lg:col-span-2 space-y-6">
            <h2 className="text-xl font-black text-white flex items-center gap-2">
              <ShoppingBag className="h-6 w-6 text-emerald-400" />
              Daftar Barang & Sparepart
            </h2>

            {products.length === 0 ? (
              <Card className="bg-white/5 border-white/10 text-center py-12">
                <CardContent>
                  <p className="text-gray-400">Belum ada barang di etalase Anda.</p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {products.map((p) => (
                  <Card key={p.id} className="bg-white/5 border-white/10 rounded-2xl p-4 space-y-3">
                    <div className="flex justify-between items-start">
                      <div className="text-3xl">{p.image || '📦'}</div>
                      <Badge className="bg-emerald-500/20 text-emerald-400 border-0 text-xs">
                        Stok: {p.stock}
                      </Badge>
                    </div>
                    <div>
                      <h3 className="font-bold text-white text-base line-clamp-1">{p.name}</h3>
                      <p className="text-xs text-gray-400 line-clamp-2">{p.description}</p>
                    </div>
                    <div className="flex justify-between items-center pt-2 border-t border-white/5">
                      <p className="text-emerald-400 font-bold">
                        Rp {p.price.toLocaleString('id-ID')}
                      </p>
                      <Button
                        size="sm"
                        variant="ghost"
                        className="text-red-400 hover:text-red-300 hover:bg-red-500/10 h-8 px-2"
                        onClick={() => handleDeleteProduct(p.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </div>

        </div>

      </div>
    </div>
  );
}
