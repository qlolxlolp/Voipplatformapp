import { useState } from "react";
import { motion } from "motion/react";
import {
  Shield, Ban, AlertTriangle, CheckCircle2, XCircle,
  Globe, User, Clock, Activity, Lock, Unlock, Eye, RefreshCw,
  Zap, Database
} from "lucide-react";
import { securityLogs, type SecurityLog } from "../data/voipData";

const eventConfig = {
  REGISTER_OK: { label: "ثبت‌نام موفق", color: "#30d158", Icon: CheckCircle2 },
  AUTH_FAIL: { label: "احراز هویت ناموفق", color: "#ff375f", Icon: XCircle },
  SCAN: { label: "اسکن شناسایی شد", color: "#ff9f0a", Icon: Eye },
  BAN: { label: "مسدودسازی IP", color: "#ff375f", Icon: Ban },
  REGISTER: { label: "ثبت‌نام", color: "#00d4ff", Icon: CheckCircle2 },
};

function SecurityLogRow({ log, index }: { log: SecurityLog; index: number }) {
  const cfg = eventConfig[log.event_type];

  return (
    <motion.div
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.04 }}
      className="flex items-center gap-3 px-4 py-3 rounded-lg"
      style={{
        background: "rgba(255,255,255,0.01)",
        border: `1px solid ${log.success ? "rgba(255,255,255,0.03)" : "rgba(255,55,95,0.06)"}`,
      }}
    >
      <div className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0"
        style={{ background: `${cfg.color}15` }}>
        <cfg.Icon size={13} style={{ color: cfg.color }} />
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className="text-xs" style={{ color: cfg.color }}>{cfg.label}</span>
        </div>
        <div className="text-xs mt-0.5" style={{ color: "#6e6e80" }}>{log.details}</div>
      </div>

      <div className="flex items-center gap-1.5 flex-shrink-0 text-xs" style={{ color: "#6e6e80" }}>
        <Globe size={10} />
        <span className="font-mono">{log.ip_address}</span>
      </div>

      <div className="flex items-center gap-1.5 flex-shrink-0 text-xs" style={{ color: "#6e6e80" }}>
        <User size={10} />
        <span className="font-mono">{log.username}</span>
      </div>

      <div className="text-xs flex-shrink-0" style={{ color: "#4e4e60" }}>
        {new Date(log.event_time).toLocaleTimeString("fa-IR")}
      </div>
    </motion.div>
  );
}

const blockedIPs = [
  { ip: "45.89.123.55", reason: "حملات متعدد SIP", blocked: "10 دقیقه پیش", attacks: 47 },
  { ip: "185.220.101.42", reason: "اسکن پورت", blocked: "2 ساعت پیش", attacks: 12 },
  { ip: "91.230.11.5", reason: "AUTH FAIL متعدد", blocked: "5 ساعت پیش", attacks: 23 },
];

