'use client';

import React, { useState, useCallback } from 'react';
import type { PortfolioData, ProjectItem } from '@/types/portfolio';
import { HEADER_SCROLL_THRESHOLD } from '@/constants/portfolio';
import { padIndex } from '@/lib/format';
import { useScrolled } from '@/hooks/useScrolled';
import { useViewTransition } from '@/hooks/useViewTransition';
import Preloader from '@/components/shared/Preloader';
import SiteHeader from './topbar/SiteHeader';
import PageTransitionCurtain from './workspace/PageTransitionCurtain';
import HomeView from './workspace/HomeView';
import AboutView from './workspace/AboutView';
import SiteFooter from './workspace/SiteFooter';
import ProjectDrawer from './sidebar/ProjectDrawer';
import ProjectModal from './modals/ProjectModal';

interface PortfolioClientProps {
  initialData: PortfolioData;
}

export default function PortfolioClient({ initialData }: PortfolioClientProps) {
  const [data] = useState<PortfolioData>(initialData);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState<ProjectItem | null>(null);
  const { currentView, transitionStage, switchView } = useViewTransition('home');
  const isScrolled = useScrolled(HEADER_SCROLL_THRESHOLD);

  const openDrawer = useCallback(() => setIsDrawerOpen(true), []);
  const closeDrawer = useCallback(() => setIsDrawerOpen(false), []);
  const closeModal = useCallback(() => setSelectedProject(null), []);

  const { profile, projects } = data;
  const projectCount = padIndex(projects.length);

  return (
    <>
      <Preloader />

      <PageTransitionCurtain stage={transitionStage} name={profile.name} />

      <div className="min-h-screen flex flex-col relative z-10">
        <SiteHeader
          profile={profile}
          currentView={currentView}
          isScrolled={isScrolled}
          projectCount={projectCount}
          onSwitchView={switchView}
          onOpenProjects={openDrawer}
        />

        <div className="flex-1 flex flex-col w-full max-w-6xl mx-auto px-5 md:px-12">
          {currentView === 'home' && <HomeView onEnterProfile={() => switchView('about')} />}
          {currentView === 'about' && <AboutView data={data} onBack={() => switchView('home')} />}
          <SiteFooter profile={profile} />
        </div>
      </div>

      {/* Drawer & Modal */}
      <ProjectDrawer
        isOpen={isDrawerOpen}
        onClose={closeDrawer}
        projects={projects}
        onSelectProject={(p) => setSelectedProject(p)}
      />

      <ProjectModal project={selectedProject} onClose={closeModal} />
    </>
  );
}
