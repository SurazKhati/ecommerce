import { Outlet } from "react-router-dom"
import { FooterComponent } from "../../components/common/footer/footer"
import { HomeHeader } from "../../components/common/header/header"

export const HomePageLayout = () =>{
    return(<>
    <div className="min-h-screen bg-white text-slate-700 transition-colors duration-300 dark:bg-slate-950 dark:text-slate-100">
      <HomeHeader/>
      <Outlet/>
      <FooterComponent/>
    </div>
    </>)
}
