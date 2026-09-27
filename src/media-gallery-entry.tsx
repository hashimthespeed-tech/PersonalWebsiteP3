import * as React from "react";
import { createRoot } from "react-dom/client";

import MediaGallery, {
  type InstagramPost,
  type MediaPhoto,
} from "@/components/ui/media-gallery";
import "./media-gallery.css";

const mount = document.querySelector<HTMLElement>("#media-gallery-root");

if (mount) {
  const photos: MediaPhoto[] = [
    {
      src: "/assets/san-francisco-park.webp",
      alt: "Salesforce Park amphitheatre beneath the high-rise towers of downtown San Francisco",
      title: "A week in San Francisco",
      category: "San Francisco",
      description: "Salesforce Park during a week in San Francisco.",
    },
    {
      src: "/assets/home-gallery/mercedes-exterior.webp",
      alt: "Silver Mercedes-Benz SUV in a residential driveway",
      title: "Mercedes-Benz exterior",
      category: "Detailing",
      description: "A silver Mercedes-Benz detail on a residential driveway.",
    },
    {
      src: "/assets/home-gallery/mercedes-interior.webp",
      alt: "Bright leather Mercedes-Benz interior with a detailed dashboard",
      title: "Mercedes-Benz interior",
      category: "Detailing",
      description: "A bright leather cabin with a clean, detailed dashboard.",
    },
    {
      src: "/assets/home-gallery/bmw-interior.webp",
      alt: "BMW interior at night with purple ambient lighting",
      title: "BMW interior",
      category: "Detailing",
      description: "Purple ambient lighting in a freshly detailed BMW cabin.",
    },
    {
      src: "/assets/home-gallery/porsche-exterior.webp",
      alt: "White Porsche at a residential detailing job",
      title: "Porsche exterior",
      category: "Detailing",
      description: "A white Porsche at a residential detailing job.",
    },
    {
      src: "/assets/home-gallery/porsche-interior.webp",
      alt: "Porsche interior with red leather seats and dark trim",
      title: "Porsche interior",
      category: "Detailing",
      description: "Red leather seats and dark trim inside the Porsche.",
    },
    {
      src: "/assets/san-francisco-street.webp",
      alt: "A downtown San Francisco street framed by leafy branches and tall office buildings",
      title: "Under the trees",
      category: "City visits",
      description: "A leafy street framed by downtown San Francisco buildings.",
    },
    {
      src: "/assets/san-francisco-buildings.webp",
      alt: "Downtown San Francisco buildings in warm evening light",
      title: "City at dusk",
      category: "City visits",
      description: "Downtown San Francisco in warm evening light.",
    },
    {
      src: "/assets/home-gallery/soccer.webp",
      alt: "Soccer player wearing number 19 dribbling a ball across a grass field",
      title: "On the field",
      category: "Soccer",
      description: "A moment from a soccer match on the field.",
    },
    {
      src: "/assets/travel-london.webp",
      alt: "Buckingham Palace across its forecourt, with flower beds in the foreground",
      title: "London",
      category: "Travel",
      description: "Buckingham Palace and the gardens during a visit to London.",
    },
    {
      src: "/assets/travel-lake-como.webp",
      alt: "Lake Como shoreline with hillside homes, boats, and mountains under towering clouds",
      title: "Lake Como",
      category: "Travel",
      description: "Boats and hillside homes along the Lake Como shoreline.",
    },
    {
      src: "/assets/travel-rome.webp",
      alt: "Hashim at the Colosseum in Rome, with its ancient stone arches behind him",
      title: "Rome",
      category: "Travel",
      description: "Hashim at the Colosseum in Rome.",
    },
  ];

  const videos: InstagramPost[] = [
    {
      url: "https://www.instagram.com/reels/Ddwq04CTBLw/",
      title: "Instagram Reel",
      category: "Social",
      description:
        "Play the Reel here, or open the original post on Instagram.",
    },
  ];

  createRoot(mount).render(<MediaGallery photos={photos} videos={videos} />);
}