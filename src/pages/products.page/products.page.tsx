import { SinglePorductCard } from "../../components/common/card/single-card.component";
import { FEATURED_PRODUCTS } from "../../data/storefront";

export const ProductPage =() => {
    return(
        <div className="min-h-screen bg-slate-50 transition-colors duration-300 dark:bg-slate-950">
            <section className="bg-white py-14 transition-colors duration-300 dark:bg-slate-900">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                        <div>
                            <p className="text-sm font-semibold uppercase tracking-[0.25em] text-primary-600">
                                Full Catalog
                            </p>
                            <h1 className="section-heading mt-2">Professional Product Collection</h1>
                            <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-600 dark:text-slate-300">
                                Compare models with clearer pricing, category labels, and premium storefront presentation.
                            </p>
                        </div>
                        <div className="rounded-2xl bg-slate-50 px-5 py-4 dark:bg-slate-800">
                            <p className="text-sm text-slate-500 dark:text-slate-400">Products available</p>
                            <p className="mt-1 text-3xl font-bold text-slate-900 dark:text-white">{FEATURED_PRODUCTS.length}</p>
                        </div>
                    </div>
                </div>
            </section>

            <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-4">
                    {FEATURED_PRODUCTS.map((product) => (
                        <SinglePorductCard key={product._id} data={product} />
                    ))}
                </div>
            </section>
        </div>
    )
}
