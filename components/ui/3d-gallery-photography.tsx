import {
  Suspense,
  useEffect,
  useMemo,
  useRef,
  useState,
  type KeyboardEvent as ReactKeyboardEvent,
  type MutableRefObject,
  type PointerEvent as ReactPointerEvent,
} from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { useTexture } from "@react-three/drei";
import * as THREE from "three";

export interface MediaPhoto {
  src: string;
  alt: string;
  title: string;
  category: string;
}

interface GalleryMotion {
  velocity: number;
  lastInput: number;
}

interface PhotoPlane {
  slot: number;
  depth: number;
  imageIndex: number;
  angle: number;
  tilt: number;
}

interface GallerySceneProps {
  photos: MediaPhoto[];
  motion: MutableRefObject<GalleryMotion>;
  isPaused: boolean;
  dragMoved: MutableRefObject<boolean>;
  onActiveChange: (index: number) => void;
  onSelect: (photo: MediaPhoto) => void;
}

const DEPTH_RANGE = 32;
const START_DEPTH = 3.2;
const AUTO_SECONDS_PER_PHOTO = 2;
const GOLDEN_ANGLE = Math.PI * (3 - Math.sqrt(5));

const clamp = (value: number, min: number, max: number) =>
  Math.min(max, Math.max(min, value));

function GalleryScene({
  photos,
  motion,
  isPaused,
  dragMoved,
  onActiveChange,
  onSelect,
}: GallerySceneProps) {
  const textures = useTexture(photos.map((photo) => photo.src));
  const visibleCount = Math.min(8, photos.length);
  const autoSpeed = DEPTH_RANGE / visibleCount / AUTO_SECONDS_PER_PHOTO;
  const planes = useMemo<PhotoPlane[]>(
    () =>
      Array.from({ length: visibleCount }, (_, slot) => ({
        slot,
        depth: START_DEPTH + (DEPTH_RANGE / visibleCount) * slot,
        imageIndex: slot % photos.length,
        angle: slot * GOLDEN_ANGLE,
        tilt: ((slot % 3) - 1) * 0.08,
      })),
    [photos.length, visibleCount],
  );
  const meshRefs = useRef<Array<THREE.Mesh | null>>([]);
  const materialRefs = useRef<Array<THREE.MeshBasicMaterial | null>>([]);
  const hoveredSlots = useRef<boolean[]>([]);
  const lastActiveIndex = useRef(planes[0]?.imageIndex ?? 0);

  useEffect(() => {
    textures.forEach((texture) => {
      texture.colorSpace = THREE.SRGBColorSpace;
    });
  }, [textures]);

  useFrame((state, frameDelta) => {
    if (isPaused || !photos.length) return;

    const delta = Math.min(frameDelta, 0.05);
    const idleFor = performance.now() - motion.current.lastInput;
    const targetVelocity = idleFor > 3000 ? autoSpeed : 0;
    const easing = 1 - Math.exp(-1.3 * delta);
    motion.current.velocity +=
      (targetVelocity - motion.current.velocity) * easing;
    const travel = motion.current.velocity * delta;
    const elapsed = state.clock.elapsedTime;

    planes.forEach((plane) => {
      plane.depth -= travel;
      while (plane.depth <= 1.35) {
        plane.depth += DEPTH_RANGE;
        plane.imageIndex = (plane.imageIndex + visibleCount) % photos.length;
      }
      while (plane.depth > DEPTH_RANGE + 1.35) {
        plane.depth -= DEPTH_RANGE;
        plane.imageIndex =
          (plane.imageIndex - visibleCount + photos.length) % photos.length;
      }

      const mesh = meshRefs.current[plane.slot];
      const material = materialRefs.current[plane.slot];
      if (!mesh || !material) return;

      const depth = plane.depth;
      const distanceRatio = clamp(depth / DEPTH_RANGE, 0, 1);
      const spread = 0.18 + distanceRatio * 0.82;
      mesh.position.set(
        Math.sin(plane.angle) * (0.3 + spread * 3.4),
        Math.cos(plane.angle * 1.35) * (0.12 + spread * 1.15),
        -depth,
      );
      mesh.rotation.set(
        Math.sin(elapsed * 0.24 + plane.angle) * 0.035,
        Math.cos(elapsed * 0.2 + plane.angle) * 0.055,
        plane.tilt + Math.sin(elapsed * 0.32 + plane.angle) * 0.018,
      );

      const texture = textures[plane.imageIndex];
      if (texture && material.map !== texture) {
        material.map = texture;
        material.needsUpdate = true;
      }
      const image = texture?.image as { width?: number; height?: number } | undefined;
      const aspect =
        image?.width && image.height ? image.width / image.height : 1.35;
      const photoHeight = 2.35 + distanceRatio * 0.38;
      const photoWidth =
        aspect >= 1
          ? photoHeight * Math.min(aspect, 1.75)
          : photoHeight * aspect;
      mesh.scale.set(photoWidth, aspect >= 1 ? photoHeight : photoHeight / aspect, 1);

      const nearFade = THREE.MathUtils.smoothstep(depth, 0.5, 1.7);
      const farFade =
        1 - THREE.MathUtils.smoothstep(depth, DEPTH_RANGE - 4.5, DEPTH_RANGE);
      material.opacity = nearFade * farFade;

      const geometry = mesh.geometry;
      const position = geometry.attributes.position as THREE.BufferAttribute;
      const vertices = position.array as Float32Array;
      let original = geometry.userData.originalPositions as Float32Array | undefined;
      if (!original) {
        original = new Float32Array(vertices);
        geometry.userData.originalPositions = original;
      }
      const waveStrength = hoveredSlots.current[plane.slot] ? 0.075 : 0.025;
      for (let vertex = 0; vertex < vertices.length; vertex += 3) {
        const x = original[vertex];
        const y = original[vertex + 1];
        vertices[vertex + 2] =
          original[vertex + 2] +
          Math.sin(x * 3 + y * 1.4 + elapsed * 2.2 + plane.angle) *
            waveStrength;
      }
      position.needsUpdate = true;
    });

    const frontPlane = planes.reduce((front, plane) =>
      plane.depth < front.depth ? plane : front,
    );
    if (frontPlane.imageIndex !== lastActiveIndex.current) {
      lastActiveIndex.current = frontPlane.imageIndex;
      onActiveChange(frontPlane.imageIndex);
    }
  });

  return (
    <group>
      {planes.map((plane) => (
        <mesh
          key={plane.slot}
          ref={(mesh) => {
            meshRefs.current[plane.slot] = mesh;
          }}
          onClick={(event) => {
            event.stopPropagation();
            if (dragMoved.current) {
              dragMoved.current = false;
              return;
            }
            onSelect(photos[plane.imageIndex]);
          }}
          onPointerOver={() => {
            hoveredSlots.current[plane.slot] = true;
          }}
          onPointerOut={() => {
            hoveredSlots.current[plane.slot] = false;
          }}
        >
          <planeGeometry args={[1, 1, 8, 8]} />
          <meshBasicMaterial
            ref={(material) => {
              materialRefs.current[plane.slot] = material;
            }}
            map={textures[plane.imageIndex]}
            transparent
            opacity={0}
            side={THREE.DoubleSide}
            depthWrite={false}
            toneMapped={false}
          />
        </mesh>
      ))}
    </group>
  );
}

