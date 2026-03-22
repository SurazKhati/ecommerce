import { NavLink } from "react-router-dom";
import { toast } from "react-toastify";
import Swal from "sweetalert2";
import { Button } from "flowbite-react";
export const ActionButtons = ({editUrl,deleteAction, rowId}:{editUrl:string, deleteAction:any,rowId:string}) => {
 
        const handleDelete = async (e:any) =>{
            e.preventDefault();
            try{
                const result = await Swal.fire({
                    title: "Are you sure?",
                    text: "You won't be able to revert this!",
                    icon: "warning",
                    showCancelButton: true,
                    confirmButtonColor: "#3085d6",
                    cancelButtonColor: "#d33",
                    confirmButtonText: "Yes, delete it!"
            
                  })
                  if(result.isConfirmed){
                    // api 
                  deleteAction(rowId)
                  }
            }catch(exception){
            console.log("Delete button action ")
            toast.error("error deleting ")
        }}

    return (
    <>
      <NavLink
        to={editUrl}
        className="text-center font-bold p-3 w-[40%] bg-gray-500 text-white  hover:bg-black rounded-full hover:underline m-3"
      >
        Edit
      </NavLink>
      <Button
        onClick={handleDelete}
        className="text-center font-bold p-3 w-[40%] bg-red-900 text-white  hover:bg-black rounded-full hover:underline m-3 dark:text-cyan-500"
      >
        Delete
      </Button>
    </>
  );
};

// "/admin/banner/" + row._id + "/edit"