export function Security() {
  const [bannedIPs, setBannedIPs] = useState(blockedIPs);

  const removeBan = (ip: string) => {
    setBannedIPs(prev => prev.filter(b => b.ip !== ip));
  };

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-lg mb-0.5" style={{ color: "#e0e0f0" }}>امنیت سیستم</h1>
          <p className="text-xs" style={{ color: "#6e6e80" }}>Security Log | Fail2Ban | Firewall Rules</p>
        </div>
        <div className="flex items-center gap-2">
          <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs"
            style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.06)", color: "#8e8ea0" }}>
            <RefreshCw size={11} />
            بروزرسانی
          </button>
        </div>
      </div>

      {/* Security stats */}
      <div className="grid grid-cols-4 gap-3 mb-5">
        {[
          { label: "IP مسدود", value: bannedIPs.length, icon: Ban, color: "#ff375f" },
          { label: "حمله امروز", value: "82", icon: AlertTriangle, color: "#ff9f0a" },
          { label: "ثبت‌نام موفق", value: "47", icon: CheckCircle2, color: "#30d158" },
          { label: "احراز ناموفق", value: "35", icon: XCircle, color: "#ff375f" },
        ].map(stat => (
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

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Security logs */}
        <div className="lg:col-span-2">
          <div className="rounded-xl p-4"
            style={{ background: "rgba(10,12,30,0.8)", border: "1px solid rgba(0,212,255,0.1)" }}>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-xs" style={{ color: "#8e8ea0", letterSpacing: "0.08em" }}>SECURITY LOG - امروز</h3>
              <div className="flex items-center gap-1.5 text-xs" style={{ color: "#30d158" }}>
                <div className="w-1.5 h-1.5 rounded-full" style={{ background: "#30d158", animation: "pulse-green 2s ease-in-out infinite" }} />
                Live
              </div>
            </div>

            {/* Header */}
            <div className="flex items-center gap-3 px-4 py-1.5 text-xs mb-2"
              style={{ color: "#4e4e60", borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
              <div className="w-7" />
              <div className="flex-1">رویداد / جزئیات</div>
              <div className="w-28">IP آدرس</div>
              <div className="w-16">کاربر</div>
              <div className="w-16">زمان</div>
            </div>

            <div className="space-y-1">
              {securityLogs.map((log, i) => (
                <SecurityLogRow key={log.id} log={log} index={i} />
              ))}
            </div>
          </div>

          {/* TLS/Encryption status */}
          <div className="mt-4 rounded-xl p-4"
            style={{ background: "rgba(10,12,30,0.8)", border: "1px solid rgba(48,209,88,0.1)" }}>
            <h3 className="text-xs mb-3" style={{ color: "#8e8ea0", letterSpacing: "0.08em" }}>ENCRYPTION STATUS</h3>
            <div className="grid grid-cols-2 gap-3">
              {[
                { label: "TLS SIP", status: "فعال", port: "5061", color: "#30d158" },
                { label: "SRTP", status: "فعال", port: "N/A", color: "#30d158" },
                { label: "WebRTC/WSS", status: "فعال", port: "8443", color: "#30d158" },
                { label: "IAX2 Encrypt", status: "فعال", port: "4569", color: "#30d158" },
              ].map(enc => (
                <div key={enc.label} className="flex items-center justify-between p-2.5 rounded-lg"
                  style={{ background: "rgba(48,209,88,0.05)", border: "1px solid rgba(48,209,88,0.1)" }}>
                  <div>
                    <div className="text-xs" style={{ color: "#e0e0f0" }}>{enc.label}</div>
                    <div className="text-xs" style={{ color: "#4e4e60" }}>Port: {enc.port}</div>
                  </div>
                  <div className="flex items-center gap-1 text-xs" style={{ color: enc.color }}>
                    <Lock size={10} />
                    {enc.status}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right panel */}
        <div className="space-y-4">
          {/* Blocked IPs */}
          <div className="rounded-xl p-4"
            style={{ background: "rgba(10,12,30,0.8)", border: "1px solid rgba(255,55,95,0.15)" }}>
            <div className="flex items-center gap-2 mb-3">
              <Ban size={13} style={{ color: "#ff375f" }} />
              <h3 className="text-xs" style={{ color: "#ff375f", letterSpacing: "0.08em" }}>IP های مسدود</h3>
            </div>
            <div className="space-y-2">
              {bannedIPs.map(ban => (
                <div key={ban.ip} className="p-3 rounded-lg"
                  style={{ background: "rgba(255,55,95,0.05)", border: "1px solid rgba(255,55,95,0.1)" }}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-mono" style={{ color: "#e0e0f0" }}>{ban.ip}</span>
                    <button
                      onClick={() => removeBan(ban.ip)}
                      className="text-xs px-2 py-0.5 rounded"
                      style={{ background: "rgba(48,209,88,0.1)", color: "#30d158" }}>
                      رفع
                    </button>
                  </div>
                  <div className="text-xs" style={{ color: "#6e6e80" }}>{ban.reason}</div>
                  <div className="flex items-center justify-between mt-1">
                    <span className="text-xs" style={{ color: "#4e4e60" }}>{ban.blocked}</span>
                    <span className="text-xs" style={{ color: "#ff375f" }}>{ban.attacks} حمله</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Manual ban input */}
            <div className="mt-3 flex gap-2">
              <input
                className="flex-1 px-2 py-1.5 rounded-lg text-xs outline-none"
                placeholder="IP آدرس برای مسدودسازی..."
                style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,55,95,0.15)", color: "#e0e0f0" }}
              />
              <button className="px-3 py-1.5 rounded-lg text-xs"
                style={{ background: "rgba(255,55,95,0.15)", border: "1px solid rgba(255,55,95,0.25)", color: "#ff375f" }}>
                <Ban size={11} />
              </button>
            </div>
          </div>

          {/* Fail2Ban config */}
          <div className="rounded-xl p-4"
            style={{ background: "rgba(10,12,30,0.8)", border: "1px solid rgba(0,212,255,0.1)" }}>
            <div className="flex items-center gap-2 mb-3">
              <Shield size={13} style={{ color: "#00d4ff" }} />
              <h3 className="text-xs" style={{ color: "#8e8ea0", letterSpacing: "0.08em" }}>FAIL2BAN CONFIG</h3>
            </div>
            <div className="space-y-2">
              {[
                { label: "حداکثر تلاش", value: "5", editable: true },
                { label: "مدت مسدودی", value: "86400s", editable: true },
                { label: "پنجره زمانی", value: "600s", editable: true },
                { label: "Whitelist", value: "192.168.1.0/24", editable: true },
              ].map(conf => (
                <div key={conf.label} className="flex items-center justify-between text-xs py-1"
                  style={{ borderBottom: "1px solid rgba(255,255,255,0.03)" }}>
                  <span style={{ color: "#6e6e80" }}>{conf.label}</span>
                  <span className="font-mono" style={{ color: "#00d4ff" }}>{conf.value}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Real-time threats */}
          <div className="rounded-xl p-4"
            style={{ background: "rgba(10,12,30,0.8)", border: "1px solid rgba(255,159,10,0.1)" }}>
            <div className="flex items-center gap-2 mb-3">
              <Activity size={13} style={{ color: "#ff9f0a" }} />
              <h3 className="text-xs" style={{ color: "#8e8ea0", letterSpacing: "0.08em" }}>تهدیدات لحظه‌ای</h3>
            </div>
            <div className="space-y-2">
              {[
                { type: "SIP Scanning", level: "متوسط", count: 3 },
                { type: "Brute Force", level: "پایین", count: 1 },
              ].map(threat => (
                <div key={threat.type} className="flex items-center justify-between p-2 rounded-lg"
                  style={{ background: "rgba(255,159,10,0.05)", border: "1px solid rgba(255,159,10,0.1)" }}>
                  <div>
                    <div className="text-xs" style={{ color: "#e0e0f0" }}>{threat.type}</div>
                    <div className="text-xs" style={{ color: "#ff9f0a" }}>{threat.level}</div>
                  </div>
                  <div className="text-sm" style={{ color: "#ff9f0a" }}>{threat.count}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
