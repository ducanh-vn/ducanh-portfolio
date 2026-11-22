import { ExternalLink, FileText, Sparkles, Printer, LayoutTemplate, Palette } from 'lucide-react';

interface CvTabProps {
  cvUrl: string;
  onCvUrlChange: (value: string) => void;
}

/** TAB 5: CV BUILDER STUDIO */
export default function CvTab({ cvUrl, onCvUrlChange }: CvTabProps) {
  return (
      <div className="space-y-8">
        <div className="border-b border-neutral-800 pb-4 flex items-center justify-between flex-wrap gap-4">
          <div>
            <div className="flex items-center space-x-2">
              <FileText className="w-5 h-5 text-[#f1f505]" />
              <h2 className="font-serif text-2xl uppercase tracking-wider text-white">
                Bộ Tạo & Xuất CV (CV Studio)
              </h2>
            </div>
            <p className="text-xs text-neutral-400 mt-1">
              Công cụ tạo hồ sơ xin việc chuyên nghiệp, đồng bộ dữ liệu tự động và xuất file PDF chuẩn A4.
            </p>
          </div>

          <a
            href="/cv"
            target="_blank"
            className="flex items-center space-x-2 px-5 py-2.5 rounded-xl bg-[#f1f505] text-black font-semibold text-xs uppercase tracking-wider hover:bg-[#e0e404] transition-all shadow-lg shadow-[#f1f505]/10"
          >
            <Sparkles className="w-4 h-4" />
            <span>Mở Trình Tạo CV Trực Quan</span>
            <ExternalLink className="w-3.5 h-3.5 ml-1" />
          </a>
        </div>

        {/* Quick Config Card */}
        <div className="p-6 rounded-2xl bg-[#141414] border border-neutral-800 space-y-4">
          <h4 className="text-sm font-semibold text-white flex items-center space-x-2">
            <FileText className="w-4 h-4 text-[#f1f505]" />
            <span>Cấu hình nút "DOWNLOAD CV" trên Portfolio</span>
          </h4>
          <p className="text-xs text-neutral-400">
            Đường dẫn khi khách truy cập bấm vào nút <strong>DOWNLOAD CV</strong> tại trang chủ portfolio của bạn:
          </p>

          <div className="max-w-md space-y-2">
            <label className="block text-[11px] font-mono uppercase text-neutral-400">
              Đường dẫn CV (Mặc định: /cv)
            </label>
            <input
              type="text"
              value={cvUrl}
              onChange={(e) => onCvUrlChange(e.target.value)}
              placeholder="/cv hoặc link PDF Drive..."
              className="w-full bg-[#111] border border-neutral-700 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-[#f1f505]"
            />
            <p className="text-[11px] text-neutral-500">
              Mẹo: Để nguyên <code className="text-[#f1f505]">/cv</code> để người xem mở thẳng trình xem CV trực quan và in file PDF bất kỳ lúc nào.
            </p>
          </div>
        </div>

        {/* Feature Highlights Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-5 rounded-2xl bg-[#141414] border border-neutral-800 space-y-2">
            <div className="w-10 h-10 rounded-xl bg-neutral-900 border border-neutral-700 flex items-center justify-center text-[#f1f505]">
              <LayoutTemplate className="w-5 h-5" />
            </div>
            <h4 className="text-sm font-semibold text-white">3 Mẫu Thiết Kế</h4>
            <p className="text-xs text-neutral-400 leading-relaxed">
              Hỗ trợ chuyển đổi nhanh giữa <strong>Hiện đại (2 cột)</strong>, <strong>Chuẩn ATS (1 cột)</strong> và <strong>Editorial Luxury</strong>.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-[#141414] border border-neutral-800 space-y-2">
            <div className="w-10 h-10 rounded-xl bg-neutral-900 border border-neutral-700 flex items-center justify-center text-[#f1f505]">
              <Palette className="w-5 h-5" />
            </div>
            <h4 className="text-sm font-semibold text-white">Tuỳ biến Màu Sắc</h4>
            <p className="text-xs text-neutral-400 leading-relaxed">
              Chọn màu điểm nhấn (Vàng Neon, Xanh Dương, Xanh Ngọc, Slate Tối giản, Đỏ Hồng) và bật/tắt ảnh thẻ dễ dàng.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-[#141414] border border-neutral-800 space-y-2">
            <div className="w-10 h-10 rounded-xl bg-neutral-900 border border-neutral-700 flex items-center justify-center text-[#f1f505]">
              <Printer className="w-5 h-5" />
            </div>
            <h4 className="text-sm font-semibold text-white">Xuất PDF Chuẩn A4</h4>
            <p className="text-xs text-neutral-400 leading-relaxed">
              Định dạng in ấn chuyên nghiệp, tự động loại bỏ thanh công cụ và định dạng vừa vặn trang giấy A4 mà không bị vỡ bố cục.
            </p>
          </div>
        </div>
      </div>
  );
}
