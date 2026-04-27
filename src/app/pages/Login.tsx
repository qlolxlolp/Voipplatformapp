import { useState } from "react";
import { motion } from "motion/react";
import { useNavigate } from "react-router";
import { Phone, Lock, User, ChevronRight, Fingerprint, ShieldCheck } from "lucide-react";

export function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const navigate = useNavigate();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsAuthenticating(true);
    // Simulate network delay and authentication
    setTimeout(() => {
      setIsAuthenticating(false);
      navigate("/");
    }, 2000);
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden" style={{ background: "#050510", fontFamily: "'Segoe UI', system-ui, sans-serif" }}>
      {/* Background hyper-graphics */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute inset-0 voip-grid-bg opacity-40" />
        <div className="aurora-bg absolute inset-0 opacity-50" />
        <div className="absolute top-1/4 -left-20 w-96 h-96 rounded-full opacity-10" style={{ background: "radial-gradient(circle, #00d4ff, transparent)", filter: "blur(60px)", animation: "aurora 10s ease-in-out infinite" }} />
        <div className="absolute bottom-1/4 -right-20 w-96 h-96 rounded-full opacity-10" style={{ background: "radial-gradient(circle, #bf5af2, transparent)", filter: "blur(60px)", animation: "aurora 12s ease-in-out infinite reverse" }} />
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="relative z-10 w-full max-w-md p-8 rounded-2xl glass-card"
        style={{ border: "1px solid rgba(0,212,255,0.2)", boxShadow: "0 0 40px rgba(0,212,255,0.1), inset 0 0 20px rgba(255,255,255,0.02)" }}
      >
        <div className="flex flex-col items-center mb-8">
          <motion.div
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="relative w-16 h-16 mb-4 flex items-center justify-center rounded-2xl"
            style={{ background: "linear-gradient(135deg, rgba(0,212,255,0.15), rgba(191,90,242,0.15))", border: "1px solid rgba(0,212,255,0.4)" }}
          >
            <Phone size={28} color="#00d4ff" className="drop-shadow-[0_0_8px_rgba(0,212,255,0.8)]" />
            <div className="absolute -top-1 -right-1 w-4 h-4 rounded-full flex items-center justify-center status-dot-available" />
            <div className="absolute inset-0 rounded-2xl ring-animation" />
          </motion.div>
          <motion.h1
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="holographic-text text-2xl font-bold tracking-wider mb-2"
          >
            VOIP MOTHER
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-xs text-center"
            style={{ color: "#6e6e80", letterSpacing: "0.1em" }}
          >
            SECURE COMMUNICATIONS PLATFORM
          </motion.p>
        </div>

        <form onSubmit={handleLogin} className="space-y-5">
          <motion.div initial={{ x: -20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: 0.5 }}>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <User size={16} color="#00d4ff" className="opacity-70" />
              </div>
              <input
                type="text"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full bg-transparent border outline-none text-sm pl-10 pr-4 py-3 rounded-xl transition-all duration-300 focus:border-cyan-400"
                style={{
                  color: "#e0e0f0",
                  borderColor: "rgba(0,212,255,0.2)",
                  background: "rgba(0,0,0,0.2)"
                }}
                placeholder="نام کاربری (مثال: admin)"
                disabled={isAuthenticating}
              />
            </div>
          </motion.div>

          <motion.div initial={{ x: -20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: 0.6 }}>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Lock size={16} color="#00d4ff" className="opacity-70" />
              </div>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-transparent border outline-none text-sm pl-10 pr-4 py-3 rounded-xl transition-all duration-300 focus:border-cyan-400"
                style={{
                  color: "#e0e0f0",
                  borderColor: "rgba(0,212,255,0.2)",
                  background: "rgba(0,0,0,0.2)"
                }}
                placeholder="رمز عبور"
                disabled={isAuthenticating}
              />
            </div>
          </motion.div>

          <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.7 }} className="pt-2">
            <button
              type="submit"
              disabled={isAuthenticating}
              className="w-full relative overflow-hidden group flex items-center justify-center gap-2 py-3.5 rounded-xl font-medium text-sm transition-all duration-300"
              style={{
                background: "linear-gradient(90deg, rgba(0,212,255,0.2), rgba(191,90,242,0.2))",
                border: "1px solid rgba(0,212,255,0.5)",
                color: "#fff",
                boxShadow: "0 0 20px rgba(0,212,255,0.2)",
              }}
            >
              <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:animate-[data-stream_1.5s_ease-in-out_infinite]" />
              
              {isAuthenticating ? (
                <>
                  <Fingerprint size={18} className="animate-pulse text-cyan-400" />
                  <span>در حال تایید هویت...</span>
                </>
              ) : (
                <>
                  <ShieldCheck size={18} />
                  <span>ورود به پنل کاربری</span>
                  <ChevronRight size={16} className="absolute right-4" />
                </>
              )}
            </button>
          </motion.div>
        </form>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="mt-6 text-center"
        >
          <p className="text-xs flex items-center justify-center gap-1.5" style={{ color: "#4e4e60" }}>
            <ShieldCheck size={12} color="#30d158" />
            اتصال امن و رمزنگاری شده ۲۵۶-بیت
          </p>
        </motion.div>
      </motion.div>
    </div>
  );
}
