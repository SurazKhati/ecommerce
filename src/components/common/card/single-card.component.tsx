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
    categoryDescriptions[data.title] ||
    "Explore our range of quality kitchen appliances.";

  return (
    <Link
      to={data.slug}
      className="group block overflow-hidden rounded-xl border border-slate-200 bg-white shadow-card transition-all duration-300 hover:-translate-y-1 hover:shadow-card-hover"
    >
      <div className="aspect-[4/3] overflow-hidden bg-slate-100">
        <img
          src={data.image}
          alt={data.title}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
      </div>
      <div className="p-5">
        <h3 className="text-lg font-bold text-slate-800 transition-colors group-hover:text-primary-600">
          {data.title}
        </h3>
        <p className="mt-2 line-clamp-2 text-sm text-slate-500">{description}</p>
        <span className="mt-3 inline-flex items-center text-sm font-medium text-primary-600">
          Shop now →
        </span>
      </div>
    </Link>
  );
};

export const SinglePorductCard = ({ data }: { data: any }) => {
  return (
    <div className="group overflow-hidden rounded-xl border border-slate-200 bg-white shadow-card transition-all duration-300 hover:-translate-y-1 hover:shadow-card-hover">
      <div className="relative aspect-square overflow-hidden bg-slate-50">
        <img
          src={data.image}
          alt={data.title}
          className="h-full w-full object-contain p-4 transition-transform duration-500 group-hover:scale-105"
        />
      </div>
      <div className="p-5">
        <h3 className="line-clamp-2 text-base font-semibold text-slate-800 transition-colors group-hover:text-primary-600">
          {data.title}
        </h3>
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
          <span className="ml-1 text-sm text-slate-500">(5.0)</span>
        </div>
        <div className="mt-4 flex items-center justify-between">
          <span className="text-xl font-bold text-primary-600">
            Rs. {data.price}
          </span>
          <button className="rounded-lg bg-primary-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-primary-700">
            Add to cart
          </button>
        </div>
      </div>
    </div>
  );
};
