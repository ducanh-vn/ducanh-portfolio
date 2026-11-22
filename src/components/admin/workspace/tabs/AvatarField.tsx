import { useRef } from 'react';
import { ImageUp, User } from 'lucide-react';
import { ADMIN_INPUT_CLASS, ADMIN_LABEL_CLASS } from '@/constants/admin';
import { useAvatarUpload } from '@/hooks/admin/useAvatarUpload';

interface AvatarFieldProps {
  value: string;
  onChange: (url: string) => void;
}

/** Avatar preview with file upload and a manual URL fallback. */
export default function AvatarField({ value, onChange }: AvatarFieldProps) {
  const fileRef = useRef<HTMLInputElement>(null);
  const { isUploading, uploadError, upload } = useAvatarUpload(onChange);

  return (
    <div>
      <label className={ADMIN_LABEL_CLASS}>Ảnh đại diện</label>
      <div className="flex flex-col sm:flex-row sm:items-center gap-4">
        <div className="w-24 h-24 shrink-0 rounded-xl overflow-hidden border border-neutral-700 bg-neutral-900 flex items-center justify-center">
          {value ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={value} alt="Ảnh đại diện" className="w-full h-full object-cover" />
          ) : (
            <User className="w-8 h-8 text-neutral-600" />
          )}
        </div>

        <div className="flex-1 space-y-2.5">
          <div className="flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={() => fileRef.current?.click()}
              disabled={isUploading}
              className="flex items-center space-x-2 px-4 py-2 bg-neutral-800 hover:bg-neutral-700 rounded-xl text-xs uppercase tracking-wider text-[#f1f505] transition-colors border border-neutral-700 disabled:opacity-50"
            >
              <ImageUp className="w-4 h-4" />
              <span>{isUploading ? 'Đang tải ảnh...' : 'Tải ảnh lên'}</span>
            </button>
            <span className="text-[11px] text-neutral-500">
              JPG, PNG, WEBP, GIF, AVIF, tối đa 4 MB. Bấm &quot;Lưu dữ liệu&quot; để áp dụng.
            </span>
          </div>
          <input
            ref={fileRef}
            type="file"
            accept="image/jpeg,image/png,image/webp,image/gif,image/avif"
            className="hidden"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) upload(file);
              e.target.value = '';
            }}
          />
          <input
            type="text"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder="Hoặc dán link ảnh (https://...)"
            className={ADMIN_INPUT_CLASS}
          />
          {uploadError && <p className="text-xs text-red-400">{uploadError}</p>}
        </div>
      </div>
    </div>
  );
}
