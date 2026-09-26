import * as React from "react";
import { createRoot } from "react-dom/client";

import WorksWheel, { type WorksWheelItem } from "@/components/ui/works-wheel";
import "./media-wheel.css";

const mount = document.querySelector<HTMLElement>("#works-wheel-root");

if (mount) {
  const items: WorksWheelItem[] = Array.from(
    document.querySelectorAll<HTMLElement>(".media-card"),
  ).flatMap((card) => {
    const image = card.querySelector<HTMLImageElement>(".media-frame img");
    const title = card.querySelector(".media-body h3")?.textContent?.trim();
    if (!image || !title || !card.id) return [];
    return [{ title, image: image.currentSrc || image.src, href: `#${card.id}` }];
  });

  if (items.length) {
    createRoot(mount).render(
      <WorksWheel items={items} label="Works '26" action="View" />,
    );
  }
}