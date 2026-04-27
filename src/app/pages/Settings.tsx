import { useState, useEffect } from "react";
import { motion } from "motion/react";
import {
  Server, Phone, Wifi, Lock, Database, Save,
  RotateCcw, CheckCircle2, AlertTriangle, Cpu,
  Globe, Radio, Volume2, Shield
} from "lucide-react";
import { useAppStore } from "../store/useAppStore";
import { sipService } from "../services/sipManager";

const tabs = [
  { id: "server", label: "سرور SIP", icon: Server },
  { id: "sip", label: "تنظیمات اتصال کلاینت", icon: Phone },
  { id: "codecs", label: "کدک‌ها", icon: Volume2 },
  { id: "network", label: "شبکه & NAT", icon: Wifi },
  { id: "security", label: "TLS & SRTP", icon: Lock },
  { id: "database", label: "دیتابیس", icon: Database },
];

function ToggleSwitch({ value, onChange }: { value: boolean; onChange: (v: boolean) => void }) {
  return (
    <button
      onClick={() => onChange(!value)}
      className="w-10 h-5 rounded-full transition-all relative"
      style={{ background: value ? "rgba(0,212,255,0.3)" : "rgba(255,255,255,0.1)", border: `1px solid ${value ? "rgba(0,212,255,0.5)" : "rgba(255,255,255,0.1)"}` }}
    >
      <div className="absolute top-0.5 transition-all w-4 h-4 rounded-full"
        style={{
          background: value ? "#00d4ff" : "#4e4e60",
          left: value ? "calc(100% - 18px)" : "2px",
          boxShadow: value ? "0 0 6px #00d4ff" : "none",
          transition: "all 0.2s ease"
        }} />
    </button>
  );
}

function ConfigField({ label, value, onChange, type = "text", mono = false }: {
  label: string; value: string; onChange?: (v: string) => void; type?: string; mono?: boolean
}) {
  return (
    <div>
      <label className="text-xs mb-1 block" style={{ color: "#8e8ea0" }}>{label}</label>
      <input
        type={type}
        value={value}
        onChange={e => onChange?.(e.target.value)}
        className="w-full px-3 py-2 rounded-lg text-sm outline-none"
        style={{
          background: "rgba(255,255,255,0.04)",
          border: "1px solid rgba(0,212,255,0.12)",
          color: "#e0e0f0",
          fontFamily: mono ? "monospace" : "inherit"
        }}
      />
    </div>
  );
}

