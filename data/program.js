/* ── Conference Programme Data ─────────────────────────────── */
const PROGRAM = [
  {
    day: "Day 1",
    date: "Monday, 10 August 2026",
    theme: "Arrival & Opening Night",
    sessions: [
      { time: "2:00 PM",  title: "Arrival & Registration",    type: "logistics",  icon: "fa-clipboard-list",  speaker: "" },
      { time: "5:00 PM",  title: "Evening Prayer & Worship",  type: "prayer",     icon: "fa-hands",           speaker: "" },
      { time: "7:00 PM",  title: "Opening Ceremony",          type: "ceremony",   icon: "fa-star",            speaker: "" },
      { time: "8:00 PM",  title: "Opening Message",           type: "sermon",     icon: "fa-bible",           speaker: "Rev. [Speaker TBA]" },
    ],
  },
  {
    day: "Day 2",
    date: "Tuesday, 11 August 2026",
    theme: "Holiness & Consecration",
    sessions: [
      { time: "6:00 AM",  title: "Morning Prayer & Devotion", type: "prayer",     icon: "fa-sun",             speaker: "" },
      { time: "9:00 AM",  title: "Morning Session",           type: "sermon",     icon: "fa-bible",           speaker: "Pastor [TBA]" },
      { time: "11:00 AM", title: "Worship & Ministry",        type: "worship",    icon: "fa-music",           speaker: "" },
      { time: "2:00 PM",  title: "Afternoon Teaching",        type: "sermon",     icon: "fa-book-open",       speaker: "Guest Minister [TBA]" },
      { time: "7:00 PM",  title: "Evening Revival Service",   type: "sermon",     icon: "fa-fire",            speaker: "" },
    ],
  },
  {
    day: "Day 3",
    date: "Wednesday, 12 August 2026",
    theme: "Prayer & Intercession",
    sessions: [
      { time: "6:00 AM",  title: "Morning Prayer Watch",      type: "prayer",     icon: "fa-hands-praying",   speaker: "" },
      { time: "9:00 AM",  title: "Teaching on Prayer",        type: "sermon",     icon: "fa-bible",           speaker: "Pastor [TBA]" },
      { time: "11:00 AM", title: "Corporate Intercession",    type: "prayer",     icon: "fa-hands",           speaker: "" },
      { time: "2:00 PM",  title: "Youth Discipleship Class",  type: "workshop",   icon: "fa-users",           speaker: "" },
      { time: "7:00 PM",  title: "Night of Prayer",           type: "prayer",     icon: "fa-moon",            speaker: "" },
    ],
  },
  {
    day: "Day 4",
    date: "Thursday, 13 August 2026",
    theme: "Revival Fire",
    sessions: [
      { time: "6:00 AM",  title: "Morning Devotion",          type: "prayer",     icon: "fa-sun",             speaker: "" },
      { time: "9:00 AM",  title: "Revival Message",           type: "sermon",     icon: "fa-fire",            speaker: "Rev. [Speaker TBA]" },
      { time: "11:00 AM", title: "Worship & Encounter",       type: "worship",    icon: "fa-music",           speaker: "" },
      { time: "2:00 PM",  title: "Breakout Sessions",         type: "workshop",   icon: "fa-th",              speaker: "" },
      { time: "7:00 PM",  title: "Special Revival Service",   type: "sermon",     icon: "fa-star",            speaker: "Guest Minister [TBA]" },
    ],
  },
  {
    day: "Day 5",
    date: "Friday, 14 August 2026",
    theme: "Youth Gathering",
    sessions: [
      { time: "6:00 AM",  title: "Morning Prayer",            type: "prayer",     icon: "fa-hands",           speaker: "" },
      { time: "9:00 AM",  title: "Youth Main Session",        type: "sermon",     icon: "fa-users",           speaker: "Youth Minister [TBA]" },
      { time: "11:00 AM", title: "Testimonies & Worship",     type: "worship",    icon: "fa-music",           speaker: "" },
      { time: "2:00 PM",  title: "Leadership & Commissioning",type: "workshop",   icon: "fa-award",           speaker: "" },
      { time: "7:00 PM",  title: "Night of Worship",          type: "worship",    icon: "fa-music",           speaker: "" },
    ],
  },
  {
    day: "Day 6",
    date: "Saturday, 15 August 2026",
    theme: "Commissioning & Closing",
    sessions: [
      { time: "6:00 AM",  title: "Final Morning Prayer",      type: "prayer",     icon: "fa-sun",             speaker: "" },
      { time: "9:00 AM",  title: "Closing Message",           type: "sermon",     icon: "fa-bible",           speaker: "Rev. [Speaker TBA]" },
      { time: "11:00 AM", title: "Commissioning Service",     type: "ceremony",   icon: "fa-award",           speaker: "" },
      { time: "1:00 PM",  title: "Farewell & Departure",      type: "logistics",  icon: "fa-road",            speaker: "" },
    ],
  },
];

/* Session type badge colors */
const SESSION_TYPE_COLORS = {
  sermon:   'badge-blue',
  prayer:   'badge-red',
  worship:  'badge-green',
  workshop: 'badge-blue',
  ceremony: 'badge-blue',
  logistics:'badge-green',
};
