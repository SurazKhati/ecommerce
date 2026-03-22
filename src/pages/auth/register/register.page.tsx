import { useForm } from "react-hook-form";
import image from "../../../assets/images/the-growth-of-e-commerce-platforms-with-javascript.png"
import { CredentialResponse, GoogleLogin } from "@react-oauth/google";
import { InputLabel, RoleSelectComponent, TextAreaInputComponent, TextInputComponent } from "../../../components/common/form/input.component";
import * as Yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
// import axiosInstance from "../../../config/axios.config";
import authSvc from "../auth.service";
import {toast} from "react-toastify"
import { NavLink, useNavigate } from "react-router-dom";
import { useState } from "react";
import LoadingComponent from "../../../components/common/loading/loading.component";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setloggedInUserForRedux } from "../../../reducer/user.reducer";

const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID || "";

const RegisterPage=() =>{
    const registerDTO = Yup.object({
      name: Yup.string().min(2).max(50).required(),
      phone: Yup.string().nullable(),
      email:Yup.string().email().required(),
      address: Yup.string().nullable(),
      password: Yup.string().matches(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*\W).{8,25}$/, "Password must contain at least one digit, one lowercase, one uppercase letter, one special character, and be between 8-25 characters.").required(),
      confirmPassword: Yup.string().oneOf([Yup.ref('password')],"Password and confirm password must match"),
      role: Yup.string().matches(/^(seller|customer)$/).default('customer'),
      image: Yup.mixed()
    })

    const navigate = useNavigate();
    const [loading , setLoading] = useState(false);
    const dispatch = useDispatch();

    const {control, handleSubmit ,setValue, setError, watch, formState:{errors}} = useForm({
      resolver: yupResolver(registerDTO)
    });
    const submitForm = async(data:any) =>{
    // api call try{}

    try{
        //http://localhost:9005/auth/register
      // const response = await axiosInstance.post('/auth/register',data,{
      //   headers:{
      //     "Content-Type":"multipart/form-data"
      //   }
      // })
      setLoading(true)
      const response:any = await authSvc.postRequest('/auth/register',data,{file:true})
      // toast.success(response.message)
      toast.success("Registration is Done , Check your email for verification ")

      navigate('/')
    }
    catch(exception:any){

      if(+exception.status === 400){

        Object.keys(exception.data.result).map((field:any) =>{
            setError(field,{message: exception.data.result[field]})
          
        
        })
      
    }
    toast.error(exception.data.message)
  } finally{
    setLoading(false);

  }
}
const applyAuthResponse = (response:any) => {
  localStorage.setItem("_at", response.result.token.token);
  localStorage.setItem("_rt", response.result.token.refreshToken);
  dispatch(setloggedInUserForRedux(response.result.userDetail));
  toast.success(`Welcome ${response.result.userDetail.role}`);
  navigate(`/${response.result.userDetail.role}`);
}

const handleGoogleRegister = async (credentialResponse: CredentialResponse) => {
  if (!credentialResponse.credential) {
    toast.error("Google sign up did not return a credential");
    return;
  }

  try {
    setLoading(true);
    const response = await authSvc.postRequest("/auth/google", {
      credential: credentialResponse.credential,
      role: watch("role") || "customer"
    });
    applyAuthResponse(response);
  } catch (error:any) {
    toast.error(error?.data?.message || "Google sign up failed");
  } finally {
    setLoading(false);
  }
}

const loggedInUser = useSelector((root:any) =>{
   return root.auth.loggedInUser || null
})
useEffect(()=>{
    if(loggedInUser){
        console.log('in login',loggedInUser)
        toast.info("You are already logged in ")
        navigate('/'+loggedInUser.role)

    }
},[loggedInUser])
// const getLoggedInUser = async() =>{
//   try{
//       const response:any = await authSvc.getRequest("/auth/me",{auth:true})
//       toast.info("you are already logged in ")
//       navigate('/'+response.result.role)

//   }catch(exception){
//       console.log(exception)
//   }
// }

// useEffect(()=>{

//   const token = localStorage.getItem('_at') || null;
//   if(token){
//       //logged in user 
//       getLoggedInUser()
//   }

