import { CancelButton, InputLabel, StatusSelectComponent, SubmitButton, TextInputComponent } from "../../components/common/form/input.component";
import { FaPaperPlane, FaUndo } from "react-icons/fa";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup"
import { useForm } from "react-hook-form";
import { useEffect, useState } from "react";


const BrandFormComponent =({submitEvent,loading, detail=null}:{submitEvent:any, loading:boolean, detail?:any}) =>{
    const brandDTO = Yup.object({
        title : Yup.string().min(3).max(100).required(),
        status: Yup.object({
          label: Yup.string().matches(/^(Publish|Unpublish)$/).required(),
          value: Yup.string().matches(/^(active|inactive)$/).required(),
        }).required(),
        // status: Yup.string().valid(...Object.values(StatusType)).required(),
        image: Yup.mixed().required(),
      })
      const [thumb , setThumb] = useState<string|File>()
      const {control ,handleSubmit, setValue , formState:{errors}} = useForm({
        resolver: yupResolver(brandDTO)
      })

      useEffect(() =>{
          if(detail){
            setValue("title", detail.title)
            setValue("status", detail.status)
            setValue("image", detail.image)
            setThumb(detail.image)
          }
      },[detail])

    return(<>
    
    
    <form onSubmit={handleSubmit(submitEvent)}>
            <div className="grid gap-4 sm:grid-cols-2 sm:gap-6">
              <div className="sm:col-span-2">
                <InputLabel htmlFor="title">Brand Title</InputLabel>
                <TextInputComponent
                 control={control}
                 name="title"
                 defaultValue=""
                 errMsg={errors?.title?.message}/>
              </div>
              
              
              <div>

              <InputLabel htmlFor="status">Status</InputLabel>
             <StatusSelectComponent 
             name="status"
             control={control} 
             errMsg={errors?.status?.message}/>
               
              </div>
              <div className="col-span-2">
              <InputLabel htmlFor="image">Brand Image </InputLabel>

              <div className="flex gap-2">
                
              
                  <div className="w-3/4">
                  <input
                      type="file"
                      
                      id="image"
                      onChange={(e:any) =>{
                        // e.target.files
                        const image = e.target.files['0'];
                        setValue('image', image);
                        setThumb(image)

                      }}
                      name="image"
                      className="mt-1 w-full block rounded-md border-gray-200 bg-white text-sm text-gray-700 shadow-sm"
                    />
                  </div>
             
                 <div className="w-1/4">
                 <img  src={thumb?(typeof thumb ==='string' ? thumb: URL.createObjectURL(thumb)): 'https://placehold.co/600x200?text=NO+image+found'} alt="Image" className="max-w-full" />
                 </div>
              </div>
                 <span className="text-sm italic text-red-800">{errors?.image?.message}</span>
              </div>
              <div className="sm:col-span-2">
              
              </div>
            </div>
            <div className="btnn flex flex-wrap justify-between  w-[35%]">
            <SubmitButton loading={loading}><div className=" m-1 flex align-baseline justify-between space-x-2"><FaPaperPlane className="mt-1"/><span>  Submit</span></div></SubmitButton>
          
           <CancelButton loading={loading} href={"/admin/brand"}>
           <div className="flex flex-shrink justify-between  m-1 space-x-2 ">
            <FaUndo className="mt-0.5" />
            <span>  Cancel</span>
            </div>
            </CancelButton>
                  
            </div>
         </form>
    </>)
}
export default BrandFormComponent