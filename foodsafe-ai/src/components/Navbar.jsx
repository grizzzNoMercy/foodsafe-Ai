import { motion } from "framer-motion";

export default function Navbar() {
  return (
    <motion.nav
      initial={{ y: -50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.7 }}
      className="fixed top-0 left-0 w-full z-50 px-6 py-4"
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between backdrop-blur-xl bg-white/10 border border-white/10 rounded-3xl px-6 py-4 shadow-2xl">
        
        {/* Logo */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-green-400 flex items-center justify-center shadow-lg">
            <span className="text-black font-bold">AI</span>
          </div>

          <div>
            <h1 className="text-white font-bold text-xl">
              FoodSafe AI
            </h1>
            <p className="text-gray-300 text-sm">
              Smart Food Scanner
            </p>
          </div>
        </div>

        {/* Menu */}
        <div className="hidden md:flex items-center gap-8 text-white">
          <a href="#" className="hover:text-green-400 transition">
            Home
          </a>

          <a href="#" className="hover:text-green-400 transition">
            Scanner
          </a>

          <a href="#" className="hover:text-green-400 transition">
            About
          </a>
        </div>

        {/* Button */}
        <button className="bg-green-400 hover:bg-green-300 transition text-black font-semibold px-5 py-3 rounded-2xl shadow-lg">
          Start Scan
        </button>
      </div>
    </motion.nav>
  );
}