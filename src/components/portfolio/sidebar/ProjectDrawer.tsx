'use client';

import React from 'react';
import { X, ArrowUpRight } from 'lucide-react';
import type { ProjectItem } from '@/types/portfolio';
import { useOverlay } from '@/hooks/useOverlay';
import { isUsableUrl } from '@/lib/url';
import { padIndex } from '@/lib/format';

interface ProjectDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  projects: ProjectItem[];
  onSelectProject: (project: ProjectItem) => void;
}

export default function ProjectDrawer({
  isOpen,
  onClose,
  projects,
  onSelectProject,
}: ProjectDrawerProps) {
  useOverlay(isOpen, onClose);

  return (
    <>
      <div
        id="drawerOverlay"
        className={isOpen ? 'open' : ''}
        onClick={onClose}
        aria-hidden="true"
      />
      <aside
        id="projectDrawer"
        className={isOpen ? 'open' : ''}
        role="dialog"
        aria-modal="true"
        aria-labelledby="projectDrawerTitle"
        aria-hidden={!isOpen}
      >
        <div className="flex items-center justify-between pb-6 border-b border-neutral-800">
          <div>
            <span className="font-cursive text-xl text-[#f1f505]">Selected Works</span>
            <h2
              id="projectDrawerTitle"
              className="font-serif text-2xl text-white uppercase tracking-wider"
            >
              Featured Projects
            </h2>
          </div>
          <button
            onClick={onClose}
            aria-label="Đóng danh sách dự án"
            className="p-2.5 rounded-full hover:bg-neutral-800 text-neutral-400 hover:text-white transition-colors"
            data-cursor="pointer"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <ul className="mt-8 space-y-6">
          {projects.map((p, index) => (
            <li key={p.id} className="project-card relative p-5 sm:p-6">
              <div className="flex justify-between items-start gap-3">
                <span className="font-cursive text-lg text-[#f1f505]">
                  {padIndex(index + 1)}. {p.category}
                </span>
                <span className="text-[11px] uppercase font-mono px-2 py-0.5 rounded bg-neutral-800 text-neutral-300 shrink-0">
                  {p.year}
                </span>
              </div>
              <h3 className="font-serif text-2xl text-white mt-1">
                {/* Whole card is clickable via this button's stretched ::after; keyboard reachable */}
                <button
                  type="button"
                  className="text-left after:absolute after:inset-0 after:content-[''] focus-visible:outline-none"
                  onClick={() => {
                    onSelectProject(p);
                    onClose();
                  }}
                  data-cursor="view"
                  tabIndex={isOpen ? 0 : -1}
                >
                  {p.title}
                </button>
              </h3>
              <p className="text-sm text-neutral-400 leading-relaxed mt-2 line-clamp-2">{p.desc}</p>
              <div className="flex flex-wrap gap-2 mt-4">
                {p.badges?.map((b) => (
                  <span
                    key={b}
                    className="text-[11px] font-mono bg-neutral-900 border border-neutral-800 px-2 py-1 rounded text-neutral-300"
                  >
                    {b}
                  </span>
                ))}
              </div>
              <div className="mt-5 flex items-center justify-between pt-4 border-t border-neutral-800/80">
                <span className="text-xs text-[#f1f505] font-semibold flex items-center space-x-1">
                  <span>Chi tiết dự án</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </span>
                {isUsableUrl(p.liveDemo) && (
                  <a
                    href={p.liveDemo}
                    target="_blank"
                    rel="noopener noreferrer"
                    tabIndex={isOpen ? 0 : -1}
                    className="relative z-10 inline-flex items-center min-h-[44px] px-2 -mr-2 text-xs text-neutral-400 hover:text-[#f1f505] underline underline-offset-4 transition-colors"
                    data-cursor="pointer"
                  >
                    Live Demo ↗
                  </a>
                )}
              </div>
            </li>
          ))}
        </ul>
      </aside>
    </>
  );
}
