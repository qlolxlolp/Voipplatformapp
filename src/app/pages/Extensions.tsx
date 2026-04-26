import { useState } from "react";
import { motion } from "motion/react";
import {
  Users, Phone, Voicemail, Plus, Search, Edit,
  Trash2, Copy, MoreHorizontal, Shield, Clock, MessageSquare
} from "lucide-react";
import { extensions, type Extension } from "../data/voipData";

const statusConfig = {
  available: { label: "آماده", color: "#30d158", dotClass: "status-dot-available" },
  busy: { label: "مشغول", color: "#ff375f", dotClass: "status-dot-busy" },
  dnd: { label: "مزاحم نشوید", color: "#ff9f0a", dotClass: "status-dot-dnd" },
  offline: { label: "آفلاین", color: "#6e6e73", dotClass: "status-dot-offline" },
  ringing: { label: "زنگ می‌خورد", color: "#00d4ff", dotClass: "status-dot-available" },
};

function ExtensionCard({ ext, onCall }: { ext: Extension; onCall: (ext: string) => void }) {
  const status = statusConfig[ext.status];
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -2 }}
      className="rounded-xl p-4 relative"
      style={{
        background: "rgba(10,12,30,0.8)",
        border: `1px solid ${status.color}18`,
        backdropFilter: "blur(20px)",
      }}
    >
      {/* Menu button */}
      <div className="absolute top-3 left-3">
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="p-1 rounded"
          style={{ color: "#4e4e60" }}
        >
          <MoreHorizontal size={14} />
        </button>
        {menuOpen && (
          <div className="absolute left-0 top-6 z-10 rounded-lg overflow-hidden"
            style={{ background: "rgba(10,12,30,0.98)", border: "1px solid rgba(0,212,255,0.15)", minWidth: "120px", boxShadow: "0 8px 32px rgba(0,0,0,0.5)" }}>
            {[
              { icon: Edit, label: "ویرایش" },
              { icon: Copy, label: "کپی" },
              { icon: Trash2, label: "حذف", danger: true },
            ].map(item => (
              <button key={item.label}
                onClick={() => setMenuOpen(false)}
                className="flex items-center gap-2 px-3 py-2 w-full text-xs text-right transition-all"
                style={{ color: item.danger ? "#ff375f" : "#8e8ea0" }}>
                <item.icon size={11} />
                {item.label}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Avatar & status */}
      <div className="flex flex-col items-center mb-3">
        <div className="relative mb-2">
          <div className="w-14 h-14 rounded-full flex items-center justify-center text-lg"
            style={{
              background: `linear-gradient(135deg, ${status.color}20, ${status.color}10)`,
              border: `2px solid ${status.color}30`,
              color: status.color
            }}>
            {ext.extension}
          </div>
          <div className={`absolute -bottom-0.5 -right-0.5 w-4 h-4 rounded-full border-2 ${ext.status === 'available' ? 'status-dot-available' : ext.status === 'busy' ? 'status-dot-busy' : ext.status === 'dnd' ? 'status-dot-dnd' : 'status-dot-offline'}`}
            style={{ borderColor: "#050510" }} />
        </div>
        <div className="text-sm" style={{ color: "#e0e0f0" }}>{ext.name}</div>
        <div className="text-xs mt-0.5" style={{ color: status.color }}>{status.label}</div>
      </div>

      {/* Info */}
      <div className="space-y-1.5 mb-3 px-1">
        <div className="flex items-center justify-between text-xs">
          <span style={{ color: "#6e6e80" }}>IP</span>
          <span className="font-mono" style={{ color: "#8e8ea0" }}>{ext.ip || "آفلاین"}</span>
        </div>
        <div className="flex items-center justify-between text-xs">
          <span style={{ color: "#6e6e80" }}>کدک</span>
          <span style={{ color: "#8e8ea0" }}>{ext.codec.toUpperCase()}</span>
        </div>
        <div className="flex items-center justify-between text-xs">
          <span style={{ color: "#6e6e80" }}>آخرین فعالیت</span>
          <span style={{ color: "#8e8ea0" }}>{ext.lastSeen}</span>
        </div>
      </div>

      {/* Stats row */}
      <div className="flex items-center divide-x divide-x-reverse gap-0 mb-3"
        style={{ borderTop: "1px solid rgba(255,255,255,0.04)", paddingTop: "8px" }}>
        <div className="flex-1 text-center">
          <div className="text-sm" style={{ color: "#e0e0f0" }}>{ext.callsToday}</div>
          <div className="text-xs" style={{ color: "#4e4e60" }}>تماس</div>
        </div>
        <div className="flex-1 text-center" style={{ borderRight: "1px solid rgba(255,255,255,0.04)" }}>
          <div className="text-sm" style={{ color: "#e0e0f0" }}>{ext.totalMinutes}</div>
          <div className="text-xs" style={{ color: "#4e4e60" }}>دقیقه</div>
        </div>
        <div className="flex-1 text-center" style={{ borderRight: "1px solid rgba(255,255,255,0.04)" }}>
          <div className="text-sm" style={{ color: ext.voicemailCount > 0 ? "#ff9f0a" : "#e0e0f0" }}>
            {ext.voicemailCount}
          </div>
          <div className="text-xs" style={{ color: "#4e4e60" }}>صوتی</div>
        </div>
      </div>

      {/* Action buttons */}
      <div className="flex gap-2">
        <button
          onClick={() => onCall(ext.extension)}
          disabled={ext.status === "offline"}
          className="flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-lg text-xs transition-all"
          style={{
            background: ext.status === "offline" ? "rgba(255,255,255,0.02)" : "rgba(0,212,255,0.1)",
            border: `1px solid ${ext.status === "offline" ? "rgba(255,255,255,0.04)" : "rgba(0,212,255,0.25)"}`,
            color: ext.status === "offline" ? "#4e4e60" : "#00d4ff",
            cursor: ext.status === "offline" ? "not-allowed" : "pointer",
          }}
        >
          <Phone size={11} />
          تماس
        </button>
        <button className="flex items-center justify-center p-1.5 rounded-lg"
          style={{ background: "rgba(191,90,242,0.08)", border: "1px solid rgba(191,90,242,0.2)", color: "#bf5af2" }}>
          <Voicemail size={12} />
        </button>
        <button className="flex items-center justify-center p-1.5 rounded-lg"
          style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.06)", color: "#6e6e80" }}>
          <MessageSquare size={12} />
        </button>
      </div>
    </motion.div>
  );
}

export function Extensions() {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<string>("all");
  const [showAdd, setShowAdd] = useState(false);

  const filtered = extensions.filter(ext => {
    const matchSearch = ext.name.includes(search) || ext.extension.includes(search) || ext.email.includes(search);
    const matchFilter = filter === "all" || ext.status === filter;
    return matchSearch && matchFilter;
  });

  const handleCall = (ext: string) => {
    // Demo: show call initiated
    console.log(`Calling extension ${ext}`);
  };

  const statusCounts = {
    all: extensions.length,
    available: extensions.filter(e => e.status === "available").length,
    busy: extensions.filter(e => e.status === "busy").length,
    dnd: extensions.filter(e => e.status === "dnd").length,
    offline: extensions.filter(e => e.status === "offline").length,
  };

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-lg mb-0.5" style={{ color: "#e0e0f0" }}>داخلی‌های SIP</h1>
          <p className="text-xs" style={{ color: "#6e6e80" }}>مدیریت و مانیتورینگ اکستنشن‌ها (100-109)</p>
        </div>
        <button
          onClick={() => setShowAdd(true)}
          className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm transition-all"
          style={{
            background: "linear-gradient(135deg, rgba(0,212,255,0.2), rgba(0,212,255,0.1))",
            border: "1px solid rgba(0,212,255,0.3)",
            color: "#00d4ff"
          }}
        >
          <Plus size={14} />
          داخلی جدید
        </button>
      </div>

      {/* Filter tabs */}
      <div className="flex items-center gap-2 mb-4">
        {[
          { key: "all", label: "همه" },
          { key: "available", label: "آماده" },
          { key: "busy", label: "مشغول" },
          { key: "dnd", label: "DND" },
          { key: "offline", label: "آفلاین" },
        ].map(tab => (
          <button
            key={tab.key}
            onClick={() => setFilter(tab.key)}
            className="px-3 py-1 rounded-lg text-xs transition-all"
            style={{
              background: filter === tab.key ? "rgba(0,212,255,0.15)" : "rgba(255,255,255,0.03)",
              border: `1px solid ${filter === tab.key ? "rgba(0,212,255,0.3)" : "rgba(255,255,255,0.05)"}`,
              color: filter === tab.key ? "#00d4ff" : "#6e6e80",
            }}
          >
            {tab.label} ({statusCounts[tab.key as keyof typeof statusCounts]})
          </button>
        ))}
      </div>

      {/* Search */}
      <div className="relative mb-5">
        <Search size={14} className="absolute right-3 top-1/2 -translate-y-1/2" style={{ color: "#4e4e60" }} />
        <input
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="جستجوی داخلی، نام یا ایمیل..."
          className="w-full pr-9 pl-4 py-2 rounded-lg text-sm outline-none"
          style={{
            background: "rgba(255,255,255,0.04)",
            border: "1px solid rgba(0,212,255,0.1)",
            color: "#e0e0f0",
          }}
        />
      </div>

      {/* Summary stats */}
      <div className="grid grid-cols-4 gap-3 mb-5">
        {[
          { label: "آماده", value: statusCounts.available, color: "#30d158" },
          { label: "مشغول", value: statusCounts.busy, color: "#ff375f" },
          { label: "DND", value: statusCounts.dnd, color: "#ff9f0a" },
          { label: "آفلاین", value: statusCounts.offline, color: "#6e6e73" },
        ].map(stat => (
          <div key={stat.label} className="rounded-lg p-3 flex items-center gap-2"
            style={{ background: "rgba(10,12,30,0.8)", border: `1px solid ${stat.color}15` }}>
            <div className="w-2.5 h-2.5 rounded-full" style={{ background: stat.color, boxShadow: `0 0 6px ${stat.color}` }} />
            <div>
              <div className="text-sm" style={{ color: "#e0e0f0" }}>{stat.value}</div>
              <div className="text-xs" style={{ color: "#6e6e80" }}>{stat.label}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
        {filtered.map((ext, i) => (
          <motion.div key={ext.id} transition={{ delay: i * 0.04 }}>
            <ExtensionCard ext={ext} onCall={handleCall} />
          </motion.div>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="flex flex-col items-center justify-center py-16">
          <Users size={40} style={{ color: "#4e4e60" }} className="mb-3" />
          <p className="text-sm" style={{ color: "#6e6e80" }}>داخلی‌ای یافت نشد</p>
        </div>
      )}

      {/* Add Extension Modal */}
      {showAdd && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ background: "rgba(0,0,0,0.7)", backdropFilter: "blur(10px)" }}
          onClick={() => setShowAdd(false)}>
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            onClick={e => e.stopPropagation()}
            className="w-full max-w-md rounded-2xl p-6"
            style={{ background: "rgba(10,12,30,0.98)", border: "1px solid rgba(0,212,255,0.2)" }}
          >
            <h2 className="text-sm mb-4" style={{ color: "#e0e0f0" }}>افزودن داخلی جدید</h2>
            <div className="space-y-3">
              {[
                { label: "شماره داخلی", placeholder: "مثال: 110" },
                { label: "نام کاربر", placeholder: "نام نمایشی" },
                { label: "ایمیل", placeholder: "email@domain.local" },
                { label: "رمز عبور SIP", placeholder: "••••••••" },
              ].map(field => (
                <div key={field.label}>
                  <label className="text-xs mb-1 block" style={{ color: "#8e8ea0" }}>{field.label}</label>
                  <input
                    className="w-full px-3 py-2 rounded-lg text-sm outline-none"
                    placeholder={field.placeholder}
                    style={{
                      background: "rgba(255,255,255,0.04)",
                      border: "1px solid rgba(0,212,255,0.15)",
                      color: "#e0e0f0"
                    }}
                  />
                </div>
              ))}
            </div>
            <div className="flex gap-3 mt-5">
              <button onClick={() => setShowAdd(false)} className="flex-1 py-2 rounded-lg text-sm"
                style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.06)", color: "#8e8ea0" }}>
                لغو
              </button>
              <button className="flex-1 py-2 rounded-lg text-sm"
                style={{ background: "linear-gradient(135deg, rgba(0,212,255,0.25), rgba(0,212,255,0.15))", border: "1px solid rgba(0,212,255,0.3)", color: "#00d4ff" }}>
                ایجاد داخلی
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
