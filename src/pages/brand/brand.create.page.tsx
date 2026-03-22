import { Heading1 } from "../../components/common/title/title";
import { toast } from "react-toastify";
import { useState } from "react";
import brandSvc from "./brand.service";
import { useNavigate } from "react-router-dom";
import BrandFormComponent from "../../components/brand/brand-form.component";



export const BrandCreatePage = () => {
  const navigate = useNavigate()
  let [loading, setLoading] = useState(false)
  
  const submitEvent = async (data:any)=>{
    setLoading(true)
    try{
      
    console.log(data)
   
      const submitData = {
        ...data,
        
        status: data.status.value
        
      }
      // console.log(submitData);
      await brandSvc.postRequest("/brand", submitData,{auth:true , file:true})
      toast.success("Brand created sucessfully")
      navigate("/admin/brand")

    }catch(exception){
      console.log(exception)
      toast.error("Error while creating a brand")
    }finally{
      setLoading(false)
    }
  }
  return (
    <>
      <div className="overflow-x-auto  mb-5 px-5 ">
        <Heading1>Create Brand</Heading1>
      </div>

      <div className="overflow-x-auto">
        <div className=" py-3  px-5 lg:py-4 ">
         
         <BrandFormComponent submitEvent={submitEvent} loading={loading}/>
        </div>
      </div>
    </>
  );
};
