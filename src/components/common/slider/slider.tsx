import { Carousel } from "flowbite-react"
import { SingleSlider } from "./__contracts/contract.slider"

export const  SliderComponent = ({data}:{data:Array<SingleSlider>}) =>{
    return(<>

      <Carousel className="h-[70vh] overflow-hidden bg-slate-900 max-sm:h-[40vh] max-md:h-[45vh] max-lg:h-[55vh] max-xl:h-[65vh]">
        {
          data && data.map((row:SingleSlider, i:number)=>(
            row.link ? <a key={i} href={row.link}><img className="h-full w-full object-cover" key={i}src={row.image} alt={row.title}/></a>:
            <img className="h-full w-full object-cover" key={i}src={row.image} alt={row.title}/>
            
          ))
        }
      </Carousel>
   
    
    </>)

}
