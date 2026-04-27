import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Phone, PhoneOff, Mic, MicOff, Volume2, VolumeX,
  Pause, Play, RotateCcw, ArrowRightLeft, Radio,
  Clock, Activity, Wifi, PhoneCall
} from "lucide-react";
import { activeCalls as initialCalls, formatDuration, type ActiveCall } from "../data/voipData";
import { useAppStore } from "../store/useAppStore";
import { sipService } from "../services/sipManager";

const stateConfig = {
  connected: { label: "متصل", color: "#30d158", bg: "#30d15815" },
  ringing: { label: "زنگ می‌زند", color: "#00d4ff", bg: "#00d4ff15" },
  on_hold: { label: "در انتظار", color: "#ff9f0a", bg: "#ff9f0a15" },
  connecting: { label: "در حال اتصال", color: "#bf5af2", bg: "#bf5af215" },
  transferring: { label: "انتقال", color: "#ff375f", bg: "#ff375f15" },
};

function WaveformDisplay({ active, color }: { active: boolean; color: string }) {
  const [bars, setBars] = useState<number[]>(Array(16).fill(4));

  useEffect(() => {
    if (!active) return;
    const interval = setInterval(() => {
      setBars(Array.from({ length: 16 }, (_, i) => {
        const base = Math.sin(Date.now() / 200 + i * 0.5) * 30 + 40;
        return Math.max(4, base + Math.random() * 20 - 10);
      }));
    }, 80);
    return () => clearInterval(interval);
  }, [active]);

  return (
    <div className="flex items-end gap-0.5 h-8">
      {bars.map((h, i) => (
        <div
          key={i}
          className="flex-1 rounded-full transition-all"
          style={{
            height: `${active ? h : 15}%`,
            background: color,
            opacity: active ? 0.7 : 0.2,
            transitionDuration: active ? "80ms" : "300ms",
          }}
        />
      ))}
    </div>
  );
}

function QualityBar({ value }: { value: number }) {
  const color = value >= 90 ? "#30d158" : value >= 70 ? "#ff9f0a" : "#ff375f";
  return (
    <div className="flex items-center gap-2">
      <div className="flex-1 h-1 rounded-full" style={{ background: "rgba(255,255,255,0.05)" }}>
        <div className="h-full rounded-full transition-all" style={{ width: `${value}%`, background: color }} />
      </div>
      <span className="text-xs" style={{ color }}>{value}%</span>
    </div>
  );
}

