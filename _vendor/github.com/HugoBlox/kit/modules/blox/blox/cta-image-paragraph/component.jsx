/**
 * CTA Image Paragraph Block Component - Single source of truth
 * Alternating image + text sections with feature lists and CTA buttons
 * Images are pre-processed by Hugo's responsive image pipeline (srcset)
 */

import {Icon} from "../../shared/components/Icon.jsx";

function renderText(text) {
  if (!text) return "";
  return String(text)
    .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
    .replace(/\*(.*?)\*/g, "<em>$1</em>")
    .replace(/`(.*?)`/g, "<code>$1</code>")
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2">$1</a>');
}

const ARROW_SVG = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true"><path fill-rule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clip-rule="evenodd"/></svg>`;

function CtaItem({item, idx, imageData, featureIconSvg}) {
  const isReversed = idx % 2 === 1;

  const buttonUrl = item.button?.url || "";
  let isExternal = false;
  if (buttonUrl) {
    try {
      const url = new URL(buttonUrl, window.location.origin);
      isExternal = url.origin !== window.location.origin;
    } catch {
      isExternal = /^https?:\/\//.test(buttonUrl);
    }
  }

  const features = Array.isArray(item.features) ? item.features : typeof item.features === "string" ? [item.features] : [];

  return (
    <div
      class={`flex flex-col gap-10 items-center py-10 px-4 mx-auto max-w-screen-xl sm:py-16 lg:px-6 ${
        imageData ? "md:flex-row md:gap-16" : ""
      } ${isReversed && imageData ? "md:flex-row-reverse" : ""}`}
    >
      {/* Image */}
      {imageData && (
        <div class="w-full md:w-1/2 flex-shrink-0">
          <div class="relative overflow-hidden rounded-2xl shadow-xl ring-1 ring-gray-100 dark:ring-gray-700">
            {imageData.srcset ? (
              <img
                class="w-full h-auto object-cover"
                srcset={imageData.srcset}
                sizes="(max-width: 768px) 100vw, 50vw"
                src={imageData.src}
                width={imageData.width}
                height={imageData.height}
                alt={item.title || ""}
              />
            ) : (
              <img class="w-full h-auto object-cover" src={imageData.src} width={imageData.width} height={imageData.height} alt={item.title || ""} />
            )}
          </div>
        </div>
      )}

      {/* Text Content */}
      <div class="w-full md:w-1/2">
        {item.title && (
          <h2
            class="mb-4 text-3xl sm:text-4xl font-bold tracking-tight text-gray-900 dark:text-white"
            dangerouslySetInnerHTML={{__html: renderText(item.title)}}
          />
        )}
        {item.text && (
          <p class="mb-8 text-lg text-gray-500 dark:text-gray-400 leading-relaxed" dangerouslySetInnerHTML={{__html: renderText(item.text)}} />
        )}

        {features.length > 0 && (
          <ul class="space-y-4 mb-8">
            {features.map((feature, fIdx) => (
              <li key={fIdx} class="flex items-start gap-3">
                <span class="mt-0.5 flex-shrink-0 inline-flex items-center justify-center w-5 h-5 rounded-full bg-primary-100 dark:bg-primary-900/40">
                  {featureIconSvg ? (
                    <Icon
                      svg={featureIconSvg}
                      attributes={{
                        class: "text-primary-600 dark:text-primary-400",
                        style: "width:0.65rem;height:0.65rem",
                      }}
                    />
                  ) : (
                    <svg class="w-3 h-3 text-primary-600 dark:text-primary-400" fill="currentColor" viewBox="0 0 12 12" aria-hidden="true">
                      <path d="M10.28 2.28a1 1 0 0 0-1.44 0L4 7.12 3.16 6.28a1 1 0 0 0-1.44 1.44l2 2a1 1 0 0 0 1.44 0l6-6a1 1 0 0 0 0-1.44z" />
                    </svg>
                  )}
                </span>
                <span class="text-gray-700 dark:text-gray-300" dangerouslySetInnerHTML={{__html: renderText(String(feature))}} />
              </li>
            ))}
          </ul>
        )}

        {item.button?.text && item.button?.url && (
          <a
            href={buttonUrl}
            target={isExternal ? "_blank" : undefined}
            rel={isExternal ? "noopener" : undefined}
            class="inline-flex items-center gap-2 rounded-full bg-primary-600 text-white px-6 py-3 text-sm font-semibold hover:bg-primary-700 transition-all duration-200 shadow-sm hover:shadow-md"
          >
            {item.button.text}
            <span class="w-4 h-4 flex-shrink-0" dangerouslySetInnerHTML={{__html: ARROW_SVG}} />
          </a>
        )}
      </div>
    </div>
  );
}

export const CtaImageParagraphBlock = ({content, _design, _id, item_images, icon_svgs}) => {
  const items = Array.isArray(content?.items) ? content.items : [];
  const imageMap = item_images || {};
  const iconMap = icon_svgs || {};

  return (
    <div>
      {items.map((item, idx) => (
        <CtaItem
          key={idx}
          item={item}
          idx={idx}
          imageData={imageMap[String(idx)] || null}
          featureIconSvg={item.feature_icon ? iconMap[item.feature_icon] : iconMap.check}
        />
      ))}
    </div>
  );
};
