// VOIP Platform Mock Data based on Asterisk Configuration

export const MOTHER_NUMBER = "09120000000";
export const SERVER_IP = "192.168.1.1";
export const SERVER_PORT = "5060";
export const API_URL = `http://${SERVER_IP}:8088`;

export interface Extension {
  id: string;
  extension: string;
  name: string;
  email: string;
  status: "available" | "busy" | "dnd" | "offline" | "ringing";
  lastSeen: string;
  codec: string;
  ip?: string;
  callsToday: number;
  totalMinutes: number;
  voicemailCount: number;
}

export interface ActiveCall {
  id: string;
  uniqueid: string;
  caller: string;
  callerName: string;
  called: string;
  calledName: string;
  state: "connecting" | "ringing" | "connected" | "on_hold" | "transferring";
  duration: number;
  startTime: string;
  codec: string;
  channel: string;
  dstChannel: string;
  isMuted: boolean;
  isRecording: boolean;
  quality: number;
}

export interface CallRecord {
  id: string;
  calldate: string;
  src: string;
  srcName: string;
  dst: string;
  dstName: string;
  duration: number;
  billsec: number;
  disposition: "ANSWERED" | "NO ANSWER" | "BUSY" | "FAILED";
  uniqueid: string;
  recordingAvailable: boolean;
}

export interface VoicemailMessage {
  id: string;
  mailbox: string;
  callerid: string;
  callerName: string;
  duration: number;
  timestamp: string;
  folder: "INBOX" | "Old" | "Work" | "Family";
  isRead: boolean;
  transcription?: string;
}

export interface ConferenceRoom {
  id: string;
  confno: string;
  name: string;
  participants: ConferenceParticipant[];
  isLocked: boolean;
  isRecording: boolean;
  startTime?: string;
  maxParticipants: number;
}

export interface ConferenceParticipant {
  id: string;
  channel: string;
  callerid: string;
  name: string;
  isMuted: boolean;
  isAdmin: boolean;
  duration: number;
}

export interface SecurityLog {
  id: string;
  event_time: string;
  event_type: "REGISTER" | "AUTH_FAIL" | "BAN" | "SCAN" | "REGISTER_OK";
  ip_address: string;
  username: string;
  success: boolean;
  details: string;
}

// Extensions data (100-109 from asterisk config)
export const extensions: Extension[] = [
  { id: "1", extension: "100", name: "کاربر ۱۰۰", email: "user100@voip.mother.local", status: "available", lastSeen: "لحظاتی پیش", codec: "opus", ip: "192.168.1.101", callsToday: 12, totalMinutes: 87, voicemailCount: 2 },
  { id: "2", extension: "101", name: "کاربر ۱۰۱", email: "user101@voip.mother.local", status: "busy", lastSeen: "در حال مکالمه", codec: "g722", ip: "192.168.1.102", callsToday: 8, totalMinutes: 64, voicemailCount: 0 },
  { id: "3", extension: "102", name: "کاربر ۱۰۲", email: "user102@voip.mother.local", status: "dnd", lastSeen: "5 دقیقه پیش", codec: "ulaw", ip: "192.168.1.103", callsToday: 5, totalMinutes: 31, voicemailCount: 1 },
  { id: "4", extension: "103", name: "کاربر ۱۰۳", email: "user103@voip.mother.local", status: "available", lastSeen: "2 دقیقه پیش", codec: "opus", ip: "192.168.1.104", callsToday: 15, totalMinutes: 120, voicemailCount: 0 },
  { id: "5", extension: "104", name: "کاربر ۱۰۴", email: "user104@voip.mother.local", status: "ringing", lastSeen: "لحظاتی پیش", codec: "g729", ip: "192.168.1.105", callsToday: 3, totalMinutes: 22, voicemailCount: 3 },
  { id: "6", extension: "105", name: "کاربر ۱۰۵", email: "user105@voip.mother.local", status: "available", lastSeen: "10 دقیقه پیش", codec: "alaw", ip: "192.168.1.106", callsToday: 7, totalMinutes: 45, voicemailCount: 0 },
  { id: "7", extension: "106", name: "کاربر ۱۰۶", email: "user106@voip.mother.local", status: "offline", lastSeen: "1 ساعت پیش", codec: "-", ip: undefined, callsToday: 0, totalMinutes: 0, voicemailCount: 5 },
  { id: "8", extension: "107", name: "کاربر ۱۰۷", email: "user107@voip.mother.local", status: "busy", lastSeen: "در حال مکالمه", codec: "opus", ip: "192.168.1.108", callsToday: 11, totalMinutes: 93, voicemailCount: 0 },
  { id: "9", extension: "108", name: "کاربر ۱۰۸", email: "user108@voip.mother.local", status: "available", lastSeen: "لحظاتی پیش", codec: "g722", ip: "192.168.1.109", callsToday: 9, totalMinutes: 58, voicemailCount: 1 },
  { id: "10", extension: "109", name: "کاربر ۱۰۹", email: "user109@voip.mother.local", status: "available", lastSeen: "30 ثانیه پیش", codec: "opus", ip: "192.168.1.110", callsToday: 14, totalMinutes: 102, voicemailCount: 0 },
];

