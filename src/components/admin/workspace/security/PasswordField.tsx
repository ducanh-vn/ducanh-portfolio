import { Eye, EyeOff } from 'lucide-react';

interface PasswordFieldProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  show: boolean;
  onToggle: () => void;
  minLength?: number;
}

/** Labelled password input with a show/hide toggle. */
export default function PasswordField({
  label,
  value,
  onChange,
  placeholder,
  show,
  onToggle,
  minLength,
}: PasswordFieldProps) {
  return (
    <div>
      <label className="block text-xs font-mono uppercase tracking-wider text-neutral-400 mb-2">
        {label}
      </label>
      <div className="relative">
        <input
          type={show ? 'text' : 'password'}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          required
          minLength={minLength}
          className="w-full bg-[#121212] border border-neutral-700 rounded-xl pl-4 pr-12 py-2.5 text-sm text-white focus:outline-none focus:border-[#f1f505]"
        />
        <button
          type="button"
          onClick={onToggle}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-[#f1f505] p-1.5 transition-colors"
          title={show ? 'Ẩn' : 'Hiện'}
        >
          {show ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
        </button>
      </div>
    </div>
  );
}
