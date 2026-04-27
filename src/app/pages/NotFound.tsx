import { motion } from "motion/react";
import { useNavigate } from "react-router";
import { AlertTriangle, Home } from "lucide-react";

export function NotFound() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden" style={{ background: "#050510", fontFamily: "'Segoe UI', system-ui, sans-serif" }}>
      {/* Background hyper-graphics */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute inset-0 voip-grid-bg opacity-40" />
        <div className="aurora-bg absolute inset-0 opacity-50" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="relative z-10 w-full max-w-md p-8 rounded-2xl glass-card text-center"
        style={{ border: "1px solid rgba(255,55,95,0.2)", boxShadow: "0 0 40px rgba(255,55,95,0.1)" }}
      >
        <motion.div
          animate={{ rotate: [0, -10, 10, -10, 10, 0] }}
          transition={{ repeat: Infinity, duration: 5, ease: "easeInOut" }}
          className="w-20 h-20 mx-auto mb-6 rounded-full flex items-center justify-center"
          style={{ background: "rgba(255,55,95,0.1)", border: "1px solid rgba(255,55,95,0.3)" }}
        >
          <AlertTriangle size={36} color="#ff375f" className="drop-shadow-[0_0_8px_rgba(255,55,95,0.8)]" />
        </motion.div>

        <h1 className="text-5xl font-bold mb-2 tracking-widest" style={{ color: "#ff375f" }}>
          404
        </h1>
        <p className="text-sm mb-8" style={{ color: "#e0e0f0" }}>
          متاسفانه مسیر مورد نظر شما در سیستم VOIP پیدا نشد.
        </p>

        <button
          onClick={() => navigate("/")}
          className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl font-medium text-sm transition-all duration-300"
          style={{
            background: "linear-gradient(90deg, rgba(0,212,255,0.15), rgba(0,212,255,0.05))",
            border: "1px solid rgba(0,212,255,0.4)",
            color: "#00d4ff",
          }}
        >
          <Home size={18} />
          <span>بازگشت به داشبورد مادر</span>
        </button>
      </motion.div>
    </div>
  );
}
