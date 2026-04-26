import { useState, useEffect } from "react";
import { motion } from "motion/react";
import {
  AreaChart, Area, PieChart, Pie, Cell, ResponsiveContainer,
  Tooltip, XAxis, YAxis, CartesianGrid
} from "recharts";
import {
  Phone, PhoneIncoming, PhoneOutgoing, PhoneMissed,
  Users, Clock, Activity, TrendingUp, Server, Wifi,
  Shield, Voicemail, GitBranch, Zap, Database, Cpu
} from "lucide-react";
import {
  extensions, activeCalls, callHistory, callVolumeData,
  codecDistribution, MOTHER_NUMBER, SERVER_IP, formatDuration
} from "../data/voipData";

const StatCard = ({ icon: Icon, label, value, sublabel, color, trend }: any) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    whileHover={{ scale: 1.02, y: -2 }}
    className="rounded-xl p-4 relative overflow-hidden cursor-pointer"
    style={{
      background: "rgba(10,12,30,0.8)",
      border: `1px solid ${color}22`,
      backdropFilter: "blur(20px)",
    }}
  >
    <div className="absolute inset-0 opacity-5"
      style={{ background: `radial-gradient(ellipse at top left, ${color}, transparent)` }} />
    <div className="relative z-10">
      <div className="flex items-start justify-between mb-3">
        <div className="p-2 rounded-lg" style={{ background: `${color}15`, border: `1px solid ${color}30` }}>
          <Icon size={18} style={{ color }} />
        </div>
        {trend && (
          <div className="flex items-center gap-1 text-xs px-2 py-0.5 rounded-full"
            style={{ background: `${color}15`, color }}>
            <TrendingUp size={10} />
            {trend}
          </div>
        )}
      </div>
      <div className="text-2xl stat-value mb-0.5" style={{ color: "#fff" }}>{value}</div>
      <div className="text-xs" style={{ color: "#8e8ea0" }}>{label}</div>
      {sublabel && <div className="text-xs mt-0.5" style={{ color }}>{sublabel}</div>}
    </div>
  </motion.div>
);

