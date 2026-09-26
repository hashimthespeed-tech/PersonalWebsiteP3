"use client";

import * as React from "react";

import { cn } from "@/lib/utils";

export interface WorksWheelItem {
  /** Project name. Shown beside the front card and in the index. */
  title: string;
  /** Cover art. Any src an <img> takes. */
  image: string;
  /** Where the card links to. Omit for a wheel that only browses. */
  href?: string;
}

export interface WorksWheelProps extends Omit<
  React.ComponentPropsWithoutRef<"section">,
  "children"
> {
  items: WorksWheelItem[];
  /** Sits in the middle of the ring. @default undefined */
  label?: string;
  /** Label on the card's hover affordance. Omit to drop it. @default undefined */
  action?: string;
}

/* Geometry. The card is measured against the stage; everything else is measured
   against the card, so a narrow stage - where the card is capped by width, not
   height - scales the whole wheel down with it instead of leaving a small card
   swinging on a huge drum. The three that matter are tuned together: STEP
   against DRUM sets how hard the neighbours rotate away, and DRUM against LENS
   decides whether they land inside the frame or run off it. */
const CARD_H = 0.38;
const CARD_MAX_W = 0.34;
const CARD_RATIO = 1.45;
const STEP = 40;
const DRUM = 2.22;
const LENS = 2.7;
const RING_R = 1.14;
const TITLE = 0.124;
const INDEX = 0.04;
const BOW = 1.82;
const CULL = 1.6;

const WHEEL_UNITS = 900;
const DRAG_UNITS = 420;
const SETTLE = 140;
const EASE = 0.12;

const clamp = (value: number, min: number, max: number) =>
  Math.min(max, Math.max(min, value));
const lerp = (start: number, end: number, amount: number) =>
  start + (end - start) * amount;
type Stage = { w: number; h: number };
type DragState = {
  pointerId: number;
  startY: number;
  lastY: number;
  moved: boolean;
};
const rad = (degrees: number) => (degrees * Math.PI) / 180;
const bowAt = (drumDegrees: number, bow: number) =>
  -bow * (1 - Math.cos(rad(drumDegrees)));

function place(
  ringDegrees: number,
  drumDegrees: number,
  ringRadius: number,
  drumRadius: number,
  bow: number,
  blend: number,
) {
  return (
    `translateX(${blend * bowAt(drumDegrees, bow)}px)` +
    ` rotateZ(${(1 - blend) * ringDegrees}deg) translateY(${-(1 - blend) * ringRadius}px)` +
    ` rotateX(${blend * drumDegrees}deg) translateZ(${blend * drumRadius}px)`
  );
}

