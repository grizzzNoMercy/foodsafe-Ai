import Webcam from "react-webcam";
import { motion } from "framer-motion";
import { useRef, useState, useEffect } from "react";
import ResultCard from "./ResultCard";

export default function Scanner() {

  const webcamRef = useRef(null);

  const [loading, setLoading] = useState(false);

  const [detections, setDetections] = useState([]);

  const [history, setHistory] = useState([]);

  const [fps, setFps] = useState(0);

  const [previewImage, setPreviewImage] = useState(null);

  const [fullscreen, setFullscreen] = useState(false);

  // =========================
  // VOICE AI
  // =========================
  const speakResult = (text) => {

    const speech = new SpeechSynthesisUtterance(text);

    speech.lang = "id-ID";

    speech.rate = 1;

    speech.pitch = 1;

    window.speechSynthesis.speak(speech);
  };

  // =========================
  // STATUS SAFE / WARNING
  // =========================
  const getStatus = (confidence) => {

    if (confidence >= 80) {

      return {
        text: "SAFE",
        color: "text-green-400",
        bg: "bg-green-400/20",
      };

    }

    return {
      text: "WARNING",
      color: "text-red-400",
      bg: "bg-red-400/20",
    };
  };

  // =========================
  // ANALYZE FOOD RISK
  // =========================
  const analyzeFoodRisk = (label) => {

    const dangerousFoods = [
      "rotten",
      "mold",
      "spoiled",
      "expired",
      "toxic",
      "poison"
    ];

    return dangerousFoods.some((food) =>
      label.toLowerCase().includes(food)
    );
  };

  // =========================
  // AI RECOMMENDATION
  // =========================
  const getRecommendation = (label) => {

    const recommendations = {

      rotten: "Buang makanan segera",
      mold: "Jangan dikonsumsi",
      spoiled: "Makanan sudah rusak",
      expired: "Makanan kadaluarsa",
      fresh: "Makanan aman dikonsumsi",

    };

    const lower = label.toLowerCase();

    for (const key in recommendations) {

      if (lower.includes(key)) {
        return recommendations[key];
      }

    }

    return "Makanan perlu diperiksa lebih lanjut";
  };

  // =========================
  // FOOD RISK SCORE
  // =========================
  const getRiskScore = (label) => {

    if (
      label.toLowerCase().includes("rotten") ||
      label.toLowerCase().includes("mold")
    ) {
      return 95;
    }

    if (
      label.toLowerCase().includes("spoiled")
    ) {
      return 80;
    }

    return 10;
  };

  // =========================
  // CAPTURE IMAGE
  // =========================
  const capture = async () => {

    if (!webcamRef.current) {
      return;
    }

    const imageSrc = webcamRef.current.getScreenshot();

    if (!imageSrc) {
      alert("Camera belum siap");
      return;
    }

    setLoading(true);

    try {

      const blob = await fetch(imageSrc).then((res) => res.blob());

      const formData = new FormData();

      formData.append("image", blob, "scan.jpg");

      const response = await fetch("http://127.0.0.1:5000/detect", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      setDetections(data.detections || []);

      // SAVE HISTORY
      setHistory((prev) => [
        ...prev,
        {
          time: new Date().toLocaleTimeString(),
          detections: data.detections || [],
        },
      ]);

      // SPEAK RESULT
      if (data.detections.length > 0) {

        const dangerDetected = data.detections.some((item) =>
          analyzeFoodRisk(item.class)
        );

        if (dangerDetected) {

          speakResult("Peringatan. Makanan berbahaya terdeteksi");

        } else {

          speakResult("Makanan aman terdeteksi");

        }

      } else {

        speakResult("Tidak ada makanan terdeteksi");

      }

    } catch (error) {

      console.error(error);

      speakResult("Terjadi kesalahan pada AI scanner");

    }

    setLoading(false);
  };

  // =========================
  // UPLOAD IMAGE
  // =========================
  const uploadImage = async (event) => {

    const file = event.target.files[0];

    if (!file) return;

    setPreviewImage(URL.createObjectURL(file));

    setLoading(true);

    try {

      const formData = new FormData();

      formData.append("image", file);

      const response = await fetch("http://127.0.0.1:5000/detect", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      setDetections(data.detections || []);

      setHistory((prev) => [
        ...prev,
        {
          time: new Date().toLocaleTimeString(),
          detections: data.detections || [],
        },
      ]);

      if (data.detections.length > 0) {

        const dangerDetected = data.detections.some((item) =>
          analyzeFoodRisk(item.class)
        );

        if (dangerDetected) {

          speakResult("Peringatan. Makanan berbahaya terdeteksi");

        } else {

          speakResult("Makanan aman terdeteksi");

        }

      }

    } catch (error) {

      console.error(error);

    }

    setLoading(false);
  };

  // =========================
  // SAVE SCREENSHOT
  // =========================
  const saveScreenshot = () => {

    const imageSrc = webcamRef.current.getScreenshot();

    const link = document.createElement("a");

    link.href = imageSrc;

    link.download = "foodsafe-scan.jpg";

    link.click();
  };

  // =========================
  // AUTO SCAN
  // =========================
  useEffect(() => {

    const interval = setInterval(() => {

      capture();

    }, 5000);

    return () => clearInterval(interval);

  }, []);

  // =========================
  // FPS MONITOR
  // =========================
  useEffect(() => {

    let lastTime = performance.now();

    const interval = setInterval(() => {

      const now = performance.now();

      const delta = now - lastTime;

      const currentFps = Math.round(1000 / delta);

      setFps(currentFps);

      lastTime = now;

    }, 1000);

    return () => clearInterval(interval);

  }, []);

  const totalScans = history.length;

  return (
    <div>

      {/* CAMERA */}
      <motion.div
        animate={{
          y: [0, -5, 0],
        }}
        transition={{
          repeat: Infinity,
          duration: 4,
        }}
        className={`relative rounded-[35px] overflow-hidden border border-white/10 bg-black shadow-[0_0_60px_rgba(0,255,120,0.2)] ${
          fullscreen ? "fixed inset-0 z-50" : ""
        }`}
      >

        {/* WEBCAM */}
        <Webcam
          ref={webcamRef}
          audio={false}
          mirrored={true}
          screenshotFormat="image/jpeg"
          videoConstraints={{
            width: 1280,
            height: 720,
            facingMode: "user",
          }}
          className="w-full h-[500px] object-cover"
        />

        {/* BOUNDING BOX */}
        {detections.map((item, index) => {

          if (!item.box) return null;

          const box = item.box;

          const isDanger = analyzeFoodRisk(item.class);

          return (

            <div
              key={index}
              className={`absolute border-4 rounded-xl shadow-[0_0_20px] ${
                isDanger
                  ? "border-red-400 shadow-red-400"
                  : "border-green-400 shadow-green-400"
              }`}
              style={{
                left: `${(box.x1 / 1280) * 100}%`,
                top: `${(box.y1 / 720) * 100}%`,
                width: `${((box.x2 - box.x1) / 1280) * 100}%`,
                height: `${((box.y2 - box.y1) / 720) * 100}%`,
              }}
            >

              {/* LABEL */}
              <div
                className={`absolute -top-8 left-0 px-3 py-1 rounded-lg text-sm font-bold ${
                  isDanger
                    ? "bg-red-400 text-black"
                    : "bg-green-400 text-black"
                }`}
              >
                {item.class}
              </div>

            </div>

          );

        })}

        {/* SCANNER LINE */}
        <motion.div
          animate={{
            y: [0, 450, 0],
          }}
          transition={{
            repeat: Infinity,
            duration: 3,
          }}
          className="absolute top-0 left-0 w-full h-1 bg-green-400 shadow-[0_0_20px_#00ff88]"
        />

        {/* OVERLAY */}
        <div className="absolute inset-0 border-[3px] border-green-400/20 rounded-[35px]" />

        {/* AI STATUS */}
        <div className="absolute bottom-5 left-5 backdrop-blur-xl bg-black/30 border border-white/10 rounded-2xl px-4 py-3">

          <h2 className="text-white font-bold">
            AI Camera Active
          </h2>

          <p className="text-gray-300 text-sm">
            Realtime Food Detection
          </p>

          <p className="text-green-400 text-sm mt-1">
            FPS: {fps}
          </p>

        </div>

      </motion.div>

      {/* BUTTON */}
      <button
        onClick={capture}
        disabled={loading}
        className="mt-5 w-full bg-green-400 hover:bg-green-300 transition text-black font-bold py-4 rounded-2xl shadow-[0_0_60px_rgba(0,255,120,0.4)]"
      >
        {loading ? "Scanning..." : "Scan Food"}
      </button>

      {/* UPLOAD */}
      <label className="mt-4 block">

        <div className="w-full bg-white/10 border border-white/10 hover:bg-white/20 transition text-white text-center py-4 rounded-2xl cursor-pointer">

          Upload Food Image

        </div>

        <input
          type="file"
          accept="image/*"
          className="hidden"
          onChange={uploadImage}
        />

      </label>

      {/* SAVE SCREENSHOT */}
      <button
        onClick={saveScreenshot}
        className="mt-4 w-full bg-red-400 hover:bg-red-300 transition text-black font-bold py-4 rounded-2xl"
      >
        Save Screenshot
      </button>

      {/* FULLSCREEN */}
      <button
        onClick={() => setFullscreen(!fullscreen)}
        className="mt-4 w-full bg-blue-400 hover:bg-blue-300 transition text-black font-bold py-4 rounded-2xl"
      >
        Toggle Fullscreen
      </button>

      {/* IMAGE PREVIEW */}
      {previewImage && (

        <div className="mt-5">

          <img
            src={previewImage}
            alt="Preview"
            className="w-full rounded-3xl border border-white/10"
          />

        </div>

      )}

      {/* LOADING */}
      {loading && (
        <div className="mt-4 text-center text-green-400 animate-pulse">
          AI Sedang Menganalisis...
        </div>
      )}

      {/* RESULT */}
      <div className="mt-5 space-y-4">

        {detections.map((item, index) => {

          const status = getStatus(item.confidence);

          const isDanger = analyzeFoodRisk(item.class);

          return (

            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white/10 border border-white/10 rounded-2xl p-5 backdrop-blur-xl shadow-[0_0_40px_rgba(0,255,120,0.1)]"
            >

              {/* TOP */}
              <div className="flex items-center justify-between">

                <div>

                  <p className="text-gray-400 text-sm">
                    Detected Object
                  </p>

                  <h2 className="text-white text-2xl font-bold mt-1">
                    {item.class}
                  </h2>

                </div>

                {/* STATUS */}
                <div
                  className={`px-4 py-2 rounded-2xl font-semibold ${
                    isDanger
                      ? "bg-red-400/20 text-red-400"
                      : `${status.bg} ${status.color}`
                  }`}
                >
                  {isDanger ? "DANGEROUS" : status.text}
                </div>

              </div>

              {/* CONFIDENCE */}
              <div className="mt-5">

                <div className="flex justify-between mb-2">

                  <p className="text-gray-400">
                    AI Confidence
                  </p>

                  <p className="text-white">
                    {item.confidence}%
                  </p>

                </div>

                <div className="w-full h-3 bg-white/10 rounded-full overflow-hidden">

                  <div
                    className={`h-full rounded-full ${
                      isDanger
                        ? "bg-red-400"
                        : "bg-green-400"
                    }`}
                    style={{
                      width: `${item.confidence}%`,
                    }}
                  ></div>

                </div>

              </div>

              {/* RECOMMENDATION */}
              <div className="mt-4 bg-black/20 rounded-2xl p-4">

                <p className="text-gray-400 text-sm">
                  AI Recommendation
                </p>

                <p className="text-white mt-2 font-medium">
                  {getRecommendation(item.class)}
                </p>

              </div>

              {/* RISK SCORE */}
              <div className="mt-4">

                <div className="flex justify-between mb-2">

                  <p className="text-gray-400">
                    Food Risk Score
                  </p>

                  <p className="text-red-400">
                    {getRiskScore(item.class)}%
                  </p>

                </div>

                <div className="w-full h-3 bg-white/10 rounded-full overflow-hidden">

                  <div
                    className="h-full bg-red-400 rounded-full"
                    style={{
                      width: `${getRiskScore(item.class)}%`,
                    }}
                  ></div>

                </div>

              </div>

            </motion.div>

          );

        })}

      </div>

      {/* HISTORY */}
      <div className="mt-10">

        <h2 className="text-white text-2xl font-bold mb-5">
          Scan History
        </h2>

        <div className="space-y-4">

          {history.map((item, index) => (

            <div
              key={index}
              className="bg-white/5 border border-white/10 rounded-2xl p-4"
            >

              <p className="text-green-400">
                {item.time}
              </p>

              <div className="mt-2 space-y-2">

                {item.detections.map((detection, i) => (

                  <p
                    key={i}
                    className="text-white"
                  >
                    {detection.class} ({detection.confidence}%)
                  </p>

                ))}

              </div>

            </div>

          ))}

        </div>

      </div>

      {/* AI STATISTICS */}
      <div className="grid grid-cols-2 gap-4 mt-10">

        <div className="bg-white/10 rounded-2xl p-5">

          <p className="text-gray-400">
            Total Scan
          </p>

          <h2 className="text-white text-3xl font-bold mt-2">
            {totalScans}
          </h2>

        </div>

        <div className="bg-white/10 rounded-2xl p-5">

          <p className="text-gray-400">
            Dangerous Detection
          </p>

          <h2 className="text-red-400 text-3xl font-bold mt-2">

            {
              history.filter((item) =>
                item.detections.some((d) =>
                  analyzeFoodRisk(d.class)
                )
              ).length
            }

          </h2>

        </div>

      </div>

    </div>
  );
}