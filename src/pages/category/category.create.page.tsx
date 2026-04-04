import { Heading1 } from "../../components/common/title/title";
import { toast } from "react-toastify";
import { useState } from "react";
import categorySvc from "./category.service";
import { useNavigate } from "react-router-dom";
import CategoryFormComponent from "../../components/category/category-form.component";

export const CategoryCreatePage = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const submitEvent = async (data: any) => {
    setLoading(true);
    try {
      const submitData = {
        ...data,
        productCount: Number(data.productCount),
        status: data.status.value,
      };

      await categorySvc.postRequest("/category", submitData, { auth: true, file: true });
      toast.success("Category created successfully");
      navigate("/admin/category");
    } catch (exception) {
      console.log(exception);
      toast.error("Error while creating category");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="mb-5 overflow-x-auto px-5">
        <Heading1>Create Category</Heading1>
      </div>
      <div className="overflow-x-auto">
        <div className="px-5 py-3 lg:py-4">
          <CategoryFormComponent submitEvent={submitEvent} loading={loading} />
        </div>
      </div>
    </>
  );
};
