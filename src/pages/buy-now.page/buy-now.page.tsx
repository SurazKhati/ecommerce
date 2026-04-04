import { Link, useParams } from "react-router-dom";
import esewaQr from "../../assets/images/esewa.jpg";
import { getFeaturedProductById } from "../../data/storefront";

const ESEWA_NUMBER = "9864638141";

const parsePrice = (value: string) => Number(value.replace(/,/g, "")) || 0;

const BuyNowPage = () => {
  const { id } = useParams();
  const product = getFeaturedProductById(id);

  if (!product) {
    return (
      <section className="mx-auto flex min-h-[70vh] max-w-3xl items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
        <div className="w-full rounded-3xl border border-slate-200 bg-white p-10 text-center shadow-card dark:border-slate-800 dark:bg-slate-900">
          <h1 className="text-3xl font-bold text-slate-800 dark:text-white">Product not found</h1>
          <p className="mt-3 text-slate-500 dark:text-slate-400">
            Please return to the home page and choose a featured product again.
          </p>
          <Link
            to="/"
            className="mt-6 inline-flex rounded-xl bg-primary-600 px-6 py-3 font-semibold text-white transition-colors hover:bg-primary-700"
          >
            Back to home
          </Link>
        </div>
      </section>
    );
  }

  const totalAmount = parsePrice(product.price);

  return (
    <section className="bg-slate-50 py-12 transition-colors duration-300 dark:bg-slate-950">
      <div className="mx-auto grid max-w-6xl gap-8 px-4 sm:px-6 lg:grid-cols-[1.1fr_0.9fr] lg:px-8">
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-card dark:border-slate-800 dark:bg-slate-900 sm:p-8">
          <div className="flex flex-col gap-6 sm:flex-row">
            <div className="mx-auto flex w-full max-w-xs items-center justify-center rounded-2xl bg-slate-50 p-4 dark:bg-slate-800">
              <img
                src={product.image}
                alt={product.title}
                className="h-64 w-full object-contain"
              />
            </div>
            <div className="flex-1">
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-primary-600">
                Buy Now
              </p>
              <h1 className="mt-2 text-3xl font-bold text-slate-900 dark:text-white">{product.title}</h1>
              <p className="mt-3 text-slate-500 dark:text-slate-400">
                Complete your order by paying the full amount through eSewa using the QR code or number shown here.
              </p>
              <div className="mt-6 space-y-4 rounded-2xl bg-slate-50 p-5 dark:bg-slate-800">
                <div className="flex items-center justify-between text-slate-600 dark:text-slate-300">
                  <span>Quantity</span>
                  <span className="font-semibold text-slate-900 dark:text-white">1</span>
                </div>
                <div className="flex items-center justify-between text-slate-600 dark:text-slate-300">
                  <span>Unit price</span>
                  <span className="font-semibold text-slate-900 dark:text-white">Rs. {product.price}</span>
                </div>
                <div className="border-t border-slate-200 pt-4">
                  <div className="flex items-center justify-between">
                    <span className="text-lg font-semibold text-slate-900 dark:text-white">Total amount</span>
                    <span className="text-2xl font-bold text-primary-600">
                      Rs. {totalAmount.toLocaleString("en-NP")}
                    </span>
                  </div>
                </div>
              </div>
              <Link
                to="/"
                className="mt-6 inline-flex rounded-xl border border-slate-300 px-5 py-3 font-medium text-slate-700 transition-colors hover:bg-slate-100 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800"
              >
                Continue shopping
              </Link>
            </div>
          </div>
        </div>

        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-card dark:border-slate-800 dark:bg-slate-900 sm:p-8">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-primary-600">
            eSewa Payment
          </p>
          <h2 className="mt-2 text-2xl font-bold text-slate-900 dark:text-white">Scan and pay</h2>
          <p className="mt-3 text-slate-500 dark:text-slate-400">
            Open your eSewa app, scan the QR code below, and send the exact total amount.
          </p>

          <div className="mt-6 overflow-hidden rounded-2xl border border-emerald-100 bg-emerald-50 p-4">
            <img
              src={esewaQr}
              alt="eSewa QR code"
              className="mx-auto h-auto w-full max-w-sm rounded-xl bg-white object-contain"
            />
          </div>

          <div className="mt-6 rounded-2xl bg-slate-50 p-5 dark:bg-slate-800">
            <p className="text-sm text-slate-500 dark:text-slate-400">eSewa number</p>
            <p className="mt-1 text-2xl font-bold tracking-wide text-slate-900 dark:text-white">{ESEWA_NUMBER}</p>
            <p className="mt-4 text-sm text-slate-500 dark:text-slate-400">Amount to pay</p>
            <p className="mt-1 text-xl font-semibold text-primary-600">
              Rs. {totalAmount.toLocaleString("en-NP")}
            </p>
          </div>

          <div className="mt-6 rounded-2xl border border-dashed border-slate-300 p-4 text-sm text-slate-600 dark:border-slate-700 dark:text-slate-300">
            After payment, please keep your screenshot or receipt ready for confirmation.
          </div>
        </div>
      </div>
    </section>
  );
};

export default BuyNowPage;
