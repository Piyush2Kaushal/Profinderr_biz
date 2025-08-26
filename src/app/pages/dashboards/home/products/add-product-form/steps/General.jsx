// Import Dependencies
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import Select from "react-select";

import PropTypes from "prop-types";

// Local Imports
import { Listbox } from "components/shared/form/Listbox";
import { Button, Input, Switch } from "components/ui";
import { useAddProductFormContext } from "../AddProductFormContext";
import { generalSchema } from "../schema";
import { useEffect, useState } from "react";
import { getMyProductCategories } from "utils/API/Authapi";

// ----------------------------------------------------------------------

const brands = [
  {
    id: "1",
    label: "Samsung",
  },
  {
    id: "2",
    label: "Sony",
  },
  {
    id: "3",
    label: "Philips",
  },
  {
    id: "4",
    label: "LG",
  },
  {
    id: "5",
    label: "Bose",
  },
  {
    id: "6",
    label: "Eon",
  },
  {
    id: "7",
    label: "Nexa",
  },
  {
    id: "8",
    label: "Viva",
  },
];

export function General({ setCurrentStep }) {
  const addProductFormCtx = useAddProductFormContext();
  const [categories, setCategories] = useState([
    {
      id: "6",
      label: "Printers",
    },
  ]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const cats = await getMyProductCategories();
        setCategories(cats || []);
      } catch (err) {
        toast.error(err.message || "Failed to load categories");
      }
    };

    fetchCategories();
  }, []);

  const categories11 = [
    {
      id: "1",
      label: "Tablets",
    },
    {
      id: "2",
      label: "Gaming consoles",
    },
    {
      id: "3",
      label: "Smartphones",
    },
    {
      id: "4",
      label: "Drones",
    },
    {
      id: "5",
      label: "Cameras",
    },
    {
      id: "6",
      label: "Printers",
    },
    {
      id: "7",
      label: "TVs",
    },
  ];

  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
    setValue,
  } = useForm({
    resolver: yupResolver(generalSchema),
    defaultValues: addProductFormCtx.state.formData.general,
  });

  const onSubmit = (data) => {
    console.log("onSubmit data2");
    console.log("onSubmit data3", errors);
    console.log("onSubmit data4", data);

    addProductFormCtx.dispatch({
      type: "SET_FORM_DATA",
      payload: { general: { ...data } },
    });
    addProductFormCtx.dispatch({
      type: "SET_STEP_STATUS",
      payload: { general: { isDone: true } },
    });
    setCurrentStep(1);
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      autoComplete="off"
      className="flex grow flex-col"
    >
      <div className="grow space-y-4">
        <div className="grid gap-4 sm:grid-cols-2">
          <Input
            {...register("productName")}
            label="Product Name"
            error={errors?.productName?.message}
            placeholder="Enter Product Name"
          />
          <Input
            {...register("productCode")}
            label="Product Code"
            error={errors?.productCode?.message}
            placeholder="Enter Product Code"
          />
          <Input
            {...register("quantity")}
            label="Quantity in Stock"
            type="number"
            error={errors?.quantity?.message}
            placeholder="Enter Quantity in Stock"
          />
          <Input
            {...register("brand")}
            label="Brand"
            error={errors?.brand?.message}
            placeholder="Enter Product Price"
          />
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <Input
            {...register("price")}
            label="Price"
            type="number"
            error={errors?.price?.message}
            placeholder="Enter Product Price"
          />
          <Input
            {...register("minimumQuantity")}
            label="Minimum Quantity"
            type="number"
            error={errors?.minimumQuantity?.message}
            placeholder="Enter Product Price"
          />
          <Input
            {...register("price2")}
            label="Trader Price"
            type="number"
            error={errors?.price2?.message}
            placeholder="Enter Product Price"
          />
          <Input
            {...register("minimumQuantity2")}
            label="Minimum Quantity"
            type="number"
            error={errors?.minimumQuantity?.message}
            placeholder="Enter Product Price"
          />
          <Input
            {...register("price3")}
            label="Wholesale Price"
            type="number"
            error={errors?.price3?.message}
            placeholder="Enter Product Price"
          />
          <Input
            {...register("minimumQuantity3")}
            label="Minimum Quantity"
            type="number"
            error={errors?.minimumQuantity3?.message}
            placeholder="Enter Product Price"
          />
        </div>
        <div className="grid gap-4 sm:grid-cols-1">
          {/* <Controller
            render={({ field: { value, onChange, ...rest } }) => (
              <Listbox
                data={categories}
                value={categories.find((cat) => cat.id === value) || null}
                onChange={(val) => onChange(val.id)}
                label="Category"
                placeholder="Select Category"
                displayField="label"
                error={errors?.category_id?.message}
                {...rest}
              />
            )}
            control={control}
            name="category_id"
          /> */}

          <div className="grid gap-4 sm:grid-cols-1">
            <Controller
              control={control}
              name="categoryId"
              render={({ field }) => (
                <Select
                  options={categories.map((cat) => ({
                    value: cat._id,
                    label: cat.name,
                  }))}
                  placeholder="Select Category"
                  isClearable
                  isSearchable
                  onChange={(val) => {
                    field.onChange(val ? val.value : ""); // categoryId
                    setValue("category", val ? val.label : ""); // category name
                  }}
                  value={
                    categories
                      .map((cat) => ({ value: cat._id, label: cat.name }))
                      .find((option) => option.value === field.value) || null
                  }
                />
              )}
            />

            {/* Hidden field for category name */}
            <Controller
              control={control}
              name="category"
              render={({ field }) => <input type="hidden" {...field} />}
            />
          </div>
        </div>
        <Switch label="Active" {...register("inStock")} />{" "}
        <Switch label="availability" {...register("availability")} />
      </div>
      <div className="mt-4 flex justify-end space-x-3">
        <Button className="min-w-[7rem]">Cancel</Button>
        <Button type="submit" className="min-w-[7rem]" color="primary">
          Next
        </Button>
      </div>
    </form>
  );
}

General.propTypes = {
  setCurrentStep: PropTypes.func,
};
