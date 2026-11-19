import { toPng, toJpeg } from 'html-to-image';

export type ImageExportFormat = 'png' | 'jpeg';
export type ExportResolution = 1 | 2 | 3;

export interface ExportImageOptions {
  elementId?: string;
  format?: ImageExportFormat;
  resolution?: ExportResolution; // 1 = 1x, 2 = 2x (Retina 300 DPI), 3 = 3x (Ultra HD)
  fileName?: string;
  quality?: number; // for jpeg: 0.1 to 1.0 (default 0.95)
}

/**
 * Cleanly renders and downloads the CV paper element as a high-resolution PNG or JPG image.
 */
export async function exportCVToImage({
  elementId = 'cv-paper',
  format = 'png',
  resolution = 2,
  fileName,
  quality = 0.95,
}: ExportImageOptions = {}): Promise<{ success: boolean; dataUrl?: string; error?: string }> {
  try {
    const targetElement = document.getElementById(elementId);
    if (!targetElement) {
      throw new Error(`Không tìm thấy phần tử #${elementId} để xuất ảnh.`);
    }

    // Filter out UI elements that should not appear on the exported image
    const filter = (node: HTMLElement) => {
      if (!node.classList) return true;
      if (
        node.classList.contains('no-print') ||
        node.classList.contains('no-export') ||
        node.classList.contains('cv-export-ignore')
      ) {
        return false;
      }
      return true;
    };

    const options = {
      pixelRatio: resolution,
      backgroundColor: '#ffffff',
      filter: filter as any,
      cacheBust: true,
      skipFonts: false,
    };

    let dataUrl = '';
    if (format === 'png') {
      dataUrl = await toPng(targetElement, options);
    } else {
      dataUrl = await toJpeg(targetElement, {
        ...options,
        quality,
      });
    }

    // Trigger download in browser
    const link = document.createElement('a');
    const ext = format === 'jpeg' ? 'jpg' : 'png';
    link.download = fileName ? `${fileName}.${ext}` : `CV_${new Date().toISOString().slice(0, 10)}.${ext}`;
    link.href = dataUrl;
    link.style.display = 'none';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    return { success: true, dataUrl };
  } catch (err: any) {
    console.error('Error exporting CV to image:', err);
    return { success: false, error: err?.message || 'Có lỗi khi tạo ảnh.' };
  }
}