function CallCard({ call, onAction }: { call: ActiveCall; onAction: (id: string, action: string) => void }) {
  const [elapsed, setElapsed] = useState(call.duration);
  const cfg = stateConfig[call.state];

  useEffect(() => {
    if (call.state !== "connected") return;
    const interval = setInterval(() => setElapsed(e => e + 1), 1000);
    return () => clearInterval(interval);
  }, [call.state]);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      whileHover={{ y: -2 }}
      className="rounded-xl p-4 relative overflow-hidden"
      style={{
        background: "rgba(10,12,30,0.9)",
        border: `1px solid ${cfg.color}30`,
        boxShadow: call.state === "ringing" ? `0 0 20px ${cfg.color}20` : "none",
      }}
    >
      {/* Animated state indicator */}
      {call.state === "ringing" && (
        <div className="absolute inset-0 rounded-xl" style={{ border: `1px solid ${cfg.color}`, opacity: 0.3, animation: "pulse-neon 1.5s ease-in-out infinite" }} />
      )}

      {/* Recording indicator */}
      {call.isRecording && (
        <div className="absolute top-3 right-3 flex items-center gap-1">
          <div className="w-2 h-2 rounded-full" style={{ background: "#ff375f", animation: "pulse-red 1s ease-in-out infinite" }} />
          <span className="text-xs" style={{ color: "#ff375f" }}>REC</span>
        </div>
      )}

      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className="px-2 py-0.5 rounded-full text-xs"
            style={{ background: cfg.bg, color: cfg.color, border: `1px solid ${cfg.color}30` }}>
            {cfg.label}
          </div>
          <div className="text-xs font-mono" style={{ color: "#6e6e80" }}>
            {formatDuration(elapsed)}
          </div>
        </div>
        <div className="flex items-center gap-1 text-xs" style={{ color: "#4e4e60" }}>
          <Wifi size={10} />
          <span>{call.codec.toUpperCase()}</span>
        </div>
      </div>

      {/* Participants */}
      <div className="flex items-center gap-3 mb-3">
        <div className="flex-1 text-right">
          <div className="text-xs mb-0.5" style={{ color: "#6e6e80" }}>مبدا</div>
          <div className="text-sm" style={{ color: "#e0e0f0" }}>{call.callerName}</div>
          <div className="text-xs font-mono" style={{ color: "#8e8ea0" }}>{call.caller}</div>
        </div>
        <div className="flex flex-col items-center gap-1">
          <div className="w-8 h-8 rounded-full flex items-center justify-center"
            style={{ background: `${cfg.color}15`, border: `1px solid ${cfg.color}30` }}>
            <PhoneCall size={14} style={{ color: cfg.color }} />
          </div>
          <div className="h-px w-8" style={{ background: `linear-gradient(90deg, transparent, ${cfg.color}, transparent)` }} />
        </div>
        <div className="flex-1">
          <div className="text-xs mb-0.5" style={{ color: "#6e6e80" }}>مقصد</div>
          <div className="text-sm" style={{ color: "#e0e0f0" }}>{call.calledName}</div>
          <div className="text-xs font-mono" style={{ color: "#8e8ea0" }}>{call.called}</div>
        </div>
      </div>

      {/* Waveform */}
      <div className="mb-3">
        <WaveformDisplay active={call.state === "connected"} color={cfg.color} />
      </div>

      {/* Quality */}
      <div className="mb-3">
        <div className="flex justify-between text-xs mb-1">
          <span style={{ color: "#6e6e80" }}>کیفیت تماس</span>
        </div>
        <QualityBar value={call.quality} />
      </div>

      {/* Channel info */}
      <div className="text-xs mb-3 px-2 py-1.5 rounded" style={{ background: "rgba(255,255,255,0.02)", color: "#4e4e60" }}>
        <div className="truncate">{call.channel}</div>
        <div className="truncate">{call.dstChannel}</div>
      </div>

      {/* Action buttons */}
      <div className="flex items-center gap-2">
        <button
          onClick={() => onAction(call.id, call.isMuted ? "unmute" : "mute")}
          className="flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-lg text-xs transition-all"
          style={{
            background: call.isMuted ? "rgba(255,55,95,0.15)" : "rgba(255,255,255,0.04)",
            border: `1px solid ${call.isMuted ? "rgba(255,55,95,0.3)" : "rgba(255,255,255,0.06)"}`,
            color: call.isMuted ? "#ff375f" : "#8e8ea0",
          }}
        >
          {call.isMuted ? <MicOff size={12} /> : <Mic size={12} />}
          {call.isMuted ? "بی‌صدا" : "میکروفن"}
        </button>

        <button
          onClick={() => onAction(call.id, call.state === "on_hold" ? "resume" : "hold")}
          className="flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-lg text-xs transition-all"
          style={{
            background: call.state === "on_hold" ? "rgba(255,159,10,0.15)" : "rgba(255,255,255,0.04)",
            border: `1px solid ${call.state === "on_hold" ? "rgba(255,159,10,0.3)" : "rgba(255,255,255,0.06)"}`,
            color: call.state === "on_hold" ? "#ff9f0a" : "#8e8ea0",
          }}
        >
          {call.state === "on_hold" ? <Play size={12} /> : <Pause size={12} />}
          {call.state === "on_hold" ? "��ز سر گیر" : "انتظار"}
        </button>

        <button
          onClick={() => onAction(call.id, "transfer")}
          className="flex items-center justify-center gap-1 py-1.5 px-2 rounded-lg text-xs transition-all"
          style={{ background: "rgba(0,212,255,0.08)", border: "1px solid rgba(0,212,255,0.2)", color: "#00d4ff" }}
        >
          <ArrowRightLeft size={12} />
        </button>

        <button
          onClick={() => onAction(call.id, "hangup")}
          className="flex items-center justify-center gap-1 py-1.5 px-2 rounded-lg text-xs transition-all"
          style={{ background: "rgba(255,55,95,0.15)", border: "1px solid rgba(255,55,95,0.3)", color: "#ff375f" }}
        >
          <PhoneOff size={12} />
        </button>
      </div>
    </motion.div>
  );
}

