import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { Input, Button } from "components/ui";
import { Page } from "components/shared/Page";

const schema = yup.object().shape({
  email: yup.string().email().required("Email is required"),
});

export default function ForgotPassword() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  const onSubmit = (data) => {
    // your API call here
    console.log("Reset link sent to:", data.email);
  };

  return (
    <Page title="Forgot Password">
      <div className="min-h-100vh grid place-items-center p-4">
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="w-full max-w-md space-y-5"
        >
          <h2 className="text-xl font-semibold">Reset Your Password</h2>
          <Input
            label="Email"
            placeholder="Enter your email"
            {...register("email")}
            error={errors?.email?.message}
          />
          <Button type="submit" className="w-full">
            Send Reset Link
          </Button>
        </form>
      </div>
    </Page>
  );
}
