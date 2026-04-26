import { useState } from "react";
import { motion } from "motion/react";
import {
  Radio, ChevronRight, Phone, Voicemail,
  GitBranch, Settings, ArrowRight, Plus, Edit, Trash2,
  Hash, Users, AlertTriangle, PhoneCall
} from "lucide-react";

const ivrTree = {
  name: "منوی اصلی IVR",
  context: "mother-number",
  extension: "09120000000",
  options: [
    {
      key: "1",
      label: "تماس با داخلی‌ها",
      icon: Users,
      color: "#00d4ff",
      context: "internals",
      suboptions: [
        { key: "100", label: "کاربر ۱۰۰" },
        { key: "101", label: "کاربر ۱۰۱" },
        { key: "102", label: "کاربر ۱۰۲" },
        { key: "103", label: "کاربر ۱۰۳" },
      ]
    },
    {
      key: "2",
      label: "پیام صوتی",
      icon: Voicemail,
      color: "#bf5af2",
      context: "voicemail",
    },
    {
      key: "3",
      label: "کنفرانس",
      icon: GitBranch,
      color: "#30d158",
      context: "conference",
    },
    {
      key: "4",
      label: "انتقال تماس",
      icon: ArrowRight,
      color: "#ff9f0a",
      context: "transfer",
    },
    {
      key: "5",
      label: "تنظیمات",
      icon: Settings,
      color: "#ff375f",
      context: "settings",
    },
    {
      key: "0",
      label: "اپراتور",
      icon: Phone,
      color: "#6e6e80",
      context: "operator",
    },
  ]
};

const emergencyExtensions = [
  { ext: "110", label: "پلیس", color: "#00d4ff" },
  { ext: "115", label: "آتش‌نشانی", color: "#ff375f" },
  { ext: "112", label: "اورژانس", color: "#30d158" },
];

function IVRNode({ option, depth = 0 }: { option: any; depth?: number }) {
  const [expanded, setExpanded] = useState(false);
  const hasChildren = option.suboptions && option.suboptions.length > 0;

  return (
    <div>
      <motion.div
        whileHover={{ x: 3 }}
        className="flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-all mb-1"
        style={{
          background: expanded ? `${option.color}10` : "rgba(255,255,255,0.02)",
          border: `1px solid ${expanded ? option.color + "25" : "rgba(255,255,255,0.04)"}`,
          marginLeft: depth * 16 + "px"
        }}
        onClick={() => hasChildren && setExpanded(!expanded)}
      >
        <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
          style={{ background: `${option.color}15`, border: `1px solid ${option.color}25` }}>
          <option.icon size={14} style={{ color: option.color }} />
        </div>
        <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0"
          style={{ background: `${option.color}10`, border: `1px solid ${option.color}20` }}>
          <span className="text-xs font-mono" style={{ color: option.color }}>{option.key}</span>
        </div>
        <div className="flex-1">
          <div className="text-sm" style={{ color: "#e0e0f0" }}>{option.label}</div>
          {option.context && (
            <div className="text-xs font-mono" style={{ color: "#4e4e60" }}>→ [{option.context}]</div>
          )}
        </div>
        <div className="flex items-center gap-2">
          <button className="p-1 rounded" style={{ color: "#4e4e60" }} onClick={e => e.stopPropagation()}>
            <Edit size={11} />
          </button>
          {hasChildren && (
            <ChevronRight size={14} style={{ color: "#6e6e80", transform: expanded ? "rotate(90deg)" : "", transition: "0.2s" }} />
          )}
        </div>
      </motion.div>

      {expanded && hasChildren && (
        <motion.div
          initial={{ opacity: 0, y: -5 }}
          animate={{ opacity: 1, y: 0 }}
        >
          {option.suboptions.map((sub: any) => (
            <div key={sub.key}
              className="flex items-center gap-3 px-4 py-2 rounded-lg mb-1"
              style={{ marginLeft: (depth + 1) * 16 + "px", background: "rgba(255,255,255,0.01)", border: "1px solid rgba(255,255,255,0.03)" }}>
              <Hash size={11} style={{ color: "#4e4e60" }} />
              <span className="text-xs font-mono" style={{ color: "#6e6e80" }}>{sub.key}</span>
              <span className="text-xs" style={{ color: "#8e8ea0" }}>{sub.label}</span>
            </div>
          ))}
        </motion.div>
      )}
    </div>
  );
}

