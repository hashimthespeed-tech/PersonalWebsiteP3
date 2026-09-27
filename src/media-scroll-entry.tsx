import * as React from "react";
import { createRoot } from "react-dom/client";

import MediaScrollGallery, {
  type MediaPhoto,
} from "@/components/ui/3d-gallery-photography";
import "./media-scroll-gallery.css";

const mount = document.querySelector<HTMLElement>("#media-scroll-root");

if (mount) {
  const photos: MediaPhoto[] = [
    {
      src: "/assets/san-francisco-park.webp",
      alt: "Salesforce Park amphitheatre beneath the high-rise towers of downtown San Francisco",
      title: "A week in San Francisco",
      category: "San Francisco",
    },
    {
      src: "/assets/home-gallery/mercedes-exterior.webp",
      alt: "Silver Mercedes-Benz SUV in a residential driveway",
      title: "Mercedes-Benz exterior",
      category: "Detailing",
    },
    {
      src: "/assets/home-gallery/mercedes-interior.webp",
      alt: "Bright leather Mercedes-Benz interior with a detailed dashboard",
      title: "Mercedes-Benz interior",
      category: "Detailing",
    },
    {
      src: "/assets/home-gallery/bmw-interior.webp",
      alt: "BMW interior at night with purple ambient lighting",
      title: "BMW interior",
      category: "Detailing",
    },
    {
      src: "/assets/home-gallery/porsche-exterior.webp",
      alt: "White Porsche at a residential detailing job",
      title: "Porsche exterior",
      category: "Detailing",
    },
    {
      src: "/assets/home-gallery/porsche-interior.webp",
      alt: "Porsche interior with red leather seats and dark trim",
      title: "Porsche interior",
      category: "Detailing",
    },
    {
      src: "/assets/san-francisco-street.webp",
      alt: "A downtown San Francisco street framed by leafy branches and tall office buildings",
      title: "Under the trees",
      category: "Exploring",
    },
    {
      src: "/assets/san-francisco-buildings.webp",
      alt: "Downtown San Francisco buildings in warm evening light",
      title: "City at dusk",
      category: "Exploring",
    },
    {
      src: "/assets/home-gallery/soccer.webp",
      alt: "Soccer player wearing number 19 dribbling a ball across a grass field",
      title: "On the field",
      category: "Soccer",
    },
    {
      src: "/assets/travel-london.webp",
      alt: "Buckingham Palace across its forecourt, with flower beds in the foreground",
      title: "London",
      category: "Travel",
    },
    {
      src: "/assets/travel-lake-como.webp",
      alt: "Lake Como shoreline with hillside homes, boats, and mountains under towering clouds",
      title: "Lake Como",
      category: "Travel",
    },
    {
      src: "/assets/travel-rome.webp",
      alt: "Hashim at the Colosseum in Rome, with its ancient stone arches behind him",
      title: "Rome",
      category: "Travel",
    },
  ];

  createRoot(mount).render(<MediaScrollGallery photos={photos} />);
}