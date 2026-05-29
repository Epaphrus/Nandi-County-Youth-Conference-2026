/* ── Conference Programme Data ─────────────────────────────── */
const PROGRAM = [
  {
    day: "Day 1",
    date: "Monday, 10 August 2026",
    theme: "Arrival & Opening Night",
    sessions: [
      { time: "2:00 PM",  title: "Arrival & Registration",    type: "logistics", speaker: "" },
      { time: "5:00 PM",  title: "Evening Prayer & Worship",  type: "prayer",    speaker: "" },
      { time: "7:00 PM",  title: "Opening Ceremony",          type: "ceremony",  speaker: "" },
      { time: "8:00 PM",  title: "Opening Message",           type: "sermon",    speaker: "Rev. [Speaker TBA]" },
    ],
  },
  {
    day: "Day 2",
    date: "Tuesday, 11 August 2026",
    theme: "Holiness & Consecration",
    sessions: [
      { time: "6:00 AM",  title: "Morning Prayer & Devotion", type: "prayer",    speaker: "" },
      { time: "9:00 AM",  title: "Morning Session",           type: "sermon",    speaker: "Pastor [TBA]" },
      { time: "11:00 AM", title: "Worship & Ministry",        type: "worship",   speaker: "" },
      { time: "2:00 PM",  title: "Afternoon Teaching",        type: "sermon",    speaker: "Guest Minister [TBA]" },
      { time: "7:00 PM",  title: "Evening Revival Service",   type: "sermon",    speaker: "" },
    ],
  },
  {
    day: "Day 3",
    date: "Wednesday, 12 August 2026",
    theme: "Prayer & Intercession",
    sessions: [
      { time: "6:00 AM",  title: "Morning Prayer Watch",      type: "prayer",    speaker: "" },
      { time: "9:00 AM",  title: "Teaching on Prayer",        type: "sermon",    speaker: "Pastor [TBA]" },
      { time: "11:00 AM", title: "Corporate Intercession",    type: "prayer",    speaker: "" },
      { time: "2:00 PM",  title: "Youth Discipleship Class",  type: "workshop",  speaker: "" },
      { time: "7:00 PM",  title: "Night of Prayer",           type: "prayer",    speaker: "" },
    ],
  },
  {
    day: "Day 4",
    date: "Thursday, 13 August 2026",
    theme: "Revival Fire",
    sessions: [
      { time: "6:00 AM",  title: "Morning Devotion",          type: "prayer",    speaker: "" },
      { time: "9:00 AM",  title: "Revival Message",           type: "sermon",    speaker: "Rev. [Speaker TBA]" },
      { time: "11:00 AM", title: "Worship & Encounter",       type: "worship",   speaker: "" },
      { time: "2:00 PM",  title: "Breakout Sessions",         type: "workshop",  speaker: "" },
      { time: "7:00 PM",  title: "Special Revival Service",   type: "sermon",    speaker: "Guest Minister [TBA]" },
    ],
  },
  {
    day: "Day 5",
    date: "Friday, 14 August 2026",
    theme: "Youth Gathering",
    sessions: [
      { time: "6:00 AM",  title: "Morning Prayer",            type: "prayer",    speaker: "" },
      { time: "9:00 AM",  title: "Youth Main Session",        type: "sermon",    speaker: "Youth Minister [TBA]" },
      { time: "11:00 AM", title: "Testimonies & Worship",     type: "worship",   speaker: "" },
      { time: "2:00 PM",  title: "Leadership & Commissioning",type: "workshop",  speaker: "" },
      { time: "7:00 PM",  title: "Night of Worship",          type: "worship",   speaker: "" },
    ],
  },
  {
    day: "Day 6",
    date: "Saturday, 15 August 2026",
    theme: "Commissioning & Closing",
    sessions: [
      { time: "6:00 AM",  title: "Final Morning Prayer",      type: "prayer",    speaker: "" },
      { time: "9:00 AM",  title: "Closing Message",           type: "sermon",    speaker: "Rev. [Speaker TBA]" },
      { time: "11:00 AM", title: "Commissioning Service",     type: "ceremony",  speaker: "" },
      { time: "1:00 PM",  title: "Farewell & Departure",      type: "logistics", speaker: "" },
    ],
  },
];

/* Session type → badge colour */
const SESSION_TYPE_COLORS = {
  sermon:   'badge-blue',
  prayer:   'badge-red',
  worship:  'badge-green',
  workshop: 'badge-gray',
  ceremony: 'badge-gray',
  logistics:'badge-gray',
};
