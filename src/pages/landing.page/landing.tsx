import { BannerComponent } from "../../components/banner/banner";
import { ImageWithTitleCard, SinglePorductCard } from "../../components/common/card/single-card.component";
import { Link } from "react-router-dom";
import "./landing.css";

const CATEGORIES = [
  {
    _id: "1",
    title: "Electric stove",
    slug: "/category/electric-stove",
    image: "https://images.unsplash.com/photo-1585659722983-3a675dabf23d?w=600&h=450&fit=crop",
  },
  {
    _id: "2",
    title: "Induction stove",
    slug: "/category/induction-stove",
    image: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=600&h=450&fit=crop",
  },
];

const FEATURED_PRODUCTS = [
  {
    _id: "1",
    price: "15,999",
    title: "Philips HD4928 2000W Electric Kettle",
    image: "https://flowbite-react.com/images/products/apple-watch.png",
  },
  {
    _id: "2",
    price: "22,500",
    title: "Prestige PIC 20 2000W Induction Cooktop",
    image: "https://flowbite-react.com/images/products/apple-watch.png",
  },
  {
    _id: "3",
    price: "18,900",
    title: "Bajaj Majesty RCX 5 1850W Rice Cooker",
    image: "https://flowbite-react.com/images/products/apple-watch.png",
  },
  {
    _id: "4",
    price: "12,499",
    title: "Orient Electric Kitchen Hub Combo",
    image: "https://flowbite-react.com/images/products/apple-watch.png",
  },
  {
    _id: "5",
    price: "25,000",
    title: "Pigeon Favourite Electric Cooker 4.5L",
    image: "https://flowbite-react.com/images/products/apple-watch.png",
  },
];

const LandingPage = () => {
  return (
    <div className="min-h-screen bg-slate-50">
      <BannerComponent />

      {/* Categories Section */}
      <section className="animate-fade-in mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="mb-8 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
          <h2 className="section-heading">Shop by Category</h2>
          <Link
            to="/categories"
            className="btn-primary group"
          >
            View all
            <span className="ml-1 transition-transform group-hover:translate-x-1">→</span>
          </Link>
        </div>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-2">
          {CATEGORIES.map((cat) => (
            <ImageWithTitleCard key={cat._id} data={cat} />
          ))}
        </div>
      </section>

      {/* Products Section */}
      <section className="border-t border-slate-200 bg-white py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-8 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
            <h2 className="section-heading">Featured Products</h2>
            <Link
              to="/products"
              className="btn-primary group"
            >
              View all products
              <span className="ml-1 transition-transform group-hover:translate-x-1">→</span>
            </Link>
          </div>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
            {FEATURED_PRODUCTS.map((product) => (
              <SinglePorductCard key={product._id} data={product} />
            ))}
          </div>
        </div>
      </section>

      {/* Trust Banner */}
      <section className="border-t border-slate-200 bg-slate-50 py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 gap-6 md:grid-cols-4">
            <div className="flex flex-col items-center text-center">
              <div className="mb-3 rounded-full bg-primary-100 p-4">
                <svg className="h-8 w-8 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h3 className="font-semibold text-slate-800">Quality Assured</h3>
              <p className="mt-1 text-sm text-slate-500">100% genuine products</p>
            </div>
            <div className="flex flex-col items-center text-center">
              <div className="mb-3 rounded-full bg-primary-100 p-4">
                <svg className="h-8 w-8 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="font-semibold text-slate-800">Fast Delivery</h3>
              <p className="mt-1 text-sm text-slate-500">Across Nepal</p>
            </div>
            <div className="flex flex-col items-center text-center">
              <div className="mb-3 rounded-full bg-primary-100 p-4">
                <svg className="h-8 w-8 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="font-semibold text-slate-800">Warranty</h3>
              <p className="mt-1 text-sm text-slate-500">Official warranty on all items</p>
            </div>
            <div className="flex flex-col items-center text-center">
              <div className="mb-3 rounded-full bg-primary-100 p-4">
                <svg className="h-8 w-8 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              </div>
              <h3 className="font-semibold text-slate-800">Support</h3>
              <p className="mt-1 text-sm text-slate-500">Dedicated customer care</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;
