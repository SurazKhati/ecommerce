import axiosInstance from "../config/axios.config";
import { SearchParams } from "../config/constants";

interface HeaderConfigProps{
    auth?:boolean,
    file?:boolean,
    params?:SearchParams

}

abstract class HttpService{

    private headers={};
    private params={}
    private setHeaders =  (config:any) =>{
        if(config && config.auth){
            // login token
            const token = localStorage.getItem('_at')|| null;
            if(!token){
                // throw new  Error("error")
                throw {message:"login first"}
            }else{
                console.log("already logged")
                this.headers = {
                    ...this.headers,
                    "Authorization":"Bearer "+ token

                }
            }
        }
        if(config && config.file){
            this.headers = {
                ...this.headers,
                "Content-Type":"multipart/form-data"
            }
        } // todo : params  set 
        if(config  && config.params){
            this.params = {
                ...config.params
            }
        }
    }
     postRequest = async(url:string,data:any = {}, config:any = null )=>{
        try{
            this.setHeaders(config)
            const response = await axiosInstance.post(url,data,{
                headers:{...this.headers},
                params:{...this.params}
            })
            console.log("sucessPost:",response);
            return response;
            
        }catch(exception){
            console.log("exception",exception);
            throw exception
        }
     }
     getRequest = async(url:string, config:any = null )=>{
        try{
            this.setHeaders(config)
            // this.headers
            const response = await axiosInstance.get(url,{
                
                headers:{...this.headers},
                params:{...this.params}
            })
            // console.log("sucessget:",response);
            return response;
            
        }catch(exception){
            console.log("exception",exception);
            throw exception
        }
     }
     deleteRequest = async(url:string, config:any = null )=>{
        try{
            this.setHeaders(config)
            // this.headers
            const response = await axiosInstance.delete(url,{
                
                headers:{...this.headers},
                params:{...this.params}
            })
            // console.log("sucessget:",response);
            return response;
            
        }catch(exception){
            console.log("exception",exception);
            throw exception
        }
     }
     patchRequest = async(url:string,data:any = {}, config:any = null )=>{
        try{
            this.setHeaders(config)
            const response = await axiosInstance.patch(url,data,{
                headers:{...this.headers},
                params:{...this.params}
            })
            console.log("sucessPost:",response);
            return response;
            
        }catch(exception){
            console.log("exception",exception);
            throw exception
        }
     }
}
export  default HttpService