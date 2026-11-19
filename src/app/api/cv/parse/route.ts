import { NextResponse } from 'next/server';
import { parseCVText, ParsedCVResult } from '@/lib/cvParser';

// Disable body parser for large file uploads if needed, or handle standard Request
export const dynamic = 'force-dynamic';

async function extractTextFromPDF(buffer: Buffer): Promise<string> {
  try {
    const pdfParsePkg = require('pdf-parse');
    if (pdfParsePkg.PDFParse) {
      const parser = new pdfParsePkg.PDFParse({ data: buffer });
      const res = await parser.getText();
      return res.text || '';
    }
    if (typeof pdfParsePkg === 'function') {
      const res = await pdfParsePkg(buffer);
      return res.text || '';
    }
    if (pdfParsePkg.default && typeof pdfParsePkg.default === 'function') {
      const res = await pdfParsePkg.default(buffer);
      return res.text || '';
    }
    throw new Error('PDF parsing engine not initialized');
  } catch (err: any) {
    console.error('PDF extraction error:', err);
    throw new Error(err.message || 'Không thể trích xuất văn bản từ file PDF');
  }
}

async function extractTextFromDocx(buffer: Buffer): Promise<string> {
  try {
    const mammoth = require('mammoth');
    const result = await mammoth.extractRawText({ buffer });
    return result.value || '';
  } catch (err: any) {
    console.error('DOCX extraction error:', err);
    throw new Error(err.message || 'Không thể trích xuất văn bản từ file Word (.docx)');
  }
}

export async function POST(request: Request) {
  try {
    const contentType = request.headers.get('content-type') || '';

    // Case 1: multipart/form-data file upload (PDF, DOCX, TXT, JSON)
    if (contentType.includes('multipart/form-data')) {
      const formData = await request.formData();
      const file = formData.get('file') as File | null;

      if (!file) {
        return NextResponse.json({ success: false, error: 'Vui lòng chọn file CV cần tải lên.' }, { status: 400 });
      }

      const fileName = file.name || 'cv_document';
      const fileExt = fileName.split('.').pop()?.toLowerCase() || '';
      const arrayBuffer = await file.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);

      let extractedText = '';

      if (fileExt === 'pdf') {
        extractedText = await extractTextFromPDF(buffer);
      } else if (fileExt === 'docx') {
        extractedText = await extractTextFromDocx(buffer);
      } else if (fileExt === 'txt' || fileExt === 'md') {
        extractedText = buffer.toString('utf8');
      } else if (fileExt === 'json') {
        try {
          const jsonContent = JSON.parse(buffer.toString('utf8'));
          // If already structured CV, return directly
          if (jsonContent.name || jsonContent.cv) {
            const rawCv = jsonContent.cv || jsonContent;
            return NextResponse.json({
              success: true,
              result: {
                cv: rawCv,
                detectedLang: jsonContent.lang || 'vi',
                confidenceScore: 98,
                stats: {
                  skillsCount: (rawCv.skills || []).length,
                  experienceCount: (rawCv.timeline || []).length,
                  projectsCount: (rawCv.projects || []).length,
                  educationCount: (rawCv.education || []).length,
                  hasContact: !!rawCv.email,
                  hasSummary: !!rawCv.summary,
                },
                rawTextLength: buffer.length,
                fileName,
              } as ParsedCVResult,
            });
          }
          extractedText = JSON.stringify(jsonContent, null, 2);
        } catch {
          extractedText = buffer.toString('utf8');
        }
      } else {
        return NextResponse.json(
          { success: false, error: 'Định dạng file chưa được hỗ trợ. Vui lòng tải lên file .pdf, .docx, .txt hoặc .json' },
          { status: 400 }
        );
      }

      if (!extractedText || extractedText.trim().length < 20) {
        return NextResponse.json(
          {
            success: false,
            error: 'Không tìm thấy nội dung văn bản trong file (có thể là file scan hoặc ảnh). Vui lòng dùng file PDF có thể chọn văn bản hoặc dán trực tiếp nội dung.',
          },
          { status: 422 }
        );
      }

      const parsed = parseCVText(extractedText, fileName);
      return NextResponse.json({ success: true, result: parsed });
    }

    // Case 2: application/json direct text / clipboard paste
    if (contentType.includes('application/json')) {
      const body = await request.json();
      const { text, fileName } = body;

      if (!text || typeof text !== 'string' || text.trim().length < 20) {
        return NextResponse.json(
          { success: false, error: 'Nội dung văn bản CV quá ngắn hoặc không hợp lệ. Vui lòng cung cấp ít nhất 20 ký tự.' },
          { status: 400 }
        );
      }

      const parsed = parseCVText(text, fileName || 'Dán từ bộ nhớ tạm');
      return NextResponse.json({ success: true, result: parsed });
    }

    return NextResponse.json(
      { success: false, error: 'Invalid Content-Type header. Use multipart/form-data or application/json.' },
      { status: 400 }
    );
  } catch (err: any) {
    console.error('CV Parse API error:', err);
    return NextResponse.json(
      { success: false, error: err.message || 'Đã xảy ra lỗi khi phân tích và trích xuất CV.' },
      { status: 500 }
    );
  }
}
