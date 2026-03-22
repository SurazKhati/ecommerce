import { useEffect, useState } from "react"
import { SliderComponent } from "../common/slider/slider"
import { SingleSlider } from "../common/slider/__contracts/contract.slider"
import bannerSvc from "../../pages/banner/banner.service"
import banner1 from "../../assets/images/banner1.avif"
import banner2 from "../../assets/images/banner2.avif"
import banner3 from "../../assets/images/banner3.avif"
import banner4 from "../../assets/images/banner4.avif"

const defaultBannerData: Array<SingleSlider> = [
    {
        _id: "default-banner-1",
        title: "Banner 1",
        image: banner1,
        link: null
    },
    {
        _id: "default-banner-2",
        title: "Banner 2",
        image: banner2,
        link: null
    },
    {
        _id: "default-banner-3",
        title: "Banner 3",
        image: banner3,
        link: null
    }
]

export const BannerComponent = () =>{
    const [bannerData , setBannerData] = useState(defaultBannerData)
    const [showPopup, setShowPopup] = useState(false)

    const getAllBanner = async () => {
        try{
            const response :any= await bannerSvc.getRequest('/banner/list-home')
            const homeBanners = response?.result?.data

            if (Array.isArray(homeBanners) && homeBanners.length > 0) {
                setBannerData(homeBanners)
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
