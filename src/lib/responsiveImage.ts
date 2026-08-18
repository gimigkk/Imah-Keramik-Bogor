const DEFAULT_WIDTHS = [320, 480, 720, 960, 1200];

type ResponsiveImageProps = {
  src: string;
  srcSet?: string;
  sizes?: string;
};

const isOptimizableUnsplashUrl = (source: string) => {
  try {
    const url = new URL(source);
    return url.hostname === 'images.unsplash.com';
  } catch {
    return false;
  }
};

const isLocalActivityImage = (source: string) =>
  /^\/assets\/images\/activities\/[^/]+\.webp$/.test(source);

const getLocalActivityVariant = (source: string, width: 480 | 720 | 1080) =>
  source.replace('/assets/images/activities/', `/assets/images/activities/${width}/`);

const optimizeUnsplashUrl = (source: string, width: number) => {
  const url = new URL(source);
  url.searchParams.set('fit', 'max');
  url.searchParams.set('fm', 'webp');
  url.searchParams.set('q', '72');
  url.searchParams.set('w', String(width));
  return url.toString();
};

export const getResponsiveImageProps = (
  source: string,
  sizes: string,
  widths: number[] = DEFAULT_WIDTHS,
): ResponsiveImageProps => {
  // Serve crisp, high-DPI Lanczos-scaled WebP variants (480w, 720w, 1080w, original)
  if (isLocalActivityImage(source)) {
    return {
      src: getLocalActivityVariant(source, 1080),
      srcSet: [
        `${getLocalActivityVariant(source, 480)} 480w`,
        `${getLocalActivityVariant(source, 720)} 720w`,
        `${getLocalActivityVariant(source, 1080)} 1080w`,
        `${source} 1600w`,
      ].join(', '),
      sizes,
    };
  }

  if (!isOptimizableUnsplashUrl(source)) return { src: source };

  const fallbackWidth = widths.find((width) => width >= 720) ?? widths.at(-1) ?? 720;

  return {
    src: optimizeUnsplashUrl(source, fallbackWidth),
    srcSet: widths
      .map((width) => `${optimizeUnsplashUrl(source, width)} ${width}w`)
      .join(', '),
    sizes,
  };
};

export const preloadTicketImages = (
  sources: string[],
  sizes = '(min-width: 1400px) 560px, (min-width: 768px) 44vw, calc(100vw - 5rem)',
) => {
  if (typeof window === 'undefined') return;

  sources.forEach((source) => {
    if (!source || source.endsWith('.mp4')) return;
    const props = getResponsiveImageProps(source, sizes);

    if (props.srcSet) {
      const urls = props.srcSet.split(',').map((item) => item.trim().split(' ')[0]);
      urls.forEach((url) => {
        if (!url) return;
        const img = new Image();
        img.src = url;
      });
    } else if (props.src) {
      const img = new Image();
      img.src = props.src;
    }
  });
};

