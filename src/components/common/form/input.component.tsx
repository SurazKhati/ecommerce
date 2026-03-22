//import { ChangeEventHandler } from "react"
import { useController } from "react-hook-form"
import LoadingComponent from "../loading/loading.component"
import { NavLink } from "react-router-dom"
import Select from "react-select"
export interface InputLabelProps {
    children:any ,
     htmlFor:string
}
export const InputLabel = ({children, htmlFor}:InputLabelProps) =>{
    return(<>
    
    <label htmlFor={htmlFor} className="block  font-medium text-gray-700 text-md">
              {children}
            </label>
    
    </>)
}

export interface TextInputInterface {
    defaultValue?: string | undefined,
    control:any,
    name:string,
    required?:boolean,
    errMsg?:string| null,
    type?: string,
    placeholder?: string,
    row?: number,
    id?:string
}
export const TextInputComponent = ({control, name,defaultValue, errMsg="",type="text", placeholder=""}:TextInputInterface) => {
    const {field} = useController({
        control:control,
        name:name,
        defaultValue:defaultValue,
        
        // rules:{
        //     required:required

        // },
        
    })
    return(<>
    
    <input id={name}
              type={type}
              placeholder={placeholder}
            {...field}
              className={`mt-1 w-full rounded-md ${errMsg? 'border-red-500 focus:border-red-500' :'border-gray-200'} bg-white text-sm text-gray-700 shadow-sm`}
            />
            <span className="text-sm italic text-red-800">{errMsg}</span>
    </>)
}

export const TextAreaInputComponent = ({control, name, defaultValue, errMsg = null , row=2}: TextInputInterface) =>{
  
  const {field} = useController({
    control: control,
    name:name,
    defaultValue:defaultValue,
    // rules:{
    //     required:required
    // },
    

  })
  return (<>
    
    <textarea
    style={{resize:"none"}} 
    rows={row}
    {...field}
    className={`mt-1 w-full rounded-md ${errMsg? 'border-red-500 focus:border-red-500' :'border-gray-200'} bg-white text-sm text-gray-700 shadow-sm`} 
     id="">{defaultValue}</textarea>
      <span className="text-sm italic text-red-800">{errMsg}</span>
    
    </>)

}
export interface OptionType{
    label: string ,value:string
}
export interface SelectOptionProps{
    control:any,
    name: string,
    required?:boolean,
    errMsg?:string,
    id?:string,
    defaultValue?:{ label: string, value: string }

    options?: Array<OptionType>
}
export const SelectOptionComponent = ({options, control ,errMsg="",name,id=""}:SelectOptionProps) =>{
 const {field} = useController({
    name:name,
    control: control,
  
    // rules:{
    //     required:required
    // }

 })

return (<>
    
    <select
              {...field}
             id={id}
              className="mt-1 w-full rounded-md border-gray-200 bg-white text-sm text-gray-700 shadow-sm"
            >

             {options && options.map((row:OptionType,i:number) =>(
                    <option key={i} value={row.value}>
                        {row.label}
                    </option>
                )   )
             } 
            </select>
            <span className="text-sm italic text-red-800">{errMsg}</span>
    
    </>)
}
export const SelectComponent = ({options, control ,errMsg="",name, defaultValue}:SelectOptionProps) =>{
 const {field} = useController({
    name:name,
    control: control,
    // rules:{
    //     required:'required'
    // }

 })

return (<>
    <Select options={options} {...field} isClearable value={field.value|| defaultValue?.value}/>
 
            <span className="text-sm italic text-red-800">{errMsg}</span>
    
    </>)
}
export const RoleSelectComponent = ({ control ,errMsg="", required=false,name}:SelectOptionProps) =>{
    return(<>
    
     <SelectOptionComponent
     options={
        [
        
            {label:"Buyer" , value:"customer" },
            {label:"Seller", value:"seller"   },

        ]
     }
     control = {control}
     name = {name}
     required = {required}
     errMsg={errMsg}
        />
    
    
    </>)
}
export const StatusSelectComponent = ( {control ,errMsg="",name }:SelectOptionProps) =>{
    return(<>
    
    <SelectComponent
  
    options={[{label:"Publish", value:"active"}, {label:"Unpublish", value:"inactive"}]}
    control={control}
    errMsg={errMsg}
    name={name}
   required={true}
   defaultValue={{label:"Publish",value:"active"}}
    />
    </>)
}
export const SubmitButton = ({loading=false, children}:{loading:boolean, children:any}) => {

    return(<>
    
    <button
              className={`m-1 inline-block shrink-0 rounded-md px-12 py-3 text-sm font-medium transition focus:outline-none focus:ring
                ${loading ? 'bg-gray-400 text-gray-700 border-gray-400 cursor-not-allowed' : 'bg-green-900 text-white border-green-900 hover:bg-gray-900  active:text-blue-500'}`}
              disabled={loading}
            >
              {loading ? <LoadingComponent/>:children}
              
            </button>
    </>)
}
export const CancelButton = ({href ,loading=false, children}:{href:string ,loading:boolean,children:any}) =>{
  return(<>
  <NavLink to={loading?"#":href}  className={` m-1 inline-block shrink-0 rounded-md px-12 py-3 text-sm font-medium transition focus:outline-none focus:ring
                ${loading ? 'bg-gray-400 text-gray-700 border-gray-400 cursor-not-allowed' : 'bg-gray-600 text-white border-gray-600 hover:bg-black hover:text-white active:text-gray-500'}`}
            >
    {children}
  </NavLink>
  
  </>)
}
