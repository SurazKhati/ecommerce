import { FaBus, FaDollarSign, FaImage, FaPage4, FaShopify, FaSitemap, FaUser } from "react-icons/fa";
import { FaB, FaBuildingCircleArrowRight, FaO } from "react-icons/fa6";
import { HiArchive, HiChevronDoubleRight, HiDatabase, HiPhotograph } from "react-icons/hi";
import { HiBars3, HiCog, HiCurrencyDollar, HiHome, HiLifebuoy, HiMiniInbox, HiOutlineGlobeAlt, HiPaintBrush, HiPaperClip, HiUser, HiWindow } from "react-icons/hi2";
import { NavLink } from "react-router-dom";

export const CMSSidebar = () => {

  const adminMenu = [
   {
     name:"Home",
     url:"/",
     icon:<HiHome className=""/>
   },
   {
     name:"Dashboard",
     url:"/admin",
     icon:<HiCog className=""/>
   },
   {
     name:"Banner",
     url:"/admin/banner",
     icon:<FaImage className=""/>
   },
   {
    name:"Brand",
    url:"/admin/brand",
    icon:<FaB className=""/>
  },
  {
    name:"Categories",
    url:"/admin/category",
    icon:<FaSitemap className=""/>
  },
  {
    name:"Users",
    url:"/admin/user",
    icon:<FaUser className=""/>
  },
  {
    name:"Products",
    url:"/admin/product",
    icon:<FaShopify className=""/>
  },
  {
    name:"Orders",
    url:"/admin/order",
    icon:<FaBuildingCircleArrowRight className=""/>
  },
  {
    name:"Payments",
    url:"/admin/payments",
    icon:<FaDollarSign className=""/>
  },

  ]
  return (
    <>
    
    
    <aside
          className="fixed top-0 left-0 z-40 w-64 h-screen pt-14 transition-transform -translate-x-full bg-white border-r border-gray-200 md:translate-x-0 dark:bg-gray-800 dark:border-gray-700"
          aria-label="Sidenav"
          id="drawer-navigation"
        >
          <div className="overflow-y-auto py-5 px-3 h-full bg-white dark:bg-gray-800">
           
        
            <ul className="pt-5   border-gray-200 dark:border-gray-700">

              {
                adminMenu.map((item:any,i:number)=>(
                  <li key={i} >
                  <NavLink
                    to={item.url}
                    className="flex items-center p-2 text-base font-medium text-gray-900 rounded-lg transition duration-75 hover:bg-gray-100 dark:hover:bg-gray-700 dark:text-white group"
                  >
                    {item.icon}
                    <span className="ml-3">{item.name}</span>
                  </NavLink>
                </li>
                ))
              }
              
              
            
              
            </ul>
          </div>
          
        </aside>
    </>
  );
};
