// Import Dependencies
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import PropTypes from "prop-types";

// Local Imports
import { Listbox } from "components/shared/form/Listbox";
import { Button, Input } from "components/ui";
import { useAddProductFormContext } from "../AddProductFormContext";
import { generalSchema } from "../schema";

// ----------------------------------------------------------------------

const categories = [
  { id: "1", label: "Plumbing" },
  { id: "2", label: "Electrical" },
  { id: "3", label: "Cleaning" },
  { id: "4", label: "IT Support" },
];

const brands = [
  { id: "1", label: "Brand A" },
  { id: "2", label: "Brand B" },
  { id: "3", label: "Brand C" },
];

const availabilityOptions = [
  { id: "yes", label: "Yes" },
  { id: "no", label: "No" },
];

const serviceTimeOptions = [
  { id: "15min", label: "15 min" },
  { id: "30min", label: "30 min" },
  { id: "60min", label: "60 min" },
  { id: "1:30hrs", label: "1:30 hrs" },
  { id: "2:00hrs", label: "2:00 hrs" },
  { id: "2:30hrs", label: "2:30 hrs" },
];

export function General({ setCurrentStep }) {
  const addServiceFormCtx = useAddProductFormContext();

  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
  } = useForm({
    resolver: yupResolver(generalSchema),
    defaultValues: addServiceFormCtx.state.formData.general,
  });

  const onSubmit = (data) => {
    addServiceFormCtx.dispatch({
      type: "SET_FORM_DATA",
      payload: { general: { ...data } },
    });
    addServiceFormCtx.dispatch({
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
            {...register("service_name")}
            label="Service Name"
            error={errors?.service_name?.message}
            placeholder="Enter Service Name"
          />
          <Input
            {...register("service_code")}
            label="Service Code"
            error={errors?.service_code?.message}
            placeholder="Enter Service Code"
          />
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <Controller
            render={({ field: { value, onChange, ...rest } }) => (
              <Listbox
                data={brands}
                value={brands.find((brand) => brand.id === value) || null}
                onChange={(val) => onChange(val.id)}
                label="Brand / Manufacturer"
                placeholder="Select Brand / Manufacturer"
                displayField="label"
                error={errors?.brand_id?.message}
                {...rest}
              />
            )}
            control={control}
            name="brand_id"
          />
          <Controller
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
          />
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <Controller
            render={({ field: { value, onChange, ...rest } }) => (
              <Listbox
                data={availabilityOptions}
                value={
                  availabilityOptions.find((opt) => opt.id === value) || null
                }
                onChange={(val) => onChange(val.id)}
                label="Availability"
                placeholder="Select Availability"
                displayField="label"
                error={errors?.availability?.message}
                {...rest}
              />
            )}
            control={control}
            name="availability"
          />

          <Controller
            render={({ field: { value, onChange, ...rest } }) => (
              <Listbox
                data={serviceTimeOptions}
                value={
                  serviceTimeOptions.find((opt) => opt.id === value) || null
                }
                onChange={(val) => onChange(val.id)}
                label="Service Time"
                placeholder="Select Service Time"
                displayField="label"
                error={errors?.service_time?.message}
                {...rest}
              />
            )}
            control={control}
            name="service_time"
          />
        </div>

        <Input
          {...register("service_price")}
          label="Service Price (£)"
          type="number"
          error={errors?.service_price?.message}
          placeholder="Enter Service Price"
        />
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
