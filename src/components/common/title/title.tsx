
// interface HeadingProps{
//     value:string
// }
// export const Heading1 = (props:Heading) =>{
//     return(
//         <>
//         <h1>
//             {props.value}
//         </h1>
//         </>
//     )
// }
import { Component,  } from "react"
import { FaPlus } from "react-icons/fa"
import { NavLink } from "react-router-dom"
export const Heading1 = ({children}:{children:any}) =>{
    return(
        <>
        <h1 className="md:text-[28px] md:text-black lg:text-[30px] xl:text-32px 2xl:text-[38px]">
            {children}
        </h1>
        </>
    )
}
export const HeadingWithLink = ({title, link, btnTxt}:{title: string, link:string, btnTxt:string})=>{

    return(<>
    <div className="flex justify-between my-2 ">
        <Heading1>{title}</Heading1>
        <NavLink to={link}  className="bg-green-600 text-white rounded  text-sm px-2 pt-3 hover:bg-slate-500 sm:px-1 sm:pt-2 md:p-4 inline-flex items-baseline ">

          <FaPlus className="me-3 pt-0.5"/>
          <span className=""> {btnTxt}</span>
        </NavLink>
    </div>
    
    </>)



}
export const Heading2 = ({value}:{value?:string}) =>{
    return(
        <>
        <h1 className="  md:text-[28px] md:text-black lg:text-[30px] xl:text-32px 2xl:text-[38px]">
            {value}
        </h1>
        </>
    )
}

export class Heading3 extends Component{
    constructor(props:any){
        super(props)
        this.state = {
            value: props.value
        }
    }

    render = () => {
        return (
            <>
            <h3></h3>
            </>
        )
    }
}