export const activeCalls: ActiveCall[] = [
  {
    id: "1",
    uniqueid: "1714158000.1",
    caller: "09120000000",
    callerName: "شماره مادر",
    called: "101",
    calledName: "کاربر ۱۰۱",
    state: "connected",
    duration: 142,
    startTime: "2026-04-26T10:23:18",
    codec: "opus",
    channel: "SIP/mother-0000001",
    dstChannel: "SIP/101-0000002",
    isMuted: false,
    isRecording: true,
    quality: 98,
  },
  {
    id: "2",
    uniqueid: "1714158100.2",
    caller: "102",
    callerName: "کاربر ۱۰۲",
    called: "103",
    calledName: "کاربر ۱۰۳",
    state: "connected",
    duration: 67,
    startTime: "2026-04-26T10:24:33",
    codec: "g722",
    channel: "SIP/102-0000003",
    dstChannel: "SIP/103-0000004",
    isMuted: false,
    isRecording: false,
    quality: 95,
  },
  {
    id: "3",
    uniqueid: "1714158200.3",
    caller: "09121234567",
    callerName: "خارجی",
    called: "104",
    calledName: "کاربر ۱۰۴",
    state: "ringing",
    duration: 8,
    startTime: "2026-04-26T10:25:52",
    codec: "ulaw",
    channel: "SIP/gateway-0000005",
    dstChannel: "SIP/104-0000006",
    isMuted: false,
    isRecording: false,
    quality: 92,
  },
  {
    id: "4",
    uniqueid: "1714158300.4",
    caller: "107",
    callerName: "کاربر ۱۰۷",
    called: "09139876543",
    calledName: "خارجی",
    state: "on_hold",
    duration: 231,
    startTime: "2026-04-26T10:21:09",
    codec: "opus",
    channel: "SIP/107-0000007",
    dstChannel: "SIP/gateway-0000008",
    isMuted: true,
    isRecording: true,
    quality: 87,
  },
];

export const callHistory: CallRecord[] = [
  { id: "1", calldate: "2026-04-26T10:15:00", src: "09120000000", srcName: "شماره مادر", dst: "100", dstName: "کاربر ۱۰۰", duration: 245, billsec: 230, disposition: "ANSWERED", uniqueid: "1714157700.1", recordingAvailable: true },
  { id: "2", calldate: "2026-04-26T10:08:22", src: "102", srcName: "کاربر ۱۰۲", dst: "09121111111", dstName: "خارجی", duration: 180, billsec: 172, disposition: "ANSWERED", uniqueid: "1714157302.2", recordingAvailable: false },
  { id: "3", calldate: "2026-04-26T09:55:11", src: "09129999999", srcName: "ناشناس", dst: "09120000000", dstName: "شماره مادر", duration: 12, billsec: 0, disposition: "NO ANSWER", uniqueid: "1714156511.3", recordingAvailable: false },
  { id: "4", calldate: "2026-04-26T09:42:33", src: "105", srcName: "کاربر ۱۰۵", dst: "108", dstName: "کاربر ۱۰۸", duration: 412, billsec: 400, disposition: "ANSWERED", uniqueid: "1714155753.4", recordingAvailable: true },
  { id: "5", calldate: "2026-04-26T09:30:00", src: "09120000000", srcName: "شماره مادر", dst: "106", dstName: "کاربر ۱۰۶", duration: 5, billsec: 0, disposition: "BUSY", uniqueid: "1714155000.5", recordingAvailable: false },
  { id: "6", calldate: "2026-04-26T09:18:45", src: "103", srcName: "کاربر ۱۰۳", dst: "109", dstName: "کاربر ۱۰۹", duration: 328, billsec: 315, disposition: "ANSWERED", uniqueid: "1714154325.6", recordingAvailable: true },
  { id: "7", calldate: "2026-04-26T09:05:12", src: "09135554444", srcName: "خارجی", dst: "09120000000", dstName: "شماره مادر", duration: 620, billsec: 608, disposition: "ANSWERED", uniqueid: "1714153512.7", recordingAvailable: true },
  { id: "8", calldate: "2026-04-26T08:52:00", src: "101", srcName: "کاربر ۱۰۱", dst: "09120000000", dstName: "شماره مادر", duration: 89, billsec: 75, disposition: "ANSWERED", uniqueid: "1714152720.8", recordingAvailable: false },
];

