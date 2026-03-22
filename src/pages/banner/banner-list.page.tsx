import { Badge, Button, Table, TextInput } from "flowbite-react";
import { Pagination } from "flowbite-react";
import {  HeadingWithLink } from "../../components/common/title/title";
import { useCallback, useEffect, useState } from "react";
import bannerSvc from "./banner.service";
import {RowSkeleton} from "../../components/common/table/table-skeleton.component";
import { toast } from "react-toastify";
import { SearchParams } from "../../config/constants";
import { NavLink } from "react-router-dom";
import  Swal from "sweetalert2"
import { ActionButtons } from "../../components/common/table/table-action-button.components";


const BannerListingPage = () => {
  let [pagination, setPagination] = useState({
    currentPage: 1,
    totalPage: 1,
  });

  const [banner, setBanner] = useState([]);
  const [search , setSearch] = useState<string | null>()
  const [loading, setLoading] = useState(true);


  const onPageChange = useCallback(async(page: number) => {
    console.log(page);
    setPagination({
      ...pagination,
      currentPage: page,
    });
    await getAllBanners({
      page:page,
      limit:10
    })
  },[pagination])


  const getAllBanners = useCallback(async ({page=1,limit=10, search=''}:SearchParams) => {
    setLoading(true);
    try {

      const response :any = await bannerSvc.getRequest("/banner",{auth:true, params:{limit:limit , page:page, search:search}})
      console.log(response)
      setBanner(response.result)
      setPagination({
          currentPage:response.meta.currentPage,
          totalPage: Math.ceil(response.meta.total / response.meta.limit)
        })
    } catch (exception) {

      toast.error("Error while fetching banner")
      console.log(exception)


    } finally {
      setLoading(false)
    }
  },[pagination])
  // useEffect(() => {
  //   getAllBanners({
  //     page:1,
  //     limit:10
  //   })
  // }, []);
  useEffect(()=>{
    const timeout = setTimeout(()=>{
      getAllBanners({
        page:1,
        limit:10,
        search:search
      })

    },100)
    return () =>{
      clearTimeout(timeout)
    }
  },[search])

  const deleteData= async (id: string) =>{
    try{
            
      await  bannerSvc.deleteRequest('/banner/'+id,{auth:true})
      toast.success("Banner deleted sucessfully")
      getAllBanners({
        page:1, 
        limit:10,
        // search:search
      })
      }catch(exception){
      console.log(exception)
      toast.error("exception while deleting banner")
    }
  }

  return (
    <>
      <div className="overflow-x-auto  ">
        <HeadingWithLink
          link="/admin/banner/create"
          title="Banner Management"
          btnTxt="Add Banner"
        />
      </div>
      <hr />
      <div className="flex justify-end m-3">
      <TextInput className="w-1/4" type="search" onChange={(e:any)=>{
        setSearch(e.target.value)
      }}/>
      </div>

      <div className="overflow-x-auto">
     
        <Table striped>
          <Table.Head>
            <Table.HeadCell className="bg-gray-700 text-white py-5">
              Title
            </Table.HeadCell>
            <Table.HeadCell className="bg-gray-700 text-white py-5">
              Link
            </Table.HeadCell>
            <Table.HeadCell className="bg-gray-700 text-white py-5">
              Image
            </Table.HeadCell>
            <Table.HeadCell className="bg-gray-700 text-white py-5">
              Status
            </Table.HeadCell>
            <Table.HeadCell className="bg-gray-700 text-white py-5">
              Actions
            </Table.HeadCell>
          </Table.Head>

          <Table.Body className="divide-y">
            {loading ? (
              <>
                <RowSkeleton row={5} cols={5} />
              </>
            ) : (
              <>
                {banner && banner.length > 0 ? (
                  <>
                    {banner.map((row: any, inx: number) => (
                      <Table.Row className="bg-white dark:border-gray-700 dark:bg-gray-800" key={inx}>
                        <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
                          {row.title}
                        </Table.Cell>
                        <Table.Cell >
                          <a href={row.link} >
                          GO to link
                          </a>
                          </Table.Cell>
                        <Table.Cell><img src={row.image} className="w-24"/></Table.Cell>
                        <Table.Cell className="">
                        <Badge color={row.status === 'active' ? 'green': "red"} className="flex" >
                          {row.status === 'active' ? "Publish" : "Unpublish"}

                        </Badge>
                        
                          
                        </Table.Cell>
                        <Table.Cell className="flex gap-3">
                          <ActionButtons rowId={row._id}
                           editUrl={`/admin/banner/${row._id}/edit`}
                            deleteAction={deleteData}/>
                        </Table.Cell>
                      </Table.Row>
                    ))}
                  </>
                ) : (
                  <>
                    <Table.Row className="bg-white dark:border-gray-700 dark:bg-gray-800">
                      <Table.Cell
                        colSpan={5}
                        className="whitespace-nowrap text-center font-medium text-gray-900 dark:text-white"
                      >
                        NO DATA FOUND
                      </Table.Cell>
                    </Table.Row>
                  </>
                )}
              </>
            )}

          </Table.Body>
        </Table>
        <div className="flex overflow-x-auto sm:justify-center">
          <Pagination
            currentPage={pagination.currentPage}
            totalPages={pagination.totalPage}
            onPageChange={onPageChange}
          />
        </div>
      </div>
    </>
  );
};
export default BannerListingPage;
