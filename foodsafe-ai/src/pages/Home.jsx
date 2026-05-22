import { motion } from "framer-motion";
import Navbar from "../components/Navbar";
import Scanner from "../components/Scanner";

export default function Home() {
  return (
    <div className="min-h-screen bg-[#0F172A] overflow-hidden relative">

      {/* Background Gradient */}
      <div className="absolute top-[-200px] left-[-200px] w-[500px] h-[500px] bg-green-500 rounded-full blur-[200px] opacity-20"></div>

      <div className="absolute bottom-[-200px] right-[-200px] w-[500px] h-[500px] bg-red-500 rounded-full blur-[200px] opacity-20"></div>

      {/* Navbar */}
      <Navbar />

      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-6 pt-40 pb-20 grid md:grid-cols-2 gap-16 items-center">

        {/* Left Content */}
        <motion.div
          initial={{ x: -80, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.8 }}
        >
          <p className="text-green-400 font-semibold mb-4">
            AI Powered Food Detection
          </p>

          <h1 className="text-5xl md:text-7xl font-bold text-white leading-tight">
            Detect
            <span className="text-green-400"> Dangerous </span>
            Food Using AI Camera
          </h1>

          <p className="text-gray-400 mt-6 text-lg leading-relaxed">
            Gunakan kamera dan AI realtime untuk mendeteksi makanan basi,
            jamur, atau makanan berbahaya secara otomatis.
          </p>

          {/* Buttons */}
          <div className="flex gap-4 mt-10">
            <button className="bg-green-400 hover:bg-green-300 transition text-black font-bold px-7 py-4 rounded-2xl shadow-2xl">
              Start Scanning
            </button>

            <button className="border border-white/20 hover:bg-white/10 transition text-white px-7 py-4 rounded-2xl backdrop-blur-xl">
              Learn More
            </button>
          </div>

          {/* Stats */}
          <div className="flex gap-8 mt-12 flex-wrap">

            <div>
              <h2 className="text-3xl font-bold text-white">
                98%
              </h2>

              <p className="text-gray-400">
                Detection Accuracy
              </p>
            </div>

            <div>
              <h2 className="text-3xl font-bold text-white">
                AI
              </h2>

              <p className="text-gray-400">
                Realtime Scanner
              </p>
            </div>

            <div>
              <h2 className="text-3xl font-bold text-white">
                24/7
              </h2>

              <p className="text-gray-400">
                Monitoring
              </p>
            </div>

          </div>
        </motion.div>

        {/* Right Scanner Card */}
        <motion.div
          initial={{ x: 80, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.8 }}
          className="relative"
        >

          {/* Glow Effect */}
          <div className="absolute inset-0 bg-green-500 blur-[120px] opacity-20 rounded-full"></div>

          {/* Scanner Container */}
          <div className="relative backdrop-blur-2xl bg-white/10 border border-white/10 rounded-[40px] p-6 shadow-2xl">

            {/* REAL CAMERA SCANNER */}
            <Scanner />

            {/* Result Card */}
            <div className="mt-6 backdrop-blur-xl bg-white/10 border border-white/10 rounded-3xl p-5">

              {/* Top Result */}
              <div className="flex items-center justify-between">

                <div>
                  <p className="text-gray-400">
                    Detection Result
                  </p>

                  <h2 className="text-white text-2xl font-bold mt-1">
                    Fresh Food
                  </h2>
                </div>

                <div className="bg-green-400/20 text-green-400 px-4 py-2 rounded-2xl font-semibold">
                  SAFE
                </div>

              </div>

              {/* Confidence */}
              <div className="mt-5">

                <div className="flex justify-between mb-2">

                  <p className="text-gray-400">
                    AI Confidence
                  </p>

                  <p className="text-white">
                    98%
                  </p>

                </div>

                {/* Progress Bar */}
                <div className="w-full h-3 bg-white/10 rounded-full overflow-hidden">

                  <div className="w-[98%] h-full bg-green-400 rounded-full"></div>

                </div>

              </div>

              {/* Bottom Info Cards */}
              <div className="grid grid-cols-2 gap-4 mt-6">

                {/* Food Status */}
                <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-4">

                  <p className="text-gray-400 text-sm">
                    Food Status
                  </p>

                  <h2 className="text-green-400 text-xl font-bold mt-1">
                    Safe
                  </h2>

                </div>

                {/* Scanner Status */}
                <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-4">

                  <p className="text-gray-400 text-sm">
                    AI Scanner
                  </p>

                  <h2 className="text-white text-xl font-bold mt-1">
                    Active
                  </h2>

                </div>

              </div>

            </div>

          </div>

        </motion.div>

      </div>
    </div>
  );
}