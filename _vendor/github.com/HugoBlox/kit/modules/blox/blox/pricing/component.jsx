import {useState} from "preact/hooks";
import {Icon} from "../../shared/components/Icon.jsx";

const CHECK_SVG = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true"><path fill-rule="evenodd" d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z" clip-rule="evenodd"/></svg>`;
const X_SVG = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true"><path d="M6.28 5.22a.75.75 0 00-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 101.06 1.06L10 11.06l3.72 3.72a.75.75 0 101.06-1.06L11.06 10l3.72-3.72a.75.75 0 00-1.06-1.06L10 8.94 6.28 5.22z"/></svg>`;

function renderText(text) {
  if (!text) return "";
  return String(text)
    .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
    .replace(/\*(.*?)\*/g, "<em>$1</em>")
    .replace(/`(.*?)`/g, "<code>$1</code>");
}

function BillingToggle({billing, setBilling, toggle}) {
  const isYearly = billing === "yearly";
  return (
    <div class="flex items-center justify-center gap-4 mb-10">
      <span
        class={`text-sm transition-colors ${isYearly ? "font-normal text-gray-400 dark:text-gray-500" : "font-semibold text-gray-900 dark:text-white"}`}
      >
        {toggle.monthly_label || "Monthly"}
      </span>
      <button
        type="button"
        role="switch"
        aria-checked={isYearly}
        onClick={() => setBilling(isYearly ? "monthly" : "yearly")}
        class={`relative inline-flex h-7 w-12 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900 ${isYearly ? "bg-primary-600" : "bg-gray-300 dark:bg-gray-600"}`}
      >
        <span class="sr-only">Toggle billing period</span>
        <span
          class={`pointer-events-none inline-block h-6 w-6 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${isYearly ? "translate-x-5" : "translate-x-0"}`}
        />
      </button>
      <span
        class={`flex items-center gap-2 text-sm transition-colors ${isYearly ? "font-semibold text-gray-900 dark:text-white" : "font-normal text-gray-400 dark:text-gray-500"}`}
      >
        {toggle.yearly_label || "Yearly"}
        {toggle.yearly_discount && (
          <span class="inline-flex items-center rounded-full bg-green-50 dark:bg-green-900/20 px-2.5 py-0.5 text-xs font-semibold text-green-700 dark:text-green-400">
            {toggle.yearly_discount}
          </span>
        )}
      </span>
    </div>
  );
}