export function IVR() {
  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-lg mb-0.5" style={{ color: "#e0e0f0" }}>سیستم IVR مادر</h1>
          <p className="text-xs" style={{ color: "#6e6e80" }}>
            Interactive Voice Response | extensions.conf Asterisk
          </p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm"
          style={{ background: "linear-gradient(135deg, rgba(191,90,242,0.2), rgba(191,90,242,0.1))", border: "1px solid rgba(191,90,242,0.3)", color: "#bf5af2" }}>
          <Plus size={14} />
          منوی جدید
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* IVR Tree */}
        <div className="lg:col-span-2">
          <div className="rounded-xl p-5"
            style={{ background: "rgba(10,12,30,0.8)", border: "1px solid rgba(0,212,255,0.1)" }}>
            {/* Root node */}
            <div className="flex items-center gap-3 p-4 rounded-xl mb-4"
              style={{ background: "linear-gradient(135deg, rgba(0,212,255,0.08), rgba(0,212,255,0.04))", border: "1px solid rgba(0,212,255,0.2)" }}>
              <div className="w-10 h-10 rounded-full flex items-center justify-center"
                style={{ background: "rgba(0,212,255,0.15)", border: "1px solid rgba(0,212,255,0.3)" }}>
                <Radio size={18} style={{ color: "#00d4ff" }} />
              </div>
              <div>
                <div className="text-sm" style={{ color: "#e0e0f0" }}>{ivrTree.name}</div>
                <div className="text-xs font-mono" style={{ color: "#00d4ff" }}>
                  [{ivrTree.context}] → {ivrTree.extension}
                </div>
              </div>
              <div className="mr-auto flex items-center gap-2">
                <div className="px-2 py-0.5 rounded text-xs"
                  style={{ background: "rgba(48,209,88,0.1)", color: "#30d158", border: "1px solid rgba(48,209,88,0.2)" }}>
                  فعال
                </div>
              </div>
            </div>

            {/* Options */}
            <div className="space-y-1">
              {ivrTree.options.map(option => (
                <IVRNode key={option.key} option={option} />
              ))}
            </div>
          </div>

          {/* IVR Config snippets */}
          <div className="mt-4 rounded-xl p-4"
            style={{ background: "rgba(10,12,30,0.8)", border: "1px solid rgba(0,212,255,0.08)" }}>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-xs" style={{ color: "#8e8ea0", letterSpacing: "0.08em" }}>EXTENSIONS.CONF PREVIEW</h3>
              <button className="text-xs px-2 py-0.5 rounded" style={{ color: "#00d4ff", background: "rgba(0,212,255,0.1)" }}>کپی</button>
            </div>
            <div className="rounded-lg p-3 overflow-x-auto"
              style={{ background: "rgba(0,0,0,0.3)", border: "1px solid rgba(255,255,255,0.04)", fontFamily: "monospace" }}>
              <pre className="text-xs" style={{ color: "#8e8ea0", lineHeight: "1.6" }}>
{`[mother-number]
exten => ${ivrTree.extension},1,Answer()
 same => n,Wait(0.5)
 same => n,Background(/sounds/fa/main-menu)
 same => n,WaitExten(5)

exten => 1,1,Goto(internals,\${MOTHER_NUMBER},1)
exten => 2,1,Goto(voicemail,\${MOTHER_NUMBER},1)
exten => 3,1,Goto(conference,main,1)
exten => 4,1,Goto(transfer,main,1)
exten => 5,1,Goto(settings,main,1)
exten => 0,1,Dial(SIP/operator,30,tT)`}
              </pre>
            </div>
          </div>
        </div>

        {/* Right sidebar */}
        <div className="space-y-4">
          {/* Emergency */}
          <div className="rounded-xl p-4"
            style={{ background: "rgba(10,12,30,0.8)", border: "1px solid rgba(255,55,95,0.15)" }}>
            <div className="flex items-center gap-2 mb-3">
              <AlertTriangle size={14} style={{ color: "#ff375f" }} />
              <h3 className="text-xs" style={{ color: "#ff375f", letterSpacing: "0.08em" }}>EMERGENCY</h3>
            </div>
            <div className="space-y-2">
              {emergencyExtensions.map(e => (
                <div key={e.ext} className="flex items-center justify-between p-2.5 rounded-lg"
                  style={{ background: `${e.color}08`, border: `1px solid ${e.color}15` }}>
                  <div className="flex items-center gap-2">
                    <PhoneCall size={12} style={{ color: e.color }} />
                    <span className="text-xs" style={{ color: "#e0e0f0" }}>{e.label}</span>
                  </div>
                  <span className="text-xs font-mono px-2 py-0.5 rounded"
                    style={{ background: `${e.color}15`, color: e.color }}>
                    {e.ext}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Queue Config */}
          <div className="rounded-xl p-4"
            style={{ background: "rgba(10,12,30,0.8)", border: "1px solid rgba(0,212,255,0.1)" }}>
            <h3 className="text-xs mb-3" style={{ color: "#8e8ea0", letterSpacing: "0.08em" }}>QUEUE CONFIG</h3>
            <div className="space-y-2">
              {[
                { label: "صف پشتیبانی", agents: 4, waiting: 2, color: "#00d4ff" },
                { label: "صف فروش", agents: 2, waiting: 0, color: "#30d158" },
              ].map(q => (
                <div key={q.label} className="p-3 rounded-lg"
                  style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.04)" }}>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-xs" style={{ color: "#e0e0f0" }}>{q.label}</span>
                    <div className="w-2 h-2 rounded-full" style={{ background: q.color }} />
                  </div>
                  <div className="flex gap-3 text-xs">
                    <span style={{ color: "#6e6e80" }}>عوامل: <span style={{ color: q.color }}>{q.agents}</span></span>
                    <span style={{ color: "#6e6e80" }}>انتظار: <span style={{ color: q.waiting > 0 ? "#ff9f0a" : "#6e6e80" }}>{q.waiting}</span></span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Callback */}
          <div className="rounded-xl p-4"
            style={{ background: "rgba(10,12,30,0.8)", border: "1px solid rgba(191,90,242,0.1)" }}>
            <h3 className="text-xs mb-3" style={{ color: "#8e8ea0", letterSpacing: "0.08em" }}>CALLBACK QUEUE</h3>
            <div className="space-y-2">
              {[
                { number: "09123456789", time: "10 دقیقه پیش" },
                { number: "09137654321", time: "25 دقیقه پیش" },
              ].map(cb => (
                <div key={cb.number} className="flex items-center justify-between p-2.5 rounded-lg"
                  style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(191,90,242,0.1)" }}>
                  <div>
                    <div className="text-xs font-mono" style={{ color: "#e0e0f0" }}>{cb.number}</div>
                    <div className="text-xs" style={{ color: "#4e4e60" }}>{cb.time}</div>
                  </div>
                  <button className="p-1.5 rounded-lg"
                    style={{ background: "rgba(191,90,242,0.15)", color: "#bf5af2" }}>
                    <PhoneCall size={11} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
