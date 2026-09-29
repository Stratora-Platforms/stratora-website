import { useCallback, useLayoutEffect, useRef, type ReactNode } from "react";

/**
 * A fixed-size stage that scales to fit its container.
 *
 * The refreshed sections all contain visuals authored at a specific pixel size
 * — absolutely positioned diagrams, app screens, timelines — which cannot be
 * made fluid without redrawing them. This lays them out at their design size
 * and transform-scales from the top-left, so a scale of s paints exactly
 * s * width wide, flush with the container, and sets the wrapper's height to
 * match so the transform leaves no gap. Same mechanism as app-preview.tsx.
 *
 * `minScale` is the narrow-screen floor: below it the stage stops shrinking
 * and crops instead, because past a point the type inside turns to mush.
 * `cropAnchor` picks which part survives the crop.
 */
export function ScaledStage({
  width,
  height,
  minScale = 0,
  cropAnchor = "left",
  className,
  style,
  children,
}: {
  width: number;
  height: number;
  minScale?: number;
  cropAnchor?: "left" | "center";
  className?: string;
  style?: React.CSSProperties;
  children: ReactNode;
}) {
  const outerRef = useRef<HTMLDivElement>(null);
  const innerRef = useRef<HTMLDivElement>(null);

  const applyFit = useCallback(() => {
    const outer = outerRef.current;
    const inner = innerRef.current;
    if (!outer || !inner) return;

    const fitScale = outer.clientWidth / width;
    const scale = Math.max(fitScale, minScale);

    let offsetX = 0;
    if (scale > fitScale && cropAnchor === "center") {
      offsetX = (outer.clientWidth - width * scale) / 2;
    }

    inner.style.transform = `translateX(${offsetX}px) scale(${scale})`;
    const next = `${Math.round(height * scale)}px`;
    if (outer.style.height !== next) outer.style.height = next;
  }, [width, height, minScale, cropAnchor]);

  useLayoutEffect(() => {
    applyFit();
    const observer = new ResizeObserver(() => applyFit());
    if (outerRef.current) observer.observe(outerRef.current);
    window.addEventListener("resize", applyFit);
    return () => {
      observer.disconnect();
      window.removeEventListener("resize", applyFit);
    };
  }, [applyFit]);

  return (
    // The inner box is absolutely positioned so its authored width is out of
    // flow entirely and can never set a max-content track size on an ancestor.
    // In flow it did: the grid track sized to the authored width, which
    // inflated the outer's clientWidth, which made the very first scale
    // measurement wrong — fine after a resize, broken on a fresh load.
    // minWidth: 0 / maxWidth: 100% keep the outer itself inside its track.
    <div
      ref={outerRef}
      className={className}
      style={{ position: "relative", overflow: "hidden", minWidth: 0, maxWidth: "100%", ...style }}
    >
      <div
        ref={innerRef}
        style={{ width, height, transformOrigin: "0 0", position: "absolute", top: 0, left: 0 }}
      >
        {children}
      </div>
    </div>
  );
}
