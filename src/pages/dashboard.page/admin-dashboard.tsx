import { Card } from "flowbite-react";
import {  HiCurrencyDollar, HiCurrencyRupee, HiUserGroup } from "react-icons/hi";

const AdminDashboard = () =>{
    return(<>
    
    
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
            <div className="border-2 border-gray-300 rounded-lg dark:border-gray-600  ">
            <Card href="/admin/user-list" className=" bg-black hover:bg-slate-600 h-[100%]  w-[100%] ">

             <h5 className="text-2xl font-bold tracking-tight  text-gray-100 " >
                     <HiUserGroup  />
                     Total Customers                   
             </h5>
             <p className="font-extrabold text-2xl text-gray-200 dark:text-gray-400">
                10000
            </p>
            </Card>
            </div>
            <div className="border-2 border-gray-300 rounded-lg dark:border-gray-600  ">
            <Card href="/admin/order-list" className=" bg-yellow-700 hover:bg-slate-600 h-[100%]  w-[100%] ">

             <h5 className="text-2xl font-bold tracking-tight  text-gray-100 " >
                     <HiCurrencyRupee  />
                      Total Sales               
             </h5>
             <p className="font-extrabold text-2xl  text-gray-200 dark:text-gray-400">
               Npr.  1,00,000
            </p>
            </Card>
            </div>
            <div className="border-2 border-gray-300 rounded-lg dark:border-gray-600  ">
            <Card href="/admin/user-list" className=" bg-blue-950 hover:bg-slate-600 h-[100%]  w-[100%] ">

             <h5 className="text-2xl font-bold tracking-tight  text-gray-100 " >
                     <HiUserGroup  />
                     Total Customers                   
             </h5>
             <p className="font-extrabold text-2xl text-gray-200 dark:text-gray-400">
                10000
            </p>
            </Card>
            </div>
            <div className="border-2 border-gray-300 rounded-lg dark:border-gray-600  ">
            <Card href="/admin/user-list" className=" bg-orange-800 hover:bg-slate-600 h-[100%]  w-[100%] ">

             <h5 className="text-2xl font-bold tracking-tight  text-gray-100 " >
                     <HiUserGroup  />
                     Total Customers                   
             </h5>
             <p className="font-extrabold text-2xl text-gray-200 dark:text-gray-400">
                10000
            </p>
            </Card>
            </div>
           
            <div className="border-2 rounded-lg border-gray-300 dark:border-gray-600 h-32 md:h-64"></div>
            <div className="border-2 rounded-lg border-gray-300 dark:border-gray-600 h-32 md:h-64"></div>
            <div className="border-2 rounded-lg border-gray-300 dark:border-gray-600 h-32 md:h-64"></div>
          </div>
          <div className="border-2 rounded-lg border-gray-300 dark:border-gray-600 h-96 mb-4"></div>
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div className="border-2 rounded-lg border-gray-300 dark:border-gray-600 h-48 md:h-72"></div>
            <div className="border-2 rounded-lg border-gray-300 dark:border-gray-600 h-48 md:h-72"></div>
            <div className="border-2 rounded-lg border-gray-300 dark:border-gray-600 h-48 md:h-72"></div>
            <div className="border-2 rounded-lg border-gray-300 dark:border-gray-600 h-48 md:h-72"></div>
          </div>
          <div className="border-2 rounded-lg border-gray-300 dark:border-gray-600 h-96 mb-4"></div>
          <div className="grid grid-cols-2 gap-4">
            <div className="border-2 rounded-lg border-gray-300 dark:border-gray-600 h-48 md:h-72"></div>
            <div className="border-2 rounded-lg border-gray-300 dark:border-gray-600 h-48 md:h-72"></div>
            <div className="border-2 rounded-lg border-gray-300 dark:border-gray-600 h-48 md:h-72"></div>
            <div className="border-2 rounded-lg border-gray-300 dark:border-gray-600 h-48 md:h-72"></div>
          </div>
    </>)
}
export default AdminDashboard