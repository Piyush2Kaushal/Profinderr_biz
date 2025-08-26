// Import Dependencies
import { yupResolver } from "@hookform/resolvers/yup";
import { Controller, useForm } from "react-hook-form";
import PropTypes from "prop-types";

// Local Imports
import { TextEditor } from "components/shared/form/TextEditor";
import { Button, Input } from "components/ui";
import { useAddProductFormContext } from "../AddProductFormContext";
import { descriptionSchema } from "../schema";

// ----------------------------------------------------------------------

const editorModules = {
  toolbar: [
    ["bold", "italic", "underline", "strike"],
    ["blockquote", "code-block"],
    [{ header: 1 }, { header: 2 }],
    [{ list: "ordered" }, { list: "bullet" }],
    [{ script: "sub" }, { script: "super" }],
    [{ indent: "-1" }, { indent: "+1" }],
    [{ direction: "rtl" }],
    [{ size: ["small", false, "large", "huge"] }],
    [{ header: [1, 2, 3, 4, 5, 6, false] }],
    [{ color: [] }, { background: [] }],
    [{ font: [] }],
    [{ align: [] }, "image"],
    ["clean"],
  ],
};

export function Description({ setCurrentStep }) {
  const addProductFormCtx = useAddProductFormContext();

  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
  } = useForm({
    resolver: yupResolver(descriptionSchema),
    defaultValues: addProductFormCtx.state.formData.description,
  });

  const onSubmit = (data) => {
    console.log(" description onSubmit data2");
    console.log(" description onSubmit data3", errors);
    console.log(" description onSubmit data4", data);
    console.log(" description onSubmit data4", data);
    addProductFormCtx.dispatch({
      type: "SET_FORM_DATA",
      payload: { description: { ...data } },
    });
    addProductFormCtx.dispatch({
      type: "SET_STEP_STATUS",
      payload: { description: { isDone: true } },
    });
    setCurrentStep(2);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} autoComplete="off">
      <div>
        <h6 className="dark:text-dark-100 text-base font-medium text-gray-800">
          <span>Product Description</span>
        </h6>

        <div className="mt-3 space-y-4">
          {/* <Input
            {...register("short_description")}
            label="Short description"
            error={errors?.short_description?.message}
            placeholder="Enter Short Description"
          /> */}
          <div className="flex flex-col">
            <span>Description</span>
            <Controller
              control={control}
              name="description"
              render={({ field: { value, onChange, ...rest } }) => (
                <TextEditor
                  value={value}
                  onChange={(val) => onChange(val)}
                  placeholder="Enter your content..."
                  className="mt-1.5 [&_.ql-editor]:max-h-80 [&_.ql-editor]:min-h-[12rem]"
                  modules={editorModules}
                  error={errors?.description?.message}
                  {...rest}
                />
              )}
            />
          </div>
        </div>
      </div>

      <div className="mt-4 flex justify-end space-x-3">
        <Button className="min-w-[7rem]" onClick={() => setCurrentStep(0)}>
          Prev
        </Button>
        <Button type="submit" className="min-w-[7rem]" color="primary">
          Next
        </Button>
      </div>
    </form>
  );
}

Description.propTypes = {
  setCurrentStep: PropTypes.func,
};
