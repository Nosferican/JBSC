/**
 * Hero Block Component - Single source of truth
 * Used for both SSR and client-side hydration
 */

import {Icon} from "../../shared/components/Icon.jsx";

// Simple markdown renderer
export function renderText(text) {
  if (!text) return "";
  return String(text)
    .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
    .replace(/\*(.*?)\*/g, "<em>$1</em>")
    .replace(/`(.*?)`/g, "<code>$1</code>");
}

// Title renderer: supports [highlight] syntax for gradient-text spans (in addition to markdown).
// `[word]` becomes a primary→secondary gradient span. Negative lookahead `(?!\()` avoids
// clobbering markdown link syntax `[text](url)`.
const HIGHLIGHT_CLS =
  "bg-gradient-to-r from-primary-500 via-secondary-500 to-primary-500 dark:from-primary-400 dark:via-secondary-400 dark:to-primary-400 bg-clip-text text-transparent";

export function renderTitle(text) {
  if (!text) return "";
  return String(text)
    .replace(/\[([^\]]+)\](?!\()/g, `<span class="${HIGHLIGHT_CLS}">$1</span>`)
    .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
    .replace(/\*(.*?)\*/g, "<em>$1</em>");
}

// Process URLs
export function processUrl(url) {
  if (!url) return {href: "#"};
  if (url.startsWith("http://") || url.startsWith("https://")) {
    return {href: url, target: "_blank", rel: "noopener"};
  }
  return {href: url};
}

// Full literal class strings (Tailwind scanner safety)
const ACTION_STYLES = {
  gradient:
    "rounded-full bg-gradient-to-r from-primary-600 to-secondary-600 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-primary-500/25 hover:shadow-xl hover:shadow-primary-500/40 hover:from-primary-500 hover:to-secondary-500 transition-all duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-500",
  solid:
    "rounded-full bg-primary-600 px-6 py-3 text-sm font-semibold text-white shadow-sm hover:bg-primary-500 transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-600",
  outline:
    "rounded-full px-6 py-3 text-sm font-semibold ring-1 ring-inset ring-gray-300 dark:ring-gray-600 text-gray-900 dark:text-gray-100 hover:bg-gray-50 dark:hover:bg-gray-800/60 transition-colors",
  ghost:
    "rounded-full px-6 py-3 text-sm font-semibold text-gray-900 dark:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-800/60 transition-colors",
  text: "text-sm font-semibold leading-6 text-gray-900 dark:text-gray-100 hover:text-gray-700 dark:hover:text-gray-300 transition-colors",
};

function ActionButton({action, defaultStyle, iconSvg}) {
  if (!action?.url || !action?.text) return null;
  const styleKey = action.style && ACTION_STYLES[action.style] ? action.style : defaultStyle;
  const cls = ACTION_STYLES[styleKey];
  const url = processUrl(action.url);
  // text-style without an explicit icon shows the classic trailing arrow
  const showTextArrow = styleKey === "text" && !iconSvg;

  return (
    <a href={url.href} {...(url.target && {target: url.target, rel: url.rel})} class={`inline-flex items-center gap-2 ${cls}`}>
      <span dangerouslySetInnerHTML={{__html: renderText(action.text)}} />
      {iconSvg && (
        <span class="inline-flex">
          <Icon svg={iconSvg} attributes={{style: "height: 1em", class: "inline-block"}} />
        </span>
      )}
      {showTextArrow && <span aria-hidden="true">→</span>}
    </a>
  );
}

// Star strip for the trust block. Supports fractional values (e.g. 4.5 → 4 full + half).
const STAR_FULL = `<svg viewBox="0 0 20 20" fill="currentColor" aria-hidden="true"><path d="M9.05 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.957a1 1 0 0 0 .95.69h4.162c.969 0 1.371 1.24.588 1.81l-3.367 2.446a1 1 0 0 0-.364 1.118l1.287 3.957c.3.921-.755 1.688-1.539 1.118l-3.366-2.446a1 1 0 0 0-1.176 0l-3.366 2.446c-.784.57-1.838-.197-1.539-1.118l1.287-3.957a1 1 0 0 0-.364-1.118L2.06 9.384c-.783-.57-.38-1.81.588-1.81h4.162a1 1 0 0 0 .95-.69L9.05 2.927Z"/></svg>`;
const STAR_EMPTY = `<svg viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true"><path stroke-linejoin="round" d="M9.05 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.957a1 1 0 0 0 .95.69h4.162c.969 0 1.371 1.24.588 1.81l-3.367 2.446a1 1 0 0 0-.364 1.118l1.287 3.957c.3.921-.755 1.688-1.539 1.118l-3.366-2.446a1 1 0 0 0-1.176 0l-3.366 2.446c-.784.57-1.838-.197-1.539-1.118l1.287-3.957a1 1 0 0 0-.364-1.118L2.06 9.384c-.783-.57-.38-1.81.588-1.81h4.162a1 1 0 0 0 .95-.69L9.05 2.927Z"/></svg>`;

