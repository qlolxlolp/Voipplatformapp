import { useState, useEffect } from "react";
import { motion } from "motion/react";
import {
  Users, Mic, MicOff, Lock, Unlock, Radio,
  PhoneOff, Plus, Crown, Volume2, Clock,
  GitBranch, PhoneCall
} from "lucide-react";
import { conferenceRooms, formatDuration, type ConferenceRoom } from "../data/voipData";

function SpeakerWave({ active }: { active: boolean }) {
  const [vals, setVals] = useState<number[]>([0.2, 0.5, 0.3, 0.7, 0.4]);
  useEffect(() => {
    if (!active) return;
    const iv = setInterval(() => setVals(Array.from({ length: 5 }, () => Math.random())), 200);
    return () => clearInterval(iv);
  }, [active]);

  return (
    <div className="flex items-end gap-0.5 h-4">
      {vals.map((v, i) => (
        <div key={i} className="w-1 rounded-full transition-all"
          style={{
            height: `${active ? v * 100 : 20}%`,
            background: active ? "#30d158" : "#4e4e60",
            transitionDuration: active ? "200ms" : "400ms"
          }} />
      ))}
    </div>
  );
}

function ParticipantBubble({ participant, isAdmin }: { participant: any; isAdmin: boolean }) {
  return (
    <div className="flex flex-col items-center gap-1.5">
      <div className="relative">
        <div className="w-14 h-14 rounded-full flex items-center justify-center text-base"
          style={{
            background: participant.isMuted ? "rgba(255,55,95,0.15)" : "rgba(48,209,88,0.15)",
            border: `2px solid ${participant.isMuted ? "rgba(255,55,95,0.4)" : "rgba(48,209,88,0.4)"}`,
            color: participant.isMuted ? "#ff375f" : "#30d158",
            boxShadow: !participant.isMuted ? "0 0 15px rgba(48,209,88,0.2)" : "none"
          }}>
          {participant.name.charAt(participant.name.length - 1)}
        </div>
        {isAdmin && (
          <div className="absolute -top-1 -right-1 w-5 h-5 rounded-full flex items-center justify-center"
            style={{ background: "#ff9f0a", boxShadow: "0 0 6px rgba(255,159,10,0.5)" }}>
            <Crown size={9} color="#000" />
          </div>
        )}
        <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full flex items-center justify-center"
          style={{ background: participant.isMuted ? "rgba(255,55,95,0.3)" : "rgba(48,209,88,0.3)", border: "1px solid rgba(0,0,0,0.3)" }}>
          {participant.isMuted ? <MicOff size={8} color="#ff375f" /> : <Mic size={8} color="#30d158" />}
        </div>
      </div>
      <div className="text-center">
        <div className="text-xs" style={{ color: "#e0e0f0" }}>{participant.name}</div>
        <div className="mt-0.5 flex justify-center">
          <SpeakerWave active={!participant.isMuted} />
        </div>
      </div>
      <div className="text-xs" style={{ color: "#4e4e60" }}>{formatDuration(participant.duration)}</div>
    </div>
  );
}

