import {Icon} from "../../shared/components/Icon.jsx";

function renderText(text) {
  if (!text) return "";
  return String(text)
    .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
    .replace(/\*(.*?)\*/g, "<em>$1</em>")
    .replace(
      /`(.*?)`/g,
      '<code class="px-1.5 py-0.5 rounded font-mono text-sm bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200">$1</code>',
    );
}

function FeatureCard({item, iconSvg, imgData, variant = "grid", large = false}) {
  const isCard = variant === "bento";
  const wrapperCls = isCard
    ? `relative h-full rounded-2xl ring-1 ring-gray-200 dark:ring-gray-700 bg-white dark:bg-gray-800/50 ${large ? "p-8 lg:p-10" : "p-6"} hover:ring-primary-300 dark:hover:ring-primary-600 hover:shadow-lg transition-all duration-300 overflow-hidden`
    : "";

  const iconWrapper = large ? "w-14 h-14 lg:w-16 lg:h-16" : "w-11 h-11 lg:w-12 lg:h-12";
  const iconSize = large ? "height:1.75rem;width:auto" : "height:1.4rem;width:auto";

  const titleSize = large ? "text-2xl lg:text-3xl" : isCard ? "text-lg lg:text-xl" : "text-xl";
  const descSize = large ? "text-base lg:text-lg" : "text-sm lg:text-base";

  return (
    <div class={wrapperCls}>
      {iconSvg && (
        <div
          class={`flex justify-center items-center mb-5 ${iconWrapper} rounded-2xl bg-primary-100 dark:bg-primary-900/40 text-primary-600 dark:text-primary-300`}
        >
          <Icon svg={iconSvg} attributes={{class: "inline-block", style: iconSize}} />
        </div>
      )}
      {item.name && (
        <h3
          class={`mb-2 ${titleSize} font-bold text-gray-900 dark:text-white tracking-tight`}
          dangerouslySetInnerHTML={{__html: renderText(item.name)}}
        />
      )}
      {item.description && (
        <p class={`${descSize} text-gray-600 dark:text-gray-400 leading-relaxed`} dangerouslySetInnerHTML={{__html: renderText(item.description)}} />
      )}
      {large && imgData?.src && (
        <div class="mt-6 -mx-2 lg:-mx-4">
          <img src={imgData.src} alt={item.name || ""} class="w-full rounded-xl ring-1 ring-gray-200 dark:ring-gray-700" loading="lazy" />
        </div>
      )}
    </div>
  );
}

function GridLayout({items, iconMap, item_images}) {
  return (
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10 lg:gap-12">
      {items.map((item, idx) => (
        <FeatureCard key={idx} item={item} iconSvg={item.icon ? iconMap[item.icon] : null} imgData={item_images?.[String(idx)]} variant="grid" />
      ))}
    </div>
  );
}

function BentoLayout({items, iconMap, item_images}) {
  // First item is the featured "large" card spanning 2 cols (md+) and 2 rows (lg+).
  // grid-flow-dense lets remaining items pack the gaps cleanly across counts (4–7).
  return (
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 lg:gap-6 grid-flow-dense auto-rows-fr">
      {items.map((item, idx) => {
        const large = idx === 0;
        const spanCls = large ? "md:col-span-2 lg:row-span-2" : "";
        return (
          <div key={idx} class={spanCls}>
            <FeatureCard
              item={item}
              iconSvg={item.icon ? iconMap[item.icon] : null}
              imgData={item_images?.[String(idx)]}
              variant="bento"
              large={large}
            />
          </div>
        );
      })}
    </div>
  );
}

export const FeaturesBlock = ({content = {}, design = {}, icon_svgs = {}, item_images = {}}) => {
  const {title, subtitle, text, items: rawItems = []} = content;
  const items = Array.isArray(rawItems) ? rawItems : [];
  const layout = design.layout || "grid";

  return (
    <div class="py-16 sm:py-24 px-4 sm:px-6 lg:px-8">
      <div class="max-w-7xl mx-auto">
        {(title || text || subtitle) && (
          <div class="text-center max-w-3xl mx-auto mb-12 lg:mb-16">
            {subtitle && <p class="text-xs font-semibold uppercase tracking-widest text-primary-600 dark:text-primary-400 mb-3">{subtitle}</p>}
            {title && (
              <h2
                class="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white tracking-tight mb-4"
                dangerouslySetInnerHTML={{__html: renderText(title)}}
              />
            )}
            {text && <p class="text-lg text-gray-600 dark:text-gray-400" dangerouslySetInnerHTML={{__html: renderText(text)}} />}
          </div>
        )}

        {items.length > 0 &&
          (layout === "bento" ? (
            <BentoLayout items={items} iconMap={icon_svgs} item_images={item_images} />
          ) : (
            <GridLayout items={items} iconMap={icon_svgs} item_images={item_images} />
          ))}
      </div>
    </div>
  );
};
