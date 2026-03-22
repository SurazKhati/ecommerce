import { Outlet } from "react-router-dom"
import { FooterComponent } from "../../components/common/footer/footer"
import { HomeHeader } from "../../components/common/header/header"

export const HomePageLayout = () =>{
    return(<>
    
    <HomeHeader/>

        <Outlet/>

    <FooterComponent/>

    
    </>)
}