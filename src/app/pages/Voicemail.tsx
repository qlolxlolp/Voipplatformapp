import { useState } from "react";
import { motion } from "motion/react";
import {
  Voicemail, Play, Pause, Trash2, Download,
  Mail, MailOpen, Volume2, Clock, User, Mic,
  ChevronDown, Star
} from "lucide-react";
import { voicemailMessages, formatDuration, type VoicemailMessage } from "../data/voipData";

function AudioVisualizer({ playing }: { playing: boolean }) {
  return (
    <div className="flex items-end gap-0.5 h-6 w-24">
      {Array.from({ length: 20 }, (_, i) => (
        <div
          key={i}
          className="flex-1 rounded-full"
          style={{
            height: playing ? `${Math.sin(Date.now() / 300 + i * 0.4) * 40 + 50}%` : "20%",
            background: playing ? "#00d4ff" : "#4e4e60",
            opacity: playing ? 0.8 : 0.4,
            transition: playing ? "height 0.1s ease" : "height 0.3s ease",
          }}
        />
      ))}
    </div>
  );
}

function VoicemailCard({ msg, onDelete }: { msg: VoicemailMessage; onDelete: (id: string) => void }) {
  const [playing, setPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [expanded, setExpanded] = useState(false);

  const folderColors: Record<string, string> = {
    INBOX: "#00d4ff",
    Old: "#6e6e80",
    Work: "#bf5af2",
    Family: "#30d158",
  };

  const folderColor = folderColors[msg.folder] || "#00d4ff";

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -20 }}
      whileHover={{ y: -1 }}
      className="rounded-xl p-4 relative overflow-hidden"
      style={{
        background: msg.isRead ? "rgba(8,10,25,0.6)" : "rgba(12,15,35,0.9)",
        border: msg.isRead ? "1px solid rgba(255,255,255,0.04)" : `1px solid ${folderColor}25`,
        boxShadow: msg.isRead ? "none" : `0 0 20px ${folderColor}08`
      }}
    >
      {!msg.isRead && (
        <div className="absolute top-0 right-0 w-1 h-full rounded-r-xl"
          style={{ background: `linear-gradient(180deg, ${folderColor}, transparent)` }} />
      )}

      <div className="flex items-start gap-3">
        {/* Avatar */}
        <div className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0"
          style={{ background: `${folderColor}15`, border: `1px solid ${folderColor}30` }}>
          <User size={16} style={{ color: folderColor }} />
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-sm" style={{ color: "#e0e0f0" }}>{msg.callerName}</span>
                {!msg.isRead && (
                  <div className="w-1.5 h-1.5 rounded-full" style={{ background: folderColor, boxShadow: `0 0 4px ${folderColor}` }} />
                )}
              </div>
              <div className="text-xs font-mono" style={{ color: "#6e6e80" }}>{msg.callerid}</div>
            </div>
            <div className="text-right flex-shrink-0">
              <div className="text-xs" style={{ color: "#6e6e80" }}>
                {new Date(msg.timestamp).toLocaleTimeString("fa-IR", { hour: "2-digit", minute: "2-digit" })}
              </div>
              <div className="text-xs mt-0.5 px-1.5 py-0.5 rounded-full inline-block"
                style={{ background: `${folderColor}15`, color: folderColor }}>
                {msg.folder}
              </div>
            </div>
          </div>

          {/* Duration */}
          <div className="flex items-center gap-2 mt-2">
            <Clock size={11} style={{ color: "#4e4e60" }} />
            <span className="text-xs" style={{ color: "#8e8ea0" }}>{formatDuration(msg.duration)}</span>
            <span className="text-xs" style={{ color: "#4e4e60" }}>|</span>
            <span className="text-xs" style={{ color: "#8e8ea0" }}>صندوق: {msg.mailbox}</span>
          </div>

          {/* Player */}
          <div className="flex items-center gap-3 mt-3 p-2 rounded-lg"
            style={{ background: "rgba(255,255,255,0.03)" }}>
            <button
              onClick={() => setPlaying(!playing)}
              className="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0"
              style={{ background: `${folderColor}20`, border: `1px solid ${folderColor}30` }}
            >
              {playing ? <Pause size={12} style={{ color: folderColor }} /> : <Play size={12} style={{ color: folderColor }} />}
            </button>

            <AudioVisualizer playing={playing} />

            {/* Progress bar */}
            <div className="flex-1 h-1 rounded-full" style={{ background: "rgba(255,255,255,0.05)" }}>
              <div className="h-full rounded-full transition-all"
                style={{ width: `${playing ? 35 : 0}%`, background: folderColor }} />
            </div>

            <div className="flex items-center gap-1.5">
              <button onClick={() => {}} className="p-1 rounded"
                style={{ color: "#4e4e60" }}>
                <Download size={11} />
              </button>
              <button onClick={() => onDelete(msg.id)} className="p-1 rounded"
                style={{ color: "#4e4e60" }}>
                <Trash2 size={11} />
              </button>
            </div>
          </div>

          {/* Transcription */}
          {msg.transcription && (
            <div className="mt-2">
              <button
                onClick={() => setExpanded(!expanded)}
                className="flex items-center gap-1 text-xs"
                style={{ color: "#6e6e80" }}
              >
                <Mic size={10} />
                متن پیام
                <ChevronDown size={10} style={{ transform: expanded ? "rotate(180deg)" : "", transition: "0.2s" }} />
              </button>
              {expanded && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  className="mt-1.5 px-2 py-2 rounded-lg text-xs leading-relaxed"
                  style={{ background: "rgba(0,212,255,0.05)", border: "1px solid rgba(0,212,255,0.1)", color: "#8e8ea0" }}
                  dir="rtl"
                >
                  {msg.transcription}
                </motion.div>
              )}
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}