function canUseWebGL() {
  try {
    const canvas = document.createElement("canvas");
    return Boolean(
      canvas.getContext("webgl2") ||
        canvas.getContext("webgl") ||
        canvas.getContext("experimental-webgl"),
    );
  } catch {
    return false;
  }
}

interface MediaScrollGalleryProps {
  photos: MediaPhoto[];
}

export default function MediaScrollGallery({
  photos,
}: MediaScrollGalleryProps) {
  const [webglSupported, setWebglSupported] = useState<boolean | null>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [selectedPhoto, setSelectedPhoto] = useState<MediaPhoto | null>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const motion = useRef<GalleryMotion>({
    velocity: 0,
    lastInput: performance.now(),
  });
  const pointer = useRef<{ id: number; startY: number; lastY: number } | null>(
    null,
  );
  const dragMoved = useRef(false);
  const activePhoto = photos[activeIndex] ?? photos[0];

  useEffect(() => {
    setWebglSupported(canUseWebGL());
  }, []);

  useEffect(() => {
    const stage = stageRef.current;
    if (!stage) return;

    const onWheel = (event: WheelEvent) => {
      event.preventDefault();
      motion.current.velocity = clamp(
        motion.current.velocity + clamp(event.deltaY * 0.014, -14, 14),
        -24,
        24,
      );
      motion.current.lastInput = performance.now();
    };

    stage.addEventListener("wheel", onWheel, { passive: false });
    return () => stage.removeEventListener("wheel", onWheel);
  }, []);

  useEffect(() => {
    const onPointerMove = (event: PointerEvent) => {
      const activePointer = pointer.current;
      if (!activePointer || activePointer.id !== event.pointerId) return;

      const totalDelta = event.clientY - activePointer.startY;
      const delta = event.clientY - activePointer.lastY;
      activePointer.lastY = event.clientY;
      if (Math.abs(totalDelta) >= 6) dragMoved.current = true;
      if (Math.abs(delta) < 1) return;

      motion.current.velocity = clamp(
        motion.current.velocity - delta * 0.075,
        -24,
        24,
      );
      motion.current.lastInput = performance.now();
    };
    const onPointerUp = (event: PointerEvent) => {
      if (pointer.current?.id === event.pointerId) pointer.current = null;
    };

    window.addEventListener("pointermove", onPointerMove, { passive: true });
    window.addEventListener("pointerup", onPointerUp);
    window.addEventListener("pointercancel", onPointerUp);
    return () => {
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerup", onPointerUp);
      window.removeEventListener("pointercancel", onPointerUp);
    };
  }, []);

  useEffect(() => {
    if (selectedPhoto && dialogRef.current && !dialogRef.current.open) {
      dialogRef.current.showModal();
    }
  }, [selectedPhoto]);

  const selectPhoto = (photo: MediaPhoto) => {
    if (dragMoved.current) {
      dragMoved.current = false;
      return;
    }
    setSelectedPhoto(photo);
  };

  const handlePointerDown = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (event.pointerType === "mouse" && event.button !== 0) return;
    pointer.current = {
      id: event.pointerId,
      startY: event.clientY,
      lastY: event.clientY,
    };
    dragMoved.current = false;
  };

  const handleKeyDown = (event: ReactKeyboardEvent<HTMLDivElement>) => {
    if (event.key === "ArrowDown" || event.key === "ArrowRight") {
      event.preventDefault();
      motion.current.velocity = clamp(motion.current.velocity + 4, -24, 24);
    } else if (event.key === "ArrowUp" || event.key === "ArrowLeft") {
      event.preventDefault();
      motion.current.velocity = clamp(motion.current.velocity - 4, -24, 24);
    } else {
      return;
    }
    motion.current.lastInput = performance.now();
  };

  const closeLightbox = () => {
    dialogRef.current?.close();
    setSelectedPhoto(null);
  };

  if (!activePhoto) return null;

  return (
    <div className="media-scroll-gallery">
      <div
        className={`media-scroll-stage${webglSupported === false ? " media-scroll-stage-fallback" : ""}`}
        ref={stageRef}
        role="region"
        aria-label="Three-dimensional photo gallery"
        aria-describedby="media-scroll-instructions"
        tabIndex={0}
        onPointerDown={handlePointerDown}
        onKeyDown={handleKeyDown}
      >
        {webglSupported ? (
          <Canvas
            camera={{ position: [0, 0, 0], fov: 48, near: 0.1, far: 44 }}
            dpr={[1, 1.5]}
            gl={{ alpha: true, antialias: true, powerPreference: "low-power" }}
          >
            <Suspense fallback={null}>
              <GalleryScene
                photos={photos}
                motion={motion}
                isPaused={Boolean(selectedPhoto)}
                dragMoved={dragMoved}
                onActiveChange={setActiveIndex}
                onSelect={selectPhoto}
              />
            </Suspense>
          </Canvas>
        ) : webglSupported === false ? (
          <div className="media-scroll-fallback">
            {photos.map((photo) => (
              <button
                className="media-scroll-fallback-card"
                key={photo.src}
                type="button"
                onClick={() => setSelectedPhoto(photo)}
              >
                <img src={photo.src} alt={photo.alt} loading="eager" draggable="false" />
                <span>{photo.category}</span>
                <strong>{photo.title}</strong>
              </button>
            ))}
          </div>
        ) : (
          <p className="media-scroll-loading">Loading the photo archive…</p>
        )}
        {webglSupported && (
          <div className="media-scroll-overlay" aria-hidden="true">
            <span>{activePhoto.category}</span>
            <strong>{activePhoto.title}</strong>
          </div>
        )}
      </div>
      <p className="media-scroll-instructions" id="media-scroll-instructions">
        Scroll or swipe to move through the photos. Use the arrow keys when the gallery is focused.
      </p>
      <ul className="media-scroll-accessible-list" aria-label="Photos in the gallery">
        {photos.map((photo) => (
          <li key={photo.src}>
            {photo.category}: {photo.title}. {photo.alt}
          </li>
        ))}
      </ul>

      <dialog
        className="media-scroll-lightbox"
        ref={dialogRef}
        aria-label={selectedPhoto?.title ?? "Expanded photo"}
        onClose={() => setSelectedPhoto(null)}
        onClick={(event) => {
          if (event.target === dialogRef.current) closeLightbox();
        }}
      >
        {selectedPhoto && (
          <>
            <button
              className="media-scroll-lightbox-close"
              type="button"
              aria-label="Close expanded photo"
              autoFocus
              onClick={closeLightbox}
            >
              ×
            </button>
            <img src={selectedPhoto.src} alt={selectedPhoto.alt} />
            <div className="media-scroll-lightbox-caption">
              <span>{selectedPhoto.category}</span>
              <h2>{selectedPhoto.title}</h2>
            </div>
          </>
        )}
      </dialog>
    </div>
  );
}