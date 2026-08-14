/** Reset the landing page to a deterministic starting position. */
export const resetScrollPosition = (): void => {
  if ('scrollRestoration' in history) history.scrollRestoration = 'manual';
  if (window.location.hash) {
    window.history.replaceState(null, '', window.location.pathname + window.location.search);
  }
  window.scrollTo(0, 0);
};
