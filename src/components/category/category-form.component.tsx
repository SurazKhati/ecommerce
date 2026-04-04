import {
  CancelButton,
  InputLabel,
  StatusSelectComponent,
  SubmitButton,
  TextAreaInputComponent,
  TextInputComponent,
} from "../../components/common/form/input.component";
import { FaPaperPlane, FaUndo } from "react-icons/fa";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import { useForm } from "react-hook-form";
import { useEffect, useState } from "react";

const CategoryFormComponent = ({
  submitEvent,
  loading,
  detail = null,
}: {
  submitEvent: any;
  loading: boolean;
  detail?: any;
}) => {
  const categoryDTO = Yup.object({
    title: Yup.string().min(3).max(150).required(),
    description: Yup.string().min(10).max(2000).required(),
    accent: Yup.string().min(2).max(100).required(),
    productCount: Yup.number().typeError("Product count must be a number").min(0).required(),
    highlights: Yup.string().required(),
    status: Yup.object({
      label: Yup.string().matches(/^(Publish|Unpublish)$/).required(),
      value: Yup.string().matches(/^(active|inactive)$/).required(),
    }).required(),
    image: Yup.mixed().nullable(),
  });

  const [thumb, setThumb] = useState<string | File>();
  const {
    control,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(categoryDTO),
  });

  useEffect(() => {
    if (detail) {
      setValue("title", detail.title);
      setValue("description", detail.description);
      setValue("accent", detail.accent);
      setValue("productCount", detail.productCount);
      setValue("highlights", Array.isArray(detail.highlights) ? detail.highlights.join(", ") : "");
      setValue("status", {
        label: detail.status === "active" ? "Publish" : "Unpublish",
        value: detail.status,
      });
      setValue("image", detail.image);
      setThumb(detail.image);
    }
  }, [detail, setValue]);

  return (
    <form onSubmit={handleSubmit(submitEvent)}>
      <div className="grid gap-4 sm:grid-cols-2 sm:gap-6">
        <div className="sm:col-span-2">
          <InputLabel htmlFor="title">Category Title</InputLabel>
          <TextInputComponent control={control} name="title" defaultValue="" errMsg={errors?.title?.message as string} />
        </div>

        <div className="sm:col-span-2">
          <InputLabel htmlFor="description">Description</InputLabel>
          <TextAreaInputComponent control={control} name="description" row={5} errMsg={errors?.description?.message as string} />
        </div>

        <div>
          <InputLabel htmlFor="accent">Accent Label</InputLabel>
          <TextInputComponent control={control} name="accent" defaultValue="" errMsg={errors?.accent?.message as string} />
        </div>

        <div>
          <InputLabel htmlFor="productCount">Product Count</InputLabel>
          <TextInputComponent control={control} name="productCount" type="number" defaultValue="" errMsg={errors?.productCount?.message as string} />
        </div>

        <div className="sm:col-span-2">
          <InputLabel htmlFor="highlights">Highlights</InputLabel>
          <TextInputComponent
            control={control}
            name="highlights"
            defaultValue=""
            placeholder="Easy heat control, Budget friendly, Long-lasting body"
            errMsg={errors?.highlights?.message as string}
          />
        </div>

        <div>
          <InputLabel htmlFor="status">Status</InputLabel>
          <StatusSelectComponent name="status" control={control} errMsg={errors?.status?.message as string} />
        </div>

        <div className="col-span-2">
          <InputLabel htmlFor="image">Category Image</InputLabel>
          <div className="flex gap-2">
            <div className="w-3/4">
              <input
                type="file"
                id="image"
                onChange={(e: any) => {
                  const image = e.target.files["0"];
                  setValue("image", image);
                  setThumb(image);
                }}
                name="image"
                className="mt-1 block w-full rounded-md border-gray-200 bg-white text-sm text-gray-700 shadow-sm"
              />
            </div>

            <div className="w-1/4">
              <img
                src={
                  thumb
                    ? typeof thumb === "string"
                      ? thumb
                      : URL.createObjectURL(thumb)
                    : "https://placehold.co/600x400?text=No+Image"
                }
                alt="Category preview"
                className="max-w-full"
              />
            </div>
          </div>
          <span className="text-sm italic text-red-800">{errors?.image?.message as string}</span>
        </div>
      </div>

      <div className="btnn flex w-[35%] flex-wrap justify-between">
        <SubmitButton loading={loading}>
          <div className="m-1 flex items-baseline justify-between space-x-2">
            <FaPaperPlane className="mt-1" />
            <span>Submit</span>
          </div>
        </SubmitButton>

        <CancelButton loading={loading} href={"/admin/category"}>
          <div className="m-1 flex flex-shrink justify-between space-x-2">
            <FaUndo className="mt-0.5" />
            <span>Cancel</span>
          </div>
        </CancelButton>
      </div>
    </form>
  );
};

export default CategoryFormComponent;
