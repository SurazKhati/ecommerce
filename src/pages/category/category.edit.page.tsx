import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { Heading1 } from "../../components/common/title/title";
import categorySvc from "./category.service";
import CategoryFormComponent from "../../components/category/category-form.component";

export const CategoryEditPage = () => {
  const params = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [detail, setDetail] = useState<any>(null);

  useEffect(() => {
    (async () => {
      try {
        const response: any = await categorySvc.getRequest(`/category/${params.id}`, { auth: true });
        setDetail(response.result);
      } catch (exception) {
        console.log(exception);
        toast.error("Category detail not found");
        navigate("/admin/category");
      }
    })();
  }, [navigate, params.id]);

  const submitEvent = async (data: any) => {
    setLoading(true);
    try {
      const submitData = {
        ...data,
        productCount: Number(data.productCount),
        status: data.status.value,
      };

      await categorySvc.patchRequest(`/category/${params.id}`, submitData, { auth: true, file: true });
      toast.success("Category updated successfully");
      navigate("/admin/category");
    } catch (exception) {
      console.log(exception);
      toast.error("Error while updating category");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="mb-5 overflow-x-auto px-5">
        <Heading1>Edit Category</Heading1>
      </div>
      <div className="overflow-x-auto">
        <div className="px-5 py-3 lg:py-4">
          <CategoryFormComponent submitEvent={submitEvent} loading={loading} detail={detail} />
        </div>
      </div>
    </>
  );
};
