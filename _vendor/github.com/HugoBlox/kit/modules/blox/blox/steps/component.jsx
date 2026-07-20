import {useEffect, useRef} from "preact/hooks";
import {Icon} from "../../shared/components/Icon.jsx";

function renderText(text) {
  if (!text) return "";
  return String(text)
    .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
    .replace(/\*(.*?)\*/g, "<em>$1</em>")
    .replace(
      /`(.*?)`/g,
      (_, code) =>
        `<code class="px-1.5 py-0.5 rounded font-mono text-sm bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200">${code}</code>`,
    );
}

function toRoman(n) {
  const vals = [1000, 900, 500, 400, 100, 90, 50, 40, 10, 9, 5, 4, 1];
  const syms = ["M", "CM", "D", "CD", "C", "XC", "L", "XL", "X", "IX", "V", "IV", "I"];
  let r = "";
  vals.forEach((v, i) => {
    while (n >= v) {
      r += syms[i];
      n -= v;
    }
  });
  return r;
}

function markerLabel(idx, numbering) {
  const n = idx + 1;
  if (numbering === "roman") return toRoman(n);
  if (numbering === "alpha") return String.fromCharCode(64 + n);
  if (numbering === "padded") return String(n).padStart(2, "0");
  return String(n);
}

// size: "sm" (vertical/timeline — marker is secondary to text content)
//       "lg" (horizontal desktop — marker is the primary focal point)
function StepMarker({idx, iconSvg, markerStyle, numbering, size = "sm"}) {
  if (markerStyle === "dot") {
    return <div class="w-3.5 h-3.5 rounded-full bg-primary-600 dark:bg-primary-400 flex-shrink-0 mt-1.5" />;
  }

  // Horizontal icon — no circle, icon speaks for itself.
  // The w-14 h-14 wrapper is kept for layout consistency (connector line math, justify-around).
  if (markerStyle === "icon" && iconSvg && size === "lg") {
    return (
      <div class="w-14 h-14 flex items-center justify-center text-primary-600 dark:text-primary-400 flex-shrink-0">
        <Icon svg={iconSvg} attributes={{class: "inline-block", style: "height:2.5rem;width:auto"}} />
      </div>
    );
  }

  const dim = size === "lg" ? "w-14 h-14 text-base" : "w-10 h-10 text-sm";
  const iconH = size === "lg" ? "1.75rem" : "1.25rem";
  const base = `${dim} flex items-center justify-center rounded-full flex-shrink-0 font-bold`;

  // Vertical/timeline icon — keep circle for visual anchoring against the connector line
  if (markerStyle === "icon" && iconSvg) {
    return (
      <div class={`${base} bg-primary-100 dark:bg-primary-900/50 text-primary-700 dark:text-primary-300`}>
        <Icon svg={iconSvg} attributes={{class: "inline-block", style: `height:${iconH};width:auto`}} />
      </div>
    );
  }

  return <div class={`${base} bg-primary-600 dark:bg-primary-500 text-white`}>{markerLabel(idx, numbering)}</div>;
}

function StepBody({step, imgData}) {
  const isExtCta = step.cta?.url && (step.cta.url.startsWith("http://") || step.cta.url.startsWith("https://"));

  return (
    <>
      {(step.badge || step.date) && (
        <div class="flex items-center gap-2 mb-2">
          {step.date && <span class="text-xs font-semibold text-primary-600 dark:text-primary-400 uppercase tracking-wide">{step.date}</span>}
          {step.badge && (
            <span class="px-2 py-0.5 text-xs font-medium rounded-full bg-primary-100 dark:bg-primary-900/60 text-primary-700 dark:text-primary-300">
              {step.badge}
            </span>
          )}
        </div>
      )}
      {step.title && (
        <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-2" dangerouslySetInnerHTML={{__html: renderText(step.title)}} />
      )}
      {step.text && <p class="text-gray-500 dark:text-gray-400 leading-relaxed" dangerouslySetInnerHTML={{__html: renderText(step.text)}} />}
      {imgData && <img src={imgData.src} alt={step.title || ""} class="mt-4 rounded-xl shadow-sm w-full object-cover max-h-60" />}
      {step.cta?.text && step.cta?.url && (
        <a
          href={step.cta.url}
          class="inline-flex items-center gap-1.5 mt-3 text-sm font-medium text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 transition-colors"
          {...(isExtCta ? {target: "_blank", rel: "noopener noreferrer"} : {})}
        >
          {step.cta.text}
          <span aria-hidden="true">→</span>
        </a>
      )}
    </>
  );
}

