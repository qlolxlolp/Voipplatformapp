import { useState, useEffect } from "react";
import { NavLink, Outlet, useLocation } from "react-router";
import { motion, AnimatePresence } from "motion/react";
import {
  LayoutDashboard, Phone, PhoneCall, Users, History, 
  Voicemail, GitBranch, Shield, Settings, Menu, X,
  Wifi, WifiOff, Activity, Bell, Server, Radio
} from "lucide-react";
import { MOTHER_NUMBER, SERVER_IP } from "../../data/voipData";

const navItems = [
  { to: "/", icon: LayoutDashboard, label: "داشبورد", labelEn: "Dashboard" },
  { to: "/active-calls", icon: PhoneCall, label: "تماس‌های فعال", labelEn: "Active Calls", badge: 4 },
  { to: "/extensions", icon: Users, label: "داخلی‌ها", labelEn: "Extensions" },
  { to: "/history", icon: History, label: "تاریخچه تماس", labelEn: "Call History" },
  { to: "/voicemail", icon: Voicemail, label: "پیام صوتی", labelEn: "Voicemail", badge: 3 },
  { to: "/conference", icon: GitBranch, label: "کنفرانس", labelEn: "Conference" },
  { to: "/ivr", icon: Radio, label: "IVR مادر", labelEn: "IVR System" },
  { to: "/security", icon: Shield, label: "امنیت", labelEn: "Security" },
  { to: "/settings", icon: Settings, label: "تنظیمات", labelEn: "Settings" },
];

