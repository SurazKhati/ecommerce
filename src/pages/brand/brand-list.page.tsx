import { Badge,Table, TextInput } from "flowbite-react";
import { Pagination } from "flowbite-react";
import {  HeadingWithLink } from "../../components/common/title/title";
import { useCallback, useEffect, useState } from "react";
import brandSvc from "./brand.service";
import {RowSkeleton} from "../../components/common/table/table-skeleton.component";
import { toast } from "react-toastify";
import { SearchParams } from "../../config/constants";
import { ActionButtons } from "../../components/common/table/table-action-button.components";


const BrandListingPage = () => {
  let [pagination, setPagination] = useState({
    currentPage: 1,
    totalPage: 1,
  });

  const [brand, setBrand] = useState([]);
  const [search , setSearch] = useState<string | null>()
  const [loading, setLoading] = useState(true);


  const onPageChange = useCallback(async(page: number) => {
    console.log(page);
    setPagination({
      ...pagination,
      currentPage: page,
    });
    await getAllBrands({
      page:page,
      limit:10
    })
  },[pagination])


  const getAllBrands = useCallback(async ({page=1,limit=10, search=''}:SearchParams) => {
    setLoading(true);
    try {

      const response :any = await brandSvc.getRequest("/brand",{auth:true, params:{limit:limit , page:page, search:search}})
      console.log(response)
      setBrand(response.result)
      setPagination({
          currentPage:response.meta.currentPage,
          totalPage: Math.ceil(response.meta.total / response.meta.limit)
        })
    } catch (exception) {

      toast.error("Error while fetching brand")
      console.log(exception)


    } finally {
      setLoading(false)
    }
  },[pagination])
  // useEffect(() => {
  //   getAllBrands({
  //     page:1,
  //     limit:10
  //   })
  // }, []);
  useEffect(()=>{
    const timeout = setTimeout(()=>{
      getAllBrands({
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
            
      await  brandSvc.deleteRequest('/brand/'+id,{auth:true})
      toast.success("Brand deleted sucessfully")
      getAllBrands({
        page:1, 
        limit:10,
        // search:search
      })
      }catch(exception){
      console.log(exception)
      toast.error("exception while deleting brand")
    }
  }

  return (
    <>
      <div className="overflow-x-auto  ">
        <HeadingWithLink
          link="/admin/brand/create"
          title="Brand Management"
          btnTxt="Add Brand"
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
                <RowSkeleton row={4} cols={4} />
              </>
            ) : (
              <>
                {brand && brand.length > 0 ? (
                  <>
                    {brand.map((row: any, inx: number) => (
                      <Table.Row className="bg-white dark:border-gray-700 dark:bg-gray-800" key={inx}>
                        <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
                          {row.title}
                        </Table.Cell>
                      
                        <Table.Cell><img src={row.image} className="w-24"/></Table.Cell>
                        <Table.Cell className="">
                        <Badge color={row.status === 'active' ? 'green': "red"} className="flex" >
                          {row.status === 'active' ? "Publish" : "Unpublish"}

                        </Badge>
                        
                          
                        </Table.Cell>
                        <Table.Cell className="flex gap-3">
                          <ActionButtons rowId={row._id}
                           editUrl={`/admin/brand/${row._id}/edit`}
                            deleteAction={deleteData}/>
                        </Table.Cell>
                      </Table.Row>
                    ))}
                  </>
                ) : (
                  <>
                    <Table.Row className="bg-white dark:border-gray-700 dark:bg-gray-800">
                      <Table.Cell
                        colSpan={4}
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
export default BrandListingPage;