// ─── Vertical ──────────────────────────────────────────────────────────────────

function VerticalSteps({steps, markerStyle, numbering, connector, icon_svgs, item_images}) {
  const isDashed = connector === "dashed";
  return (
    <ol>
      {steps.map((step, i) => {
        const isLast = i === steps.length - 1;
        const iconSvg = step.icon ? (icon_svgs?.[step.icon] ?? null) : null;
        const imgData = item_images?.[String(i)] ?? null;
        return (
          <li key={i} class="step-item flex gap-5">
            <div class="flex flex-col items-center flex-shrink-0">
              <StepMarker idx={i} iconSvg={iconSvg} markerStyle={markerStyle} numbering={numbering} />
              {!isLast && connector !== "none" && (
                <div
                  class={`flex-1 w-0.5 my-2 ${
                    isDashed ? "border-l-2 border-dashed border-gray-200 dark:border-gray-700" : "bg-gray-200 dark:bg-gray-700"
                  }`}
                  style="min-height: 1.25rem"
                />
              )}
            </div>
            <div class={`flex-1 min-w-0 pt-0.5 ${isLast ? "pb-0" : "pb-10"}`}>
              <StepBody step={step} imgData={imgData} />
            </div>
          </li>
        );
      })}
    </ol>
  );
}

// ─── Horizontal ────────────────────────────────────────────────────────────────