export function VoicemailPage() {
  const [messages, setMessages] = useState<VoicemailMessage[]>(voicemailMessages);
  const [folder, setFolder] = useState("all");

  const filtered = messages.filter(m => folder === "all" || m.folder === folder);
  const unreadCount = messages.filter(m => !m.isRead).length;

  const handleDelete = (id: string) => {
    setMessages(prev => prev.filter(m => m.id !== id));
  };

  const folders = ["all", "INBOX", "Old", "Work", "Family"];
  const folderCounts = {
    all: messages.length,
    INBOX: messages.filter(m => m.folder === "INBOX").length,
    Old: messages.filter(m => m.folder === "Old").length,
    Work: messages.filter(m => m.folder === "Work").length,
    Family: messages.filter(m => m.folder === "Family").length,
  };

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-lg mb-0.5 flex items-center gap-2" style={{ color: "#e0e0f0" }}>
            پیام‌های صوتی
            {unreadCount > 0 && (
              <span className="text-xs px-2 py-0.5 rounded-full"
                style={{ background: "rgba(0,212,255,0.2)", color: "#00d4ff", border: "1px solid rgba(0,212,255,0.3)" }}>
                {unreadCount} جدید
              </span>
            )}
          </h1>
          <p className="text-xs" style={{ color: "#6e6e80" }}>
            سیستم Voicemail Asterisk | voicemail.conf
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs"
            style={{ background: "rgba(48,209,88,0.1)", border: "1px solid rgba(48,209,88,0.2)", color: "#30d158" }}>
            <MailOpen size={11} />
            علامت‌گذاری همه
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-3 mb-5">
        {[
          { label: "کل پیام‌ها", value: messages.length, icon: Voicemail, color: "#00d4ff" },
          { label: "خوانده نشده", value: unreadCount, icon: Mail, color: "#ff375f" },
          { label: "مجموع دقایق", value: formatDuration(messages.reduce((s, m) => s + m.duration, 0)), icon: Clock, color: "#bf5af2" },
          { label: "با متن", value: messages.filter(m => m.transcription).length, icon: Mic, color: "#30d158" },
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

      <div className="flex gap-4">
        {/* Sidebar folders */}
        <div className="w-36 flex-shrink-0">
          <div className="space-y-1">
            <p className="text-xs px-2 mb-2" style={{ color: "#4e4e60", letterSpacing: "0.08em" }}>FOLDERS</p>
            {folders.map(f => (
              <button
                key={f}
                onClick={() => setFolder(f)}
                className="w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs transition-all"
                style={{
                  background: folder === f ? "rgba(0,212,255,0.1)" : "transparent",
                  border: `1px solid ${folder === f ? "rgba(0,212,255,0.2)" : "transparent"}`,
                  color: folder === f ? "#00d4ff" : "#6e6e80",
                }}
              >
                <span>{f === "all" ? "همه پیام‌ها" : f}</span>
                <span className="text-xs" style={{ color: folder === f ? "#00d4ff" : "#4e4e60" }}>
                  {folderCounts[f as keyof typeof folderCounts]}
                </span>
              </button>
            ))}
          </div>

          {/* Mailboxes */}
          <div className="mt-4">
            <p className="text-xs px-2 mb-2" style={{ color: "#4e4e60", letterSpacing: "0.08em" }}>MAILBOXES</p>
            {["09120000000", "102", "104", "106"].map(box => (
              <div key={box} className="px-3 py-1.5 rounded-lg text-xs mb-1"
                style={{ color: "#6e6e80" }}>
                <div className="font-mono">{box}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Messages list */}
        <div className="flex-1 min-w-0 space-y-2">
          {filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16">
              <Voicemail size={40} style={{ color: "#4e4e60" }} className="mb-3" />
              <p className="text-sm" style={{ color: "#6e6e80" }}>پیامی در این پوشه وجود ندارد</p>
            </div>
          ) : (
            filtered.map(msg => (
              <VoicemailCard key={msg.id} msg={msg} onDelete={handleDelete} />
            ))
          )}
        </div>
      </div>
    </div>
  );
}
