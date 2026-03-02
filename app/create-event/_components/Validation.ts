import { EventFormData, StepErrors } from "./types";

export function validateStep(step: number, data: EventFormData): StepErrors {
  const errors: StepErrors = {};

  if (step === 1) {
    if (!data.title.trim()) errors.title = "Title is required";
    else if (data.title.length > 100) errors.title = "Max 100 characters";
    if (!data.overview.trim()) errors.overview = "Overview is required";
    else if (data.overview.length > 500) errors.overview = "Max 500 characters";
    if (!data.description.trim())
      errors.description = "Description is required";
    else if (data.description.length > 1000)
      errors.description = "Max 1000 characters";
    if (!data.organizer.trim()) errors.organizer = "Organizer is required";
  }

  if (step === 2) {
    if (!data.date) errors.date = "Date is required";
    if (!data.time) errors.time = "Time is required";
    if (!data.mode) errors.mode = "Select an event mode";
    if (!data.venue.trim()) errors.venue = "Venue is required";
    if (!data.location.trim()) errors.location = "Location is required";
    if (!data.audience.trim()) errors.audience = "Target audience is required";
  }

  if (step === 3) {
    if (!data.image) errors.image = "Cover image is required";
    if (data.tags.length === 0) errors.tags = "Add at least one tag";
    if (data.agenda.length === 0)
      errors.agenda = "Add at least one agenda item";
    else if (data.agenda.some((a) => !a.trim()))
      errors.agenda = "Remove empty agenda items";
  }

  return errors;
}
