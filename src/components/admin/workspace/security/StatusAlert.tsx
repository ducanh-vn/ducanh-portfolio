import { CheckCircle2, AlertCircle } from 'lucide-react';
import type { StatusMessage } from '@/types/admin';

interface StatusAlertProps {
  message: StatusMessage;
}

/** Success / error banner used by the security forms. */
export default function StatusAlert({ message }: StatusAlertProps) {
  return (
    <div
      className={`p-4 rounded-xl border flex items-center space-x-3 text-xs ${
        message.type === 'success'
          ? 'bg-emerald-950/50 border-emerald-500/50 text-emerald-200'
          : 'bg-red-950/50 border-red-500/50 text-red-200'
      }`}
    >
      {message.type === 'success' ? (
        <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0" />
      ) : (
        <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0" />
      )}
      <span>{message.text}</span>
    </div>
  );
}
