import { useState } from "react";
import { motion } from "motion/react";
import {
  PhoneIncoming, PhoneOutgoing, PhoneMissed, PhoneOff,
  Download, Play, Search, Filter, Calendar,
  TrendingUp, Clock, Phone
} from "lucide-react";
import { useLiveQuery } from "dexie-react-hooks";
import { db, type CallLog } from "../services/db";
import { formatDuration } from "../data/voipData";

const dispositionConfig = {
  "answered": { label: "پاسخ داده", color: "#30d158", Icon: PhoneIncoming },
  "no-answer": { label: "بی‌پاسخ", color: "#ff375f", Icon: PhoneMissed },
  "busy": { label: "مشغول", color: "#ff9f0a", Icon: PhoneOff },
  "failed": { label: "ناموفق", color: "#6e6e73", Icon: PhoneOff },
};

function CallRow({ call, index }: { call: CallLog; index: number }) {
  const cfg = dispositionConfig[call.status];
  const [playing, setPlaying] = useState(false);

  const isInternal = (num: string) => num.length <= 4;

  return (
    <motion.div
      initial={{ opacity: 0, x: -15 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.04 }}
      className="flex items-center gap-4 px-4 py-3 rounded-lg group transition-all"
      style={{
        background: "rgba(255,255,255,0.01)",
        border: "1px solid rgba(255,255,255,0.03)",
      }}
      whileHover={{ background: "rgba(0,212,255,0.03)", borderColor: "rgba(0,212,255,0.08)" }}
    >
      {/* Direction icon */}
      <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
        style={{ background: `${cfg.color}15` }}>
        <cfg.Icon size={14} style={{ color: cfg.color }} />
      </div>

      {/* From → To */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-1.5">
          <div className="flex items-center gap-1">
            <span className="text-sm" style={{ color: "#e0e0f0" }}>{call.direction === 'outgoing' ? 'شما' : call.name}</span>
            {!isInternal(call.number) && (
              <span className="text-xs px-1 rounded" style={{ background: "rgba(0,212,255,0.1)", color: "#00d4ff" }}>خارجی</span>
            )}
          </div>
          <span style={{ color: "#3e3e50" }}>→</span>
          <div className="flex items-center gap-1">
            <span className="text-sm" style={{ color: "#8e8ea0" }}>{call.direction === 'incoming' ? 'شما' : call.name}</span>
          </div>
        </div>
        <div className="flex items-center gap-3 mt-0.5">
          <span className="text-xs font-mono" style={{ color: "#4e4e60" }}>{call.number}</span>
        </div>
      </div>

      {/* Disposition */}
      <div className="flex items-center gap-1.5 flex-shrink-0">
        <div className="w-1.5 h-1.5 rounded-full" style={{ background: cfg.color }} />
        <span className="text-xs" style={{ color: cfg.color }}>{cfg.label}</span>
      </div>

      {/* Duration */}
      <div className="text-right flex-shrink-0 w-16">
        <div className="text-sm font-mono" style={{ color: "#e0e0f0" }}>
          {call.status === "answered" ? formatDuration(call.duration) : "-"}
        </div>
      </div>

      {/* Time */}
      <div className="text-right flex-shrink-0 w-20">
        <div className="text-xs" style={{ color: "#8e8ea0" }}>
          {new Date(call.timestamp).toLocaleTimeString("fa-IR", { hour: "2-digit", minute: "2-digit", second: "2-digit" })}
        </div>
        <div className="text-xs" style={{ color: "#4e4e60" }}>
          {new Date(call.timestamp).toLocaleDateString("fa-IR")}
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-all">
        {call.status === 'answered' && (
          <>
            <button
              onClick={() => setPlaying(!playing)}
              className="p-1.5 rounded-lg transition-all"
              style={{ background: "rgba(0,212,255,0.1)", border: "1px solid rgba(0,212,255,0.2)", color: "#00d4ff" }}
            >
              <Play size={11} />
            </button>
            <button className="p-1.5 rounded-lg transition-all"
              style={{ background: "rgba(48,209,88,0.1)", border: "1px solid rgba(48,209,88,0.2)", color: "#30d158" }}>
              <Download size={11} />
            </button>
          </>
        )}
      </div>
    </motion.div>
  );
}

export function CallHistory() {
  const [search, setSearch] = useState("");
  const [filterDisposition, setFilterDisposition] = useState("all");

  const callHistory = useLiveQuery(() => db.calls.toArray()) || [];

  const filtered = callHistory.filter(call => {
    const matchSearch = call.name.includes(search) || call.number.includes(search);
    const matchFilter = filterDisposition === "all" || call.status === filterDisposition;
    return matchSearch && matchFilter;
  }).sort((a, b) => b.timestamp - a.timestamp);

  const answered = callHistory.filter(c => c.status === "answered");
  const totalAnsweredBillsec = answered.reduce((sum, c) => sum + (c.duration || 0), 0);
  const avgDuration = answered.length ? Math.round(totalAnsweredBillsec / answered.length) : 0;

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-lg mb-0.5" style={{ color: "#e0e0f0" }}>تاریخچه تماس (CDR)</h1>
          <p className="text-xs" style={{ color: "#6e6e80" }}>گزارش کامل تماس‌های ثبت شده در دیتابیس محلی</p>
        </div>
        <button className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs"
          style={{ background: "rgba(48,209,88,0.1)", border: "1px solid rgba(48,209,88,0.2)", color: "#30d158" }}>
          <Download size={12} />
          خروجی CSV
        </button>
      </div>

      {/* Quick stats */}
      <div className="grid grid-cols-4 gap-3 mb-5">
        {[
          { label: "کل تماس‌ها", value: callHistory.length, icon: Phone, color: "#00d4ff" },
          { label: "پاسخ داده", value: answered.length, icon: PhoneIncoming, color: "#30d158" },
          { label: "بی‌پاسخ", value: callHistory.filter(c => c.disposition === "NO ANSWER").length, icon: PhoneMissed, color: "#ff375f" },
          { label: "میانگین مدت", value: formatDuration(avgDuration), icon: Clock, color: "#bf5af2" },
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

      {/* Filters */}
      <div className="flex items-center gap-3 mb-4">
        <div className="relative flex-1">
          <Search size={13} className="absolute right-3 top-1/2 -translate-y-1/2" style={{ color: "#4e4e60" }} />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="جستجو در تاریخچه..."
            className="w-full pr-8 pl-3 py-2 rounded-lg text-sm outline-none"
            style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(0,212,255,0.1)", color: "#e0e0f0" }}
          />
        </div>

        <div className="flex gap-2">
          {[
            { key: "all", label: "همه" },
            { key: "answered", label: "پاسخ داده" },
            { key: "no-answer", label: "بی‌پاسخ" },
            { key: "busy", label: "مشغول" },
          ].map(f => (
            <button
              key={f.key}
              onClick={() => setFilterDisposition(f.key)}
              className="px-3 py-1.5 rounded-lg text-xs transition-all"
              style={{
                background: filterDisposition === f.key ? "rgba(0,212,255,0.15)" : "rgba(255,255,255,0.03)",
                border: `1px solid ${filterDisposition === f.key ? "rgba(0,212,255,0.3)" : "rgba(255,255,255,0.05)"}`,
                color: filterDisposition === f.key ? "#00d4ff" : "#6e6e80",
              }}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* Table header */}
      <div className="flex items-center gap-4 px-4 pb-2 text-xs"
        style={{ color: "#4e4e60", borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
        <div className="w-8" />
        <div className="flex-1">مبدا → مقصد</div>
        <div className="w-20">وضعیت</div>
        <div className="w-16 text-right">مدت</div>
        <div className="w-20 text-right">زمان</div>
        <div className="w-16" />
      </div>

      {/* Rows */}
      <div className="mt-2 space-y-1">
        {filtered.map((call, i) => (
          <CallRow key={call.id} call={call} index={i} />
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="flex flex-col items-center justify-center py-16">
          <Phone size={36} style={{ color: "#4e4e60" }} className="mb-3" />
          <p className="text-sm" style={{ color: "#6e6e80" }}>هیچ تماسی یافت نشد</p>
        </div>
      )}

      {/* Paging info */}
      <div className="flex items-center justify-between mt-4 text-xs" style={{ color: "#4e4e60" }}>
        <span>نمایش {filtered.length} از {callHistory.length} رکورد</span>
        <div className="flex items-center gap-1">
          {[1, 2, 3].map(p => (
            <button key={p} className="w-6 h-6 rounded flex items-center justify-center"
              style={{
                background: p === 1 ? "rgba(0,212,255,0.15)" : "rgba(255,255,255,0.03)",
                color: p === 1 ? "#00d4ff" : "#4e4e60"
              }}>
              {p}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
