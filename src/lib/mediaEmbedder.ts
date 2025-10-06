/**
 * Detects and embeds YouTube and Vimeo links in content
 */
export const detectAndEmbedMedia = (content: string): string => {
  // YouTube formats: https://youtu.be/VIDEO_ID, https://www.youtube.com/watch?v=VIDEO_ID
  const youtubeRegex =
    /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/watch\?v=|youtu\.be\/)([\w\-]{11})(?:[^\s]*)/gi;

  // Vimeo formats: https://vimeo.com/VIDEO_ID
  const vimeoRegex =
    /(?:https?:\/\/)?(?:www\.)?vimeo\.com\/(\d+)/gi;

  // Replace YouTube links with embedded iframe
  content = content.replace(
    youtubeRegex,
    `<div class="video-embed my-4 relative w-full" style="padding-bottom: 56.25%;">
      <iframe
        class="absolute top-0 left-0 w-full h-full rounded-lg"
        src="https://www.youtube.com/embed/$1"
        frameborder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowfullscreen>
      </iframe>
    </div>`
  );

  // Replace Vimeo links with embedded iframe
  content = content.replace(
    vimeoRegex,
    `<div class="video-embed my-4 relative w-full" style="padding-bottom: 56.25%;">
      <iframe
        class="absolute top-0 left-0 w-full h-full rounded-lg"
        src="https://player.vimeo.com/video/$1"
        frameborder="0"
        allow="autoplay; fullscreen; picture-in-picture"
        allowfullscreen>
      </iframe>
    </div>`
  );

  return content;
};
