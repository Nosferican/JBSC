/**
 * CTA Card Block Component
 * A centered card with title, text, and primary action button.
 * Supports glassmorphism, custom backgrounds, and automatic text color adjustment.
 */

import {Icon} from "../../shared/components/Icon.jsx";

// Simple markdown renderer
function renderText(text) {
  if (!text) return "";
  return String(text)
    .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
    .replace(/\*(.*?)\*/g, "<em>$1</em>")
    .replace(/`(.*?)`/g, "<code>$1</code>")
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2">$1</a>');
}

export const CtaCardBlock = ({content, design, _id, button_icon_svg}) => {
  const card = design?.card || {};
  const cardClass = card.css_class || "";
  const cardStyle = card.css_style || "";

  // Overlay Opacity Logic
  let overlayOpacity = 0.15;
  if (card.overlay_opacity !== undefined) {
    const val = parseFloat(card.overlay_opacity);
    if (!Number.isNaN(val)) overlayOpacity = Math.max(0, Math.min(1, val));
  }

  // Text Color Logic — three modes:
  // - "light": white title + white/80 body, white pill button (use on coloured/dark cards)
  // - "dark":  dark title + dark body, dark pill button (use on white/light cards)
  // - "auto":  detect from card classes — colored gradient or saturated bg → light, else fall back
  //
  // All output classes must be FULL LITERAL STRINGS so Tailwind's source scanner picks them up.
  let textColorMode = "auto";
  if (["light", "dark", "auto"].includes(card.text_color?.toLowerCase())) {
    textColorMode = card.text_color.toLowerCase();
  }

  if (textColorMode === "auto") {
    const looksColored =
      cardClass.includes("bg-gradient") ||
      /\bbg-(primary|secondary|violet|indigo|blue|purple|pink|fuchsia|rose|red|orange|amber|emerald|teal|cyan|sky)-[4-9]\d{0,2}\b/.test(cardClass) ||
      /\bfrom-(primary|secondary|violet|indigo|blue|purple|pink|fuchsia|rose|red|orange|amber|emerald|teal|cyan|sky)-[4-9]/.test(cardClass);
    // Legacy detection: design.background.gradient.start using saturated Tailwind tokens
    const bg = design?.background || {};
    const gradientStart = bg.gradient?.start || "";
    const legacyDarkBg = ["primary-7", "primary-8", "primary-9", "secondary-7", "secondary-8", "secondary-9"].some((p) =>
      gradientStart.startsWith(p),
    );
    textColorMode = looksColored || legacyDarkBg ? "light" : "dark";
  }

  // Title, body, and button classes — full literals only
  const titleClasses = textColorMode === "light" ? "text-white" : "text-gray-900 dark:text-white";
  const bodyClasses = textColorMode === "light" ? "text-white/80" : "text-gray-700 dark:text-gray-300";
  // Button: in "light" mode (coloured card), keep a white pill across both themes for consistency.
  // In "dark" mode (light card), use a dark pill.
  const buttonBgClasses =
    textColorMode === "light"
      ? "bg-white ring-1 ring-white/40 hover:bg-white/95 hover:ring-white/60 shadow-lg"
      : "bg-gray-900 dark:bg-white ring-1 ring-gray-900/10 dark:ring-white/10 hover:bg-gray-800 dark:hover:bg-gray-100 shadow-lg";
  const buttonTextClasses = textColorMode === "light" ? "text-gray-900" : "text-white dark:text-gray-900";

  // Button Logic
  const button = content?.button || {};
  const buttonText = button.text?.trim();
  const buttonUrl = button.url?.trim();
  const showButton = !!(buttonText && buttonUrl);

  let isExternal = false;
  let isNewTab = button.new_tab === true;
  if (buttonUrl) {
    try {
      const url = new URL(buttonUrl, window.location.origin);
      isExternal = url.origin !== window.location.origin;
    } catch {
      isExternal = /^https?:\/\//.test(buttonUrl);
    }
    if (buttonUrl.endsWith(".pdf")) isNewTab = true;
    if (isExternal) isNewTab = true;
  }

  const defaultBgClass = "bg-gradient-to-br from-primary-500/90 via-primary-600/95 to-primary-700/90";
  const finalCardClass = cardClass || defaultBgClass;

  const style = `--glassmorphism-opacity: ${overlayOpacity}; ${cardStyle}`;

  return (
    <div
      class={`relative overflow-hidden ${finalCardClass} p-8 sm:p-12 lg:p-16 xl:p-20 mx-auto max-w-6xl rounded-3xl shadow-2xl flex flex-col items-center text-center`}
      style={style}
    >
      {/* Title */}
      {content.title && (
        <h2
          class={`${titleClasses} text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold tracking-tight leading-tight`}
          dangerouslySetInnerHTML={{__html: renderText(content.title)}}
        />
      )}

      {/* Text */}
      {content.text && (
        <div
          class={`${bodyClasses} mt-6 text-lg sm:text-xl lg:text-2xl max-w-3xl leading-relaxed font-light`}
          dangerouslySetInnerHTML={{__html: renderText(content.text)}}
        />
      )}

      {/* Button */}
      {showButton && (
        <div class="flex mt-10">
          <a
            href={buttonUrl}
            target={isNewTab ? "_blank" : undefined}
            rel={isNewTab ? "noopener" : undefined}
            class={`group inline-flex items-center gap-3 rounded-2xl px-8 py-4 text-lg font-semibold ${buttonBgClasses} ${buttonTextClasses} transition-all duration-300 ease-out hover:scale-105 hover:shadow-2xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/60 focus-visible:ring-offset-2 focus-visible:ring-offset-transparent`}
          >
            <span>{buttonText}</span>
            {button_icon_svg && (
              <span class="transition-transform duration-300 group-hover:translate-x-1">
                <Icon svg={button_icon_svg} attributes={{style: "height: 1.25em", class: "inline-block"}} />
              </span>
            )}
          </a>
        </div>
      )}
    </div>
  );
};
