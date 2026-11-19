import React from 'react';
import {
  Github,
  Linkedin,
  Globe,
  Youtube,
  Dribbble,
  Gitlab,
  ExternalLink,
  MessageSquare,
  Send,
} from 'lucide-react';
import { TechLinkPlatform } from '@/lib/customTechLinks';

interface TechLinkIconProps {
  platform: TechLinkPlatform;
  className?: string;
}

export default function TechLinkIcon({ platform, className = 'w-3.5 h-3.5' }: TechLinkIconProps) {
  switch (platform) {
    case 'github':
      return <Github className={className} />;
    case 'linkedin':
      return <Linkedin className={className} />;
    case 'website':
      return <Globe className={className} />;
    case 'youtube':
      return <Youtube className={className} />;
    case 'dribbble':
      return <Dribbble className={className} />;
    case 'gitlab':
      return <Gitlab className={className} />;
    case 'telegram':
      return <Send className={className} />;
    case 'discord':
      return <MessageSquare className={className} />;

    case 'leetcode':
      return (
        <svg viewBox="0 0 24 24" className={className} fill="currentColor">
          <path d="M13.483 0a1.374 1.374 0 0 0-.961.438L7.116 6.226l-3.854 4.126a5.266 5.266 0 0 0-1.209 2.104 5.35 5.35 0 0 0-.125.513 5.527 5.527 0 0 0 .062 2.362 5.83 5.83 0 0 0 .349 1.017 5.938 5.938 0 0 0 4.818 3.518 5.86 5.86 0 0 0 3.282-.572l3.516-2.033a1.362 1.362 0 0 0 .678-1.18 1.375 1.375 0 0 0-1.375-1.375H7.06a3.14 3.14 0 0 1-2.493-1.22 3.1 3.1 0 0 1-.418-2.585 3.144 3.144 0 0 1 1.127-1.741l3.65-3.882 4.518-4.836A1.37 1.37 0 0 0 13.483 0zm4.512 7.74a1.375 1.375 0 0 0-.972 2.347l2.84 2.84a1.375 1.375 0 0 0 1.944-1.944l-2.84-2.84a1.37 1.37 0 0 0-.972-.403z" />
        </svg>
      );

    case 'kaggle':
      return (
        <svg viewBox="0 0 24 24" className={className} fill="currentColor">
          <path d="M18.825 23.859c-.022.09-.117.141-.281.141h-3.139c-.187 0-.351-.082-.492-.248l-5.178-6.589-1.448 1.374v5.111c0 .235-.117.352-.351.352H5.505c-.236 0-.354-.117-.354-.352V.353c0-.233.118-.353.354-.353h2.431c.234 0 .351.12.351.353v14.343l6.203-6.272c.165-.165.328-.246.492-.246h3.239c.144 0 .236.06.281.179.046.149.035.26-.035.352l-6.505 6.307 6.786 8.497c.094.117.118.235.071.354z" />
        </svg>
      );

    case 'medium':
      return (
        <svg viewBox="0 0 24 24" className={className} fill="currentColor">
          <path d="M13.54 12a6.8 6.8 0 0 1-6.77 6.82A6.8 6.8 0 0 1 0 12a6.8 6.8 0 0 1 6.77-6.82A6.8 6.8 0 0 1 13.54 12zM20.96 12c0 3.54-1.51 6.42-3.38 6.42-1.87 0-3.39-2.88-3.39-6.42s1.52-6.42 3.39-6.42 3.38 2.88 3.38 6.42M24 12c0 3.17-.53 5.75-1.19 5.75-.66 0-1.19-2.58-1.19-5.75s.53-5.75 1.19-5.75C23.47 6.25 24 8.83 24 12z" />
        </svg>
      );

    case 'devto':
      return (
        <svg viewBox="0 0 24 24" className={className} fill="currentColor">
          <path d="M7.42 10.05c-.18-.16-.46-.23-.84-.23H5.13v4.35h1.45c.38 0 .66-.08.84-.24.18-.16.27-.43.27-.81v-2.26c0-.38-.09-.65-.27-.81zm10.74-.01h-1.42l-1.07 4.36h1.27l.22-1.01h1.12l.21 1.01h1.27l-1.6-4.36zm-8.62.01h-1.25v4.35h3.04v-1.06h-1.79v-.63h1.56v-1.01h-1.56v-.59h1.79v-1.06zm-4.41-4.05h13.74C20.48 6 22 7.52 22 9.42v5.16c0 1.9-1.52 3.42-3.13 3.42H5.13C3.52 18 2 16.48 2 14.58V9.42C2 7.52 3.52 6 5.13 6z" />
        </svg>
      );

    case 'twitter':
      return (
        <svg viewBox="0 0 24 24" className={className} fill="currentColor">
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
        </svg>
      );

    case 'stackoverflow':
      return (
        <svg viewBox="0 0 24 24" className={className} fill="currentColor">
          <path d="M18.986 21.865v-6.408h2.134V24H2.87v-8.543h2.134v6.408h13.982zM6.924 16.634l10.354 2.144.437-2.096L7.361 14.538l-.437 2.096zm1.754-5.215l9.28 4.974.998-1.9-9.28-4.974-.998 1.9zm3.176-4.919l7.534 7.42 1.492-1.547-7.534-7.42-1.492 1.547zm6.39-5.111l-1.92 1.054 5.378 9.17 1.92-1.054-5.378-9.17zM6.69 20.8v-2.134h10.67V20.8H6.69z" />
        </svg>
      );

    case 'behance':
      return (
        <svg viewBox="0 0 24 24" className={className} fill="currentColor">
          <path d="M22 7h-7v-2h7v2zm1.726 10c-.442 1.297-2.029 3-5.171 3-3.955 0-6.555-2.615-6.555-6.505 0-3.955 2.571-6.495 6.455-6.495 3.967 0 6.185 2.664 6.185 6.837 0 .445-.049.882-.089 1.163h-9.822c.119 2.219 1.772 3.328 3.822 3.328 1.83 0 2.981-.884 3.435-1.328h1.74zm-3.036-4.5c-.097-1.747-1.332-2.828-3.061-2.828-1.815 0-2.99 1.066-3.149 2.828h6.21zm-12.015 7.5h-8.675v-16h8.804c3.483 0 5.871 1.761 5.871 5.163 0 1.865-.964 3.292-2.535 4.095 2.062.836 3.035 2.576 3.035 4.697 0 3.738-2.793 6.045-6.5 6.045zm-5.675-9.333h5.083c1.782 0 3.012-.863 3.012-2.457 0-1.637-1.282-2.37-3.012-2.37h-5.083v4.827zm0 6.666h5.378c2.043 0 3.393-.974 3.393-2.793 0-1.783-1.378-2.73-3.393-2.73h-5.378v5.523z" />
        </svg>
      );

    default:
      return <ExternalLink className={className} />;
  }
}
