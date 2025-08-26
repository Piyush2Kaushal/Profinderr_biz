import { Navigate, useLocation, useNavigate, useOutlet } from "react-router";
import { getStorageItem } from "app/store/storage";
import { GetBusiness, GetSubscription } from "utils/API/Authapi";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { setCredentials, setSubscription } from "app/store/features/authSlice";

export default function AuthGuard() {
  const outlet = useOutlet();
  const location = useLocation();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const token = getStorageItem("authToken");

  const GetAPI = async () => {
    try {
      const response = await GetBusiness();
      console.log("response auth", response);

      if (response.status) {
        dispatch(
          setCredentials({
            user: response.user,
            currentPlan: response.user.currentPlan,
          }),
        );
      }
      const subscriptionRes = await GetSubscription();
      console.log("subscriptionRes", subscriptionRes);

      if (subscriptionRes.success) {
        dispatch(setSubscription(subscriptionRes.data));
      }
    } catch (error) {
      // handle error
      // navigate('/login');
    }
  };
  useEffect(() => {
    GetAPI();
  }, []);

  if (!token) {
    return <Navigate to={`/login?redirect=${location.pathname}`} replace />;
  }

  return <>{outlet}</>;
}