function PriceDisplay({price = {}, price_suffix, price_note, price_note_monthly, price_note_yearly, billing}) {
  const raw = billing === "yearly" && price.yearly != null ? price.yearly : price.monthly;
  const currency = price.currency ?? "$";
  const isContact = raw === "" || raw == null;
  const isFree = String(raw) === "0";

  const note = billing === "yearly" ? (price_note_yearly ?? price_note) : (price_note_monthly ?? price_note);

  if (isContact) {
    return (
      <div class="mb-6">
        <p class="text-3xl font-bold text-gray-900 dark:text-white">{price_note || "Contact us"}</p>
      </div>
    );
  }

  if (isFree) {
    return (
      <div class="mb-6">
        {/* text-4xl matches the visual weight of `$XX` prices (where $ is text-2xl
            and the digit is text-5xl) without "Free" dominating the row. */}
        <p class="text-4xl font-bold tracking-tight text-gray-900 dark:text-white">Free</p>
        {note && <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">{note}</p>}
      </div>
    );
  }

  return (
    <div class="mb-6">
      <div class="flex items-baseline gap-x-1">
        {currency && <span class="text-2xl font-semibold text-gray-900 dark:text-white">{currency}</span>}
        <span class="text-5xl font-bold tracking-tight text-gray-900 dark:text-white">{raw}</span>
        {price_suffix && <span class="text-base text-gray-500 dark:text-gray-400 ml-1">{price_suffix}</span>}
      </div>
      {note && <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">{note}</p>}
    </div>
  );
}

function FeatureRow({feature}) {
  const text = typeof feature === "string" ? feature : (feature.text ?? "");
  const included = typeof feature === "string" ? true : feature.included !== false;
  const note = typeof feature === "object" ? feature.note : null;

  return (
    <li class="flex items-start gap-3">
      <span
        class={`mt-0.5 h-5 w-5 flex-shrink-0 ${included ? "text-green-500 dark:text-green-400" : "text-gray-300 dark:text-gray-600"}`}
        dangerouslySetInnerHTML={{__html: included ? CHECK_SVG : X_SVG}}
      />
      <span class={`text-sm leading-6 ${included ? "text-gray-700 dark:text-gray-300" : "text-gray-400 dark:text-gray-500"}`}>
        {text}
        {note && <span class="ml-1 text-xs text-gray-400 dark:text-gray-500">({note})</span>}
      </span>
    </li>
  );
}

function TierCardContent({
  name,
  description,
  price,
  price_suffix,
  price_note,
  price_note_monthly,
  price_note_yearly,
  cta,
  features,
  billing,
  icon_svgs,
  highlight,
}) {
  const ctaStyle = cta.style || (highlight ? "primary" : "outline");
  const ctaIconSvg = cta.icon ? (icon_svgs?.[cta.icon] ?? null) : null;
  const isExternalCta = cta.url && (cta.url.startsWith("http://") || cta.url.startsWith("https://"));

  return (
    <>
      <div class="mb-5">
        <h3 class="text-lg font-bold text-gray-900 dark:text-white">{name}</h3>
        {description && <p class="mt-1.5 text-sm text-gray-500 dark:text-gray-400">{description}</p>}
      </div>

      <PriceDisplay
        price={price}
        price_suffix={price_suffix}
        price_note={price_note}
        price_note_monthly={price_note_monthly}
        price_note_yearly={price_note_yearly}
        billing={billing}
      />

      {cta.text && cta.url && (
        <a
          href={cta.url}
          {...(isExternalCta ? {target: "_blank", rel: "noopener noreferrer"} : {})}
          class={`mb-8 flex w-full items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-semibold transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900 ${
            ctaStyle === "primary"
              ? "bg-gradient-to-r from-primary-600 to-secondary-600 text-white hover:from-primary-700 hover:to-secondary-700 shadow-sm hover:shadow-md"
              : "ring-1 ring-inset ring-gray-300 dark:ring-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700/50"
          }`}
        >
          {cta.text}
          {ctaIconSvg && <Icon svg={ctaIconSvg} attributes={{class: "w-4 h-4 flex-shrink-0"}} />}
        </a>
      )}

      {features.length > 0 && (
        <ul class="mt-auto space-y-3 border-t border-gray-100 dark:border-gray-700/60 pt-6">
          {features.map((f, i) => (
            <FeatureRow key={i} feature={f} />
          ))}
        </ul>
      )}
    </>
  );
}

function PricingTier({tier, billing, icon_svgs}) {
  const {
    name = "",
    badge = "",
    description = "",
    price = {},
    price_suffix = "",
    price_note = "",
    price_note_monthly,
    price_note_yearly,
    highlight = false,
    cta = {},
    features = [],
  } = tier;

  const cardProps = {
    name,
    description,
    price,
    price_suffix,
    price_note,
    price_note_monthly,
    price_note_yearly,
    cta,
    features,
    billing,
    icon_svgs,
    highlight,
  };

  if (highlight) {
    return (
      <div class="relative">
        {badge && (
          <div class="absolute -top-4 inset-x-0 flex justify-center z-10">
            <span class="inline-flex items-center rounded-full bg-gradient-to-r from-primary-600 to-secondary-600 px-4 py-1 text-xs font-semibold text-white shadow-sm">
              {badge}
            </span>
          </div>
        )}
        {/* Gradient border ring (2px, with brand-coloured glow) wrapping a white inner
            card. The thicker p-0.5 makes the gradient direction visible at edge/corners,
            and shadow-primary-500/20 carries the visual lift since primary→secondary in
            light mode have similar hues and the gradient alone reads as flat. */}
        <div class="rounded-3xl p-0.5 bg-gradient-to-br from-primary-500 to-secondary-500 shadow-2xl shadow-primary-500/20">
          <div class="flex flex-col rounded-3xl p-8 bg-white dark:bg-gray-900 h-full">
            <TierCardContent {...cardProps} />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div class="relative flex flex-col rounded-3xl p-8 ring-1 ring-gray-200 dark:ring-gray-700 bg-white dark:bg-gray-800 hover:shadow-xl transition-shadow duration-200">
      {badge && (
        <div class="absolute -top-4 inset-x-0 flex justify-center">
          <span class="inline-flex items-center rounded-full bg-primary-600 px-4 py-1 text-xs font-semibold text-white shadow-sm">{badge}</span>
        </div>
      )}
      <TierCardContent {...cardProps} />
    </div>
  );
}

export const PricingBlock = ({content = {}, icon_svgs = {}}) => {
  const {title, subtitle, billing_toggle = {}, tiers = []} = content;

  const hasYearlyPrices = tiers.some((t) => t.price?.yearly != null && t.price.yearly !== t.price.monthly);
  const showToggle = billing_toggle.enabled && hasYearlyPrices;

  const [billing, setBilling] = useState("monthly");

  const colsClass =
    tiers.length === 1 ? "max-w-sm mx-auto" : tiers.length === 2 ? "max-w-4xl mx-auto grid-cols-1 sm:grid-cols-2" : "grid-cols-1 md:grid-cols-3";

  return (
    <div class="py-16 sm:py-24 px-4 sm:px-6 lg:px-8">
      <div class="max-w-7xl mx-auto">
        {(title || subtitle) && (
          <div class="text-center max-w-3xl mx-auto mb-10 lg:mb-14">
            {title && (
              <h2
                class="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white tracking-tight mb-4"
                dangerouslySetInnerHTML={{__html: renderText(title)}}
              />
            )}
            {subtitle && <p class="text-lg text-gray-600 dark:text-gray-400" dangerouslySetInnerHTML={{__html: renderText(subtitle)}} />}
          </div>
        )}

        {showToggle && <BillingToggle billing={billing} setBilling={setBilling} toggle={billing_toggle} />}

        {/* pt-6 gives clearance for absolutely-positioned badges */}
        <div class={`grid gap-8 pt-6 ${colsClass}`}>
          {tiers.map((tier, i) => (
            <PricingTier key={i} tier={tier} billing={billing} icon_svgs={icon_svgs} />
          ))}
        </div>
      </div>
    </div>
  );
};
