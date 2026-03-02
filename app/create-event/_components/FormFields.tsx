"use client";

// ─── FieldLabel ───────────────────────────────────────────────────────────────

export function FieldLabel({
  children,
  required,
}: {
  children: React.ReactNode;
  required?: boolean;
}) {
  return (
    <label className="block text-xs font-mono tracking-widest text-zinc-400 uppercase mb-2">
      {children}
      {required && <span className="text-emerald-400 ml-1">*</span>}
    </label>
  );
}

// ─── FieldError ───────────────────────────────────────────────────────────────

export function FieldError({ message }: { message?: string }) {
  if (!message) return null;
  return (
    <p className="mt-1.5 text-xs font-mono text-red-400 flex items-center gap-1">
      <span>✕</span> {message}
    </p>
  );
}

// ─── Input ────────────────────────────────────────────────────────────────────

export function Input({
  value,
  onChange,
  placeholder,
  maxLength,
  error,
  type = "text",
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  maxLength?: number;
  error?: string;
  type?: string;
}) {
  return (
    <div>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        maxLength={maxLength}
        className={`w-full bg-zinc-900 border ${
          error ? "border-red-500/60" : "border-zinc-700"
        } rounded-lg px-4 py-3 text-sm text-zinc-100 font-mono
        placeholder:text-zinc-600 focus:outline-none focus:border-emerald-500/60
        focus:ring-1 focus:ring-emerald-500/20 transition-all duration-200`}
      />
      {maxLength ? (
        <div className="flex justify-between items-center mt-1">
          <FieldError message={error} />
          <span className="text-xs font-mono text-zinc-600 ml-auto">
            {value.length}/{maxLength}
          </span>
        </div>
      ) : (
        <FieldError message={error} />
      )}
    </div>
  );
}

// ─── Textarea ─────────────────────────────────────────────────────────────────

export function Textarea({
  value,
  onChange,
  placeholder,
  maxLength,
  rows = 4,
  error,
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  maxLength?: number;
  rows?: number;
  error?: string;
}) {
  return (
    <div>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        maxLength={maxLength}
        rows={rows}
        className={`w-full bg-zinc-900 border ${
          error ? "border-red-500/60" : "border-zinc-700"
        } rounded-lg px-4 py-3 text-sm text-zinc-100 font-mono resize-none
        placeholder:text-zinc-600 focus:outline-none focus:border-emerald-500/60
        focus:ring-1 focus:ring-emerald-500/20 transition-all duration-200`}
      />
      {maxLength ? (
        <div className="flex justify-between items-center mt-1">
          <FieldError message={error} />
          <span className="text-xs font-mono text-zinc-600 ml-auto">
            {value.length}/{maxLength}
          </span>
        </div>
      ) : (
        <FieldError message={error} />
      )}
    </div>
  );
}
