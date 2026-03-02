export interface EventFormData {
  title: string;
  overview: string;
  description: string;
  organizer: string;
  date: string;
  time: string;
  mode: "online" | "offline" | "hybrid" | "";
  venue: string;
  location: string;
  audience: string;
  image: File | null;
  imagePreview: string;
  tags: string[];
  agenda: string[];
}

export interface StepErrors {
  [key: string]: string;
}

export interface StepProps {
  data: EventFormData;
  errors: StepErrors;
  update: (key: keyof EventFormData, value: unknown) => void;
}
