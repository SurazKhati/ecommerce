import { Heading1 } from "../../components/common/title/title";
import { toast } from "react-toastify";
import { useState } from "react";
import{ DateTime} from "luxon"
import bannerSvc from "./banner.service";
import { useNavigate } from "react-router-dom";
import BannerFormComponent from "../../components/banner/banner-form.component";



export const BannerCreatePage = () => {
  const navigate = useNavigate()
  let [loading, setLoading] = useState(false)
  
  const submitEvent = async (data:any)=>{
    setLoading(true)
    try{
      
    console.log(data)
   
      const submitData = {
        ...data,
        startDate:DateTime.fromJSDate(data.startDate).toFormat("yyyy-MM-dd"),
        endDate:DateTime.fromJSDate(data.endDate ).toFormat("yyyy-MM-dd"),
        status: data.status.value
        
      }
      // console.log(submitData);
      await bannerSvc.postRequest("/banner", submitData,{auth:true , file:true})
      toast.success("Banner created sucessfully")
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
        <Heading1>Create Banner</Heading1>
      </div>

      <div className="overflow-x-auto">
        <div className=" py-3  px-5 lg:py-4 ">
         
         <BannerFormComponent submitEvent={submitEvent} loading={loading}/>
        </div>
      </div>
    </>
  );
};
