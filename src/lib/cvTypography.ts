export interface CVTypographyConfig {
  bodyFontSize: number;          // in px: 11 to 16, default 13.5
  headingFontSize: number;       // in px: 13 to 22, default 16.5
  lineHeight: number;            // multiplier: 1.2 to 1.85, default 1.45
  sectionSpacing: number;        // in px: 8 to 32, default 18
  itemSpacing: number;           // in px: 4 to 20, default 10
  pagePaddingTopBottom: number;  // in px: 12 to 48, default 24
  pagePaddingLeftRight: number;  // in px: 16 to 56, default 28
}

export const DEFAULT_TYPOGRAPHY_CONFIG: CVTypographyConfig = {
  bodyFontSize: 13.5,
  headingFontSize: 16.5,
  lineHeight: 1.45,
  sectionSpacing: 18,
  itemSpacing: 10,
  pagePaddingTopBottom: 24,
  pagePaddingLeftRight: 28,
};

export const COMPACT_TYPOGRAPHY_PRESET: CVTypographyConfig = {
  bodyFontSize: 12,
  headingFontSize: 14.5,
  lineHeight: 1.3,
  sectionSpacing: 12,
  itemSpacing: 6,
  pagePaddingTopBottom: 16,
  pagePaddingLeftRight: 20,
};

export const SPACIOUS_TYPOGRAPHY_PRESET: CVTypographyConfig = {
  bodyFontSize: 15,
  headingFontSize: 18.5,
  lineHeight: 1.6,
  sectionSpacing: 24,
  itemSpacing: 14,
  pagePaddingTopBottom: 32,
  pagePaddingLeftRight: 36,
};

export type TypographyPresetKey = 'balanced' | 'compact' | 'spacious' | 'custom';

export function getActivePresetKey(config: CVTypographyConfig): TypographyPresetKey {
  if (
    config.bodyFontSize === DEFAULT_TYPOGRAPHY_CONFIG.bodyFontSize &&
    config.headingFontSize === DEFAULT_TYPOGRAPHY_CONFIG.headingFontSize &&
    config.lineHeight === DEFAULT_TYPOGRAPHY_CONFIG.lineHeight &&
    config.sectionSpacing === DEFAULT_TYPOGRAPHY_CONFIG.sectionSpacing &&
    config.itemSpacing === DEFAULT_TYPOGRAPHY_CONFIG.itemSpacing &&
    config.pagePaddingTopBottom === DEFAULT_TYPOGRAPHY_CONFIG.pagePaddingTopBottom &&
    config.pagePaddingLeftRight === DEFAULT_TYPOGRAPHY_CONFIG.pagePaddingLeftRight
  ) {
    return 'balanced';
  }

  if (
    config.bodyFontSize === COMPACT_TYPOGRAPHY_PRESET.bodyFontSize &&
    config.headingFontSize === COMPACT_TYPOGRAPHY_PRESET.headingFontSize &&
    config.lineHeight === COMPACT_TYPOGRAPHY_PRESET.lineHeight &&
    config.sectionSpacing === COMPACT_TYPOGRAPHY_PRESET.sectionSpacing &&
    config.itemSpacing === COMPACT_TYPOGRAPHY_PRESET.itemSpacing &&
    config.pagePaddingTopBottom === COMPACT_TYPOGRAPHY_PRESET.pagePaddingTopBottom &&
    config.pagePaddingLeftRight === COMPACT_TYPOGRAPHY_PRESET.pagePaddingLeftRight
  ) {
    return 'compact';
  }

  if (
    config.bodyFontSize === SPACIOUS_TYPOGRAPHY_PRESET.bodyFontSize &&
    config.headingFontSize === SPACIOUS_TYPOGRAPHY_PRESET.headingFontSize &&
    config.lineHeight === SPACIOUS_TYPOGRAPHY_PRESET.lineHeight &&
    config.sectionSpacing === SPACIOUS_TYPOGRAPHY_PRESET.sectionSpacing &&
    config.itemSpacing === SPACIOUS_TYPOGRAPHY_PRESET.itemSpacing &&
    config.pagePaddingTopBottom === SPACIOUS_TYPOGRAPHY_PRESET.pagePaddingTopBottom &&
    config.pagePaddingLeftRight === SPACIOUS_TYPOGRAPHY_PRESET.pagePaddingLeftRight
  ) {
    return 'spacious';
  }

  return 'custom';
}