// },[])




    return(<>

<section className="bg-white">
  <div className="lg:grid lg:min-h-screen lg:grid-cols-12">
    <aside className="relative block h-16 lg:order-last lg:col-span-5 lg:h-full xl:col-span-6">
      <img
        alt=""
        src={image}
        className="absolute inset-0 h-full w-full object-cover"
      />
    </aside>

    <main
      className="flex items-center justify-center px-8 py-8 sm:px-12 lg:col-span-7 lg:px-16 lg:py-12 xl:col-span-6"
    >
      <div className="max-w-xl lg:max-w-3xl">
        <a className="block text-blue-600" href="#">
          <span className="sr-only">Home</span>
          {/* <svg
            className="h-8 sm:h-10"
            viewBox="0 0 28 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M0.41 10.3847C1.14777 7.4194 2.85643 4.7861 5.2639 2.90424C7.6714 1.02234 10.6393 0 13.695 0C16.7507 0 19.7186 1.02234 22.1261 2.90424C24.5336 4.7861 26.2422 7.4194 26.98 10.3847H25.78C23.7557 10.3549 21.7729 10.9599 20.11 12.1147C20.014 12.1842 19.9138 12.2477 19.81 12.3047H19.67C19.5662 12.2477 19.466 12.1842 19.37 12.1147C17.6924 10.9866 15.7166 10.3841 13.695 10.3841C11.6734 10.3841 9.6976 10.9866 8.02 12.1147C7.924 12.1842 7.8238 12.2477 7.72 12.3047H7.58C7.4762 12.2477 7.376 12.1842 7.28 12.1147C5.6171 10.9599 3.6343 10.3549 1.61 10.3847H0.41ZM23.62 16.6547C24.236 16.175 24.9995 15.924 25.78 15.9447H27.39V12.7347H25.78C24.4052 12.7181 23.0619 13.146 21.95 13.9547C21.3243 14.416 20.5674 14.6649 19.79 14.6649C19.0126 14.6649 18.2557 14.416 17.63 13.9547C16.4899 13.1611 15.1341 12.7356 13.745 12.7356C12.3559 12.7356 11.0001 13.1611 9.86 13.9547C9.2343 14.416 8.4774 14.6649 7.7 14.6649C6.9226 14.6649 6.1657 14.416 5.54 13.9547C4.4144 13.1356 3.0518 12.7072 1.66 12.7347H0V15.9447H1.61C2.39051 15.924 3.154 16.175 3.77 16.6547C4.908 17.4489 6.2623 17.8747 7.65 17.8747C9.0377 17.8747 10.392 17.4489 11.53 16.6547C12.1468 16.1765 12.9097 15.9257 13.69 15.9447C14.4708 15.9223 15.2348 16.1735 15.85 16.6547C16.9901 17.4484 18.3459 17.8738 19.735 17.8738C21.1241 17.8738 22.4799 17.4484 23.62 16.6547ZM23.62 22.3947C24.236 21.915 24.9995 21.664 25.78 21.6847H27.39V18.4747H25.78C24.4052 18.4581 23.0619 18.886 21.95 19.6947C21.3243 20.156 20.5674 20.4049 19.79 20.4049C19.0126 20.4049 18.2557 20.156 17.63 19.6947C16.4899 18.9011 15.1341 18.4757 13.745 18.4757C12.3559 18.4757 11.0001 18.9011 9.86 19.6947C9.2343 20.156 8.4774 20.4049 7.7 20.4049C6.9226 20.4049 6.1657 20.156 5.54 19.6947C4.4144 18.8757 3.0518 18.4472 1.66 18.4747H0V21.6847H1.61C2.39051 21.664 3.154 21.915 3.77 22.3947C4.908 23.1889 6.2623 23.6147 7.65 23.6147C9.0377 23.6147 10.392 23.1889 11.53 22.3947C12.1468 21.9165 12.9097 21.6657 13.69 21.6847C14.4708 21.6623 15.2348 21.9135 15.85 22.3947C16.9901 23.1884 18.3459 23.6138 19.735 23.6138C21.1241 23.6138 22.4799 23.1884 23.62 22.3947Z"
              fill="currentColor"
            />
          </svg> */}
        </a>

        <h1 className="mt-6 text-2xl font-bold text-gray-900 sm:text-3xl md:text-4xl">
          Welcome to our family 
        </h1>

        <p className="mt-4 leading-relaxed text-gray-500">
        Join us today! Create your account to enjoy seamless shopping and exclusive offers.
        </p>

        <div className="mt-6 space-y-3">
          {googleClientId ? (
            <div className="flex justify-start">
              <GoogleLogin
                onSuccess={handleGoogleRegister}
                onError={() => toast.error("Google sign up failed")}
                text="signup_with"
                shape="pill"
                width="320"
              />
            </div>
          ) : (
            <p className="rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
              Add `VITE_GOOGLE_CLIENT_ID` to enable Google sign up.
            </p>
          )}
          <p className="text-sm text-gray-500">
            Google sign up uses the selected role below for new accounts.
          </p>
        </div>

        <form onSubmit={handleSubmit(submitForm)} className="mt-8 grid grid-cols-6 gap-6">
          
          <div className="col-span-6">
           
           <InputLabel htmlFor="name">Full Name</InputLabel>


            <TextInputComponent 
            name="name" errMsg={errors?.name?.message as string} 
            required={true}
             control= {control}/>
            {/* <input
              type="text"
              onChange={(e) => {
                e.preventDefault()
                setData({
                  ...data,
                  name: e.target.value,

                })
              }}
              id="name"
              name="name"
              className="mt-1 w-full rounded-md border-gray-200 bg-white text-sm text-gray-700 shadow-sm"
            /> */}
           </div>

          

          <div className="col-span-6">
          <InputLabel htmlFor="email">Email</InputLabel>


           
            <TextInputComponent 
            name="email" 
            errMsg={errors?.email?.message as string} 
            type="email"
            required={true}
            control= {control}/>
          </div>
          <div className="col-span-6">
          <InputLabel htmlFor="phone">Phone</InputLabel>


            <TextInputComponent
            name = "phone"
            errMsg={errors?.phone?.message as string}
            required={true}
            control={control}
            type="tel"
            
            />

          </div>
          <div className="col-span-6">
          <InputLabel htmlFor="role">Role</InputLabel>


           <RoleSelectComponent
           name="role" 
           errMsg={errors?.role?.message as string} 
           required={true}
           control= {control}/>
           
          </div>
          <div className="col-span-6">
          <InputLabel htmlFor="image">Profile Picture </InputLabel>


            <input
              type="file"
              id="image"
              onChange={(e:any) =>{
                // e.target.files
                const image = e.target.files['0'];
                setValue('image', image);

              }}
              name="image"
              className="mt-1 w-full rounded-md border-gray-200 bg-white text-sm text-gray-700 shadow-sm"
            />
          </div>
          <div className="col-span-6">
          <InputLabel htmlFor="address">Address</InputLabel>


            <TextAreaInputComponent 
            name="address"
            errMsg={errors?.address?.message as string}
            required={true}
            control = {control}
            />
          </div>

          <div className="col-span-6 sm:col-span-3">
          <InputLabel htmlFor="password">Password</InputLabel>


            <TextInputComponent 
            name="password" errMsg={errors?.password?.message as string} 
            required={true}
             control= {control}
             type="password"
             />
             
          </div>

          <div className="col-span-6 sm:col-span-3">
          <InputLabel htmlFor="confirmPassword">Confirm Password</InputLabel>


            <TextInputComponent 
            name="confirmPassword" errMsg={errors?.confirmPassword?.message as string} 
            required={true}
             control= {control}
             type="password"
             />
          </div>

         

          <div className="col-span-6">
            <p className="text-sm text-gray-500">
              By creating an account, you agree to our
              <a href="#" className="text-gray-700 underline"> terms and conditions </a>
              and
              <a href="#" className="text-gray-700 underline">privacy policy</a>.
            </p>
          </div>

          <div className="col-span-6 sm:flex sm:items-center sm:gap-4">
            <button
            type="submit"
              className={`inline-block shrink-0 rounded-md px-12 py-3 text-sm font-medium transition focus:outline-none focus:ring
                ${loading ? 'bg-gray-400 text-gray-700 border-gray-400 cursor-not-allowed' : 'bg-blue-600 text-white border-blue-600 hover:bg-transparent hover:text-blue-600 active:text-blue-500'}`}
              disabled={loading}
            >
              {loading ? <LoadingComponent/>:'Create an account'}
              
            </button>

            <p className="mt-4 text-sm text-gray-500 sm:mt-0">
              Already have an account?
              <NavLink to="/login" className="text-gray-700 underline">Log in</NavLink>.
            </p>
          </div>
        </form>
      </div>
    </main>
  </div>
</section> 

    </>)
}

export default RegisterPage
