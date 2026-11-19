'use client';

import React, { useState, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  ArrowRight,
  ArrowLeft,
  Download,
  Mail,
  MapPin,
  Github,
  Settings,
} from 'lucide-react';
import { PortfolioData, ProjectItem } from '@/lib/data';
import Preloader from '@/components/Preloader';
import ProjectDrawer from '@/components/ProjectDrawer';
import ProjectModal from '@/components/ProjectModal';

interface PortfolioClientProps {
  initialData: PortfolioData;
}

export default function PortfolioClient({ initialData }: PortfolioClientProps) {
  const [data] = useState<PortfolioData>(initialData);
  const [currentView, setCurrentView] = useState<'home' | 'about'>('home');
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState<ProjectItem | null>(null);
  const [transitionStage, setTransitionStage] = useState<'idle' | 'in' | 'out'>('idle');

  // Cinematic Curtain Transition Switcher (Pure React State + CSS Keyframes)
  const handleSwitchView = (targetView: 'home' | 'about') => {
    if (targetView === currentView || transitionStage !== 'idle') return;

    // Step 1: Sweep curtain up to cover screen
    setTransitionStage('in');

    setTimeout(() => {
      // Step 2: Swap view content at peak coverage and reset scroll
      setCurrentView(targetView);
      window.scrollTo({ top: 0, behavior: 'instant' });

      // Step 3: Sweep curtain up and out of screen
      setTransitionStage('out');

      setTimeout(() => {
        setTransitionStage('idle');
      }, 500);
    }, 480);
  };

  const { profile, skills, timeline, projects } = data;

  return (
    <>
      <Preloader />

      {/* Cinematic Page Transition Curtain */}
      <div
        id="pageTransition"
        className={`page-transition-curtain ${
          transitionStage === 'in'
            ? 'is-entering'
            : transitionStage === 'out'
            ? 'is-leaving'
            : ''
        }`}
      >
        <div className="transition-stripe" />
        <div className="transition-panel">
          <span className="transition-text font-serif">{profile.name}</span>
          <span className="transition-subtext font-sans">Portfolio & Selected Works</span>
        </div>
      </div>

      <div className="min-h-screen flex flex-col p-6 md:p-12 relative z-10">
        {/* Top Navigation Header */}
        <header className="flex items-center justify-between w-full mb-8">
          {/* Logo Badge with rotating dashed border */}
          <div
            className="flex items-center space-x-3 cursor-pointer group"
            onClick={() => handleSwitchView('home')}
            data-cursor="pointer"
          >
            <div className="relative w-12 h-12 flex items-center justify-center">
              <svg className="absolute inset-0 w-full h-full logo-ring" viewBox="0 0 50 50">
                <circle
                  cx="25"
                  cy="25"
                  r="23"
                  fill="none"
                  stroke="#f1f505"
                  strokeWidth="1.5"
                  strokeDasharray="4, 4"
                  opacity="0.6"
                />
              </svg>
              <span className="font-serif text-lg font-bold tracking-wider text-white group-hover:text-[#f1f505] transition-colors">
                DA
              </span>
            </div>
            <div className="hidden sm:block">
              <p className="text-xs uppercase tracking-widest text-neutral-400 font-medium">
                {profile.name}
              </p>
              <p className="text-[10px] text-neutral-500 font-sans tracking-wide">
                {profile.role.split('&')[0]}
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center space-x-6">
            <button
              onClick={() => handleSwitchView(currentView === 'home' ? 'about' : 'home')}
              className="text-xs uppercase tracking-[0.2em] text-neutral-300 hover:text-[#f1f505] transition-colors py-2 px-3"
              data-cursor="pointer"
            >
              {currentView === 'home' ? 'About' : 'Home'}
            </button>

            <button
              onClick={() => setIsDrawerOpen(true)}
              className="flex items-center space-x-2 text-xs uppercase tracking-[0.25em] bg-[#1a1a1a] border border-neutral-700 hover:border-[#f1f505] text-white hover:text-[#f1f505] transition-all px-5 py-2.5 rounded-full shadow-lg"
              data-cursor="pointer"
            >
              <span>Projects</span>
              <span className="text-[#f1f505] font-mono text-[11px]">
                [ 0{projects.length} ]
              </span>
            </button>

            {/* Admin Portal Icon Link */}
            <Link
              href="/admin"
              className="text-neutral-500 hover:text-[#f1f505] transition-colors p-2 rounded-full hover:bg-neutral-900"
              title="Admin CMS"
              data-cursor="pointer"
            >
              <Settings className="w-4 h-4" />
            </Link>
          </div>
        </header>

        {/* VIEW 1: HOME (Editorial Hero) */}
        {currentView === 'home' && (
          <main className="flex-1 flex flex-col items-center justify-center py-12">
            <div
              className="text-center max-w-4xl mx-auto cursor-pointer select-none"
              onClick={() => handleSwitchView('about')}
              data-cursor="view"
            >
              <p className="font-cursive text-xl md:text-2xl text-[#f1f505] mb-2 tracking-wide">
                Portfolio & Selected Works
              </p>
              <h1 className="editorial-hero-text text-neutral-200">
                <span>Click to</span>
                <span className="glow-text text-white">View Information</span>
                <span>About Me</span>
              </h1>
              <p className="text-neutral-400 text-xs md:text-sm tracking-[0.25em] uppercase mt-8 flex items-center justify-center space-x-2 opacity-70 hover:opacity-100 transition-opacity">
                <span>Enter profile</span>
                <ArrowRight className="w-4 h-4 text-[#f1f505]" />
              </p>
            </div>
          </main>
        )}

        {/* VIEW 2: ABOUT ME (Split Asymmetric Layout) */}
        {currentView === 'about' && (
          <main className="flex-1 max-w-6xl w-full mx-auto py-2">
            <button
              onClick={() => handleSwitchView('home')}
              className="mb-8 flex items-center space-x-2 text-xs uppercase tracking-[0.2em] text-neutral-400 hover:text-[#f1f505] transition-colors"
              data-cursor="pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Home</span>
            </button>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
              {/* Left Column: Portrait & Quick Actions */}
              <div className="lg:col-span-5 flex flex-col items-center lg:items-start space-y-6">
                <div className="relative w-full max-w-[340px] aspect-[4/5] rounded-2xl overflow-hidden border border-neutral-800 bg-neutral-900 shadow-2xl group">
                  <Image
                    src={profile.avatar || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?fit=crop&w=700&q=80'}
                    alt={profile.name}
                    fill
                    className="object-cover filter grayscale contrast-125 group-hover:scale-105 transition-transform duration-700 opacity-90"
                    unoptimized
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#141414] via-transparent to-transparent" />

                  <div className="absolute bottom-6 left-6 right-6">
                    <span className="text-[10px] tracking-[0.3em] uppercase bg-[#f1f505] text-black font-bold px-2.5 py-1 rounded">
                      {profile.status}
                    </span>
                    <h3 className="font-serif text-2xl text-white mt-2">{profile.name}</h3>
                    <p className="text-xs text-neutral-400 font-sans tracking-wider">
                      {profile.role}
                    </p>
                  </div>
                </div>

                {/* Download CV & Contact CTA */}
                <div className="w-full max-w-[340px] flex flex-col space-y-3">
                  <a
                    href={profile.cvUrl || '/cv'}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full py-3.5 bg-white text-black hover:bg-[#f1f505] transition-all font-semibold text-xs uppercase tracking-[0.2em] text-center rounded-xl flex items-center justify-center space-x-2 shadow-xl"
                    data-cursor="pointer"
                  >
                    <Download className="w-4 h-4" />
                    <span>Download CV</span>
                  </a>
                  <div className="bg-[#1a1a1a] border border-neutral-800 rounded-xl p-4 text-xs text-neutral-300 space-y-2">
                    <div className="flex items-center space-x-3">
                      <Mail className="w-4 h-4 text-[#f1f505]" />
                      <a href={`mailto:${profile.email}`} className="hover:underline">
                        {profile.email}
                      </a>
                    </div>
                    <div className="flex items-center space-x-3">
                      <MapPin className="w-4 h-4 text-[#f1f505]" />
                      <span>{profile.location}</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Github className="w-4 h-4 text-[#f1f505]" />
                      <a
                        href={profile.github}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:text-[#f1f505]"
                      >
                        {profile.github.replace('https://', '')}
                      </a>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column: Bio, Timeline & Tech Stack */}
              <div className="lg:col-span-7 space-y-12">
                <div>
                  <span className="font-cursive text-2xl text-[#f1f505]">About me</span>
                  <h2 className="font-serif text-3xl md:text-4xl text-white tracking-wide mt-1 uppercase">
                    {profile.tagline}
                  </h2>
                  <p className="text-neutral-400 text-sm leading-relaxed mt-4">
                    {profile.bio}
                  </p>
                </div>

                {/* Timeline */}
                <div>
                  <h3 className="text-xs uppercase tracking-[0.25em] text-neutral-300 font-bold mb-6 flex items-center space-x-2">
                    <span className="w-2 h-2 rounded-full bg-[#f1f505]" />
                    <span>Hành trình & Kinh nghiệm</span>
                  </h3>

                  <div className="relative ml-2 space-y-8 border-l-2 border-neutral-800">
                    {timeline.map((item) => (
                      <div key={item.id} className="relative pl-8">
                        <div className="timeline-dot" />
                        <span className="text-[11px] font-mono text-[#f1f505] uppercase tracking-wider">
                          {item.period}
                        </span>
                        <h4 className="text-white font-semibold text-base mt-1">
                          {item.role}
                        </h4>
                        <p className="text-neutral-400 text-xs mt-1.5 leading-relaxed">
                          {item.desc}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Tech Stack */}
                <div>
                  <h3 className="text-xs uppercase tracking-[0.25em] text-neutral-300 font-bold mb-4 flex items-center space-x-2">
                    <span className="w-2 h-2 rounded-full bg-[#f1f505]" />
                    <span>Công nghệ trọng tâm</span>
                  </h3>

                  <div className="flex flex-wrap gap-2.5">
                    {skills.map((skill) => (
                      <span
                        key={skill}
                        className="px-3.5 py-1.5 bg-[#1f1f1f] border border-neutral-800 rounded-lg text-xs text-neutral-200 hover:border-[#f1f505] transition-colors"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </main>
        )}

        {/* Bottom Footer Elements */}
        <footer className="flex items-end justify-between w-full mt-auto pt-8 text-neutral-400 text-xs">
          <div className="flex items-center space-x-6">
            <a
              href={profile.github}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-[#f1f505] transition-colors uppercase tracking-widest text-[11px]"
              data-cursor="pointer"
            >
              GitHub
            </a>
            <a
              href={profile.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-[#f1f505] transition-colors uppercase tracking-widest text-[11px]"
              data-cursor="pointer"
            >
              LinkedIn
            </a>
            <a
              href={`mailto:${profile.email}`}
              className="hover:text-[#f1f505] transition-colors uppercase tracking-widest text-[11px]"
              data-cursor="pointer"
            >
              Email
            </a>
          </div>

          <div className="text-right">
            <p className="uppercase tracking-widest text-[10px] text-neutral-500">
              © {new Date().getFullYear()} {profile.name}
            </p>
            <p className="text-[11px] text-neutral-400 font-mono">ducanh-vn</p>
          </div>
        </footer>
      </div>

      {/* Drawer & Modal */}
      <ProjectDrawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        projects={projects}
        onSelectProject={(p) => setSelectedProject(p)}
      />

      <ProjectModal
        project={selectedProject}
        onClose={() => setSelectedProject(null)}
      />
    </>
  );
}
