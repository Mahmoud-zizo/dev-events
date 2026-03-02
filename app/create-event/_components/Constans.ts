export const STEPS = [
  { id: 1, label: "Basic Info", short: "01" },
  { id: 2, label: "Event Details", short: "02" },
  { id: 3, label: "Media & Tags", short: "03" },
  { id: 4, label: "Review", short: "04" },
];

export const MODES = [
  { value: "online", label: "Online", icon: "⬡" },
  { value: "offline", label: "In-Person", icon: "◈" },
  { value: "hybrid", label: "Hybrid", icon: "◉" },
];

export const INITIAL_FORM_DATA = {
  title: "",
  overview: "",
  description: "",
  organizer: "",
  date: "",
  time: "",
  mode: "" as const,
  venue: "",
  location: "",
  audience: "",
  image: null,
  imagePreview: "",
  tags: [],
  agenda: [],
};

export const STEP_SUBTITLES: Record<number, string> = {
  1: "Tell us about your event",
  2: "When, where, and how it's happening",
  3: "Visuals, tags, and the schedule",
  4: "Confirm everything looks right",
};
