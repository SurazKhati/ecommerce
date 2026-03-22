import axios ,{AxiosResponse} from "axios";

const axiosInstance = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
    timeout:30000,
    // method:"GET,POST,PUT,PATch, delete"
    timeoutErrorMessage:"Server timed out...",
    // maxContentLength
    // maxRate
    // xsrfcookiename


    headers:{
        "Content-Type":"application/json"
    }
})

// interceptor 
axiosInstance.interceptors.response.use((response: any) =>{

    // console.log("sucessintercept :",response);
    return response.data;


},(error:any)=>{
    if(error.response){
        throw error.response
    }
    throw error
})

export default axiosInstance;
