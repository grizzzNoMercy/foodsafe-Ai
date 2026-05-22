import { motion } from "framer-motion";

export default function ResultCard({
  item,
  getStatus,
  analyzeFoodRisk,
  getRecommendation,
  getRiskScore,
}) {

  const status = getStatus(item.confidence);

  const isDanger = analyzeFoodRisk(item.class);

  return (

    <motion.div
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
}