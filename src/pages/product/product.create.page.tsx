import { Heading1 } from "../../components/common/title/title";
import { toast } from "react-toastify";
import { useState } from "react";
import productSvc from "./product.service";
import { useNavigate } from "react-router-dom";
import ProductFormComponent from "../../components/product/product-form.component";

export const ProductCreatePage = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const submitEvent = async (data: any) => {
    setLoading(true);
    try {
      const submitData = {
        ...data,
        price: Number(data.price),
        stock: Number(data.stock),
        status: data.status.value,
      };

      await productSvc.postRequest("/product", submitData, { auth: true, file: true });
      toast.success("Product created successfully");
      navigate("/admin/product");
    } catch (exception) {
      console.log(exception);
      toast.error("Error while creating a product");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="mb-5 overflow-x-auto px-5">
        <Heading1>Create Product</Heading1>
      </div>

      <div className="overflow-x-auto">
        <div className="px-5 py-3 lg:py-4">
          <ProductFormComponent submitEvent={submitEvent} loading={loading} />
        </div>
      </div>
    </>
  );
};
