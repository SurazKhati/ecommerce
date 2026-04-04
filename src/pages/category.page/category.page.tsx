import { useParams } from "react-router-dom";
import { useEffect, useMemo, useState } from "react";
import { ImageWithTitleCard } from "../../components/common/card/single-card.component";
import categorySvc from "../category/category.service";
import { CATEGORY_IMAGE_FALLBACKS, CATEGORIES, FEATURED_PRODUCTS } from "../../data/storefront";

export const CategoryPage = () => {
  const params = useParams();
  const [categories, setCategories] = useState(CATEGORIES);

  useEffect(() => {
    (async () => {
      try {
        const response: any = await categorySvc.getRequest("/category/list-home");
        const homeCategories = response?.result?.data;
        if (Array.isArray(homeCategories) && homeCategories.length > 0) {
          setCategories(
            homeCategories.map((category: any) => ({
              ...category,
              image: category.image || CATEGORY_IMAGE_FALLBACKS[category.slug] || CATEGORIES[0]?.image,
            })),
          );
        }
      } catch (exception) {
        console.log(exception);
      }
    })();
  }, []);

  const activeCategory = useMemo(
    () => categories.find((category) => category.slug === `/category/${params.slug}`),
    [categories, params.slug],
  );

  if (params.slug && activeCategory) {
    const relatedProducts = FEATURED_PRODUCTS.filter(
      (product) => product.category.toLowerCase() === activeCategory.title.toLowerCase(),
    );

    return (
      <div className="min-h-screen bg-slate-50 transition-colors duration-300 dark:bg-slate-950">
        <section className="overflow-hidden bg-slate-950 py-16 text-white">
          <div className="mx-auto grid max-w-7xl gap-10 px-4 sm:px-6 lg:grid-cols-[1.1fr_0.9fr] lg:px-8">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.3em] text-cyan-300">
                {activeCategory.accent}
              </p>
              <h1 className="mt-3 text-4xl font-bold sm:text-5xl">{activeCategory.title}</h1>
              <p className="mt-5 max-w-2xl text-base leading-8 text-slate-300">
                {activeCategory.description}
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                {activeCategory.highlights.map((highlight) => (
                  <span
                    key={highlight}
                    className="rounded-full border border-white/15 bg-white/10 px-4 py-2 text-sm text-slate-100"
                  >
                    {highlight}
                  </span>
                ))}
              </div>
            </div>
            <div className="rounded-[2rem] border border-white/10 bg-white/5 p-6 backdrop-blur">
              <img
                src={activeCategory.image}
                alt={activeCategory.title}
                className="h-72 w-full rounded-[1.5rem] object-cover"
              />
              <div className="mt-5 grid grid-cols-2 gap-4">
                <div className="rounded-2xl bg-white/10 p-4">
                  <p className="text-sm text-slate-300">Available models</p>
                  <p className="mt-2 text-2xl font-bold">{activeCategory.productCount}+</p>
                </div>
                <div className="rounded-2xl bg-white/10 p-4">
                  <p className="text-sm text-slate-300">Customer favorite</p>
                  <p className="mt-2 text-2xl font-bold">4.8/5</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
          <div className="grid gap-6 md:grid-cols-3">
            {[
              { label: "Best for", value: activeCategory.accent },
              { label: "Price range", value: "Rs. 15,999 - Rs. 22,499" },
              { label: "Service promise", value: "Support and delivery assistance" },
            ].map((item) => (
              <div key={item.label} className="rounded-3xl border border-slate-200 bg-white p-6 shadow-card dark:border-slate-800 dark:bg-slate-900">
                <p className="text-sm text-slate-500 dark:text-slate-400">{item.label}</p>
                <h2 className="mt-2 text-xl font-bold text-slate-900 dark:text-white">{item.value}</h2>
              </div>
            ))}
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-4 pb-16 sm:px-6 lg:px-8">
          <div className="mb-8">
            <p className="text-sm font-semibold uppercase tracking-[0.25em] text-primary-600">
              Recommended models
            </p>
            <h2 className="section-heading mt-2">Products in this category</h2>
          </div>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
            {relatedProducts.map((product) => (
              <div key={product._id} className="rounded-3xl border border-slate-200 bg-white p-5 shadow-card dark:border-slate-800 dark:bg-slate-900">
                <img
                  src={product.image}
                  alt={product.title}
                  className="h-64 w-full rounded-2xl bg-slate-50 object-contain p-4 dark:bg-slate-800"
                />
                <p className="mt-5 text-xs font-semibold uppercase tracking-[0.18em] text-primary-600">
                  {product.badge || activeCategory.title}
                </p>
                <h3 className="mt-2 text-xl font-semibold text-slate-900 dark:text-white">{product.title}</h3>
                <p className="mt-2 text-sm leading-7 text-slate-600 dark:text-slate-300">{product.summary}</p>
                <div className="mt-4 flex items-end justify-between">
                  <div>
                    <p className="text-2xl font-bold text-primary-600">Rs. {product.price}</p>
                    {product.oldPrice ? (
                      <p className="text-sm text-slate-400 line-through dark:text-slate-500">Rs. {product.oldPrice}</p>
                    ) : null}
                  </div>
                  <span className="rounded-full bg-slate-100 px-4 py-2 text-sm font-medium text-slate-700 dark:bg-slate-800 dark:text-slate-200">
                    {product.rating.toFixed(1)} rating
                  </span>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 transition-colors duration-300 dark:bg-slate-950">
      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="mb-10 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.25em] text-primary-600">
              Advanced browsing
            </p>
            <h1 className="section-heading mt-2">All Categories</h1>
            <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-600 dark:text-slate-300">
              Compare collections by use case, speed, finish, and value so customers can choose faster.
            </p>
          </div>
          <div className="rounded-2xl bg-white px-5 py-4 shadow-card dark:bg-slate-900">
            <p className="text-sm text-slate-500 dark:text-slate-400">Collections available</p>
            <p className="mt-1 text-3xl font-bold text-slate-900 dark:text-white">{categories.length}</p>
          </div>
        </div>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-4">
          {categories.map((cat) => (
            <ImageWithTitleCard key={cat._id} data={cat} />
          ))}
        </div>
      </div>
    </div>
  );
};
