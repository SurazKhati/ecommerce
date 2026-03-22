// import { CMSNav } from "../../components/cms/navbar/nav.cms";
// import "flowbite"
// import AdminHeader from "../../components/common/header/admin-header";
// import { CMSSidebar } from "../../components/cms/sidebar/sidebar";
// import { Outlet } from "react-router-dom";

import { Outlet } from "react-router-dom"
import AdminHeader from "../../components/common/header/admin-header"
import { AdminDashboard } from "../dashboard.page"
import { CMSSidebar } from "../../components/cms/sidebar/sidebar"

export const AdminLayout = () => {
  return (
    <>
    <div className="antialiased bg-gray-50 dark:bg-gray-900">

      <AdminHeader/>

      <CMSSidebar/>
   <main className="p-4 md:ml-64 h-auto pt-20">
      <Outlet/>

   </main>
    </div>
         
    </>
  )}