export function WorksWheel({
  items,
  label = "Works '26",
  action = "View",
  className,
  ...props
}: WorksWheelProps) {
  const stageRef = React.useRef<HTMLDivElement>(null);
  const wheelRef = React.useRef<HTMLDivElement>(null);
  const cardRefs = React.useRef<(HTMLElement | null)[]>([]);
  const labelRef = React.useRef<HTMLDivElement>(null);
  const titleRef = React.useRef<HTMLDivElement>(null);
  const turn = React.useRef(0);
  const target = React.useRef(0);
  const drag = React.useRef<DragState | null>(null);
  const settling = React.useRef<number | undefined>(undefined);
  const [active, setActive] = React.useState(0);
  const [stage, setStage] = React.useState<Stage>({ w: 0, h: 0 });
  const [reduced, setReduced] = React.useState(false);

  const count = items.length;
  const last = Math.max(count - 1, 0);

  React.useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    const read = () => setReduced(query.matches);
    read();
    query.addEventListener("change", read);
    return () => query.removeEventListener("change", read);
  }, []);

  React.useEffect(() => {
    const element = stageRef.current;
    if (!element) return;
    const read = () => setStage({ w: element.clientWidth, h: element.clientHeight });
    read();
    const observer = new ResizeObserver(read);
    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  const metrics = React.useMemo(() => {
    const { w, h } = stage;
    const cardW = Math.min(h * CARD_H * CARD_RATIO, w * CARD_MAX_W);
    const cardH = cardW / CARD_RATIO;
    const drumR = cardH * DRUM;
    const ringR = cardH * RING_R;
    const ringScale = count
      ? clamp((((2 * Math.PI * ringR) / count) * 0.82) / (cardW || 1), 0.16, 1)
      : 1;
    return {
      cardW,
      cardH,
      ringR,
      ringScale,
      drumR,
      bow: cardH * BOW,
      depth: cardH * LENS,
      title: cardH * TITLE,
      index: cardH * INDEX,
    };
  }, [stage, count]);

  const to = React.useCallback(
    (next: number) => {
      target.current = clamp(next, 0, last + 1);
    },
    [last],
  );

  React.useEffect(() => {
    if (!stage.h || !count) return;
    let frame = 0;
    const { ringR, ringScale, drumR, bow } = metrics;

    const draw = () => {
      frame = requestAnimationFrame(draw);
      const gap = target.current - turn.current;
      if (Math.abs(gap) < 0.0005) turn.current = target.current;
      else turn.current += gap * (reduced ? 1 : EASE);

      const current = turn.current;
      const blend = clamp(current, 0, 1);
      const position = Math.max(0, current - 1);
      if (wheelRef.current) {
        wheelRef.current.style.transform = `translateZ(${-blend * drumR}px)`;
      }

      for (let i = 0; i < count; i++) {
        const distance = i - position;
        const drumDegrees = distance * STEP;
        const card = cardRefs.current[i];
        if (card) {
          card.style.transform = place(
            distance * (360 / count),
            drumDegrees,
            ringR,
            drumR,
            bow,
            blend,
          );
          card.style.opacity =
            blend > 0.5 && Math.abs(distance) > CULL ? "0" : "1";
          card.style.zIndex = String(Math.round(100 - Math.abs(distance) * 2));
        }
        const face = card?.firstElementChild as HTMLElement | null;
        if (face) face.style.transform = `scale(${lerp(ringScale, 1, blend)})`;
      }

      if (labelRef.current) labelRef.current.style.opacity = String(1 - blend);
      if (titleRef.current) titleRef.current.style.opacity = String(blend);
      const near = clamp(Math.round(position), 0, last);
      setActive((previous) => (previous === near ? previous : near));
    };

    frame = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(frame);
  }, [metrics, stage.h, count, last, reduced]);

  React.useEffect(() => {
    const element = stageRef.current;
    if (!element) return;
    const onWheel = (event: WheelEvent) => {
      const next = target.current + event.deltaY / WHEEL_UNITS;
      if (next > 0 && next < last + 1) event.preventDefault();
      to(next);
      window.clearTimeout(settling.current);
      settling.current = window.setTimeout(
        () => to(Math.round(target.current)),
        SETTLE,
      );
    };
    element.addEventListener("wheel", onWheel, { passive: false });
    return () => {
      element.removeEventListener("wheel", onWheel);
      window.clearTimeout(settling.current);
    };
  }, [to, last]);

  return (
    <section
      aria-label={label}
      className={cn(
        "bg-background text-foreground relative h-full min-h-[24rem] w-full overflow-hidden select-none",
        className,
      )}
      {...props}
    >
      <div
        ref={stageRef}
        tabIndex={0}
        role="listbox"
        aria-label={label}
        aria-activedescendant={`works-wheel-${active}`}
        className="focus-visible:outline-foreground absolute inset-0 cursor-grab touch-pan-x outline-none focus-visible:outline-2 focus-visible:-outline-offset-4 active:cursor-grabbing"
        style={{ perspective: `${metrics.depth}px` }}
        onPointerDown={(event) => {
          drag.current = {
            pointerId: event.pointerId,
            startY: event.clientY,
            lastY: event.clientY,
            moved: false,
          };
        }}
        onPointerMove={(event) => {
          const current = drag.current;
          if (!current || current.pointerId !== event.pointerId) return;
          if (!current.moved && Math.abs(current.startY - event.clientY) >= 5) {
            current.moved = true;
            event.currentTarget.setPointerCapture(event.pointerId);
          }
          if (current.moved) {
            to(target.current + (current.lastY - event.clientY) / DRAG_UNITS);
          }
          current.lastY = event.clientY;
        }}
        onPointerUp={() => {
          const wasDragging = drag.current?.moved;
          drag.current = null;
          if (wasDragging && target.current > 1) to(Math.round(target.current));
        }}
        onPointerCancel={() => {
          drag.current = null;
        }}
        onKeyDown={(event) => {
          if (event.key === "ArrowDown") to(Math.round(target.current) + 1);
          else if (event.key === "ArrowUp") to(Math.round(target.current) - 1);
          else return;
          event.preventDefault();
        }}
      >
        <div
          ref={wheelRef}
          className="absolute top-1/2 left-1/2 [transform-style:preserve-3d]"
        >
          {items.map((item, index) => {
            const Tag = (item.href ? "a" : "div") as "a";
            return (
              <React.Fragment key={item.title}>
                <Tag
                  id={`works-wheel-${index}`}
                  role="option"
                  aria-selected={index === active}
                  href={item.href}
                  ref={(node: HTMLElement | null) => {
                    cardRefs.current[index] = node;
                  }}
                  className="group absolute [backface-visibility:hidden]"
                  style={{
                    width: metrics.cardW,
                    height: metrics.cardH,
                    marginLeft: -metrics.cardW / 2,
                    marginTop: -metrics.cardH / 2,
                  }}
                >
                  <span className="bg-muted shadow-foreground/12 relative block size-full overflow-hidden rounded-lg shadow-[0_18px_40px_-18px_var(--tw-shadow-color)]">
                    <img
                      src={item.image}
                      alt={item.title}
                      draggable={false}
                      className="size-full object-cover"
                    />
                    {action && item.href ? (
                      <span className="bg-background/80 text-foreground pointer-events-none absolute right-3 bottom-3 flex translate-y-1 items-center gap-1 rounded-full px-2.5 py-1 text-[0.7rem] opacity-0 backdrop-blur-sm transition group-hover:translate-y-0 group-hover:opacity-100">
                        <svg
                          viewBox="0 0 12 12"
                          className="size-2.5"
                          aria-hidden="true"
                        >
                          <path
                            d="M3 9 9 3M4 3h5v5"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="1.4"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                        {action}
                      </span>
                    ) : null}
                  </span>
                </Tag>
              </React.Fragment>
            );
          })}
        </div>
      </div>

      <div
        ref={labelRef}
        className="pointer-events-none absolute inset-0 grid place-items-center tracking-tight"
        style={{ fontSize: metrics.title }}
      >
        {label}
      </div>
      <div
        ref={titleRef}
        className="pointer-events-none absolute top-1/2 left-[8%] -translate-y-1/2 tracking-tight opacity-0"
        style={{ fontSize: metrics.title }}
      >
        {items[active]?.title}
      </div>

      <ol
        className="text-muted-foreground absolute top-[7.5%] right-[2.5%] text-right leading-[1.75]"
        style={{ fontSize: metrics.index }}
      >
        {items.map((item, index) => (
          <li key={item.title}>
            <button
              type="button"
              onClick={() => to(index + 1)}
              className={cn(
                "focus-visible:outline-foreground cursor-pointer transition-colors outline-none focus-visible:outline-1",
                index === active && "text-foreground font-medium",
              )}
            >
              {item.title}
            </button>
          </li>
        ))}
      </ol>
    </section>
  );
}

export default WorksWheel;