function StarStrip({stars}) {
  const n = Math.max(0, Math.min(5, Number(stars) || 0));
  const full = Math.floor(n);
  return (
    <div class="inline-flex items-center gap-0.5 text-amber-400">
      {Array.from({length: 5}).map((_, i) => (
        <span key={i} class="w-5 h-5 inline-block" dangerouslySetInnerHTML={{__html: i < full ? STAR_FULL : STAR_EMPTY}} />
      ))}
    </div>
  );
}

function TrustStrip({trust, alignKey = "center"}) {
  if (!trust) return null;
  const {stars, text} = trust;
  if (!stars && !text) return null;
  const justify = alignKey === "left" ? "justify-start" : "justify-center";
  return (
    <div class={`mt-8 flex items-center ${justify} gap-3 flex-wrap`}>
      {stars != null && <StarStrip stars={stars} />}
      {text && <span class="text-sm text-gray-600 dark:text-gray-400" dangerouslySetInnerHTML={{__html: renderText(text)}} />}
    </div>
  );
}

// Announcement: pill above the title with optional leading badge.
// announcement.badge: {text, color?} — color is one of: primary | green | amber | rose
const BADGE_COLORS = {
  primary: "bg-primary-100 text-primary-700 dark:bg-primary-900/40 dark:text-primary-300",
  green: "bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300",
  amber: "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300",
  rose: "bg-rose-100 text-rose-700 dark:bg-rose-900/40 dark:text-rose-300",
};