export const voicemailMessages: VoicemailMessage[] = [
  { id: "1", mailbox: "09120000000", callerid: "09121234567", callerName: "احمد محمدی", duration: 45, timestamp: "2026-04-26T09:30:00", folder: "INBOX", isRead: false, transcription: "سلام، خواستم راجع به جلسه فردا صحبت کنم..." },
  { id: "2", mailbox: "104", callerid: "09139876543", callerName: "ناشناس", duration: 28, timestamp: "2026-04-26T08:15:00", folder: "INBOX", isRead: false },
  { id: "3", mailbox: "106", callerid: "09120000000", callerName: "شماره مادر", duration: 12, timestamp: "2026-04-25T17:45:00", folder: "INBOX", isRead: true, transcription: "لطفاً با داخلی ۱۰۰ تماس بگیرید" },
  { id: "4", mailbox: "102", callerid: "09131111111", callerName: "رضا کریمی", duration: 67, timestamp: "2026-04-25T14:20:00", folder: "Old", isRead: true },
  { id: "5", mailbox: "106", callerid: "09152222222", callerName: "مریم حسینی", duration: 34, timestamp: "2026-04-25T11:05:00", folder: "INBOX", isRead: false, transcription: "فایل مربوطه را ارسال کردم..." },
  { id: "6", mailbox: "106", callerid: "09163333333", callerName: "علی رضایی", duration: 89, timestamp: "2026-04-24T16:30:00", folder: "Work", isRead: true },
];

export const conferenceRooms: ConferenceRoom[] = [
  {
    id: "1",
    confno: "1000",
    name: "اتاق کنفرانس اصلی",
    isLocked: false,
    isRecording: true,
    startTime: "2026-04-26T10:00:00",
    maxParticipants: 20,
    participants: [
      { id: "1", channel: "SIP/100-00001", callerid: "100", name: "کاربر ۱۰۰", isMuted: false, isAdmin: true, duration: 1500 },
      { id: "2", channel: "SIP/103-00002", callerid: "103", name: "کاربر ۱۰۳", isMuted: false, isAdmin: false, duration: 1200 },
      { id: "3", channel: "SIP/105-00003", callerid: "105", name: "کاربر ۱۰۵", isMuted: true, isAdmin: false, duration: 900 },
    ],
  },
  {
    id: "2",
    confno: "2000",
    name: "اتاق پشتیبانی",
    isLocked: true,
    isRecording: false,
    maxParticipants: 5,
    participants: [],
  },
  {
    id: "3",
    confno: "3000",
    name: "اتاق مدیریت",
    isLocked: true,
    isRecording: true,
    maxParticipants: 10,
    participants: [],
  },
];

export const securityLogs: SecurityLog[] = [
  { id: "1", event_time: "2026-04-26T10:25:33", event_type: "REGISTER_OK", ip_address: "192.168.1.101", username: "100", success: true, details: "ثبت نام موفق" },
  { id: "2", event_time: "2026-04-26T10:20:11", event_type: "AUTH_FAIL", ip_address: "185.234.56.78", username: "admin", success: false, details: "تلاش ناموفق - رمز اشتباه" },
  { id: "3", event_time: "2026-04-26T10:18:44", event_type: "SCAN", ip_address: "45.89.123.55", username: "unknown", success: false, details: "اسکن پورت SIP شناسایی شد" },
  { id: "4", event_time: "2026-04-26T10:15:22", event_type: "BAN", ip_address: "45.89.123.55", username: "-", success: false, details: "IP مسدود شد - حملات متعدد" },
  { id: "5", event_time: "2026-04-26T10:10:05", event_type: "REGISTER", ip_address: "192.168.1.108", username: "107", success: true, details: "ثبت نام موفق" },
  { id: "6", event_time: "2026-04-26T09:55:18", event_type: "AUTH_FAIL", ip_address: "91.230.11.5", username: "1000", success: false, details: "اکستنشن نامعتبر" },
];

export const callVolumeData = [
  { time: "00:00", incoming: 2, outgoing: 1 },
  { time: "02:00", incoming: 0, outgoing: 0 },
  { time: "04:00", incoming: 1, outgoing: 0 },
  { time: "06:00", incoming: 3, outgoing: 2 },
  { time: "08:00", incoming: 12, outgoing: 8 },
  { time: "09:00", incoming: 18, outgoing: 15 },
  { time: "10:00", incoming: 25, outgoing: 22 },
  { time: "11:00", incoming: 30, outgoing: 28 },
  { time: "12:00", incoming: 20, outgoing: 18 },
  { time: "13:00", incoming: 15, outgoing: 12 },
  { time: "14:00", incoming: 28, outgoing: 25 },
  { time: "15:00", incoming: 35, outgoing: 30 },
  { time: "16:00", incoming: 22, outgoing: 20 },
  { time: "17:00", incoming: 15, outgoing: 13 },
  { time: "18:00", incoming: 8, outgoing: 6 },
  { time: "20:00", incoming: 5, outgoing: 3 },
  { time: "22:00", incoming: 3, outgoing: 2 },
];

export const codecDistribution = [
  { name: "Opus", value: 45, color: "#00d4ff" },
  { name: "G.722", value: 25, color: "#bf5af2" },
  { name: "G.729", value: 15, color: "#30d158" },
  { name: "uLaw", value: 10, color: "#ff9f0a" },
  { name: "G.711", value: 5, color: "#ff375f" },
];

export const formatDuration = (seconds: number): string => {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;
  if (h > 0) return `${h}:${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  return `${m}:${s.toString().padStart(2, "0")}`;
};
