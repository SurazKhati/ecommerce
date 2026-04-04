import { Footer } from "flowbite-react";
import { Link } from "react-router-dom";
import logo from "../../../assets/images/logo.png";

export const FooterComponent = () => {
  return (
    <Footer container className="mt-16 rounded-none border-t border-slate-200 bg-slate-900 transition-colors duration-300 dark:border-slate-800 dark:bg-slate-950">
      <div className="w-full px-6 py-12 lg:px-16">
        <div className="grid gap-10 sm:grid-cols-2 md:grid-cols-4">
          {/* BRAND */}
          <div>
            <Link
              to="/"
              className="mb-4 flex items-center gap-2 transition-opacity hover:opacity-90"
            >
              <img
                src={logo}
                className="h-9"
                alt="Peoples Commerce Logo"
              />
              <span className="text-xl font-bold text-white">
                Peoples Commerce
              </span>
            </Link>
            <p className="text-sm leading-relaxed text-slate-400 dark:text-slate-500">
              Your trusted destination for high-quality electric & induction stoves.
              Safe, efficient kitchen solutions for every home in Nepal.
            </p>
          </div>

          {/* QUICK LINKS */}
          <div>
            <h2 className="mb-4 text-sm font-semibold uppercase tracking-wider text-slate-300">
              Quick Links
            </h2>
            <ul className="space-y-2">
              {[
                { to: "/aboutus", label: "About Us" },
                { to: "/contacts", label: "Contact" },
                { to: "/categories", label: "Categories" },
                { to: "/privacypolicy", label: "Privacy Policy" },
              ].map((item) => (
                <li key={item.to}>
                  <Link
                    to={item.to}
                    className="text-slate-400 transition-colors hover:text-white dark:text-slate-500 dark:hover:text-slate-200"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* CONTACT */}
          <div>
            <h2 className="mb-4 text-sm font-semibold uppercase tracking-wider text-slate-300">
              Contact
            </h2>
            <div className="space-y-3 text-sm text-slate-400 dark:text-slate-500">
              <p>📍 Baneshwor, Kathmandu</p>
              <p>
                <a href="tel:+9779864638141" className="transition-colors hover:text-white dark:hover:text-slate-200">
                  📞 +977 9864638141
                </a>
              </p>
              <p>
                <a
                  href="mailto:peoplescommerce@gmail.com"
                  className="transition-colors hover:text-white dark:hover:text-slate-200"
                >
                  📧 peoplescommerce@gmail.com
                </a>
              </p>
              <p>🕒 Sun – Fri, 9 AM – 6 PM</p>
            </div>
          </div>

          {/* FOLLOW */}
          <div>
            <h2 className="mb-4 text-sm font-semibold uppercase tracking-wider text-slate-300">
              Follow Us
            </h2>
            <a
              href="https://www.facebook.com/peoplesreviewweekly/"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 rounded-lg bg-slate-800 px-4 py-2 text-sm text-slate-300 transition-colors hover:bg-slate-700 hover:text-white dark:bg-slate-900 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-100"
            >
              Facebook
            </a>
            <p className="mt-3 text-sm text-slate-500 dark:text-slate-600">
              Stay connected for updates & offers
            </p>
          </div>
        </div>

        <Footer.Divider className="my-8 border-slate-700" />

        <div className="flex flex-col items-center justify-between gap-4 text-sm text-slate-500 dark:text-slate-600 sm:flex-row">
          <Footer.Copyright
            href="/"
            by="Peoples Commerce™"
            year={2026}
            className="!text-slate-500"
          />
          <span>Designed for modern kitchens</span>
        </div>
      </div>
    </Footer>
  );
};
