import { Badge, Table, TextInput } from "flowbite-react";
import { Pagination } from "flowbite-react";
import { HeadingWithLink } from "../../components/common/title/title";
import { useCallback, useEffect, useState } from "react";
import { RowSkeleton } from "../../components/common/table/table-skeleton.component";
import { toast } from "react-toastify";
import { SearchParams } from "../../config/constants";
import productSvc from "./product.service";

const ProductListingPage = () => {
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPage: 1,
  });

  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState<string | null>();
  const [loading, setLoading] = useState(true);

  const getAllProducts = useCallback(async ({ page = 1, limit = 10, search = "" }: SearchParams) => {
    setLoading(true);
    try {
      const response: any = await productSvc.getRequest("/product", {
        auth: true,
        params: { limit, page, search },
      });

      setProducts(response.result);
      setPagination({
        currentPage: response.meta.currentPage,
        totalPage: Math.ceil(response.meta.total / response.meta.limit),
      });
    } catch (exception) {
      console.log(exception);
      toast.error("Error while fetching products");
    } finally {
      setLoading(false);
    }
  }, []);

  const onPageChange = useCallback(async (page: number) => {
    setPagination((prev) => ({
      ...prev,
      currentPage: page,
    }));

    await getAllProducts({
      page,
      limit: 10,
      search,
    });
  }, [getAllProducts, search]);

  useEffect(() => {
    const timeout = setTimeout(() => {
      getAllProducts({
        page: 1,
        limit: 10,
        search,
      });
    }, 100);

    return () => clearTimeout(timeout);
  }, [search, getAllProducts]);

  return (
    <>
      <div className="overflow-x-auto">
        <HeadingWithLink
          link="/admin/product/create"
          title="Product Management"
          btnTxt="Add Product"
        />
      </div>
      <hr />

      <div className="m-3 flex justify-end">
        <TextInput
          className="w-1/4"
          type="search"
          onChange={(e: any) => setSearch(e.target.value)}
        />
      </div>

      <div className="overflow-x-auto">
        <Table striped>
          <Table.Head>
            <Table.HeadCell className="bg-gray-700 py-5 text-white">Title</Table.HeadCell>
            <Table.HeadCell className="bg-gray-700 py-5 text-white">Price</Table.HeadCell>
            <Table.HeadCell className="bg-gray-700 py-5 text-white">Stock</Table.HeadCell>
            <Table.HeadCell className="bg-gray-700 py-5 text-white">Image</Table.HeadCell>
            <Table.HeadCell className="bg-gray-700 py-5 text-white">Status</Table.HeadCell>
          </Table.Head>

          <Table.Body className="divide-y">
            {loading ? (
              <RowSkeleton row={5} cols={5} />
            ) : products && products.length > 0 ? (
              <>
                {products.map((row: any, index: number) => (
                  <Table.Row className="bg-white dark:border-gray-700 dark:bg-gray-800" key={index}>
                    <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
                      <div>{row.title}</div>
                      <div className="mt-1 max-w-md text-xs text-gray-500">{row.description}</div>
                    </Table.Cell>
                    <Table.Cell>{row.price}</Table.Cell>
                    <Table.Cell>{row.stock}</Table.Cell>
                    <Table.Cell><img src={row.image} className="w-24" /></Table.Cell>
                    <Table.Cell>
                      <Badge color={row.status === "active" ? "green" : "red"} className="flex">
                        {row.status === "active" ? "Publish" : "Unpublish"}
                      </Badge>
                    </Table.Cell>
                  </Table.Row>
                ))}
              </>
            ) : (
              <Table.Row className="bg-white dark:border-gray-700 dark:bg-gray-800">
                <Table.Cell
                  colSpan={5}
                  className="whitespace-nowrap text-center font-medium text-gray-900 dark:text-white"
                >
                  NO DATA FOUND
                </Table.Cell>
              </Table.Row>
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

export default ProductListingPage;