function AnnouncementPill({announcement, alignKey = "center"}) {
  if (!announcement?.text) return null;
  const badge = announcement.badge;
  const badgeCls = badge && BADGE_COLORS[badge.color] ? BADGE_COLORS[badge.color] : BADGE_COLORS.primary;
  const justify = alignKey === "left" ? "sm:justify-start" : "sm:justify-center";

  return (
    <div class={`hidden sm:mb-8 sm:flex ${justify}`}>
      <div class="relative flex items-center gap-2 rounded-full pl-1 pr-4 py-1 text-sm leading-6 text-gray-600 dark:text-gray-300 ring-1 ring-gray-900/10 dark:ring-gray-300/30 hover:ring-gray-900/20 dark:hover:ring-gray-300/50 transition-all">
        {badge?.text && <span class={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${badgeCls}`}>{badge.text}</span>}
        {!badge?.text && <span class="pl-2" />}
        <span dangerouslySetInnerHTML={{__html: renderText(announcement.text)}} />
        {announcement.link?.text && (
          <a
            href={processUrl(announcement.link.url).href}
            {...(processUrl(announcement.link.url).target && {
              target: processUrl(announcement.link.url).target,
              rel: processUrl(announcement.link.url).rel,
            })}
            class="font-semibold text-primary-600 dark:text-primary-300"
          >
            <span class="absolute inset-0" aria-hidden="true" />
            {announcement.link.text} <span aria-hidden="true">→</span>
          </a>
        )}
      </div>
    </div>
  );
}

// Hero size presets — full literal class strings (Tailwind scanner safety).
// `default` is the modern 2026 baseline (~96-160px vertical padding).
// `tall` is the legacy size for when the hero needs more visual weight.
// `viewport` fills the screen — vertically centred content, useful for splash heroes.
const SIZE_CLASSES = {
  compact: "py-16 sm:py-20 lg:py-24",
  default: "py-24 sm:py-32 lg:py-40",
  tall: "py-32 sm:py-48 lg:py-56",
  viewport: "min-h-screen flex flex-col justify-center py-16",
  none: "",
};

const ALIGN_TEXT = {center: "text-center", left: "text-left"};
const ALIGN_FLEX = {center: "justify-center", left: "justify-start"};
const ALIGN_MX = {center: "mx-auto", left: ""};

// Layout presets. `centered` is the classic stacked hero. `split-*` puts text and media
// side-by-side (the dominant 2026 SaaS pattern). `stacked` keeps text top-aligned with
// media full-width below — useful for product screenshots that need horizontal real estate.
const LAYOUTS = {
  centered: {container: "max-w-2xl", grid: false, stacked: false, reverse: false},
  "split-left": {container: "max-w-7xl", grid: true, stacked: false, reverse: false},
  "split-right": {container: "max-w-7xl", grid: true, stacked: false, reverse: true},
  stacked: {container: "max-w-6xl", grid: false, stacked: true, reverse: false},
};

// Media: image (with optional dark variant) or video. Hero `media.src` is processed
// through Hugo's responsive image pipeline upstream and arrives as `media_image` with
// {src, srcset, width, height}. Videos pass straight through.
function Media({media, mediaImage, mediaImageDark}) {
  if (!media) return null;
  const type = media.type || "image";

  if (type === "video") {
    return (
      <div class="relative">
        <video
          src={media.src}
          poster={media.poster}
          autoplay={media.autoplay !== false}
          loop={media.loop !== false}
          muted={media.muted !== false}
          playsinline
          class="w-full h-auto rounded-2xl shadow-2xl ring-1 ring-gray-900/10 dark:ring-white/10"
        />
      </div>
    );
  }

  // image (default)
  if (!mediaImage) return null;
  const hasDark = !!mediaImageDark;
  return (
    <div class="relative">
      <img
        src={mediaImage.src}
        srcset={mediaImage.srcset}
        sizes="(max-width: 1024px) 100vw, 50vw"
        width={mediaImage.width}
        height={mediaImage.height}
        alt={media.alt || ""}
        loading="eager"
        class={`w-full h-auto rounded-2xl shadow-2xl ring-1 ring-gray-900/10 dark:ring-white/10 ${hasDark ? "block dark:hidden" : ""}`}
      />
      {hasDark && (
        <img
          src={mediaImageDark.src}
          srcset={mediaImageDark.srcset}
          sizes="(max-width: 1024px) 100vw, 50vw"
          width={mediaImageDark.width}
          height={mediaImageDark.height}
          alt={media.alt || ""}
          loading="eager"
          class="hidden dark:block w-full h-auto rounded-2xl shadow-2xl ring-1 ring-white/10"
        />
      )}
    </div>
  );
}

// Hero Block Component - Single implementation
export const HeroBlock = ({content, design, _id, icon_svg, secondary_icon_svg, media_image, media_image_dark}) => {
  // Backward compat: legacy `no_padding: true` maps to size: "none"
  const sizeKey = SIZE_CLASSES[design?.size] ? design.size : design?.no_padding ? "none" : "default";
  const sizeClasses = SIZE_CLASSES[sizeKey];

  const layoutKey = LAYOUTS[design?.layout] ? design.layout : "centered";
  const layout = LAYOUTS[layoutKey];

  // Auto-align: split layouts read better left-aligned unless explicitly centred
  const alignKey = design?.alignment === "left" || design?.alignment === "center" ? design.alignment : layout.grid ? "left" : "center";
  const textAlign = ALIGN_TEXT[alignKey];
  const flexAlign = ALIGN_FLEX[alignKey];
  const mxAuto = ALIGN_MX[alignKey];

  const contentStack = (
    <>
      <AnnouncementPill announcement={content.announcement} alignKey={alignKey} />
      <div class={textAlign}>
        {content.eyebrow && (
          <p
            class="mb-4 text-sm font-semibold uppercase tracking-wider text-primary-600 dark:text-primary-400"
            dangerouslySetInnerHTML={{__html: renderText(content.eyebrow)}}
          />
        )}
        {content.title && (
          <h1
            class="text-4xl font-bold tracking-tight text-gray-900 dark:text-gray-100 sm:text-6xl"
            dangerouslySetInnerHTML={{__html: renderTitle(content.title)}}
          />
        )}
        {content.text && (
          <p
            class={`mt-6 text-lg leading-8 text-gray-600 dark:text-gray-300 max-w-2xl ${mxAuto}`}
            dangerouslySetInnerHTML={{__html: renderText(content.text)}}
          />
        )}
        {(content.primary_action?.url || content.secondary_action?.url) && (
          <div class={`mt-10 flex items-center ${flexAlign} gap-x-6 flex-wrap gap-y-3`}>
            <ActionButton action={content.primary_action} defaultStyle="gradient" iconSvg={icon_svg} />
            <ActionButton action={content.secondary_action} defaultStyle="text" iconSvg={secondary_icon_svg} />
          </div>
        )}
        <TrustStrip trust={content.trust} alignKey={alignKey} />
      </div>
    </>
  );

  const mediaEl = content.media ? <Media media={content.media} mediaImage={media_image} mediaImageDark={media_image_dark} /> : null;

  // Split layout: two-column grid, optionally reversed
  if (layout.grid) {
    return (
      <div class="relative isolate px-6 lg:px-8">
        <div class={`mx-auto ${layout.container} ${sizeClasses}`}>
          <div class="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            <div class={layout.reverse ? "lg:order-2" : ""}>{contentStack}</div>
            {mediaEl && <div class={layout.reverse ? "lg:order-1" : ""}>{mediaEl}</div>}
          </div>
        </div>
      </div>
    );
  }

  // Stacked layout: text top (constrained), media full-width below
  if (layout.stacked) {
    return (
      <div class="relative isolate px-6 lg:px-8">
        <div class={`mx-auto ${layout.container} ${sizeClasses}`}>
          <div class="mx-auto max-w-3xl">{contentStack}</div>
          {mediaEl && <div class="mt-16">{mediaEl}</div>}
        </div>
      </div>
    );
  }

  // Centered (default)
  return (
    <div class="relative isolate px-6 lg:px-8">
      <div class={`mx-auto ${layout.container} ${sizeClasses}`}>{contentStack}</div>
    </div>
  );
};
