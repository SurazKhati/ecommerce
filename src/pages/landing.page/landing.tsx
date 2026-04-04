import { BannerComponent } from "../../components/banner/banner";
import { ImageWithTitleCard, SinglePorductCard } from "../../components/common/card/single-card.component";
import { Link } from "react-router-dom";
import { CATEGORY_IMAGE_FALLBACKS, CATEGORIES, FEATURED_PRODUCTS } from "../../data/storefront";
import { useEffect, useState } from "react";
import categorySvc from "../category/category.service";
import "./landing.css";

const LandingPage = () => {
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

  return (
    <div className="min-h-screen bg-slate-50 transition-colors duration-300 dark:bg-slate-950">
      <BannerComponent />

      <section className="mx-auto -mt-16 max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-4 rounded-[2rem] border border-slate-200 bg-white/95 p-4 shadow-2xl backdrop-blur sm:grid-cols-2 lg:grid-cols-4 lg:p-6 dark:border-slate-800 dark:bg-slate-900/95">
          {[
            { title: "Curated product range", value: "19+ models", note: "From compact home use to commercial kitchens" },
            { title: "Reliable payment", value: "eSewa ready", note: "Simple QR-based checkout for direct orders" },
            { title: "Fast support", value: "6 days/week", note: "Order help, guidance, and post-purchase support" },
            { title: "Coverage", value: "Across Nepal", note: "Delivery support for city and district customers" },
          ].map((item) => (
            <div key={item.title} className="rounded-2xl bg-slate-50 p-5 dark:bg-slate-800/70">
              <p className="text-sm text-slate-500 dark:text-slate-400">{item.title}</p>
              <h3 className="mt-2 text-2xl font-bold text-slate-900 dark:text-white">{item.value}</h3>
              <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">{item.note}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="animate-fade-in mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="mb-8 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.25em] text-primary-600">
              Category Collections
            </p>
            <h2 className="section-heading mt-2">Shop by Category</h2>
            <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-600 dark:text-slate-300">
              Browse curated stove collections based on performance, finish, and how you cook every day.
            </p>
          </div>
          <Link
            to="/categories"
            className="btn-primary group"
          >
            View all
            <span className="ml-1 transition-transform group-hover:translate-x-1">→</span>
          </Link>
        </div>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-4">
          {categories.map((cat) => (
            <ImageWithTitleCard key={cat._id} data={cat} />
          ))}
        </div>
      </section>

      <section className="border-y border-slate-200 bg-white py-16 transition-colors duration-300 dark:border-slate-800 dark:bg-slate-900">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-8 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.25em] text-primary-600">
                Featured Picks
              </p>
              <h2 className="section-heading mt-2">Professional Product Display</h2>
              <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-600 dark:text-slate-300">
                Stronger pricing presentation, premium badges, and a wider model range to make the storefront feel ready for customers.
              </p>
            </div>
            <Link
              to="/products"
              className="btn-primary group"
            >
              View all products
              <span className="ml-1 transition-transform group-hover:translate-x-1">→</span>
            </Link>
          </div>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-4">
            {FEATURED_PRODUCTS.map((product) => (
              <SinglePorductCard key={product._id} data={product} />
            ))}
          </div>
        </div>
      </section>

      <section className="border-t border-slate-200 bg-slate-50 py-16 transition-colors duration-300 dark:border-slate-800 dark:bg-slate-950">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-10 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.25em] text-primary-600">
                Why customers trust us
              </p>
              <h2 className="section-heading mt-2">Built for confidence, not just clicks</h2>
            </div>
            <p className="max-w-xl text-sm leading-7 text-slate-600 dark:text-slate-300">
              The homepage now carries stronger business signals so customers quickly understand quality, support, and delivery confidence.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-6 md:grid-cols-4">
            <div className="flex flex-col items-center text-center">
              <div className="mb-3 rounded-full bg-primary-100 p-4">
                <svg className="h-8 w-8 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h3 className="font-semibold text-slate-800 dark:text-white">Quality Assured</h3>
              <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">100% genuine products</p>
            </div>
            <div className="flex flex-col items-center text-center">
              <div className="mb-3 rounded-full bg-primary-100 p-4">
                <svg className="h-8 w-8 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="font-semibold text-slate-800 dark:text-white">Fast Delivery</h3>
              <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Across Nepal</p>
            </div>
            <div className="flex flex-col items-center text-center">
              <div className="mb-3 rounded-full bg-primary-100 p-4">
                <svg className="h-8 w-8 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="font-semibold text-slate-800 dark:text-white">Warranty</h3>
              <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Official warranty on all items</p>
            </div>
            <div className="flex flex-col items-center text-center">
              <div className="mb-3 rounded-full bg-primary-100 p-4">
                <svg className="h-8 w-8 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              </div>
              <h3 className="font-semibold text-slate-800 dark:text-white">Support</h3>
              <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Dedicated customer care</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;
