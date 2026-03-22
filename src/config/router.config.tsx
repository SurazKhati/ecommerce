import { BrowserRouter, Routes, Route, Outlet } from "react-router-dom";
import LandingPage from "../pages/landing.page/landing";
import { CategoryPage} from "../pages/category.page/category.page"
import { Aboutus } from "../pages/aboutus.page/aboutus.page";
import { ProductPage } from "../pages/products.page/products.page";
import { ContactsPage } from "../pages/contacts.page/contacts.page";
import { PrivacyPolicy } from "../pages/privacypolicy/privacypolicy";
import { Licensing } from "../pages/licensing/licensing";
import { HomePageLayout } from "../pages/layout/home.page";
import {AdminLayout} from "../pages/layout/cms.page";
import { ToastContainer } from "react-toastify";
import "react-toastify/ReactToastify.css"
import { LoginPage, RegisterPage,UserActivation } from "../pages/auth";
import { useEffect, useState } from "react";
import AuthContext from "../context/auth.context";
import authSvc from "../pages/auth/auth.service";
import{ AdminDashboard} from "../pages/dashboard.page"
import CheckPermission from "./rbac.config";
import { UserRoleValue } from "./constants";
import LoadingComponent from "../components/common/loading/loading.component";
import NotFoundError from "../components/common/error/not-found.error.component";
import { BannerListingPage , BannerCreatePage , BannerEditPage} from "../pages/banner";
import { BrandCreatePage, BrandEditPage, BrandListingPage } from "../pages/brand";
import { useDispatch } from "react-redux";
import { getLoggedInUserRedux, setloggedInUserForRedux } from "../reducer/user.reducer";
// import RegisterPage from "../pages/auth/register/register.page";
// import  LoginPage  from "../pages/auth/login/login.page";
// import UserActivation from "../pages/auth/activate/activate-user.page";


const RouterConfig =() =>{
  const [loggedInUser, setLoggedInUser] = useState(null)
  const [loading , setLoading] = useState(true)


  const dispatch = useDispatch();


  const getLoggedInUser = async() =>{
    try{
      const response :any = await authSvc.getRequest('/auth/me',{auth:true})
     dispatch(setloggedInUserForRedux(response.result))
      setLoggedInUser(response.result);

    }catch(exception){
      console.log(exception )
    }finally{
      setLoading(false)
    }
  }

  
  useEffect(()=>{
    let token = localStorage.getItem("_at");
    if(token){

      dispatch(getLoggedInUserRedux())
      setLoading(false)
    }else{
      setLoading(false)
    }
  },[])

    return(<>
    {loading?<><LoadingComponent/></>:<>
    <AuthContext.Provider value={ {loggedInUser,setLoggedInUser} }>
    <ToastContainer></ToastContainer>
      
      <BrowserRouter>
        
        <Routes>

          <Route path="/" element={<HomePageLayout/>}>
         
         
            <Route index element={<LandingPage/>}/>
            <Route path="/register" element={<RegisterPage/>}/>
            <Route path="/category/:slug" element={<CategoryPage/>}/>
            <Route path="/categories" element={<CategoryPage/>}/>
            <Route path="/aboutus" element={<Aboutus/>}/>
            <Route path="/products" element={<ProductPage/>}/>
            <Route path="/contacts" element={<ContactsPage/>}/>
            <Route path="/privacypolicy" element={<PrivacyPolicy/>}/>
            <Route path="/licensing" element={<Licensing/>}/>
            <Route path="/login" element={<LoginPage/>}/>
            <Route path ="/auth/activate/:token" element={<UserActivation/>}/>
            

            <Route path="*"  element={<NotFoundError url="/" label="Home"/>}/>
         
          </Route>


          <Route path="/admin" element={<CheckPermission user={loggedInUser} allowedBy={UserRoleValue.ADMIN}>
            <AdminLayout/>
            </CheckPermission>}>


                <Route index element={<AdminDashboard/>}></Route>
                <Route path="*" element={<NotFoundError url="/admin" label="ADMIN"/>}/>
                <Route path="banner" element={<BannerListingPage/>}></Route>
                <Route path="banner/create" element={<BannerCreatePage/>}></Route>
                <Route path="banner/:id/edit" element={<BannerEditPage/>}></Route>
                <Route path="brand" element={<BrandListingPage/>}></Route>

                <Route path="brand/create" element={<BrandCreatePage/>}></Route>
                <Route path="brand/:id/edit" element={<BrandEditPage/>}></Route>

                
          </Route>
          <Route path="/seller" element={<CheckPermission user={loggedInUser} allowedBy={UserRoleValue.SELLER}>
           <>
           
           seller component
           <Outlet/>
           
           </>
            </CheckPermission>}>


                <Route index element={<>Seller view Dashboard</>}></Route>

          </Route>

        </Routes>

    </BrowserRouter>
    
    </AuthContext.Provider>
    </>}
    
    </>)
}
// const RouterConfig = () => {
//   const [loggedInUser, setLoggedInUser] = useState(null);
//   const [loading, setLoading] = useState(true); // Add loading state

//   const getLoggedInUser = async () => {
//       try {
//           const response: any = await authSvc.getRequest('/auth/me', { auth: true });
//           setLoggedInUser(response.result);
//       } catch (exception) {
//           console.log(exception);
//       } finally {
//           setLoading(false); // Set loading to false after request
//       }
//   };

//   useEffect(() => {
//       getLoggedInUser();
//   }, []);

//   return (
//       <AuthContext.Provider value={loggedInUser}>
//           <ToastContainer />
//           <BrowserRouter>
//               <Routes>
//                   <Route path="/" element={<HomePageLayout />}>
//                       <Route index element={<LandingPage />} />
//                       <Route path="/register" element={<RegisterPage />} />
//                       <Route path="/category/:slug" element={<CategoryPage />} />
//                       <Route path="/categories" element={<CategoryPage />} />
//                       <Route path="/aboutus" element={<Aboutus />} />
//                       <Route path="/products" element={<ProductPage />} />
//                       <Route path="/contacts" element={<ContactsPage />} />
//                       <Route path="/privacypolicy" element={<PrivacyPolicy />} />
//                       <Route path="/licensing" element={<Licensing />} />
//                       <Route path="/login" element={<LoginPage />} />
//                       <Route path="/auth/activate/:token" element={<UserActivation />} />
//                       <Route path="*" element={<>Error Page</>} />
//                   </Route>

//                    {loading ? ( // Show a loading state while fetching user
//                       <Route path="/admin" element={<>Loading...</>} />
//                   ) : (
//                       <Route path="/admin" element={<CheckPermission allowedBy={UserRoleValue.ADMIN}><AdminLayout /></CheckPermission>}>
//                           <Route index element={<AdminDashboard />} />
//                       </Route>
//                   )} 
//                   {/* <Route path="/admin" element={<AdminLayout/>} ><Route index element={<AdminDashboard/>}></Route></Route> */}
//               </Routes>
//           </BrowserRouter>
//       </AuthContext.Provider>
//   );
// };
export default RouterConfig;