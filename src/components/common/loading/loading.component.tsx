import { Spinner } from "flowbite-react";

const LoadingComponent = ({size="xl"}:{size?:string}) =>{

    return(<>
    
    <Spinner aria-label="Default status example" className="text-stone-400" size={size}/>
    
    </>)
}
export default LoadingComponent