function HorizontalSteps({steps, markerStyle, numbering, connector, icon_svgs}) {
  const isDashed = connector === "dashed";
  return (
    <>
      {/* Mobile: vertical stack */}
      <ol class="sm:hidden space-y-8">
        {steps.map((step, i) => {
          const iconSvg = step.icon ? (icon_svgs?.[step.icon] ?? null) : null;
          return (
            <li key={i} class="step-item flex gap-4 items-start">
              <StepMarker idx={i} iconSvg={iconSvg} markerStyle={markerStyle} numbering={numbering} />
              <div class="pt-0.5 flex-1 min-w-0">
                {step.title && (
                  <h3 class="font-semibold text-gray-900 dark:text-white mb-1" dangerouslySetInnerHTML={{__html: renderText(step.title)}} />
                )}
                {step.text && <p class="text-sm text-gray-500 dark:text-gray-400" dangerouslySetInnerHTML={{__html: renderText(step.text)}} />}
                {step.cta?.text && step.cta?.url && (
                  <a
                    href={step.cta.url}
                    class="inline-flex items-center gap-1 mt-2 text-xs font-medium text-primary-600 dark:text-primary-400 hover:underline"
                  >
                    {step.cta.text} →
                  </a>
                )}
              </div>
            </li>
          );
        })}
      </ol>

      {/* Desktop: horizontal layout with connecting line */}
      <div class="hidden sm:block">
        {/* Markers row — absolute line behind, markers on top */}
        {/* top-7/left-7/right-7 = half the w-14 h-14 (56px) marker, centres the line on the circles */}
        <div class="relative flex justify-around mb-6">
          {connector !== "none" && (
            <div
              class={`absolute top-7 left-7 right-7 h-0.5 ${
                isDashed ? "border-t-2 border-dashed border-gray-200 dark:border-gray-700" : "bg-gray-200 dark:bg-gray-700"
              }`}
            />
          )}
          {steps.map((step, i) => {
            const iconSvg = step.icon ? (icon_svgs?.[step.icon] ?? null) : null;
            return (
              <div key={i} class="step-item relative z-10 flex flex-col items-center">
                <StepMarker idx={i} iconSvg={iconSvg} markerStyle={markerStyle} numbering={numbering} size="lg" />
              </div>
            );
          })}
        </div>

        {/* Content row — aligned under each marker */}
        <div class="flex">
          {steps.map((step, i) => (
            <div key={i} class="flex-1 text-center px-3">
              {step.badge && (
                <span class="inline-block mb-1.5 px-2 py-0.5 text-xs font-medium rounded-full bg-primary-100 dark:bg-primary-900/60 text-primary-700 dark:text-primary-300">
                  {step.badge}
                </span>
              )}
              {step.title && (
                <h3 class="text-base font-bold text-gray-900 dark:text-white mb-1.5" dangerouslySetInnerHTML={{__html: renderText(step.title)}} />
              )}
              {step.text && (
                <p class="text-sm text-gray-500 dark:text-gray-400 leading-relaxed" dangerouslySetInnerHTML={{__html: renderText(step.text)}} />
              )}
              {step.cta?.text && step.cta?.url && (
                <a
                  href={step.cta.url}
                  class="inline-flex items-center justify-center gap-1 mt-2 text-xs font-medium text-primary-600 dark:text-primary-400 hover:underline"
                >
                  {step.cta.text} →
                </a>
              )}
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

// ─── Timeline ──────────────────────────────────────────────────────────────────

function TimelineSteps({steps, markerStyle, numbering, icon_svgs, item_images}) {
  return (
    <div class="relative">
      {/* Center vertical line, desktop only */}
      <div class="absolute left-1/2 top-0 bottom-0 w-0.5 bg-gray-200 dark:bg-gray-700 -translate-x-1/2 hidden md:block" />

      <ol class="space-y-10 md:space-y-12">
        {steps.map((step, i) => {
          const isLeft = i % 2 === 0;
          const iconSvg = step.icon ? (icon_svgs?.[step.icon] ?? null) : null;
          const imgData = item_images?.[String(i)] ?? null;
          const isExtCta = step.cta?.url && (step.cta.url.startsWith("http://") || step.cta.url.startsWith("https://"));

          return (
            <li key={i} class={`step-item flex items-start gap-4 md:gap-0 ${isLeft ? "md:flex-row" : "md:flex-row-reverse"}`}>
              {/* Content card */}
              <div class={`flex-1 md:max-w-[calc(50%-2rem)] ${isLeft ? "md:pr-8" : "md:pl-8"}`}>
                <div class="bg-white dark:bg-gray-800/80 rounded-2xl border border-gray-200 dark:border-gray-700 p-5 shadow-sm hover:shadow-md transition-shadow duration-300">
                  {(step.badge || step.date) && (
                    <div class="flex items-center gap-2 mb-3">
                      {step.date && (
                        <span class="text-xs font-semibold text-primary-600 dark:text-primary-400 uppercase tracking-wide">{step.date}</span>
                      )}
                      {step.badge && (
                        <span class="px-2 py-0.5 text-xs font-medium rounded-full bg-primary-100 dark:bg-primary-900/60 text-primary-700 dark:text-primary-300">
                          {step.badge}
                        </span>
                      )}
                    </div>
                  )}
                  {step.title && (
                    <h3
                      class="text-base font-semibold text-gray-900 dark:text-white mb-2"
                      dangerouslySetInnerHTML={{__html: renderText(step.title)}}
                    />
                  )}
                  {step.text && (
                    <p class="text-sm text-gray-500 dark:text-gray-400 leading-relaxed" dangerouslySetInnerHTML={{__html: renderText(step.text)}} />
                  )}
                  {imgData && <img src={imgData.src} alt={step.title || ""} class="mt-3 rounded-lg w-full object-cover max-h-48" />}
                  {step.cta?.text && step.cta?.url && (
                    <a
                      href={step.cta.url}
                      class="inline-flex items-center gap-1.5 mt-3 text-sm font-medium text-primary-600 dark:text-primary-400 hover:underline"
                      {...(isExtCta ? {target: "_blank", rel: "noopener noreferrer"} : {})}
                    >
                      {step.cta.text} →
                    </a>
                  )}
                </div>
              </div>

              {/* Center marker */}
              <div class="relative z-10 flex-shrink-0">
                <StepMarker step={step} idx={i} iconSvg={iconSvg} markerStyle={markerStyle} numbering={numbering} />
              </div>

              {/* Spacer on opposite side (desktop) */}
              <div class="hidden md:block flex-1 md:max-w-[calc(50%-2rem)]" />
            </li>
          );
        })}
      </ol>
    </div>
  );
}

// ─── Staggered reveal animation ────────────────────────────────────────────────

const STEP_ANIMATION_CSS = `
.step-item {
  opacity: 0;
  transform: translateY(20px);
  transition: opacity 0.5s ease-out, transform 0.5s ease-out;
}
.step-item.step-visible {
  opacity: 1;
  transform: translateY(0);
}
.step-item:nth-child(1) { transition-delay: 0ms; }
.step-item:nth-child(2) { transition-delay: 100ms; }
.step-item:nth-child(3) { transition-delay: 200ms; }
.step-item:nth-child(4) { transition-delay: 300ms; }
.step-item:nth-child(5) { transition-delay: 400ms; }
.step-item:nth-child(6) { transition-delay: 500ms; }
`;

function useStepAnimation(ref) {
  useEffect(() => {
    const container = ref.current;
    if (!container) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const items = container.querySelectorAll(".step-item");
    if (reduced) {
      items.forEach((el) => {
        el.classList.add("step-visible");
      });
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("step-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      {threshold: 0.15},
    );

    items.forEach((el) => {
      const rect = el.getBoundingClientRect();
      if (rect.top < window.innerHeight * 0.95) {
        el.classList.add("step-visible");
      } else {
        observer.observe(el);
      }
    });

    return () => observer.disconnect();
  }, []);
}

// ─── Main block ────────────────────────────────────────────────────────────────

export const StepsBlock = ({content = {}, design = {}, icon_svgs = {}, item_images = {}}) => {
  const containerRef = useRef(null);
  useStepAnimation(containerRef);

  const steps = Array.isArray(content.items) ? content.items : Array.isArray(content.steps) ? content.steps : [];

  const {title, subtitle, text} = content;
  const layout = design.layout || "vertical";
  const markerStyle = design.marker_style || "number";
  const numbering = design.numbering || "decimal";
  const connector = design.connector || "line";

  const isCentered = layout === "horizontal" || layout === "timeline";
  const maxW = layout === "horizontal" ? "max-w-5xl" : layout === "timeline" ? "max-w-4xl" : "max-w-2xl";

  return (
    <div class="py-12 sm:py-16 px-4 sm:px-6 lg:px-8" ref={containerRef}>
      <style>{STEP_ANIMATION_CSS}</style>

      <div class={`mx-auto ${maxW}`}>
        {(title || subtitle || text) && (
          <div class={`mb-10 sm:mb-14 ${isCentered ? "text-center" : ""}`}>
            {subtitle && <p class="text-sm font-semibold uppercase tracking-widest text-primary-600 dark:text-primary-400 mb-3">{subtitle}</p>}
            {title && (
              <h2
                class="text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-4xl mb-3"
                dangerouslySetInnerHTML={{__html: renderText(title)}}
              />
            )}
            {text && (
              <p
                class={`text-lg text-gray-500 dark:text-gray-400 ${isCentered ? "mx-auto max-w-2xl" : "max-w-2xl"}`}
                dangerouslySetInnerHTML={{__html: renderText(text)}}
              />
            )}
          </div>
        )}

        {layout === "horizontal" && (
          <HorizontalSteps steps={steps} markerStyle={markerStyle} numbering={numbering} connector={connector} icon_svgs={icon_svgs} />
        )}
        {layout === "timeline" && (
          <TimelineSteps steps={steps} markerStyle={markerStyle} numbering={numbering} icon_svgs={icon_svgs} item_images={item_images} />
        )}
        {layout !== "horizontal" && layout !== "timeline" && (
          <VerticalSteps
            steps={steps}
            markerStyle={markerStyle}
            numbering={numbering}
            connector={connector}
            icon_svgs={icon_svgs}
            item_images={item_images}
          />
        )}
      </div>
    </div>
  );
};
