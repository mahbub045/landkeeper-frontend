"use client";

// ── Toggle ────────────────────────────────────────────────────────────────────

interface ToggleProps {
  enabled: boolean;
  onToggle: () => void;
}

export function Toggle({ enabled, onToggle }: ToggleProps) {
  return (
    <button
      role="switch"
      aria-checked={enabled}
      onClick={onToggle}
      className={`relative inline-flex h-7 w-12 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:outline-none ${
        enabled ? "bg-blue-600" : "bg-gray-200 dark:bg-gray-600"
      }`}
    >
      <span
        className={`pointer-events-none mt-0.5 inline-block size-5 transform rounded-full bg-white shadow-sm transition-transform duration-200 ${
          enabled ? "translate-x-5" : "translate-x-0.5"
        }`}
      />
    </button>
  );
}

// ── FormField ─────────────────────────────────────────────────────────────────

interface FormFieldProps {
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
}

export function FormField({
  label,
  value,
  onChange,
  type = "text",
}: FormFieldProps) {
  return (
    <div className="space-y-1.5">
      <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">
        {label}
      </label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm text-gray-700 transition-colors focus:ring-2 focus:ring-blue-500 focus:outline-none dark:border-gray-600 dark:bg-gray-800 dark:text-gray-200"
      />
    </div>
  );
}
