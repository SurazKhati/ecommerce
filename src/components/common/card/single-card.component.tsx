import { Link } from "react-router-dom";
import { SingleCardWithImageAndTitleProps } from "./single-card.contracts";

const categoryDescriptions: Record<string, string> = {
  "Electric stove": "Energy-efficient electric stoves for modern kitchens. Reliable heating with easy temperature control.",
  "Induction stove": "Fast, precise induction cooktops. Safe, cool-to-touch cooking with instant heat response.",
};

export const ImageWithTitleCard = ({
  data,
}: {
  data: SingleCardWithImageAndTitleProps;
}) => {
  const description =
    data.description ||
    categoryDescriptions[data.title] ||
    "Explore our range of quality kitchen appliances.";

  return (
    <Link
      to={data.slug}
      className="group block overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-card transition-all duration-300 hover:-translate-y-1 hover:shadow-card-hover dark:border-slate-800 dark:bg-slate-900"
    >
      <div className="relative aspect-[4/3] overflow-hidden bg-slate-100 dark:bg-slate-800">
        <img
          src={data.image}
          alt={data.title}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        {data.accent ? (
          <span className="absolute left-4 top-4 rounded-full bg-white/90 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-slate-700 shadow-sm dark:bg-slate-900/90 dark:text-slate-200">
            {data.accent}
          </span>
        ) : null}
      </div>
      <div className="p-5">
        <div className="flex items-start justify-between gap-3">
          <h3 className="text-lg font-bold text-slate-800 transition-colors group-hover:text-primary-600 dark:text-slate-100">
            {data.title}
          </h3>
          {data.productCount ? (
            <span className="rounded-full bg-primary-50 px-3 py-1 text-xs font-semibold text-primary-700 dark:bg-primary-900/30 dark:text-primary-200">
              {data.productCount}+ items
            </span>
          ) : null}
        </div>
        <p className="mt-2 line-clamp-2 text-sm text-slate-500 dark:text-slate-400">{description}</p>
        {data.highlights?.length ? (
          <div className="mt-4 flex flex-wrap gap-2">
            {data.highlights.slice(0, 3).map((highlight) => (
              <span
                key={highlight}
                className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600 dark:bg-slate-800 dark:text-slate-300"
              >
                {highlight}
              </span>
            ))}
          </div>
        ) : null}
        <span className="mt-4 inline-flex items-center text-sm font-medium text-primary-600">
          Explore collection →
        </span>
      </div>
    </Link>
  );
};

export const SinglePorductCard = ({ data }: { data: any }) => {
  const rating = typeof data.rating === "number" ? data.rating.toFixed(1) : "5.0";

  return (
    <div className="group overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-card transition-all duration-300 hover:-translate-y-1 hover:shadow-card-hover dark:border-slate-800 dark:bg-slate-900">
      <div className="relative aspect-square overflow-hidden bg-gradient-to-br from-slate-50 via-white to-primary-50 dark:from-slate-900 dark:via-slate-900 dark:to-slate-800">
        {data.badge ? (
          <span className="absolute left-4 top-4 z-10 rounded-full bg-slate-900 px-3 py-1 text-xs font-semibold uppercase tracking-[0.15em] text-white">
            {data.badge}
          </span>
        ) : null}
        <img
          src={data.image}
          alt={data.title}
          className="h-full w-full object-contain p-4 transition-transform duration-500 group-hover:scale-105"
        />
      </div>
      <div className="p-5">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary-600">
          {data.category || "Kitchen appliance"}
        </p>
        <h3 className="mt-2 line-clamp-2 text-base font-semibold text-slate-800 transition-colors group-hover:text-primary-600 dark:text-slate-100">
          {data.title}
        </h3>
        <p className="mt-2 line-clamp-2 text-sm text-slate-500 dark:text-slate-400">{data.summary}</p>
        <div className="mt-3 flex items-center gap-1 text-amber-400">
          {[...Array(5)].map((_, i) => (
            <svg
              key={i}
              className="h-4 w-4"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
          ))}
          <span className="ml-1 text-sm text-slate-500 dark:text-slate-400">({rating})</span>
        </div>
        <div className="mt-4 flex items-end justify-between gap-4">
          <div>
            <span className="text-xl font-bold text-primary-600">Rs. {data.price}</span>
            {data.oldPrice ? (
              <p className="mt-1 text-sm text-slate-400 line-through dark:text-slate-500">Rs. {data.oldPrice}</p>
            ) : null}
          </div>
          <Link
            to={`/buy-now/${data._id}`}
            className="rounded-xl bg-primary-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-primary-700"
          >
            Buy now
          </Link>
        </div>
      </div>
    </div>
  );
};