export function ActiveCalls() {
  const [calls, setCalls] = useState<ActiveCall[]>(initialCalls);
  const [totalTime, setTotalTime] = useState(0);
  const [dialNumber, setDialNumber] = useState("");

  const { isConnected } = useAppStore();

  useEffect(() => {
    const interval = setInterval(() => setTotalTime(t => t + 1), 1000);
    return () => clearInterval(interval);
  }, []);

  const handleAction = (id: string, action: string) => {
    setCalls(prev => prev.map(call => {
      if (call.id !== id) return call;
      switch (action) {
        case "mute": return { ...call, isMuted: true };
        case "unmute": return { ...call, isMuted: false };
        case "hold": return { ...call, state: "on_hold" as const };
        case "resume": return { ...call, state: "connected" as const };
        case "hangup": return { ...call, state: "connecting" as const };
        default: return call;
      }
    }));
  };

  const handleMakeCall = () => {
    if (!dialNumber) return;
    if (isConnected) {
      sipService.makeCall(dialNumber);
    }
    // Add mock active call for UI visualization
    setCalls(prev => [{
      id: Date.now().toString(),
      state: "connecting",
      caller: useAppStore.getState().extension,
      callerName: "شما",
      called: dialNumber,
      calledName: "در حال تماس...",
      duration: 0,
      codec: "opus",
      quality: 100,
      isMuted: false,
      isRecording: false,
      channel: `SIP/${useAppStore.getState().extension}-000000${Math.floor(Math.random() * 100)}`,
      dstChannel: `SIP/${dialNumber}-000000${Math.floor(Math.random() * 100)}`
    }, ...prev]);
    setDialNumber("");
  };

  const connected = calls.filter(c => c.state === "connected").length;
  const ringing = calls.filter(c => c.state === "ringing" || c.state === "connecting").length;
  const onHold = calls.filter(c => c.state === "on_hold").length;

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-lg mb-0.5" style={{ color: "#e0e0f0" }}>تماس‌های فعال</h1>
          <p className="text-xs" style={{ color: "#6e6e80" }}>مانیتورینگ و کنترل تماس‌های جاری</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs"
            style={{ background: "rgba(48,209,88,0.1)", border: "1px solid rgba(48,209,88,0.2)", color: "#30d158" }}>
            <Activity size={12} />
            <span>{connected} متصل</span>
          </div>
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs"
            style={{ background: "rgba(0,212,255,0.1)", border: "1px solid rgba(0,212,255,0.2)", color: "#00d4ff" }}>
            <Phone size={12} />
            <span>{ringing} زنگ</span>
          </div>
          {onHold > 0 && (
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs"
              style={{ background: "rgba(255,159,10,0.1)", border: "1px solid rgba(255,159,10,0.2)", color: "#ff9f0a" }}>
              <Pause size={12} />
              <span>{onHold} انتظار</span>
            </div>
          )}
        </div>
      </div>

      {/* Live system stats */}
      <div className="grid grid-cols-4 gap-3 mb-6">
        {[
          { label: "کانال‌های فعال", value: calls.length, icon: Radio, color: "#00d4ff" },
          { label: "مجموع زمان", value: formatDuration(1024 + totalTime), icon: Clock, color: "#bf5af2" },
          { label: "پهنای باند", value: "2.4 Mbps", icon: Wifi, color: "#30d158" },
          { label: "کیفیت میانگین", value: "93%", icon: Activity, color: "#ff9f0a" },
        ].map((stat) => (
          <div key={stat.label} className="rounded-lg p-3 flex items-center gap-3"
            style={{ background: "rgba(10,12,30,0.8)", border: `1px solid ${stat.color}15` }}>
            <div className="p-2 rounded-lg" style={{ background: `${stat.color}15` }}>
              <stat.icon size={14} style={{ color: stat.color }} />
            </div>
            <div>
              <div className="text-sm stat-value" style={{ color: "#e0e0f0" }}>{stat.value}</div>
              <div className="text-xs" style={{ color: "#6e6e80" }}>{stat.label}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Calls grid */}
      <AnimatePresence>
        {calls.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col items-center justify-center py-20"
          >
            <div className="w-20 h-20 rounded-full flex items-center justify-center mb-4"
              style={{ background: "rgba(0,212,255,0.05)", border: "1px solid rgba(0,212,255,0.1)" }}>
              <Phone size={32} style={{ color: "#4e4e60" }} />
            </div>
            <p className="text-sm" style={{ color: "#6e6e80" }}>هیچ تماس فعالی وجود ندارد</p>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-2 gap-4">
            {calls.map((call) => (
              <CallCard key={call.id} call={call} onAction={handleAction} />
            ))}
          </div>
        )}
      </AnimatePresence>

        {/* Make new call panel */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mt-6 rounded-xl p-4"
          style={{ background: "rgba(10,12,30,0.8)", border: "1px solid rgba(0,212,255,0.1)" }}
        >
          <h3 className="text-sm mb-3" style={{ color: "#e0e0f0" }}>تماس جدید</h3>
          <div className="flex gap-3">
            <input
              value={dialNumber}
              onChange={(e) => setDialNumber(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleMakeCall()}
              className="flex-1 px-3 py-2 rounded-lg text-sm outline-none font-mono"
              placeholder="شماره یا داخلی..."
              style={{
                background: "rgba(255,255,255,0.04)",
                border: "1px solid rgba(0,212,255,0.15)",
                color: "#e0e0f0",
              }}
            />
            <button 
              onClick={handleMakeCall}
              disabled={!dialNumber}
              className="px-4 py-2 rounded-lg text-sm flex items-center gap-2 transition-all disabled:opacity-50"
              style={{ background: "linear-gradient(135deg, #00d4ff20, #00d4ff10)", border: "1px solid rgba(0,212,255,0.3)", color: "#00d4ff" }}>
              <Phone size={14} />
              برقراری تماس
            </button>
          </div>

          {/* Quick dial */}
          <div className="flex flex-wrap gap-2 mt-3">
            {["100", "101", "102", "103", "104", "105"].map(ext => (
              <button 
                key={ext} 
                onClick={() => setDialNumber(ext)}
                className="px-3 py-1 rounded-lg text-xs transition-all hover:bg-white/10"
                style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)", color: "#8e8ea0" }}>
                {ext}
              </button>
            ))}
          </div>
        </motion.div>
    </div>
  );
}
