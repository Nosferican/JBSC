/**
 * Testimonials Block Component - Single source of truth
 * Quote cards with avatar, name, and role.
 * Single item: large featured card. Multiple items: responsive grid of cards.
 * Avatars are pre-processed by Hugo's image pipeline (passed as item_images prop)
 */

function renderText(text) {
  if (!text) return "";
  return String(text)
    .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
    .replace(/\*(.*?)\*/g, "<em>$1</em>")
    .replace(/`(.*?)`/g, "<code>$1</code>");
}

function Avatar({item, avatarUrl, size = "lg"}) {
  const sizeClass = size === "lg" ? "w-14 h-14" : "w-10 h-10";
  const textSize = size === "lg" ? "text-xl" : "text-base";
  const initial = item.name ? item.name.trim()[0].toUpperCase() : "?";

  if (avatarUrl) {
    return (
      <img
        class={`${sizeClass} rounded-full object-cover ring-2 ring-primary-100 dark:ring-primary-900/50`}
        src={avatarUrl}
        width={size === "lg" ? 56 : 40}
        height={size === "lg" ? 56 : 40}
        alt={item.name || ""}
        loading="lazy"
      />
    );
  }

  return (
    <div
      class={`${sizeClass} rounded-full bg-gradient-to-br from-primary-400 to-secondary-400 flex items-center justify-center text-white font-bold ${textSize} flex-shrink-0`}
    >
      {initial}
    </div>
  );
}

function TestimonialFeatured({item, avatarUrl}) {
  return (
    <div class="relative max-w-3xl mx-auto bg-white dark:bg-gray-800 rounded-3xl p-10 sm:p-14 shadow-xl ring-1 ring-gray-100 dark:ring-gray-700 overflow-hidden">
      {/* Decorative large quote mark */}
      <div
        class="absolute top-6 left-8 text-9xl font-serif font-bold text-primary-100 dark:text-primary-900/30 leading-none select-none pointer-events-none"
        aria-hidden="true"
      >
        {"“"}
      </div>

      <blockquote class="relative">
        <p
          class="text-xl sm:text-2xl font-medium text-gray-900 dark:text-white leading-relaxed"
          dangerouslySetInnerHTML={{__html: `“${renderText(item.text)}”`}}
        />
      </blockquote>

      <div class="mt-8 flex items-center gap-4">
        <Avatar item={item} avatarUrl={avatarUrl} size="lg" />
        <div>
          {item.name && <div class="font-semibold text-gray-900 dark:text-white">{item.name}</div>}
          {item.role && <div class="text-sm text-gray-500 dark:text-gray-400">{item.role}</div>}
        </div>
      </div>
    </div>
  );
}

function TestimonialCard({item, avatarUrl}) {
  return (
    <div class="flex flex-col bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-sm ring-1 ring-gray-100 dark:ring-gray-700 hover:shadow-md transition-shadow duration-200">
      <blockquote class="flex-1 mb-6">
        <p class="text-base text-gray-700 dark:text-gray-300 leading-relaxed" dangerouslySetInnerHTML={{__html: `“${renderText(item.text)}”`}} />
      </blockquote>

      <div class="flex items-center gap-3">
        <Avatar item={item} avatarUrl={avatarUrl} size="sm" />
        <div>
          {item.name && <div class="text-sm font-semibold text-gray-900 dark:text-white">{item.name}</div>}
          {item.role && <div class="text-xs text-gray-500 dark:text-gray-400">{item.role}</div>}
        </div>
      </div>
    </div>
  );
}

export const TestimonialsBlock = ({content, _design, _id, item_images}) => {
  const title = content?.title;
  const text = content?.text;
  const items = Array.isArray(content?.items) ? content.items : [];
  const imageMap = item_images || {};

  const gridCols =
    items.length === 1
      ? ""
      : items.length === 2
        ? "grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-4xl mx-auto"
        : "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6";

  return (
    <div class="max-w-screen-xl px-4 py-8 mx-auto lg:py-16 lg:px-6">
      {(title || text) && (
        <div class="max-w-screen-md mb-12 lg:mb-16 mx-auto text-center">
          {title && (
            <h2
              class="mb-4 text-4xl tracking-tight font-extrabold text-gray-900 dark:text-white"
              dangerouslySetInnerHTML={{__html: renderText(title)}}
            />
          )}
          {text && <p class="text-gray-500 sm:text-xl dark:text-gray-400" dangerouslySetInnerHTML={{__html: renderText(text)}} />}
        </div>
      )}

      {items.length === 1 ? (
        <TestimonialFeatured item={items[0]} avatarUrl={imageMap["0"]?.src || null} />
      ) : (
        <div class={gridCols}>
          {items.map((item, idx) => (
            <TestimonialCard key={idx} item={item} avatarUrl={imageMap[String(idx)]?.src || null} />
          ))}
        </div>
      )}
    </div>
  );
};
