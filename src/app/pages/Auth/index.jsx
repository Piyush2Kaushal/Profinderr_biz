import { Link, useNavigate } from "react-router-dom";
import { EnvelopeIcon, LockClosedIcon } from "@heroicons/react/24/outline";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";

// Local Imports
import Logo from "assets/LogoBizz.png";
import { Button, Card, Checkbox, Input, InputErrorMsg } from "components/ui";
import { LOGIN } from "utils/API/Authapi";
import { Page } from "components/shared/Page";
import {
  selectCurrentToken,
  setCredentials,
  setError,
  setLoading,
} from "app/store/features/authSlice";
import { getStorageItem, setStorageItem } from "app/store/storage";
import { useEffect } from "react";
// import { setStorageItem } from "utils/storage";

export default function SignIn() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const token = useSelector(selectCurrentToken);
  useEffect(() => {
    const localToken = getStorageItem("authToken");
    if (token || localToken) {
      navigate("/");
    }
  }, [token, navigate]);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm();

  const onSubmit = async (data) => {
    dispatch(setLoading(true));
    dispatch(setError(null));

    try {
      const response = await LOGIN({
        identifier: data.identifier,
        password: data.password,
      });

      // console.log("response" , response);
      if (response?.status) {
        // Save to localStorage
        setStorageItem("authToken", response.token);
        setStorageItem("user", response.user);
        setStorageItem("currentPlan", response.user.currentPlan);

        // Save to Redux
        dispatch(
          setCredentials({
            token: response.token,
            user: response.user,
            currentPlan: response.user.currentPlan,
          }),
        );

        navigate("/dashboards/home");
        setTimeout(() => {
          window.location.reload();
        }, 100);
      } else {
        dispatch(
          setError(response?.message || "Login failed. Please try again."),
        );
      }
    } catch (err) {
      dispatch(setError(err.message || "An error occurred during login."));
    } finally {
      dispatch(setLoading(false));
    }
  };

  return (
    <Page title="Login">
      <main className="min-h-100vh grid w-full grow grid-cols-1 place-items-center">
        <div className="w-full max-w-[26rem] p-4 sm:px-5">
          <div className="text-center">
            <img
              src={Logo}
              alt="Logo"
              className="mx-auto h-auto w-16 sm:w-40"
            />
            <div className="mt-4">
              <h2 className="dark:text-dark-100 text-2xl font-semibold text-gray-600">
                Login With Us!
              </h2>
            </div>
          </div>
          <Card className="mt-5 rounded-lg p-5 lg:p-7">
            <form onSubmit={handleSubmit(onSubmit)} autoComplete="off">
              <div className="space-y-4">
                <Input
                  label="Email or Phone"
                  placeholder="Enter email or phone"
                  prefix={
                    <EnvelopeIcon
                      className="size-5 transition-colors duration-200"
                      strokeWidth="1"
                    />
                  }
                  {...register("identifier", {
                    required: "This field is required",
                  })}
                  error={errors?.identifier?.message}
                />
                <Input
                  label="Password"
                  placeholder="Enter Password"
                  type="password"
                  prefix={
                    <LockClosedIcon
                      className="size-5 transition-colors duration-200"
                      strokeWidth="1"
                    />
                  }
                  {...register("password", {
                    required: "This field is required",
                  })}
                  error={errors?.password?.message}
                />
              </div>

              <div className="mt-2">
                <InputErrorMsg when={errors?.root?.message}>
                  {errors?.root?.message}
                </InputErrorMsg>
              </div>

              <div className="mt-4 flex items-center justify-between space-x-2">
                <Checkbox label="Remember me" />
                {/* <Link
                  to="/forgot-password"
                  className="dark:text-dark-300 dark:hover:text-dark-100 dark:focus:text-dark-100 text-xs text-gray-400 transition-colors hover:text-gray-800 focus:text-gray-800"
                >
                  Forgot Password?
                </Link> */}
              </div>

              <Button
                type="submit"
                className="mt-5 w-full"
                color="primary"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Logging in..." : "Login"}
              </Button>
            </form>
            {/* <div className="text-xs-plus mt-4 text-center">
              <p className="line-clamp-1">
                <span>Don't have an account?</span>{" "}
                <Link
                  className="text-primary-600 hover:text-primary-800 dark:text-primary-400 dark:hover:text-primary-600 transition-colors"
                  to="/pages/sign-up-v1"
                >
                  REGISTER
                </Link>
              </p>
            </div> */}
          </Card>

          <div className="dark:text-dark-300 mt-8 flex justify-center text-xs text-gray-400">
            <Link to="/privacy-policy">Privacy Policy & Content Policy</Link>
            <div className="dark:bg-dark-500 mx-2.5 my-0.5 w-px bg-gray-200"></div>
            <Link to="/terms">Terms & Conditions</Link>
          </div>
        </div>
      </main>
    </Page>
  );
}
