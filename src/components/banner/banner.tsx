import { useEffect, useState } from "react"
import { SliderComponent } from "../common/slider/slider"
import { SingleSlider } from "../common/slider/__contracts/contract.slider"
import bannerSvc from "../../pages/banner/banner.service"
import banner4 from "../../assets/images/banner4.avif"
import { HERO_SLIDES } from "../../data/storefront"

const defaultBannerData: Array<SingleSlider> = HERO_SLIDES
const FALLBACK_BANNER_COPY = HERO_SLIDES[0]

const normalizeBanner = (banner: any, index: number): SingleSlider => {
    const rawLink = typeof banner?.link === "string" ? banner.link.trim() : ""
    const safeLink =
        !rawLink || rawLink.includes("example.com")
            ? "/products"
            : rawLink

    return {
        _id: banner?._id || `banner-${index}`,
        title:
            banner?.title && banner.title !== "Homepage Banner"
                ? banner.title
                : "Portable electric burners for fast everyday cooking",
        image: banner?.image || FALLBACK_BANNER_COPY.image,
        link: safeLink,
        eyebrow: banner?.eyebrow || "Featured burner collection",
        description:
            banner?.description ||
            "Discover practical electric burners with compact design, fast heating, and a cleaner setup for home kitchens.",
        ctaLabel: banner?.ctaLabel || "Shop now",
        ctaLink: safeLink,
        stats: Array.isArray(banner?.stats) && banner.stats.length
            ? banner.stats
            : ["Portable design", "Quick heating", "Ready for daily use"],
    }
}

export const BannerComponent = () =>{
    const [bannerData , setBannerData] = useState(defaultBannerData)
    const [showPopup, setShowPopup] = useState(false)

    const getAllBanner = async () => {
        try{
            const response :any= await bannerSvc.getRequest('/banner/list-home')
            const homeBanners = response?.result?.data

            if (Array.isArray(homeBanners) && homeBanners.length > 0) {
                setBannerData(homeBanners.map(normalizeBanner))
            }

        }catch(exception){
            console.log(exception)
        }

    }

    useEffect(()=>{
            getAllBanner()
    },[])

    useEffect(() => {
        const popupTimer = window.setTimeout(() => {
            setShowPopup(true)
        }, 5000)

        return () => {
            window.clearTimeout(popupTimer)
        }
    }, [])

    return(

        <>
        <SliderComponent data={bannerData}/>
        {showPopup && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4">
                <div className="relative w-full max-w-4xl overflow-hidden rounded-2xl bg-white shadow-2xl">
                    <button
                        type="button"
                        onClick={() => setShowPopup(false)}
                        className="absolute right-3 top-3 z-10 rounded-full bg-black/70 px-3 py-1 text-sm font-semibold text-white hover:bg-black"
                    >
                        X
                    </button>
                    <img
                        src={banner4}
                        alt="Banner 4"
                        className="h-auto max-h-[80vh] w-full object-cover"
                    />
                </div>
            </div>
        )}
    
        </>
    )
}