function RoomCard({ room }: { room: ConferenceRoom }) {
  const [myRoom, setMyRoom] = useState(room);
  const [joinElapsed, setJoinElapsed] = useState(0);
  const isActive = myRoom.participants.length > 0;

  useEffect(() => {
    if (!isActive) return;
    const iv = setInterval(() => setJoinElapsed(e => e + 1), 1000);
    return () => clearInterval(iv);
  }, [isActive]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-xl p-5 relative overflow-hidden"
      style={{
        background: isActive ? "rgba(10,15,35,0.9)" : "rgba(8,10,22,0.7)",
        border: isActive ? "1px solid rgba(0,212,255,0.25)" : "1px solid rgba(255,255,255,0.05)",
        boxShadow: isActive ? "0 0 30px rgba(0,212,255,0.05)" : "none"
      }}
    >
      {isActive && (
        <div className="absolute top-0 left-0 right-0 h-px"
          style={{ background: "linear-gradient(90deg, transparent, #00d4ff, transparent)" }} />
      )}

      {/* Room header */}
      <div className="flex items-start justify-between mb-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <div className="w-7 h-7 rounded-lg flex items-center justify-center"
              style={{ background: isActive ? "rgba(0,212,255,0.15)" : "rgba(255,255,255,0.04)", border: isActive ? "1px solid rgba(0,212,255,0.3)" : "1px solid rgba(255,255,255,0.06)" }}>
              <GitBranch size={13} style={{ color: isActive ? "#00d4ff" : "#6e6e80" }} />
            </div>
            <h3 className="text-sm" style={{ color: "#e0e0f0" }}>{myRoom.name}</h3>
          </div>
          <div className="flex items-center gap-2 text-xs" style={{ color: "#6e6e80" }}>
            <span>شماره: {myRoom.confno}</span>
            <span>|</span>
            <span>ظرفیت: {myRoom.maxParticipants} نفر</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {myRoom.isRecording && (
            <div className="flex items-center gap-1 px-2 py-0.5 rounded-full text-xs"
              style={{ background: "rgba(255,55,95,0.15)", border: "1px solid rgba(255,55,95,0.3)", color: "#ff375f" }}>
              <div className="w-1.5 h-1.5 rounded-full" style={{ background: "#ff375f", animation: "pulse-red 1s ease-in-out infinite" }} />
              REC
            </div>
          )}
          <div className="flex items-center gap-1 text-xs px-2 py-0.5 rounded-full"
            style={{ background: "rgba(255,255,255,0.04)", color: "#6e6e80" }}>
            {myRoom.isLocked ? <Lock size={10} /> : <Unlock size={10} />}
          </div>
        </div>
      </div>

      {/* Participants */}
      {isActive ? (
        <>
          <div className="mb-4">
            <div className="flex items-center gap-2 mb-3 text-xs" style={{ color: "#6e6e80" }}>
              <Users size={11} />
              <span>{myRoom.participants.length} شرکت‌کننده</span>
              {myRoom.startTime && (
                <>
                  <span>|</span>
                  <Clock size={11} />
                  <span>{formatDuration(joinElapsed + 1500)}</span>
                </>
              )}
            </div>

            <div className="flex flex-wrap gap-6 justify-center">
              {myRoom.participants.map(p => (
                <ParticipantBubble key={p.id} participant={p} isAdmin={p.isAdmin} />
              ))}
            </div>
          </div>

          {/* Visualizer */}
          <div className="mb-4 p-3 rounded-lg flex items-end gap-0.5 h-12"
            style={{ background: "rgba(0,0,0,0.2)" }}>
            {Array.from({ length: 40 }, (_, i) => (
              <div key={i} className="flex-1 rounded-full waveform-bar"
                style={{
                  height: `${30 + (i % 5) * 12}%`,
                  background: i % 4 === 0 ? "#00d4ff" : i % 4 === 1 ? "#bf5af2" : i % 4 === 2 ? "#30d158" : "#ff9f0a",
                  opacity: 0.5,
                  animationDelay: `${i * 0.05}s`,
                  animationDuration: `${0.5 + (i % 4) * 0.2}s`
                }} />
            ))}
          </div>

          {/* Actions */}
          <div className="flex gap-2">
            <button className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-xs"
              style={{ background: "rgba(0,212,255,0.1)", border: "1px solid rgba(0,212,255,0.25)", color: "#00d4ff" }}>
              <PhoneCall size={12} />
              پیوستن
            </button>
            <button className="flex items-center gap-1 py-2 px-3 rounded-lg text-xs"
              style={{ background: "rgba(48,209,88,0.1)", border: "1px solid rgba(48,209,88,0.2)", color: "#30d158" }}>
              <Plus size={12} />
              دعوت
            </button>
            <button className="p-2 rounded-lg"
              style={{ background: "rgba(255,55,95,0.1)", border: "1px solid rgba(255,55,95,0.2)", color: "#ff375f" }}>
              <PhoneOff size={12} />
            </button>
          </div>
        </>
      ) : (
        <div className="flex flex-col items-center py-6">
          <div className="w-16 h-16 rounded-full flex items-center justify-center mb-3"
            style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.05)" }}>
            <Radio size={24} style={{ color: "#4e4e60" }} />
          </div>
          <p className="text-xs mb-3" style={{ color: "#6e6e80" }}>اتاق خالی است</p>
          <button className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs"
            style={{ background: "rgba(0,212,255,0.1)", border: "1px solid rgba(0,212,255,0.25)", color: "#00d4ff" }}>
            <PhoneCall size={11} />
            شروع کنفرانس
          </button>
        </div>
      )}
    </motion.div>
  );
}

export function Conference() {
  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-lg mb-0.5" style={{ color: "#e0e0f0" }}>اتاق‌های کنفرانس</h1>
          <p className="text-xs" style={{ color: "#6e6e80" }}>MeetMe & ConfBridge - Asterisk</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm"
          style={{ background: "linear-gradient(135deg, rgba(0,212,255,0.2), rgba(0,212,255,0.1))", border: "1px solid rgba(0,212,255,0.3)", color: "#00d4ff" }}>
          <Plus size={14} />
          اتاق جدید
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3 mb-6">
        {[
          { label: "اتاق فعال", value: "1", color: "#30d158", icon: GitBranch },
          { label: "شرکت‌کننده", value: "3", color: "#00d4ff", icon: Users },
          { label: "ضبط فعال", value: "1", color: "#ff375f", icon: Radio },
        ].map(s => (
          <div key={s.label} className="rounded-lg p-3 flex items-center gap-3"
            style={{ background: "rgba(10,12,30,0.8)", border: `1px solid ${s.color}15` }}>
            <div className="p-2 rounded-lg" style={{ background: `${s.color}15` }}>
              <s.icon size={14} style={{ color: s.color }} />
            </div>
            <div>
              <div className="text-lg stat-value" style={{ color: "#e0e0f0" }}>{s.value}</div>
              <div className="text-xs" style={{ color: "#6e6e80" }}>{s.label}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Rooms grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {conferenceRooms.map(room => (
          <RoomCard key={room.id} room={room} />
        ))}
      </div>

      {/* Quick dial into conference */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="mt-5 rounded-xl p-4"
        style={{ background: "rgba(10,12,30,0.8)", border: "1px solid rgba(0,212,255,0.1)" }}
      >
        <h3 className="text-xs mb-3" style={{ color: "#8e8ea0", letterSpacing: "0.08em" }}>CONFERENCE DIAL</h3>
        <div className="flex gap-3">
          <input
            className="flex-1 px-3 py-2 rounded-lg text-sm outline-none"
            placeholder="شماره کنفرانس (مثال: 1000)..."
            style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(0,212,255,0.15)", color: "#e0e0f0" }}
          />
          <button className="px-4 py-2 rounded-lg text-xs flex items-center gap-2"
            style={{ background: "rgba(0,212,255,0.1)", border: "1px solid rgba(0,212,255,0.25)", color: "#00d4ff" }}>
            <PhoneCall size={13} />
            پیوستن
          </button>
        </div>
      </motion.div>
    </div>
  );
}