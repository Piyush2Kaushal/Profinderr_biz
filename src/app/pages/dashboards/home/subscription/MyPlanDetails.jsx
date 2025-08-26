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

    const subscriptionItem = {
      id: "no-subscription",
      title: "You don’t have an active subscription & plan right now.",
      description: "Upgrade to a plan and take your business to the next level.",
      action: () => (window.location.href = buyUrl),
      actionLabel: "Buy Plans",
      colorClasses: "from-pink-300 to-indigo-400",
    };
  
    return (
      <Page title="My Plan Details">
        <div className="transition-content w-full px-(--margin-x) pb-8">
          <div className="mx-auto grid mt-10 max-w-4xl grid-cols-1 gap-4 sm:grid-cols-1 lg:gap-6">
            <div
              className={`flex flex-col items-center justify-center rounded-lg bg-linear-to-l p-5 text-center text-white ${subscriptionItem.colorClasses}`}
            >
              <h4 className="text-xl font-semibold">{subscriptionItem.title}</h4>
              <p className="mt-2 text-lg">{subscriptionItem.description}</p>
  
              <Button
                unstyled
                className="mt-4 rounded-lg bg-white/90 px-5 py-2.5 text-gray-900 hover:bg-white/70 focus:bg-white/70"
                onClick={subscriptionItem.action}
              >
                {subscriptionItem.actionLabel}
              </Button>
            </div>
          </div>
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
        <Card className="w-full max-w-3xl bg-black p-4 text-center">
          <h2 className="text-primary-500 text-lg font-semibold">
            My Plan Details
          </h2>
        </Card>

        {/* Plan Card */}
        <Card className="w-full max-w-3xl overflow-hidden">
          <div className="bg-primary-500 flex flex-col p-4 sm:flex-row sm:items-end sm:justify-between sm:p-5">
            <div className="text-center sm:text-left">
              <p className="text-xl font-medium text-white">
                Plan [£{planId.price}]
              </p>
              <p className="mt-1 text-sm text-white">
                Your next billing date is{" "}
                {dayjs(insight.nextBillingDate).format("DD MMM YYYY")}
              </p>
              <p className="mt-3 text-3xl font-semibold text-white">
                {planId.name}
              </p>
              <p className="mt-1 text-sm text-white">
                Status:{" "}
                <span className="font-semibold capitalize">{status}</span>
              </p>
              <p className="text-sm text-white">£{planId.price} per month</p>
            </div>

            <div className="mt-4 text-right sm:mt-0">
              <p className="text-sm text-white">
                Start Date: {dayjs(currentPeriodStart).format("DD MMM YYYY")}
              </p>
              <p className="text-sm text-white">
                End Date: {dayjs(currentPeriodEnd).format("DD MMM YYYY")}
              </p>
            </div>
          </div>
        </Card>
        {/* Insight Card */}
        <Card className="w-full max-w-3xl px-4 pb-4 sm:px-5">
          <div className="flex min-w-0 items-center justify-between py-3">
            <h2 className="dark:text-dark-100 truncate font-medium tracking-wide text-gray-800">
              Subscription Insights
            </h2>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {/* Total Products */}
            <div className="dark:border-dark-600 flex items-center justify-between gap-2 rounded-lg border border-gray-200 p-3">
              <div className="flex items-center gap-3">
                <Avatar
                  size={10}
                  classNames={{ display: "rounded-lg" }}
                  initialColor="success"
                >
                  <CpuChipIcon className="size-6" />
                </Avatar>
                <div>
                  <p className="dark:text-dark-100 font-medium text-gray-800">
                    Total Products
                  </p>
                  <p className="text-success dark:text-success-lighter mt-0.5 truncate text-xs">
                    {insight.totalProducts}
                  </p>
                </div>
              </div>
            </div>

            {/* Total Services */}
            <div className="dark:border-dark-600 flex items-center justify-between gap-2 rounded-lg border border-gray-200 p-3">
              <div className="flex items-center gap-3">
                <Avatar
                  size={10}
                  classNames={{ display: "rounded-lg" }}
                  initialColor="success"
                >
                  <CpuChipIcon className="size-6" />
                </Avatar>
                <div>
                  <p className="dark:text-dark-100 font-medium text-gray-800">
                    Total Services
                  </p>
                  <p className="text-success dark:text-success-lighter mt-0.5 truncate text-xs">
                    {insight.totalServices}
                  </p>
                </div>
              </div>
            </div>

            {/* Usage Percentage */}
            <div className="dark:border-dark-600 flex items-center justify-between gap-2 rounded-lg border border-gray-200 p-3">
              <div className="flex items-center gap-3">
                <Avatar
                  size={10}
                  classNames={{ display: "rounded-lg" }}
                  initialColor="warning"
                >
                  <CpuChipIcon className="size-6" />
                </Avatar>
                <div>
                  <p className="dark:text-dark-100 font-medium text-gray-800">
                    Usage Percentage
                  </p>
                  <p className="text-warning dark:text-warning-lighter mt-0.5 truncate text-xs">
                    {insight.usagePercentage}%
                  </p>
                </div>
              </div>
            </div>

            {/* Remaining Resources */}
            <div className="dark:border-dark-600 flex items-center justify-between gap-2 rounded-lg border border-gray-200 p-3">
              <div className="flex items-center gap-3">
                <Avatar size={10} classNames={{ display: "rounded-lg" }}>
                  <CpuChipIcon className="size-6" />
                </Avatar>
                <div>
                  <p className="dark:text-dark-100 font-medium text-gray-800">
                    Features
                  </p>
                  <p
                    onClick={() =>
                      navigate("/dashboards/subscription/MyPlanFeatures")
                    }
                    className="text-warning dark:text-warning-lighter mt-0.5 cursor-pointer truncate text-xs"
                  >
                    View My Plan Features
                  </p>
                </div>
              </div>
            </div>
          </div>
        </Card>

        {/* View My Plan Features Button */}
        <div className="mt-8">
          <Button
            className="w-full"
            onClick={() => navigate("/dashboards/subscription/MyPlanFeatures")}
            color="primary"
          >
            View My Plan Features
          </Button>
        </div>
      </div>
    </Page>
  );
}
