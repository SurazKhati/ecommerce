import {  PropsWithChildren } from "react"
import { toast } from "react-toastify"
import { Navigate ,} from "react-router-dom"
import { useSelector } from "react-redux"
// import { useEffect ,useState  } from "react"

interface PermissionType  {
    allowedBy:string
    user:any
}
const CheckPermission = ({allowedBy,children}:PropsWithChildren<PermissionType>) =>{
    const user = useSelector((root:any)=>{
        return root.auth.loggedInUser|| null

    })
    // const {loggedInUser, setLoggedInUser} = useContext(AuthContext)
    // Todo Loading
    // useEffect => loggend in user => login 
//    console.log("loggeduserr ", user , allowedBy)
   

    if(user){
        
        if(user.role === allowedBy){
            return children
        }else{
            toast.warn("You do not have permission to access this panel ")
            return(<>
            <Navigate to = {`/${user.role}`} />
            </>)
        }


    }else{
        
        toast.error("please login first")
        return(<>
        <Navigate to='/login' />
        
        </>)
    }
  
  
}



export default CheckPermission