export function Dashboard() {
  const [tick, setTick] = useState(0);
  const [waveData, setWaveData] = useState<number[]>([]);

  useEffect(() => {
    const interval = setInterval(() => {
      setTick(t => t + 1);
      setWaveData(Array.from({ length: 30 }, () => Math.random() * 80 + 20));
    }, 500);
    return () => clearInterval(interval);
  }, []);

  const onlineCount = extensions.filter(e => e.status !== "offline").length;
  const availableCount = extensions.filter(e => e.status === "available").length;
  const busyCount = extensions.filter(e => e.status === "busy").length;
  const answeredCalls = callHistory.filter(c => c.disposition === "ANSWERED").length;
  const totalDuration = callHistory.reduce((sum, c) => sum + c.billsec, 0);

  const statusColors: Record<string, string> = {
    available: "#30d158",
    busy: "#ff375f",
    dnd: "#ff9f0a",
    offline: "#6e6e73",
    ringing: "#00d4ff",
  };

  return (
    <div className="p-6 min-h-full">
      {/* Header */}
      <div className="mb-6">
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
          <h1 className="holographic-text mb-1" style={{ fontSize: "1.5rem" }}>
            داشبورد مرکز VOIP مادر
          </h1>
          <p className="text-sm" style={{ color: "#6e6e80" }}>
            سرور: {SERVER_IP} | شماره مادر: {MOTHER_NUMBER} | Asterisk 18.18
          </p>
        </motion.div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard icon={PhoneIncoming} label="تماس‌های فعال" value={activeCalls.length} sublabel="در حال مکالمه" color="#00d4ff" trend="+2" />
        <StatCard icon={Users} label="کاربران آنلاین" value={`${onlineCount}/10`} sublabel={`${availableCount} آماده`} color="#30d158" trend="↑87%" />
        <StatCard icon={Phone} label="تماس امروز" value="84" sublabel={`${answeredCalls} پاسخ داده`} color="#bf5af2" trend="+12%" />
        <StatCard icon={Clock} label="مجموع دقایق" value={Math.round(totalDuration / 60)} sublabel="دقیقه امروز" color="#ff9f0a" trend="+8%" />
      </div>

      {/* Secondary stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard icon={Voicemail} label="پیام صوتی جدید" value="3" sublabel="خوانده نشده" color="#ff375f" />
        <StatCard icon={GitBranch} label="کنفرانس فعال" value="1" sublabel="3 شرکت‌کننده" color="#00d4ff" />
        <StatCard icon={Shield} label="حملات مسدود" value="2" sublabel="در 24 ساعت" color="#ff9f0a" />
        <StatCard icon={Database} label="ضبط‌های ذخیره" value="47" sublabel="فایل صوتی" color="#30d158" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-4">
        {/* Call volume chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="lg:col-span-2 rounded-xl p-4"
          style={{ background: "rgba(10,12,30,0.8)", border: "1px solid rgba(0,212,255,0.1)", backdropFilter: "blur(20px)" }}
        >
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm" style={{ color: "#e0e0f0" }}>حجم تماس‌ها - امروز</h3>
              <p className="text-xs" style={{ color: "#6e6e80" }}>ورودی و خروجی</p>
            </div>
            <div className="flex items-center gap-4 text-xs">
              <div className="flex items-center gap-1.5">
                <div className="w-2 h-2 rounded-full" style={{ background: "#00d4ff" }} />
                <span style={{ color: "#8e8ea0" }}>ورودی</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-2 h-2 rounded-full" style={{ background: "#bf5af2" }} />
                <span style={{ color: "#8e8ea0" }}>خروجی</span>
              </div>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={180}>
            <AreaChart data={callVolumeData} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="gradCyan" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#00d4ff" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#00d4ff" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="gradViolet" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#bf5af2" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#bf5af2" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
              <XAxis dataKey="time" stroke="#4e4e60" tick={{ fontSize: 10, fill: "#6e6e80" }} />
              <YAxis stroke="#4e4e60" tick={{ fontSize: 10, fill: "#6e6e80" }} />
              <Tooltip
                contentStyle={{ background: "rgba(10,12,30,0.95)", border: "1px solid rgba(0,212,255,0.2)", borderRadius: "8px", color: "#e0e0f0" }}
              />
              <Area type="monotone" dataKey="incoming" stroke="#00d4ff" fill="url(#gradCyan)" strokeWidth={2} />
              <Area type="monotone" dataKey="outgoing" stroke="#bf5af2" fill="url(#gradViolet)" strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Codec distribution */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="rounded-xl p-4"
          style={{ background: "rgba(10,12,30,0.8)", border: "1px solid rgba(0,212,255,0.1)", backdropFilter: "blur(20px)" }}
        >
          <h3 className="text-sm mb-1" style={{ color: "#e0e0f0" }}>توزیع کدک</h3>
          <p className="text-xs mb-4" style={{ color: "#6e6e80" }}>پروتکل‌های صوتی</p>
          <ResponsiveContainer width="100%" height={140}>
            <PieChart>
              <Pie data={codecDistribution} cx="50%" cy="50%" innerRadius={40} outerRadius={65}
                dataKey="value" paddingAngle={3}>
                {codecDistribution.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} stroke="transparent" />
                ))}
              </Pie>
              <Tooltip contentStyle={{ background: "rgba(10,12,30,0.95)", border: "1px solid rgba(0,212,255,0.2)", borderRadius: "8px", color: "#e0e0f0", fontSize: "12px" }} />
            </PieChart>
          </ResponsiveContainer>
          <div className="space-y-1.5 mt-2">
            {codecDistribution.map((item) => (
              <div key={item.name} className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full" style={{ background: item.color }} />
                  <span style={{ color: "#8e8ea0" }}>{item.name}</span>
                </div>
                <span style={{ color: "#e0e0f0" }}>{item.value}%</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Extensions status grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="rounded-xl p-4"
          style={{ background: "rgba(10,12,30,0.8)", border: "1px solid rgba(0,212,255,0.1)", backdropFilter: "blur(20px)" }}
        >
          <h3 className="text-sm mb-3" style={{ color: "#e0e0f0" }}>وضعیت داخلی‌ها</h3>
          <div className="grid grid-cols-5 gap-2">
            {extensions.map((ext) => (
              <div key={ext.id} className="flex flex-col items-center gap-1.5 p-2 rounded-lg"
                style={{ background: "rgba(255,255,255,0.02)", border: `1px solid ${statusColors[ext.status]}20` }}>
                <div className="relative">
                  <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs"
                    style={{ background: `${statusColors[ext.status]}15`, color: statusColors[ext.status] }}>
                    {ext.extension}
                  </div>
                  <div className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full border"
                    style={{
                      background: statusColors[ext.status],
                      borderColor: "#050510",
                      boxShadow: `0 0 4px ${statusColors[ext.status]}`
                    }} />
                </div>
                <div className="text-xs truncate w-full text-center" style={{ color: "#6e6e80", fontSize: "9px" }}>
                  {ext.name.replace("کاربر ", "")}
                </div>
              </div>
            ))}
          </div>
          <div className="flex items-center gap-4 mt-3 text-xs">
            {[
              { label: "آماده", color: "#30d158", count: availableCount },
              { label: "مشغول", color: "#ff375f", count: busyCount },
              { label: "DND", color: "#ff9f0a", count: 1 },
              { label: "آفلاین", color: "#6e6e73", count: 1 },
            ].map(s => (
              <div key={s.label} className="flex items-center gap-1">
                <div className="w-1.5 h-1.5 rounded-full" style={{ background: s.color }} />
                <span style={{ color: "#6e6e80" }}>{s.label} ({s.count})</span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Recent calls */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
          className="rounded-xl p-4"
          style={{ background: "rgba(10,12,30,0.8)", border: "1px solid rgba(0,212,255,0.1)", backdropFilter: "blur(20px)" }}
        >
          <h3 className="text-sm mb-3" style={{ color: "#e0e0f0" }}>آخرین تماس‌ها</h3>
          <div className="space-y-2">
            {callHistory.slice(0, 5).map((call) => {
              const isAnswered = call.disposition === "ANSWERED";
              const isMissed = call.disposition === "NO ANSWER";
              const isBusy = call.disposition === "BUSY";
              const color = isAnswered ? "#30d158" : isMissed ? "#ff375f" : "#ff9f0a";
              const Icon = isAnswered ? PhoneIncoming : isMissed ? PhoneMissed : PhoneOutgoing;
              return (
                <div key={call.id} className="flex items-center gap-3 py-1.5">
                  <div className="p-1.5 rounded-lg" style={{ background: `${color}15` }}>
                    <Icon size={12} style={{ color }} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1">
                      <span className="text-xs truncate" style={{ color: "#e0e0f0" }}>{call.srcName}</span>
                      <span className="text-xs" style={{ color: "#4e4e60" }}>→</span>
                      <span className="text-xs truncate" style={{ color: "#8e8ea0" }}>{call.dstName}</span>
                    </div>
                    <div className="text-xs" style={{ color: "#4e4e60" }}>
                      {new Date(call.calldate).toLocaleTimeString("fa-IR", { hour: "2-digit", minute: "2-digit" })}
                    </div>
                  </div>
                  <div className="text-xs text-right">
                    <div style={{ color }}>{isAnswered ? formatDuration(call.billsec) : call.disposition === "BUSY" ? "مشغول" : "بی‌پاسخ"}</div>
                    {call.recordingAvailable && (
                      <div className="text-xs mt-0.5" style={{ color: "#4e4e60" }}>• ضبط</div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </motion.div>
      </div>

      {/* Live waveform bar at bottom */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="mt-4 rounded-xl p-3 flex items-center gap-3"
        style={{ background: "rgba(10,12,30,0.8)", border: "1px solid rgba(0,212,255,0.08)" }}
      >
        <div className="flex items-center gap-1.5 flex-shrink-0">
          <Zap size={14} style={{ color: "#00d4ff" }} />
          <span className="text-xs" style={{ color: "#6e6e80" }}>Audio Stream Live</span>
        </div>
        <div className="flex-1 flex items-end gap-0.5 h-8">
          {waveData.map((v, i) => (
            <div
              key={i}
              className="flex-1 rounded-sm transition-all duration-200"
              style={{
                height: `${v}%`,
                background: `hsl(${190 + i * 3}, 90%, 60%)`,
                opacity: 0.7,
              }}
            />
          ))}
        </div>
        <div className="flex items-center gap-3 flex-shrink-0 text-xs">
          <div style={{ color: "#30d158" }}><Cpu size={12} className="inline mr-1" />SIP OK</div>
          <div style={{ color: "#00d4ff" }}><Wifi size={12} className="inline mr-1" />RTP OK</div>
          <div style={{ color: "#bf5af2" }}><Activity size={12} className="inline mr-1" />Q:98%</div>
        </div>
      </motion.div>
    </div>
  );
}
