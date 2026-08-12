const DEFAULT_WIDTHS = [320, 480, 720, 960, 1200];

const optimizeUnsplashUrl = (source: string, width: number) => {
  try {
    const url = new URL(source);
    if (url.hostname !== 'images.unsplash.com') return source;

    url.searchParams.set('fit', 'max');
    url.searchParams.set('fm', 'webp');
    url.searchParams.set('q', '72');
    url.searchParams.set('w', String(width));
    return url.toString();
  } catch {
    return source;
  }
};

export const getResponsiveImageProps = (
  source: string,
  sizes: string,
  widths: number[] = DEFAULT_WIDTHS,
) => {
  const fallbackWidth = widths.find((width) => width >= 720) ?? widths.at(-1) ?? 720;

  return {
    src: optimizeUnsplashUrl(source, fallbackWidth),
    srcSet: widths
      .map((width) => `${optimizeUnsplashUrl(source, width)} ${width}w`)
      .join(', '),
    sizes,
  };
};