export function Layout() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [serverOnline, setServerOnline] = useState(true);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [waveValues, setWaveValues] = useState<number[]>([]);
  const location = useLocation();

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setWaveValues(Array.from({ length: 20 }, () => Math.random() * 100));
    }, 150);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    // Simulate occasional server state changes
    const timer = setInterval(() => {
      setServerOnline(true);
    }, 30000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString("fa-IR", { hour12: false });
  };

  return (
    <div className="flex h-screen overflow-hidden" style={{ background: "#050510", fontFamily: "'Segoe UI', system-ui, sans-serif" }}>
      {/* Hyper-graphic background */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute inset-0 voip-grid-bg opacity-60" />
        <div className="aurora-bg absolute inset-0" />
        {/* Animated orbs */}
        <div className="absolute top-20 left-40 w-96 h-96 rounded-full opacity-5" style={{ background: "radial-gradient(circle, #00d4ff, transparent)", filter: "blur(60px)", animation: "aurora 10s ease-in-out infinite" }} />
        <div className="absolute bottom-20 right-40 w-80 h-80 rounded-full opacity-5" style={{ background: "radial-gradient(circle, #bf5af2, transparent)", filter: "blur(60px)", animation: "aurora 12s ease-in-out infinite reverse" }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 rounded-full opacity-3" style={{ background: "radial-gradient(circle, #30d158, transparent)", filter: "blur(80px)", animation: "aurora 8s ease-in-out infinite 3s" }} />
      </div>

      {/* Sidebar */}
      <motion.aside
        initial={{ x: -280 }}
        animate={{ x: sidebarOpen ? 0 : -240 }}
        transition={{ type: "spring", damping: 25, stiffness: 200 }}
        className="relative z-20 flex-shrink-0 flex flex-col"
        style={{
          width: sidebarOpen ? 260 : 20,
          minHeight: "100vh",
          background: "linear-gradient(180deg, rgba(5,5,20,0.98) 0%, rgba(8,8,25,0.98) 100%)",
          borderRight: "1px solid rgba(0,212,255,0.1)",
          boxShadow: "4px 0 30px rgba(0,212,255,0.05)"
        }}
      >
        {/* Sidebar toggle */}
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="absolute -right-3 top-6 z-30 w-6 h-6 rounded-full flex items-center justify-center cursor-pointer"
          style={{ background: "rgba(0,212,255,0.2)", border: "1px solid rgba(0,212,255,0.4)" }}
        >
          {sidebarOpen ? <X size={12} color="#00d4ff" /> : <Menu size={12} color="#00d4ff" />}
        </button>

        <AnimatePresence>
          {sidebarOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col h-full"
            >
              {/* Logo area */}
              <div className="px-5 pt-6 pb-4" style={{ borderBottom: "1px solid rgba(0,212,255,0.08)" }}>
                <div className="flex items-center gap-3 mb-3">
                  <div className="relative w-10 h-10 flex-shrink-0">
                    <div className="absolute inset-0 rounded-xl flex items-center justify-center"
                      style={{ background: "linear-gradient(135deg, #00d4ff22, #bf5af222)", border: "1px solid rgba(0,212,255,0.3)" }}>
                      <Phone size={18} color="#00d4ff" />
                    </div>
                    <div className="absolute -top-0.5 -right-0.5 w-3 h-3 rounded-full flex items-center justify-center"
                      style={{ background: "#30d158", boxShadow: "0 0 6px #30d158" }}>
                    </div>
                  </div>
                  <div>
                    <div className="holographic-text text-sm tracking-widest" style={{ letterSpacing: "0.15em" }}>VOIP</div>
                    <div className="text-xs" style={{ color: "#6e6e80" }}>Mother Platform v2.0</div>
                  </div>
                </div>

                {/* Mother number */}
                <div className="rounded-lg p-2.5 mt-2" style={{ background: "rgba(0,212,255,0.05)", border: "1px solid rgba(0,212,255,0.1)" }}>
                  <div className="text-xs mb-1" style={{ color: "#4e4e60" }}>شماره مادر</div>
                  <div className="text-sm font-mono flex items-center gap-2" style={{ color: "#00d4ff" }}>
                    <div className="w-2 h-2 rounded-full status-dot-available" />
                    {MOTHER_NUMBER}
                  </div>
                  <div className="text-xs mt-0.5" style={{ color: "#4e4e60" }}>SERVER: {SERVER_IP}:5060</div>
                </div>
              </div>

              {/* Waveform visualizer */}
              <div className="px-5 py-3 flex items-end gap-0.5 h-10" style={{ borderBottom: "1px solid rgba(0,212,255,0.05)" }}>
                {waveValues.map((v, i) => (
                  <div key={i} className="flex-1 rounded-sm transition-all duration-150"
                    style={{
                      height: `${Math.max(2, v * 0.28)}px`,
                      background: i % 3 === 0 ? "#00d4ff" : i % 3 === 1 ? "#bf5af2" : "#30d158",
                      opacity: 0.6
                    }}
                  />
                ))}
              </div>

              {/* Navigation */}
              <nav className="flex-1 px-3 py-3 overflow-y-auto">
                <div className="text-xs px-2 mb-2" style={{ color: "#3e3e50", letterSpacing: "0.1em" }}>NAVIGATION</div>
                {navItems.map((item) => (
                  <NavLink
                    key={item.to}
                    to={item.to}
                    end={item.to === "/"}
                    className={({ isActive }) =>
                      `sidebar-nav-item flex items-center gap-3 px-3 py-2.5 rounded-lg mb-1 relative ${isActive ? "active" : ""}`
                    }
                    style={({ isActive }) => ({
                      color: isActive ? "#00d4ff" : "#8e8ea0",
                      background: isActive ? "rgba(0,212,255,0.08)" : "transparent",
                    })}
                  >
                    {({ isActive }) => (
                      <>
                        <item.icon size={16} style={{ flexShrink: 0, color: isActive ? "#00d4ff" : "#6e6e80" }} />
                        <span className="text-sm flex-1">{item.label}</span>
                        {item.badge && (
                          <span className="text-xs px-1.5 py-0.5 rounded-full"
                            style={{ background: "rgba(0,212,255,0.2)", color: "#00d4ff", border: "1px solid rgba(0,212,255,0.3)" }}>
                            {item.badge}
                          </span>
                        )}
                        {isActive && (
                          <motion.div
                            layoutId="nav-indicator"
                            className="absolute right-0 top-1/2 -translate-y-1/2 w-0.5 h-8 rounded-l"
                            style={{ background: "#00d4ff", boxShadow: "0 0 8px #00d4ff" }}
                          />
                        )}
                      </>
                    )}
                  </NavLink>
                ))}
              </nav>

              {/* Server status */}
              <div className="px-4 py-4" style={{ borderTop: "1px solid rgba(0,212,255,0.08)" }}>
                <div className="rounded-lg p-3" style={{ background: "rgba(48,209,88,0.05)", border: "1px solid rgba(48,209,88,0.1)" }}>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <Server size={13} style={{ color: "#30d158" }} />
                      <span className="text-xs" style={{ color: "#30d158" }}>Asterisk Server</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <div className="w-1.5 h-1.5 rounded-full" style={{ background: "#30d158", boxShadow: "0 0 4px #30d158" }} />
                      <span className="text-xs" style={{ color: "#30d158" }}>ONLINE</span>
                    </div>
                  </div>
                  <div className="text-xs" style={{ color: "#4e4e60" }}>
                    <div>{formatTime(currentTime)}</div>
                    <div className="mt-0.5">SIP/IAX2 Ready</div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden relative z-10">
        {/* Top header */}
        <header className="flex items-center justify-between px-6 py-3 flex-shrink-0"
          style={{
            background: "rgba(5,5,16,0.8)",
            borderBottom: "1px solid rgba(0,212,255,0.08)",
            backdropFilter: "blur(20px)"
          }}>
          <div className="flex items-center gap-4">
            {!sidebarOpen && (
              <button onClick={() => setSidebarOpen(true)} className="p-1.5 rounded-lg" style={{ color: "#00d4ff" }}>
                <Menu size={18} />
              </button>
            )}
            <div>
              <div className="text-sm" style={{ color: "#8e8ea0" }}>
                {navItems.find(item =>
                  item.to === "/" ? location.pathname === "/" :
                    location.pathname.startsWith(item.to)
                )?.label || "داشبورد"}
              </div>
              <div className="text-xs" style={{ color: "#4e4e60" }}>
                {navItems.find(item =>
                  item.to === "/" ? location.pathname === "/" :
                    location.pathname.startsWith(item.to)
                )?.labelEn || "Dashboard"}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-4">
            {/* Live stats bar */}
            <div className="flex items-center gap-4 text-xs" style={{ color: "#6e6e80" }}>
              <div className="flex items-center gap-1.5">
                <Activity size={12} style={{ color: "#00d4ff" }} />
                <span style={{ color: "#00d4ff" }}>4</span>
                <span>تماس فعال</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Users size={12} style={{ color: "#30d158" }} />
                <span style={{ color: "#30d158" }}>7</span>
                <span>آنلاین</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Wifi size={12} style={{ color: serverOnline ? "#30d158" : "#ff375f" }} />
                <span style={{ color: serverOnline ? "#30d158" : "#ff375f" }}>
                  {serverOnline ? "متصل" : "قطع"}
                </span>
              </div>
            </div>

            {/* Notification bell */}
            <button className="relative p-2 rounded-lg" style={{ background: "rgba(0,212,255,0.05)", border: "1px solid rgba(0,212,255,0.1)" }}>
              <Bell size={15} style={{ color: "#00d4ff" }} />
              <div className="absolute -top-0.5 -right-0.5 w-3 h-3 rounded-full flex items-center justify-center text-xs"
                style={{ background: "#ff375f", color: "#fff", fontSize: "8px" }}>3</div>
            </button>

            {/* Clock */}
            <div className="text-xs font-mono px-3 py-1.5 rounded-lg"
              style={{ background: "rgba(0,212,255,0.05)", border: "1px solid rgba(0,212,255,0.08)", color: "#00d4ff" }}>
              {formatTime(currentTime)}
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={location.pathname}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="h-full"
            >
              <Outlet />
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
}
