/** ID por defecto (mismo que la migración inicial del backend). */
export const DEFAULT_HERO_YOUTUBE_VIDEO_ID = "h3u-4RAwZSA";

/** Construye el `src` del iframe con los mismos parámetros que el hero original. */
export function buildHeroYoutubeEmbedSrc(videoId: string): string {
  const id = videoId.trim() || DEFAULT_HERO_YOUTUBE_VIDEO_ID;
  return `https://www.youtube.com/embed/${id}?autoplay=1&mute=1&loop=1&playlist=${id}&controls=0&showinfo=0&modestbranding=1&rel=0&playsinline=1`;
}
