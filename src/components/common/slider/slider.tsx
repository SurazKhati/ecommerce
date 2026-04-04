import { Carousel } from "flowbite-react"
import { Link } from "react-router-dom"
import { SingleSlider } from "./__contracts/contract.slider"

const isExternalLink = (value?: string | null) =>
  Boolean(value && /^https?:\/\//i.test(value));

export const  SliderComponent = ({data}:{data:Array<SingleSlider>}) =>{
    return(<>

      <Carousel className="h-[72vh] overflow-hidden rounded-b-[2rem] bg-slate-900 max-sm:h-[64vh] max-md:h-[58vh] max-lg:h-[60vh] max-xl:h-[68vh]">
        {
          data && data.map((row:SingleSlider, i:number)=>(
            <div key={i} className="relative h-full w-full">
              <img className="h-full w-full object-cover" src={row.image} alt={row.title}/>
              <div className="absolute inset-0 bg-gradient-to-r from-slate-950/90 via-slate-900/65 to-slate-900/15" />
              <div className="absolute inset-x-0 bottom-0 top-0 mx-auto flex h-full max-w-7xl items-center px-4 sm:px-8 lg:px-10">
                <div className="max-w-2xl pt-14 text-white sm:pt-0">
                  {row.eyebrow ? (
                    <p className="text-[10px] font-semibold uppercase tracking-[0.28em] text-cyan-200 sm:text-xs sm:tracking-[0.35em]">
                      {row.eyebrow}
                    </p>
                  ) : null}
                  <h1 className="mt-3 max-w-[13ch] text-[2rem] font-bold leading-[1.02] sm:mt-4 sm:max-w-none sm:text-4xl lg:text-6xl">
                    {row.title}
                  </h1>
                  {row.description ? (
                    <p className="mt-3 max-w-[26ch] text-sm leading-6 text-slate-200 sm:mt-4 sm:max-w-xl sm:text-base sm:leading-7">
                      {row.description}
                    </p>
                  ) : null}
                  <div className="mt-5 flex flex-wrap gap-2.5 sm:mt-6 sm:gap-3">
                    {row.ctaLabel && row.ctaLink ? (
                      <Link
                        to={row.ctaLink}
                        className="rounded-xl bg-white px-5 py-3 text-sm font-semibold text-slate-900 transition hover:bg-slate-100 sm:px-6"
                      >
                        {row.ctaLabel}
                      </Link>
                    ) : null}
                    {row.link ? (
                      isExternalLink(row.link) ? (
                        <a
                          href={row.link}
                          target="_blank"
                          rel="noreferrer"
                          className="rounded-xl border border-white/40 px-5 py-3 text-sm font-semibold text-white transition hover:bg-white/10 sm:px-6"
                        >
                          Learn more
                        </a>
                      ) : (
                        <Link
                          to={row.link}
                          className="rounded-xl border border-white/40 px-5 py-3 text-sm font-semibold text-white transition hover:bg-white/10 sm:px-6"
                        >
                          Learn more
                        </Link>
                      )
                    ) : null}
                  </div>
                  {row.stats?.length ? (
                    <div className="mt-5 hidden flex-wrap gap-3 text-sm text-slate-100 sm:mt-8 sm:flex">
                      {row.stats.slice(0, 3).map((stat) => (
                        <span
                          key={stat}
                          className="rounded-full border border-white/15 bg-white/10 px-4 py-2 backdrop-blur-sm"
                        >
                          {stat}
                        </span>
                      ))}
                    </div>
                  ) : null}
                </div>
              </div>
            </div>
          ))
        }
      </Carousel>
   
    
    </>)

}
