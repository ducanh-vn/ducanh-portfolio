export const PRELOADER_STORAGE_KEY = 'preloaderSeen';

/** Full intro on the first visit of a browser session, a short one afterwards (ms). */
export const PRELOADER_TIMING = {
  first: { duration: 1200, hold: 350 },
  repeat: { duration: 500, hold: 150 },
};

/** Delay between the wipe-up animation starting and the preloader unmounting (ms). */
export const PRELOADER_WIPE_MS = 900;

/** Fallback path lengths when getTotalLength is unavailable. */
export const PRELOADER_PATH1_FALLBACK = 125;
export const PRELOADER_PATH2_FALLBACK = 380;

export const PRELOADER_VIEWBOX = '0 0 95 114.3';
export const PRELOADER_PATH1 =
  'M53.4,107.4c0,2.5-2.4,4.6-5.4,4.6l0,0c-3,0-5.4-2-5.4-4.6V49.9c0-2.5,2.4-4.6,5.4-4.6l0,0c3,0,5.4,2,5.4,4.6 V107.4z';
export const PRELOADER_PATH2 =
  'M48,3.9C24.1,3.9,4.7,23.2,4.7,47.1c0,17.8,10.7,33,26.1,39.7c4.2,0,6.7-7.3,4.2-9.8 c-11.6-5-19.6-16.5-19.6-29.9c0-18,14.6-32.6,32.6-32.6s32.6,14.6,32.6,32.6c0,13.4-8.1,24.9-19.6,29.9c-2,2,2.1,9.8,4.2,9.8 c15.3-6.6,26.1-21.9,26.1-39.7C91.2,23.2,71.8,3.9,48,3.9z';
