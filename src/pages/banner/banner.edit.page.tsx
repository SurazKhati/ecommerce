import { Heading1 } from "../../components/common/title/title";
import { toast } from "react-toastify";
import { useEffect, useInsertionEffect, useState } from "react";
import{ DateTime} from "luxon"
import bannerSvc from "./banner.service";
import { useNavigate, useParams } from "react-router-dom";
import BannerFormComponent from "../../components/banner/banner-form.component";
import LoadingComponent from "../../components/common/loading/loading.component";
import { get } from "react-hook-form";

export const BannerEditPage = () => {
    const navigate = useNavigate()
    let [loading, setLoading] = useState(true)
    const [banner, setBanner] = useState<any>()
    const params = useParams();

    const getDetail = async() =>{
        try{
                const detail : any= await bannerSvc.getRequest("/banner/"+params.id,{auth:true});
                // console.log(detail)
               
                setBanner(detail.result)
                setLoading(false)
        }catch(exception) {
            toast.error("error while fetching detail")
            navigate('/admin/banner')
        }
    }

    useEffect(()=>{
        getDetail()
    },[params])
    
    const submitEvent = async (data:any)=>{
      setLoading(true)
      try{
        
      console.log(data)
        console.log("params = ",params)
        const submitData = {
          ...data,
          startDate:DateTime.fromJSDate(data.startDate).toFormat("yyyy-MM-dd"),
          endDate:DateTime.fromJSDate(data.endDate ).toFormat("yyyy-MM-dd"),
          status: data.status.value
          
        }
        if(typeof data.image ==="string"){
            delete submitData.image
        }
        // console.log(submitData);
        await bannerSvc.patchRequest("/banner/"+params.id, submitData,{auth:true , file:true})
        toast.success("Banner updated sucessfully")
        navigate("/admin/banner")
  
      }catch(exception){
        console.log(exception)
        toast.error("Error while creating a banner")
      }finally{
        setLoading(false)
      }
    }
    return (
      <>
        <div className="overflow-x-auto  mb-5 px-5 ">
          <Heading1>Edit Banner</Heading1>
        </div>
  
        <div className="overflow-x-auto">
          <div className=" py-3  px-5 lg:py-4 ">
           {
            loading? <><LoadingComponent/></>
            :
            <>
            <BannerFormComponent detail={{
                    title:banner.title,
                    link:banner.link,
                    status:{
                        label: banner.status === 'active'? 'Publish' : 'Unpublish',
                        value: banner.status
                    },
                    image: banner.image,
                    startDate:DateTime.fromISO(banner.startDate).toFormat("yyyy-MM-dd"),
                    endDate:DateTime.fromISO(banner.endDate).toFormat("yyyy-MM-dd"),

                }} submitEvent={submitEvent} loading={loading}/>
            
            </>
           }
          </div>
        </div>
      </>
    );
  };
  