export function Settings() {
  const [activeTab, setActiveTab] = useState("server");
  const [saved, setSaved] = useState(false);
  
  const settings = useAppStore();
  const setSettings = useAppStore(state => state.setSettings);
  
  const [config, setConfig] = useState({
    motherNumber: settings.motherNumber,
    serverIp: settings.serverIp,
    sipPort: settings.sipPort,
    wsPort: settings.wsPort,
    extension: settings.extension,
    sipPassword: settings.sipPassword,
    autoAnswer: settings.autoAnswer,
    wssEnabled: settings.wssEnabled,
    displayName: settings.displayName,
    // Mock settings
    tlsEnabled: true,
    srtpEnabled: true,
    natEnabled: true,
    jitterBuffer: true,
    alwaysAuthReject: true,
    allowGuest: false,
    recordingEnabled: true,
    voicemailEnabled: true,
    conferenceEnabled: true,
    iceSupport: true,
    stunAddr: "172.28.0.5:3478",
    rtpStart: "10000",
    rtpEnd: "20000",
    maxCalls: "50",
    qualify: true,
    qualifyFreq: "60",
    dbHost: "postgres",
    dbName: "asterisk",
    dbUser: "asterisk",
  });

  const handleSave = () => {
    setSettings({
      serverIp: config.serverIp,
      sipPort: config.sipPort,
      wsPort: config.wsPort,
      motherNumber: config.motherNumber,
      extension: config.extension,
      sipPassword: config.sipPassword,
      autoAnswer: config.autoAnswer,
      wssEnabled: config.wssEnabled,
      displayName: config.displayName
    });
    
    // Re-initialize SIP service with new settings
    sipService.stop();
    setTimeout(() => sipService.init(), 500);

    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const codecs = [
    { name: "Opus", enabled: true, quality: "HD", latency: "20ms", color: "#00d4ff" },
    { name: "G.722", enabled: true, quality: "HD", latency: "20ms", color: "#bf5af2" },
    { name: "G.729", enabled: true, quality: "Standard", latency: "20ms", color: "#30d158" },
    { name: "uLaw (G.711)", enabled: true, quality: "Standard", latency: "20ms", color: "#ff9f0a" },
    { name: "aLaw (G.711)", enabled: true, quality: "Standard", latency: "20ms", color: "#ff9f0a" },
    { name: "GSM", enabled: false, quality: "Low", latency: "20ms", color: "#6e6e73" },
    { name: "VP8 (Video)", enabled: false, quality: "HD", latency: "-", color: "#6e6e73" },
    { name: "VP9 (Video)", enabled: false, quality: "4K", latency: "-", color: "#6e6e73" },
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case "server":
        return (
          <div className="grid grid-cols-2 gap-4">
            <ConfigField label="IP/دامنه سرور (Asterisk/FreePBX)" value={config.serverIp} onChange={v => setConfig({...config, serverIp: v})} mono />
            <ConfigField label="پورت SIP (UDP/TCP)" value={config.sipPort} onChange={v => setConfig({...config, sipPort: v})} mono />
            <ConfigField label="پورت WebSocket (WebRTC)" value={config.wsPort} onChange={v => setConfig({...config, wsPort: v})} mono />
            <ConfigField label="شماره مادر" value={config.motherNumber} onChange={v => setConfig({...config, motherNumber: v})} mono />
            <ConfigField label="IP خارجی (NAT)" value="auto" mono />
            <ConfigField label="Hostname" value="voip.mother.local" />
            <div className="col-span-2 grid grid-cols-3 gap-3">
              {[
                { label: "WSS/Secure WebSocket", key: "wssEnabled" },
                { label: "پاسخگویی خودکار (Auto Answer)", key: "autoAnswer" },
                { label: "کنفرانس", key: "conferenceEnabled" },
              ].map(item => (
                <div key={item.key} className="flex items-center justify-between p-3 rounded-lg"
                  style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.04)" }}>
                  <span className="text-xs" style={{ color: "#8e8ea0" }}>{item.label}</span>
                  <ToggleSwitch
                    value={config[item.key as keyof typeof config] as boolean}
                    onChange={v => setConfig(p => ({ ...p, [item.key]: v }))}
                  />
                </div>
              ))}
            </div>
          </div>
        );

      case "sip":
        return (
          <div className="grid grid-cols-2 gap-4">
            <ConfigField label="شماره داخلی (Extension)" value={config.extension} onChange={v => setConfig({...config, extension: v})} mono />
            <ConfigField label="رمز عبور SIP (Secret)" value={config.sipPassword} onChange={v => setConfig({...config, sipPassword: v})} type="password" />
            <ConfigField label="نام نمایشی (Display Name)" value={config.displayName} onChange={v => setConfig({...config, displayName: v})} />
            <ConfigField label="حداکثر تماس همزمان" value={config.maxCalls} />
            <div className="col-span-2 grid grid-cols-2 gap-3">
              {[
                { label: "NAT Support", key: "natEnabled" },
                { label: "Qualify", key: "qualify" },
                { label: "Always Auth Reject", key: "alwaysAuthReject" },
                { label: "Allow Guest", key: "allowGuest" },
                { label: "Jitter Buffer", key: "jitterBuffer" },
                { label: "ICE Support", key: "iceSupport" },
              ].map(item => (
                <div key={item.key} className="flex items-center justify-between p-3 rounded-lg"
                  style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.04)" }}>
                  <span className="text-xs" style={{ color: "#8e8ea0" }}>{item.label}</span>
                  <ToggleSwitch
                    value={config[item.key as keyof typeof config] as boolean}
                    onChange={v => setConfig(p => ({ ...p, [item.key]: v }))}
                  />
                </div>
              ))}
            </div>
          </div>
        );

      case "codecs":
        return (
          <div className="space-y-2">
            <p className="text-xs mb-3" style={{ color: "#6e6e80" }}>
              ترتیب کدک‌ها از بهترین به کم‌کیفیت‌ترین | sip.conf: disallow=all, allow=...
            </p>
            {codecs.map((codec, i) => (
              <div key={codec.name} className="flex items-center gap-4 p-3 rounded-lg"
                style={{
                  background: "rgba(255,255,255,0.02)",
                  border: `1px solid ${codec.enabled ? codec.color + "20" : "rgba(255,255,255,0.04)"}`,
                  opacity: codec.enabled ? 1 : 0.5
                }}>
                <div className="w-6 h-6 rounded flex items-center justify-center text-xs"
                  style={{ background: `${codec.color}15`, color: codec.color }}>
                  {i + 1}
                </div>
                <div className="flex-1">
                  <div className="text-sm" style={{ color: codec.enabled ? "#e0e0f0" : "#6e6e80" }}>{codec.name}</div>
                  <div className="flex items-center gap-2 text-xs" style={{ color: "#4e4e60" }}>
                    <span>{codec.quality}</span>
                    <span>•</span>
                    <span>{codec.latency}</span>
                  </div>
                </div>
                <ToggleSwitch value={codec.enabled} onChange={() => {}} />
              </div>
            ))}
          </div>
        );

      case "network":
        return (
          <div className="grid grid-cols-2 gap-4">
            <ConfigField label="RTP Start Port" value={config.rtpStart} mono />
            <ConfigField label="RTP End Port" value={config.rtpEnd} mono />
            <ConfigField label="STUN/TURN Server" value={config.stunAddr} mono />
            <ConfigField label="TURN Secret" value="••••••••••" type="password" />
            <div className="col-span-2">
              <label className="text-xs mb-1 block" style={{ color: "#8e8ea0" }}>Local Networks</label>
              <textarea
                defaultValue={"192.168.1.0/255.255.255.0\n172.28.0.0/16"}
                rows={3}
                className="w-full px-3 py-2 rounded-lg text-sm outline-none resize-none"
                style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(0,212,255,0.12)", color: "#e0e0f0", fontFamily: "monospace" }}
              />
            </div>
          </div>
        );

      case "security":
        return (
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2 flex items-center gap-2 p-3 rounded-lg"
              style={{ background: "rgba(48,209,88,0.05)", border: "1px solid rgba(48,209,88,0.15)" }}>
              <CheckCircle2 size={14} style={{ color: "#30d158" }} />
              <span className="text-xs" style={{ color: "#30d158" }}>گواهی TLS معتبر است تا سال 2027</span>
            </div>
            <ConfigField label="TLS Certificate" value="/etc/asterisk/keys/asterisk.pem" mono />
            <ConfigField label="Private Key" value="/etc/asterisk/keys/asterisk.key" mono />
            <ConfigField label="CA Certificate" value="/etc/asterisk/keys/ca.crt" mono />
            <ConfigField label="TLS Cipher" value="ALL" mono />
            <div className="col-span-2 grid grid-cols-2 gap-3">
              {[
                { label: "TLS Enable", key: "tlsEnabled" },
                { label: "SRTP Enable", key: "srtpEnabled" },
              ].map(item => (
                <div key={item.key} className="flex items-center justify-between p-3 rounded-lg"
                  style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.04)" }}>
                  <span className="text-xs" style={{ color: "#8e8ea0" }}>{item.label}</span>
                  <ToggleSwitch
                    value={config[item.key as keyof typeof config] as boolean}
                    onChange={v => setConfig(p => ({ ...p, [item.key]: v }))}
                  />
                </div>
              ))}
            </div>
          </div>
        );

      case "database":
        return (
          <div className="grid grid-cols-2 gap-4">
            <ConfigField label="Database Host" value={config.dbHost} mono />
            <ConfigField label="Database Port" value="5432" mono />
            <ConfigField label="Database Name" value={config.dbName} mono />
            <ConfigField label="Database User" value={config.dbUser} mono />
            <ConfigField label="Database Password" value="••••••••••" type="password" />
            <ConfigField label="Connection Pool Size" value="10" />
            <div className="col-span-2 p-3 rounded-lg"
              style={{ background: "rgba(48,209,88,0.05)", border: "1px solid rgba(48,209,88,0.15)" }}>
              <div className="flex items-center gap-2 mb-2">
                <CheckCircle2 size={13} style={{ color: "#30d158" }} />
                <span className="text-xs" style={{ color: "#30d158" }}>اتصال به دیتابیس برقرار است</span>
              </div>
              <div className="text-xs" style={{ color: "#4e4e60" }}>CDR Table: 2,847 رکورد | Users: 10 | Active Calls: 4</div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-lg mb-0.5" style={{ color: "#e0e0f0" }}>تنظیمات سیستم</h1>
          <p className="text-xs" style={{ color: "#6e6e80" }}>Asterisk Configuration | sip.conf | rtp.conf</p>
        </div>
        <div className="flex items-center gap-2">
          <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs"
            style={{ background: "rgba(255,55,95,0.1)", border: "1px solid rgba(255,55,95,0.2)", color: "#ff375f" }}>
            <RotateCcw size={11} />
            بازنشانی
          </button>
          <button
            onClick={handleSave}
            className="flex items-center gap-1.5 px-4 py-1.5 rounded-lg text-xs transition-all"
            style={{
              background: saved ? "rgba(48,209,88,0.2)" : "rgba(0,212,255,0.15)",
              border: `1px solid ${saved ? "rgba(48,209,88,0.4)" : "rgba(0,212,255,0.3)"}`,
              color: saved ? "#30d158" : "#00d4ff"
            }}
          >
            {saved ? <CheckCircle2 size={11} /> : <Save size={11} />}
            {saved ? "ذخیره شد!" : "ذخیره تغییرات"}
          </button>
        </div>
      </div>

      {/* Server status bar */}
      <div className="rounded-xl p-3 mb-5 flex items-center justify-between"
        style={{ background: "rgba(10,12,30,0.8)", border: "1px solid rgba(48,209,88,0.15)" }}>
        <div className="flex items-center gap-4">
          {[
            { icon: Server, label: "Asterisk 18.18", status: "Running", color: "#30d158" },
            { icon: Database, label: "PostgreSQL 15", status: "Connected", color: "#30d158" },
            { icon: Radio, label: "Redis 7", status: "Active", color: "#30d158" },
            { icon: Globe, label: "CoTURN", status: "Online", color: "#30d158" },
          ].map(svc => (
            <div key={svc.label} className="flex items-center gap-2 text-xs">
              <svc.icon size={12} style={{ color: svc.color }} />
              <span style={{ color: "#8e8ea0" }}>{svc.label}</span>
              <span style={{ color: svc.color }}>{svc.status}</span>
            </div>
          ))}
        </div>
        <div className="flex items-center gap-1.5 text-xs" style={{ color: "#30d158" }}>
          <Cpu size={11} />
          CPU: 12% | RAM: 2.1/8GB
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 mb-5 overflow-x-auto pb-1">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs whitespace-nowrap transition-all"
            style={{
              background: activeTab === tab.id ? "rgba(0,212,255,0.12)" : "rgba(255,255,255,0.03)",
              border: `1px solid ${activeTab === tab.id ? "rgba(0,212,255,0.3)" : "rgba(255,255,255,0.04)"}`,
              color: activeTab === tab.id ? "#00d4ff" : "#6e6e80",
            }}
          >
            <tab.icon size={12} />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Content */}
      <motion.div
        key={activeTab}
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-xl p-5"
        style={{ background: "rgba(10,12,30,0.8)", border: "1px solid rgba(0,212,255,0.1)" }}
      >
        {renderTabContent()}
      </motion.div>

      {/* Docker commands */}
      <div className="mt-4 rounded-xl p-4"
        style={{ background: "rgba(8,8,20,0.9)", border: "1px solid rgba(255,255,255,0.04)" }}>
        <div className="text-xs mb-2" style={{ color: "#4e4e60", letterSpacing: "0.08em" }}>QUICK COMMANDS</div>
        <div className="grid grid-cols-3 gap-2">
          {[
            { label: "Asterisk Reload", cmd: "asterisk -rx 'core reload'" },
            { label: "SIP Reload", cmd: "asterisk -rx 'sip reload'" },
            { label: "Dialplan Reload", cmd: "asterisk -rx 'dialplan reload'" },
            { label: "Show Channels", cmd: "asterisk -rx 'core show channels'" },
            { label: "Show Peers", cmd: "asterisk -rx 'sip show peers'" },
            { label: "Restart Server", cmd: "docker restart voip-mother-server" },
          ].map(cmd => (
            <button key={cmd.label}
              className="p-2 rounded-lg text-left text-xs"
              style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.04)", color: "#6e6e80" }}>
              <div style={{ color: "#8e8ea0" }}>{cmd.label}</div>
              <div className="font-mono text-xs mt-0.5 truncate" style={{ color: "#4e4e60", fontSize: "10px" }}>{cmd.cmd}</div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
