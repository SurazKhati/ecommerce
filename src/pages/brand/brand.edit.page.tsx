import { Heading1 } from "../../components/common/title/title";
import { toast } from "react-toastify";
import { useEffect, useState } from "react";
import brandSvc from "./brand.service";
import { useNavigate, useParams } from "react-router-dom";
import BrandFormComponent from "../../components/brand/brand-form.component";
import LoadingComponent from "../../components/common/loading/loading.component";

export const BrandEditPage = () => {
    const navigate = useNavigate()
    let [loading, setLoading] = useState(true)
    const [brand, setBrand] = useState<any>()
    const params = useParams();

    const getDetail = async() =>{
        try{
                const detail : any= await brandSvc.getRequest("/brand/"+params.id,{auth:true});
                // console.log(detail)
               
                setBrand(detail.result)
                setLoading(false)
        }catch(exception) {
            toast.error("error while fetching detail")
            navigate('/admin/brand')
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
          
          status: data.status.value
          
        }
        if(typeof data.image ==="string"){
            delete submitData.image
        }
        // console.log(submitData);
        await brandSvc.patchRequest("/brand/"+params.id, submitData,{auth:true , file:true})
        toast.success("Brand updated sucessfully")
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
          <Heading1>Edit Brand</Heading1>
        </div>
  
        <div className="overflow-x-auto">
          <div className=" py-3  px-5 lg:py-4 ">
           {
            loading? <><LoadingComponent/></>
            :
            <>
            <BrandFormComponent detail={{
                    title:brand.title,
                   
                    status:{
                        label: brand.status === 'active'? 'Publish' : 'Unpublish',
                        value: brand.status
                    },
                    image: brand.image,
                    
                }} submitEvent={submitEvent} loading={loading}/>
            
            </>
           }
          </div>
        </div>
      </>
    );
  };
  