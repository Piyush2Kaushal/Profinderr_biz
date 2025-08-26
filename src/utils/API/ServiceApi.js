// Import Dependencies
import { Page } from "components/shared/Page";
import { Card, Button, Avatar, Box } from "components/ui";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { selectSubscription } from "app/store/features/authSlice"; // <-- import selector
import dayjs from "dayjs";
import { CpuChipIcon } from "@heroicons/react/24/outline";
import { selectCurrentUser } from "app/store/features/authSlice";
// ----------------------------------------------------------------------

export default function MyPlanDetails() {
  const navigate = useNavigate();
  const subscription = useSelector(selectSubscription);
  const user = useSelector(selectCurrentUser);

  if (!subscription || !subscription.planId) {
    const businessId = user?._id || "";
    const buyUrl = `https://plan.profinderr.co.uk/?business=${businessId}`;

    return (
      <Page title="My Plan Details">
        <div className="mt-6 flex justify-center">
          <Card className="w-full max-w-lg p-6 text-center">
            {/* Title */}
            <h2 className="text-primary-800 text-3xl font-bold">
              You don’t have any subscription. Click to buy subscription.
            </h2>

            {/* Buy button */}
            <Button
              className="mt-8 w-full"
              color="primary"
              onClick={() => (window.location.href = buyUrl)}
            >
              Buy Subscription
            </Button>
          </Card>
        </div>
      </Page>
    );
  }

  const { planId, currentPeriodStart, currentPeriodEnd, insight, status } =
    subscription;

  return (
    <Page title="My Plan Details">
      <div className="mt-6 mb-6 flex flex-col items-center gap-4 px-(--margin-x)">
        {/* Heading Card */}

        {/* Plan Card */}
        <Card className="w-full max-w-3xl overflow-hidden">
          <div className="bg-primary-500 flex flex-col p-4 sm:flex-row sm:items-end sm:justify-between sm:p-5">
            <div className="text-center sm:text-left">
              <p className="mt-3 text-3xl font-semibold text-white">
                {planId.name}
              </p>
              <p className="mt-1 text-sm text-white">
                <span className="font-semibold capitalize">{status}</span>
              </p>
            </div>

            <div className="mt-4 text-right sm:mt-0">
              <p className="text-sm text-white">
                End Date: {dayjs(currentPeriodEnd).format("DD MMM YYYY")}
              </p>
            </div>
          </div>
        </Card>
        {/* Insight Card */}
      </div>
    </Page>
  );
}
