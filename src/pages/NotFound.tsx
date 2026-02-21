import { useLocation, Link } from "react-router-dom";
import { Wrench } from "lucide-react";
import { Button } from "@/components/ui/button";

const NotFound = () => {
  const location = useLocation();

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0a0a0a] text-white p-4">
      {/* Background Glow */}
      <div className="fixed top-0 left-0 w-full h-full pointer-events-none z-0">
        <div className="absolute top-[30%] left-[20%] w-[40%] h-[40%] bg-blue-600/10 blur-[120px] rounded-full" />
      </div>

      <div className="text-center relative z-10 max-w-md w-full bg-white/5 backdrop-blur-2xl p-12 rounded-[3rem] border border-white/10 shadow-2xl">
        <div className="bg-blue-600/10 p-6 rounded-3xl w-24 h-24 mx-auto mb-8 flex items-center justify-center border border-blue-500/20">
          <Wrench className="h-12 w-12 text-blue-400" />
        </div>
        <h1 className="text-8xl font-black italic tracking-tighter mb-4 text-transparent bg-clip-text bg-gradient-to-b from-white to-white/20">404</h1>
        <p className="text-xl text-gray-400 mb-8 font-medium">Halaman yang Anda cari tidak dapat ditemukan atau telah dipindahkan.</p>
        <Link to="/">
          <Button size="lg" className="w-full bg-blue-600 hover:bg-blue-500 font-bold h-14 rounded-2xl shadow-lg shadow-blue-500/20">
            KEMBALI KE BERANDA
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
