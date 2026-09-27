import { useEffect, useRef, useState } from "react";

export interface MediaPhoto {
  src: string;
  alt: string;
  title: string;
  category: string;
  description: string;
}

export interface InstagramPost {
  url: string;
  title: string;
  category: string;
  description: string;
}

type SelectedMedia =
  | ({ kind: "photo" } & MediaPhoto)
  | ({ kind: "instagram" } & InstagramPost);

interface MediaGalleryProps {
  photos: MediaPhoto[];
  videos: InstagramPost[];
}

declare global {
  interface Window {
    instgrm?: {
      Embeds?: {
        process: () => void;
      };
    };
  }
}

function loadInstagramEmbeds() {
  const processEmbeds = () => window.instgrm?.Embeds?.process();
  if (window.instgrm?.Embeds) {
    processEmbeds();
    return () => {};
  }

  let script = document.querySelector<HTMLScriptElement>(
    "script[data-media-instagram-embed]",
  );
  if (!script) {
    script = document.createElement("script");
    script.async = true;
    script.src = "https://www.instagram.com/embed.js";
    script.dataset.mediaInstagramEmbed = "true";
    document.body.append(script);
  }

  script.addEventListener("load", processEmbeds);
  return () => script?.removeEventListener("load", processEmbeds);
}

export default function MediaGallery({ photos, videos }: MediaGalleryProps) {
  const [selected, setSelected] = useState<SelectedMedia | null>(null);
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => loadInstagramEmbeds(), []);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (selected && dialog && !dialog.open) dialog.showModal();
  }, [selected]);

  const closeDetails = () => {
    if (dialogRef.current?.open) dialogRef.current.close();
    setSelected(null);
  };

  return (
    <>
      <section className="media-collection" aria-labelledby="media-photos-title">
        <h1 className="media-collection-title" id="media-photos-title">
          Photos
        </h1>
        <div className="media-photo-grid">
          {photos.map((photo) => (
            <button
              className="media-photo-card"
              key={photo.src}
              type="button"
              aria-label={`Open ${photo.title} photo details`}
              onClick={() => setSelected({ kind: "photo", ...photo })}
            >
              <img
                src={photo.src}
                alt={photo.alt}
                loading="eager"
                decoding="async"
                draggable="false"
              />
              <span className="media-photo-caption">
                <span className="media-card-category">{photo.category}</span>
                <span className="media-card-title">{photo.title}</span>
              </span>
            </button>
          ))}
        </div>
      </section>

      <section className="media-collection" aria-labelledby="media-videos-title">
        <h2 className="media-collection-title" id="media-videos-title">
          Videos
        </h2>
        <div className="media-video-grid">
          {videos.map((video) => (
            <article className="media-video-card" key={video.url}>
              <div className="media-instagram-frame">
                <blockquote
                  className="instagram-media"
                  data-instgrm-permalink={video.url}
                  data-instgrm-version="14"
                >
                  <a
                    href={video.url}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    View this post on Instagram
                  </a>
                </blockquote>
              </div>
              <div className="media-video-caption">
                <div>
                  <span className="media-card-category">{video.category}</span>
                  <h3>{video.title}</h3>
                </div>
                <button
                  className="media-details-button"
                  type="button"
                  onClick={() =>
                    setSelected({ kind: "instagram", ...video })
                  }
                >
                  Details
                </button>
              </div>
            </article>
          ))}
        </div>
      </section>

      <dialog
        className="media-detail-dialog"
        ref={dialogRef}
        aria-labelledby="media-detail-title"
        aria-describedby="media-detail-description"
        onClose={() => setSelected(null)}
        onClick={(event) => {
          if (event.target === dialogRef.current) closeDetails();
        }}
      >
        {selected && (
          <div className="media-detail-layout">
            <button
              className="media-detail-close"
              type="button"
              aria-label="Close media details"
              autoFocus
              onClick={closeDetails}
            >
              ×
            </button>
            {selected.kind === "photo" ? (
              <img
                className="media-detail-image"
                src={selected.src}
                alt={selected.alt}
              />
            ) : (
              <div className="media-detail-social">
                <span>Instagram Reel</span>
                <a
                  href={selected.url}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Open the original post ↗
                </a>
              </div>
            )}
            <div className="media-detail-copy">
              <span className="media-card-category">{selected.category}</span>
              <h2 id="media-detail-title">{selected.title}</h2>
              <p id="media-detail-description">{selected.description}</p>
            </div>
          </div>
        )}
      </dialog>
    </>
  );
}