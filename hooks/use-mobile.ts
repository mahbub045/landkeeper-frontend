import * as React from 'react';

const MOBILE_BREAKPOINT = 768;
const QUERY = `(max-width: ${MOBILE_BREAKPOINT - 1}px)`;
const TABLET_MIN_BREAKPOINT = 768;
const TABLET_MAX_BREAKPOINT = 1023;
const TABLET_QUERY = `(min-width: ${TABLET_MIN_BREAKPOINT}px) and (max-width: ${TABLET_MAX_BREAKPOINT}px)`;

function subscribe(onStoreChange: () => void) {
  const mql = window.matchMedia(QUERY);
  mql.addEventListener('change', onStoreChange);
  return () => mql.removeEventListener('change', onStoreChange);
}

function getSnapshot() {
  return window.matchMedia(QUERY).matches;
}

function getServerSnapshot() {
  return false;
}

export function useIsMobile() {
  return React.useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}

function subscribeTablet(onStoreChange: () => void) {
  const mql = window.matchMedia(TABLET_QUERY);
  mql.addEventListener('change', onStoreChange);
  return () => mql.removeEventListener('change', onStoreChange);
}

function getTabletSnapshot() {
  return window.matchMedia(TABLET_QUERY).matches;
}

export function useIsTablet() {
  return React.useSyncExternalStore(
    subscribeTablet,
    getTabletSnapshot,
    getServerSnapshot,
  );
}
