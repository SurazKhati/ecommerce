import { Link } from "react-router-dom";
import { useCallback, useEffect, useState } from "react";
import { Badge, Pagination, Table, TextInput } from "flowbite-react";
import { toast } from "react-toastify";
import { HeadingWithLink } from "../../components/common/title/title";
import { RowSkeleton } from "../../components/common/table/table-skeleton.component";
import { ActionButtons } from "../../components/common/table/table-action-button.components";
import { SearchParams } from "../../config/constants";
import categorySvc from "./category.service";

const CategoryListingPage = () => {
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPage: 1,
  });
  const [categories, setCategories] = useState<any[]>([]);
  const [search, setSearch] = useState<string | null>();
  const [loading, setLoading] = useState(true);

  const getAllCategories = useCallback(async ({ page = 1, limit = 10, search = "" }: SearchParams) => {
    setLoading(true);
    try {
      const response: any = await categorySvc.getRequest("/category", {
        auth: true,
        params: { limit, page, search },
      });
      setCategories(response.result);
      setPagination({
        currentPage: response.meta.currentPage,
        totalPage: Math.ceil(response.meta.total / response.meta.limit),
      });
    } catch (exception) {
      console.log(exception);
      toast.error("Error while fetching categories");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const timeout = setTimeout(() => {
      getAllCategories({ page: 1, limit: 10, search });
    }, 100);
    return () => clearTimeout(timeout);
  }, [search, getAllCategories]);

  const onPageChange = useCallback(async (page: number) => {
    setPagination((prev) => ({ ...prev, currentPage: page }));
    await getAllCategories({ page, limit: 10, search });
  }, [getAllCategories, search]);

  const deleteData = async (id: string) => {
    try {
      await categorySvc.deleteRequest(`/category/${id}`, { auth: true });
      toast.success("Category deleted successfully");
      getAllCategories({ page: 1, limit: 10, search });
    } catch (exception) {
      console.log(exception);
      toast.error("Exception while deleting category");
    }
  };

  return (
    <>
      <div className="overflow-x-auto">
        <HeadingWithLink
          link="/admin/category/create"
          title="Category Management"
          btnTxt="Add Category"
        />
      </div>
      <hr />

      <div className="m-3 flex items-center justify-between gap-3">
        <TextInput className="w-1/4" type="search" onChange={(e: any) => setSearch(e.target.value)} />
        <Link
          to="/categories"
          className="inline-flex items-center justify-center rounded-xl bg-primary-600 px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-primary-700"
        >
          View public categories
        </Link>
      </div>

      <div className="overflow-x-auto">
        <Table striped>
          <Table.Head>
            <Table.HeadCell className="bg-gray-700 py-5 text-white">Title</Table.HeadCell>
            <Table.HeadCell className="bg-gray-700 py-5 text-white">Accent</Table.HeadCell>
            <Table.HeadCell className="bg-gray-700 py-5 text-white">Products</Table.HeadCell>
            <Table.HeadCell className="bg-gray-700 py-5 text-white">Image</Table.HeadCell>
            <Table.HeadCell className="bg-gray-700 py-5 text-white">Status</Table.HeadCell>
            <Table.HeadCell className="bg-gray-700 py-5 text-white">Actions</Table.HeadCell>
          </Table.Head>
          <Table.Body className="divide-y">
            {loading ? (
              <RowSkeleton row={5} cols={6} />
            ) : categories && categories.length > 0 ? (
              <>
                {categories.map((row: any, index: number) => (
                  <Table.Row className="bg-white dark:border-gray-700 dark:bg-gray-800" key={index}>
                    <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
                      <div>{row.title}</div>
                      <div className="mt-1 max-w-md text-xs text-gray-500">{row.description}</div>
                    </Table.Cell>
                    <Table.Cell>{row.accent}</Table.Cell>
                    <Table.Cell>{row.productCount}</Table.Cell>
                    <Table.Cell>
                      <img
                        src={row.image || "https://placehold.co/120x80?text=No+Image"}
                        className="w-24"
                      />
                    </Table.Cell>
                    <Table.Cell>
                      <Badge color={row.status === "active" ? "green" : "red"} className="flex">
                        {row.status === "active" ? "Publish" : "Unpublish"}
                      </Badge>
                    </Table.Cell>
                    <Table.Cell className="flex gap-3">
                      <ActionButtons
                        rowId={row._id}
                        editUrl={`/admin/category/${row._id}/edit`}
                        deleteAction={deleteData}
                      />
                    </Table.Cell>
                  </Table.Row>
                ))}
              </>
            ) : (
              <Table.Row className="bg-white dark:border-gray-700 dark:bg-gray-800">
                <Table.Cell colSpan={6} className="whitespace-nowrap text-center font-medium text-gray-900 dark:text-white">
                  NO DATA FOUND
                </Table.Cell>
              </Table.Row>
            )}
          </Table.Body>
        </Table>
        <div className="flex overflow-x-auto sm:justify-center">
          <Pagination currentPage={pagination.currentPage} totalPages={pagination.totalPage} onPageChange={onPageChange} />
        </div>
      </div>
    </>
  );
};

export default CategoryListingPage;
