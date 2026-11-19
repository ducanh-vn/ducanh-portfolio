'use client';

import React from 'react';
import { X, ArrowUpRight } from 'lucide-react';
import { ProjectItem } from '@/lib/data';

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
  return (
    <>
      <div
        id="drawerOverlay"
        className={isOpen ? 'open' : ''}
        onClick={onClose}
      />
      <aside id="projectDrawer" className={isOpen ? 'open' : ''}>
        <div className="flex items-center justify-between pb-6 border-b border-neutral-800">
          <div>
            <span className="font-cursive text-xl text-[#f1f505]">Selected Works</span>
            <h2 className="font-serif text-2xl text-white uppercase tracking-wider">
              Featured Projects
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-neutral-800 text-neutral-400 hover:text-white transition-colors"
            data-cursor="pointer"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="mt-8 space-y-6">
          {projects.map((p) => (
            <div
              key={p.id}
              className="project-card p-6 cursor-pointer"
              data-cursor="view"
              onClick={() => {
                onSelectProject(p);
                onClose();
              }}
            >
              <div className="flex justify-between items-start">
                <span className="font-cursive text-lg text-[#f1f505]">
                  {p.num}. {p.category}
                </span>
                <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-neutral-800 text-neutral-300">
                  {p.year}
                </span>
              </div>
              <h3 className="font-serif text-2xl text-white mt-1">{p.title}</h3>
              <p className="text-xs text-neutral-400 mt-2 line-clamp-2">{p.desc}</p>
              <div className="flex flex-wrap gap-2 mt-4">
                {p.badges?.map((b) => (
                  <span
                    key={b}
                    className="text-[10px] font-mono bg-neutral-900 border border-neutral-800 px-2 py-1 rounded text-neutral-300"
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
                {p.liveDemo && (
                  <a
                    href={p.liveDemo}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => e.stopPropagation()}
                    className="text-[11px] text-neutral-400 hover:text-white underline"
                  >
                    Live Demo ↗
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      </aside>
    </>
  );
}
