'use client';

import React from 'react';
import { X, ExternalLink, Github } from 'lucide-react';
import type { ProjectItem } from '@/types/portfolio';
import { useOverlay } from '@/hooks/useOverlay';
import { useModalPresence } from '@/hooks/useModalPresence';
import { isUsableUrl } from '@/lib/url';

interface ProjectModalProps {
  project: ProjectItem | null;
  onClose: () => void;
}

export default function ProjectModal({ project, onClose }: ProjectModalProps) {
  // Keep the last project mounted while the modal fades out
  const { shown, isOpen, closeBtnRef } = useModalPresence<ProjectItem>(project);

  useOverlay(!!project, onClose);

  if (!shown) return null;

  return (
    <div
      id="projectModal"
      className={isOpen ? 'open' : ''}
      onClick={onClose}
    >
      <div
        className="modal-content-box"
        role="dialog"
        aria-modal="true"
        aria-labelledby="projectModalTitle"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          ref={closeBtnRef}
          onClick={onClose}
          aria-label="Đóng chi tiết dự án"
          className="absolute top-4 right-4 md:top-6 md:right-6 z-20 p-2.5 rounded-full bg-neutral-900/80 text-white hover:text-[#f1f505] transition-colors"
          data-cursor="pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Top Dark Section */}
        <div className="p-6 pt-14 md:p-12 border-b border-neutral-800">
          <span className="font-cursive text-xl text-[#f1f505]">
            {shown.category}
          </span>
          <h2
            id="projectModalTitle"
            className="font-serif text-2xl sm:text-3xl md:text-5xl text-white mt-2 uppercase tracking-normal sm:tracking-wide md:pr-12"
          >
            {shown.title}
          </h2>

          <div className="flex flex-wrap gap-2 mt-4">
            {shown.badges?.map((b) => (
              <span
                key={b}
                className="text-[11px] font-mono bg-neutral-900 border border-neutral-700 text-[#f1f505] px-2.5 py-1 rounded"
              >
                {b}
              </span>
            ))}
          </div>

          <p className="text-neutral-400 text-sm leading-relaxed mt-6 max-w-2xl">
            {shown.desc}
          </p>

          <div className="mt-8 flex flex-col sm:flex-row gap-3">
            {isUsableUrl(shown.liveDemo) && (
              <a
                href={shown.liveDemo}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto justify-center whitespace-nowrap px-6 py-3 bg-[#f1f505] text-black font-semibold text-xs uppercase tracking-widest rounded-lg hover:shadow-lg hover:shadow-[#f1f505]/20 transition-all flex items-center gap-2"
                data-cursor="pointer"
              >
                <span>Trải nghiệm Website</span>
                <ExternalLink className="w-4 h-4" />
              </a>
            )}
            {isUsableUrl(shown.github) && (
              <a
                href={shown.github}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto justify-center whitespace-nowrap px-6 py-3 bg-neutral-800 text-white font-medium text-xs uppercase tracking-widest rounded-lg hover:bg-neutral-700 hover:text-[#f1f505] transition-colors flex items-center gap-2"
                data-cursor="pointer"
              >
                <Github className="w-4 h-4" />
                <span>Mã nguồn</span>
              </a>
            )}
          </div>
        </div>

        {/* Bottom Paper Section (High-Contrast White Paper Showcase) */}
        {shown.features && shown.features.length > 0 && (
          <div className="paper-section">
            <span className="text-xs uppercase font-mono tracking-widest text-neutral-600 font-bold block mb-4">
              Architecture & Key Features
            </span>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
              {shown.features.map((f, i) => (
                <div
                  key={i}
                  className="bg-white p-5 rounded-xl border border-neutral-200 shadow-sm"
                >
                  <h4 className="font-bold text-sm text-neutral-900 mb-1 flex items-start gap-2">
                    <span className="mt-[7px] w-1.5 h-1.5 rounded-full bg-[#141414] shrink-0" />
                    <span>{f.title}</span>
                  </h4>
                  <p className="text-[13px] text-neutral-600 leading-relaxed">
                    {f.detail}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
