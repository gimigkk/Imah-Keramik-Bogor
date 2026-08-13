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
