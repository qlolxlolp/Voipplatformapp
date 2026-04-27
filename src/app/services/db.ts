import Dexie, { type Table } from "dexie";

export interface CallLog {
  id?: number;
  direction: "incoming" | "outgoing" | "missed";
  number: string;
  name: string;
  duration: number; // in seconds
  timestamp: number;
  status: "answered" | "no-answer" | "busy" | "failed";
}

export interface Contact {
  id?: number;
  name: string;
  number: string;
  type: "internal" | "external";
  status: "available" | "busy" | "offline" | "dnd";
}

export interface Voicemail {
  id?: number;
  from: string;
  duration: number;
  timestamp: number;
  isRead: boolean;
  audioData?: Blob; // Using blob for future local storage of audio
}

export interface SystemLog {
  id?: number;
  type: "info" | "warning" | "error" | "security";
  message: string;
  timestamp: number;
  ip?: string;
  user?: string;
}

export class VoipDatabase extends Dexie {
  calls!: Table<CallLog, number>;
  contacts!: Table<Contact, number>;
  voicemails!: Table<Voicemail, number>;
  logs!: Table<SystemLog, number>;

  constructor() {
    super("VoipMotherDB");
    this.version(1).stores({
      calls: "++id, direction, number, timestamp, status",
      contacts: "++id, name, number, type, status",
      voicemails: "++id, from, timestamp, isRead",
      logs: "++id, type, timestamp, ip",
    });
  }
}

export const db = new VoipDatabase();

// Initialize some mock data if empty
db.on("populate", async () => {
  await db.contacts.bulkAdd([
    { name: "مدیریت", number: "100", type: "internal", status: "available" },
    { name: "فروش", number: "101", type: "internal", status: "available" },
    { name: "پشتیبانی", number: "102", type: "internal", status: "busy" },
    { name: "شماره مادر", number: "09120000000", type: "external", status: "available" }
  ]);

  await db.calls.bulkAdd([
    { direction: "incoming", number: "09121112233", name: "مشتری ۱", duration: 120, timestamp: Date.now() - 3600000, status: "answered" },
    { direction: "outgoing", number: "102", name: "پشتیبانی", duration: 45, timestamp: Date.now() - 7200000, status: "answered" },
    { direction: "missed", number: "09354445566", name: "ناشناس", duration: 0, timestamp: Date.now() - 86400000, status: "no-answer" }
  ]);
});
