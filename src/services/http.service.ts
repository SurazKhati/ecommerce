import axiosInstance from "../config/axios.config";
import { SearchParams } from "../config/constants";

interface HeaderConfigProps{
    auth?:boolean,
    file?:boolean,
    params?:SearchParams

}

abstract class HttpService{

    private setHeaders =  (config:any) =>{
        let headers:any = {};
        let params:any = {};
        if(config && config.auth){
            // login token
            const token = localStorage.getItem('_at')|| null;
            if(!token){
                // throw new  Error("error")
                throw {message:"login first"}
            }else{
                console.log("already logged")
                headers = {
                    ...headers,
                    "Authorization":"Bearer "+ token

                }
            }
        }
        if(config && config.file){
            headers = {
                ...headers,
                "Content-Type":"multipart/form-data"
            }
        } // todo : params  set 
        if(config  && config.params){
            params = {
                ...config.params
            }
        }
        return {headers, params}
    }
     postRequest = async(url:string,data:any = {}, config:any = null )=>{
        try{
            const {headers, params} = this.setHeaders(config)
            const response = await axiosInstance.post(url,data,{
                headers:{...headers},
                params:{...params}
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
            const {headers, params} = this.setHeaders(config)
            // this.headers
            const response = await axiosInstance.get(url,{
                
                headers:{...headers},
                params:{...params}
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
            const {headers, params} = this.setHeaders(config)
            // this.headers
            const response = await axiosInstance.delete(url,{
                
                headers:{...headers},
                params:{...params}
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
            const {headers, params} = this.setHeaders(config)
            const response = await axiosInstance.patch(url,data,{
                headers:{...headers},
                params:{...params}
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
