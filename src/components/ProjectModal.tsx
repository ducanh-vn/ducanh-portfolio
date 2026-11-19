'use client';

import React from 'react';
import { X, ExternalLink, Github } from 'lucide-react';
import { ProjectItem } from '@/lib/data';

interface ProjectModalProps {
  project: ProjectItem | null;
  onClose: () => void;
}

export default function ProjectModal({ project, onClose }: ProjectModalProps) {
  if (!project) return null;

  return (
    <div
      id="projectModal"
      className="open"
      onClick={onClose}
    >
      <div
        className="modal-content-box"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-6 right-6 z-20 p-2 rounded-full bg-neutral-900/80 text-white hover:text-[#f1f505] transition-colors"
          data-cursor="pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Top Dark Section */}
        <div className="p-8 md:p-12 border-b border-neutral-800">
          <span className="font-cursive text-xl text-[#f1f505]">
            {project.category}
          </span>
          <h2 className="font-serif text-3xl md:text-5xl text-white mt-2 uppercase tracking-wide">
            {project.title}
          </h2>

          <div className="flex flex-wrap gap-2 mt-4">
            {project.badges?.map((b) => (
              <span
                key={b}
                className="text-[11px] font-mono bg-neutral-900 border border-neutral-700 text-[#f1f505] px-2.5 py-1 rounded"
              >
                {b}
              </span>
            ))}
          </div>

          <p className="text-neutral-400 text-sm leading-relaxed mt-6 max-w-2xl">
            {project.desc}
          </p>

          <div className="mt-8 flex items-center space-x-4">
            {project.liveDemo && (
              <a
                href={project.liveDemo}
                target="_blank"
                rel="noopener noreferrer"
                className="px-6 py-3 bg-[#f1f505] text-black font-semibold text-xs uppercase tracking-widest rounded-lg hover:shadow-lg hover:shadow-[#f1f505]/20 transition-all flex items-center space-x-2"
                data-cursor="pointer"
              >
                <span>Trải nghiệm Website</span>
                <ExternalLink className="w-4 h-4" />
              </a>
            )}
            {project.github && (
              <a
                href={project.github}
                target="_blank"
                rel="noopener noreferrer"
                className="px-6 py-3 bg-neutral-800 text-white font-medium text-xs uppercase tracking-widest rounded-lg hover:bg-neutral-700 transition-colors flex items-center space-x-2"
                data-cursor="pointer"
              >
                <Github className="w-4 h-4" />
                <span>Mã nguồn</span>
              </a>
            )}
          </div>
        </div>

        {/* Bottom Paper Section (High-Contrast White Paper Showcase) */}
        {project.features && project.features.length > 0 && (
          <div className="paper-section">
            <span className="text-xs uppercase font-mono tracking-widest text-neutral-500 font-bold block mb-4">
              Architecture & Key Features
            </span>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {project.features.map((f, i) => (
                <div
                  key={i}
                  className="bg-white p-5 rounded-xl border border-neutral-200 shadow-sm"
                >
                  <h4 className="font-bold text-sm text-neutral-900 mb-1 flex items-center space-x-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#141414]" />
                    <span>{f.title}</span>
                  </h4>
                  <p className="text-xs text-neutral-600 leading-relaxed">
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
