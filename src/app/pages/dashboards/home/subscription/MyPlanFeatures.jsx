// import { CheckIcon, XMarkIcon } from "@heroicons/react/24/outline";
// import clsx from "clsx";
// import { useNavigate } from "react-router-dom";
// import dayjs from "dayjs"; // ✅ added

// // Local Imports
// import { Page } from "components/shared/Page";
// import { Button, Card, Box } from "components/ui";
// import { useSelector } from "react-redux";
// import { selectCurrentUser } from "app/store/features/authSlice";
// import { selectSubscription } from "app/store/features/authSlice";

// // ----------------------------------------------------------------------

// export default function PlanDetailsCard() {
//   const navigate = useNavigate();
//   const subscription = useSelector(selectSubscription);
//   const user = useSelector(selectCurrentUser);
//   const businessId = user?._id || "";
//   const buyUrl = `https://plan.profinderr.co.uk/?business=${businessId}`;

//   if (!subscription?.planId)
//     return (
//       <Page title="My Plan Details">
//         <div className="mt-6 flex justify-center">
//           <Card className="w-full max-w-lg p-6 text-center">
//             {/* Title */}
//             <h2 className="text-primary-800 text-3xl font-bold">
//               Subscription & Plans
//             </h2>

//             {/* Plans list */}
//             <div className="mt-6">
//               <Box className="dark:bg-dark-500 flex h-16 w-full items-center justify-center rounded-lg bg-gray-100">
//                 <p className="text-lg font-medium">Basic</p>
//               </Box>

//               <div className="dark:bg-dark-500 my-4 h-px bg-gray-200"></div>
//               <Box className="dark:bg-dark-500 flex h-16 w-full items-center justify-center rounded-lg bg-gray-100">
//                 <p className="text-lg font-medium">Standard Plan</p>
//               </Box>

//               {/* Divider */}
//               <div className="dark:bg-dark-500 my-4 h-px bg-gray-200"></div>

//               <Box className="dark:bg-dark-500 flex h-16 w-full items-center justify-center rounded-lg bg-gray-100">
//                 <p className="text-lg font-medium">Premium Plan</p>
//               </Box>

//               {/* Divider */}
//               <div className="dark:bg-dark-500 my-4 h-px bg-gray-200"></div>

//               <Box className="dark:bg-dark-500 flex h-16 w-full items-center justify-center rounded-lg bg-gray-100">
//                 <p className="text-lg font-medium">Enterprise Plan</p>
//               </Box>
//             </div>

//             {/* Buy button */}
//             <Button
//               className="mt-8 w-full"
//               color="primary"
//               onClick={() => (window.location.href = buyUrl)}
//             >
//               Buy Subscription
//             </Button>
//           </Card>
//         </div>
//       </Page>
//     );

//   const plan = subscription.planId;
//   const features = plan.features || {};

//   // Convert redux plan features into planItems
//   const planItems = [
//     {
//       label: `Service Provider (Max Services): ${features?.serviceProvider?.maxServices ?? "-"}`,
//       avaliable: true,
//     },
//     {
//       label: `Trader (Max Products): ${features?.trader?.maxProducts ?? "-"}`,
//       avaliable: true,
//     },
//     {
//       label: `Both (Max Services): ${features?.both?.maxServices ?? "-"}`,
//       avaliable: true,
//     },
//     {
//       label: `Both (Max Products): ${features?.both?.maxProducts ?? "-"}`,
//       avaliable: true,
//     },
//     { label: `Max Deals: ${features?.maxDeals ?? "-"}`, avaliable: true },
//     { label: `Deal Period: ${features?.dealPeriod ?? "-"}`, avaliable: true },

//     // Handle boolean/string features dynamically
//     ...Object.entries(features)
//       .filter(
//         ([key, value]) =>
//           ![
//             "serviceProvider",
//             "trader",
//             "both",
//             "maxDeals",
//             "dealPeriod",
//           ].includes(key),
//       )
//       .map(([key, value]) => ({
//         label: key.replace(/([A-Z])/g, " $1"), // Format camelCase → "Ai Description"
//         avaliable: value === true || value === "true",
//       })),
//   ];

//   return (
//     <Page title="Plan Details">
//       <div className="mt-6 flex w-full justify-center px-(--margin-x) pb-4">
//         <Card className="w-full max-w-3xl bg-black p-4 text-center">
//           <h2 className="text-primary-500 text-lg font-semibold">
//             My Plan Features
//           </h2>
//         </Card>
//       </div>

//       <div className="transition-content flex w-full justify-center px-(--margin-x) pb-8">
//         <Card className="w-full max-w-3xl">
//           {/* Card Header */}
//           <div className="bg-primary-500 relative flex flex-col rounded-t-lg p-4 sm:flex-row sm:items-end sm:justify-between sm:p-5">
//             <div className="text-center sm:text-left">
//               <p className="text-xl font-medium text-white">{plan.name}</p>
//               <p className="mt-3 text-3xl font-semibold text-white">
//                 £{plan.price} per month
//               </p>
//             </div>

//             {/* Dates Section */}
//             <div className="mt-4 text-right sm:mt-0">
//               <p className="text-sm text-white">
//                 Start Date:{" "}
//                 {subscription.currentPeriodStart
//                   ? dayjs(subscription.currentPeriodStart).format("DD/MM/YYYY") // ✅ dayjs used
//                   : "-"}
//               </p>
//               <p className="text-sm text-white">
//                 End Date:{" "}
//                 {subscription.currentPeriodEnd
//                   ? dayjs(subscription.currentPeriodEnd).format("DD/MM/YYYY") // ✅ dayjs used
//                   : "-"}
//               </p>
//             </div>
//           </div>

//           {/* Card Content */}
//           <div className="p-4 sm:p-5">
//             <div className="mt-3 space-y-4 text-left">
//               {planItems.map((item, index) => (
//                 <div key={index} className="flex items-start gap-3">
//                   <div
//                     className={clsx(
//                       "flex size-6 shrink-0 items-center justify-center rounded-full",
//                       item.avaliable
//                         ? "bg-primary-600/10 text-primary-600 dark:bg-primary-400/10 dark:text-primary-400"
//                         : "bg-warning/10 text-warning dark:bg-warning-light/10 dark:text-warning-light",
//                     )}
//                   >
//                     {item.avaliable ? (
//                       <CheckIcon className="size-4" />
//                     ) : (
//                       <XMarkIcon className="size-4" />
//                     )}
//                   </div>
//                   <span className="font-medium capitalize">{item.label}</span>
//                 </div>
//               ))}
//             </div>

//             {/* Button */}
//             <div className="mt-8">
//               <Button
//                 className="w-full"
//                 onClick={() =>
//                   (window.location.href = `https://plan.profinderr.co.uk/?business=${businessId}`)
//                 }
//                 color="primary"
//               >
//                 Change Plan
//               </Button>
//             </div>
//           </div>
//         </Card>
//       </div>
//     </Page>
//   );
// }

import { CheckIcon, XMarkIcon } from "@heroicons/react/24/outline";
import clsx from "clsx";
import { useNavigate } from "react-router-dom";
import dayjs from "dayjs"; // ✅ added

// Local Imports
import { Page } from "components/shared/Page";
import { Button, Card, Box } from "components/ui";
import { useSelector } from "react-redux";
import {
  selectCurrentUser,
  selectSubscription,
} from "app/store/features/authSlice";

// ----------------------------------------------------------------------

export default function PlanDetailsCard() {
  const navigate = useNavigate();
  const subscription = useSelector(selectSubscription);
  const user = useSelector(selectCurrentUser);
  const businessId = user?._id || "";
  const buyUrl = `https://plan.profinderr.co.uk/?business=${businessId}`;

  if (!subscription?.planId) {
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
  


  const plan = subscription.planId;
  const features = plan.features || {};

  return (
    <Page title="Plan Details">
      <div className="mt-6 flex w-full justify-center px-(--margin-x) pb-4">
        <Card className="w-full max-w-4xl bg-black p-4 text-center dark:bg-white">
          <h2 className="text-primary-500 text-lg font-semibold dark:text-black">
            My Plan Features
          </h2>
        </Card>
      </div>

      <div className="transition-content flex w-full justify-center px-(--margin-x) pb-8">
        <Card className="w-full max-w-4xl">
          {/* Card Header */}
          <div className="bg-primary-500 relative flex flex-col rounded-t-lg p-4 sm:flex-row sm:items-end sm:justify-between sm:p-5">
            <div className="text-center sm:text-left">
              <p className="text-3xl font-medium text-white">{plan.name}</p>
              <p className="mt-3 text-xl font-semibold text-white">
                £{plan.price} per month
              </p>
            </div>

            {/* Dates Section */}
            <div className="mt-4 text-left sm:mt-0">
              <p className="text-sm text-white">
                Start Date:{" "}
                {subscription.currentPeriodStart
                  ? dayjs(subscription.currentPeriodStart).format("DD/MM/YYYY")
                  : "-"}
              </p>
              <p className="text-sm text-white">
                End Date:{" "}
                {subscription.currentPeriodEnd
                  ? dayjs(subscription.currentPeriodEnd).format("DD/MM/YYYY")
                  : "-"}
              </p>
            </div>
          </div>

          <div className="p-4 sm:p-5">
            {/* Responsive Grid for Sections */}
            <div className="mt-3 grid grid-cols-1 gap-6 text-left md:grid-cols-2">
              {/* ✅ Core Benefits */}
              <div>
                <h3 className="text-primary-600 mb-3 text-lg font-semibold">
                  Core Benefits
                </h3>
                <div className="space-y-3">
                  <FeatureItem
                    label={`Service Provider (Max Services): ${
                      features?.serviceProvider?.maxServices ?? "Unlimited"
                    }`}
                  />
                  <FeatureItem
                    label={`Trader (Max Products): ${
                      features?.trader?.maxProducts ?? "Unlimited"
                    }`}
                  />
                  <FeatureItem
                    label={`Both (Max Services): ${
                      features?.both?.maxServices ?? "Unlimited"
                    }`}
                  />
                  <FeatureItem
                    label={`Both (Max Products): ${
                      features?.both?.maxProducts ?? "Unlimited"
                    }`}
                  />
                  <FeatureItem
                    label={`Max Deals: ${features?.maxDeals ?? "Unlimited"}`}
                  />
                  <FeatureItem
                    label={`Deal Period: ${features?.dealPeriod ?? "Unlimited"}`}
                  />
                </div>
              </div>

              <div>
                <h3 className="text-primary-600 mb-3 text-lg font-semibold">
                  Visibility & Engagement
                </h3>
                <div className="space-y-3">
                  <FeatureItem
                    label="View on Map"
                    avaliable={features?.viewOnMap}
                  />
                  <FeatureItem
                    label="WhatsApp Sharing"
                    avaliable={features?.whatsappSharing}
                  />
                  <FeatureItem
                    label="Follow Option"
                    avaliable={features?.followOption}
                  />
                  <FeatureItem
                    label="AI Description"
                    avaliable={features?.aiDescription}
                  />
                </div>
              </div>

              <div>
                <h3 className="text-primary-600 mb-3 text-lg font-semibold">
                  Support & Tools
                </h3>
                <div className="space-y-3">
                  <FeatureItem
                    label="Standard Support"
                    avaliable={features?.standardSupport}
                  />
                  <FeatureItem
                    label="Advanced Support"
                    avaliable={features?.advancedSupport}
                  />
                  <FeatureItem
                    label="Advanced Features"
                    avaliable={features?.advancedFeatures}
                  />
                  <FeatureItem
                    label="Admin Insights"
                    avaliable={features?.adminInsights}
                  />
                  <FeatureItem
                    label="Dedicated Manager"
                    avaliable={features?.dedicatedManager}
                  />
                </div>
              </div>

              <div>
                <h3 className="text-primary-600 mb-3 text-lg font-semibold">
                  Business Essentials
                </h3>
                <div className="space-y-3">
                  <FeatureItem label="POS" avaliable={features?.pos} />
                  <FeatureItem
                    label="Stock Management"
                    avaliable={features?.stockManagement}
                  />
                  <FeatureItem
                    label="Accounting"
                    avaliable={features?.accounting}
                  />
                  <FeatureItem
                    label="Custom Integrations"
                    avaliable={features?.customIntegrations}
                  />
                </div>
              </div>

              {/* Branding & Web */}
              <div className="md:col-span-2">
                <h3 className="text-primary-600 mb-3 text-lg font-semibold">
                  Branding & Web
                </h3>
                <div className="space-y-3">
                  <FeatureItem
                    label="Dedicated Store Page"
                    avaliable={features?.dedicatedStorePage}
                  />
                  <FeatureItem
                    label="Website Page"
                    avaliable={features?.websitePage}
                  />
                  <FeatureItem
                    label="Domain Connectivity"
                    avaliable={features?.domainConnectivity}
                  />
                </div>
              </div>
            </div>

            {/* Button */}
            <div className="mt-8">
              <Button
                className="mx-auto block w-full sm:w-40"
                onClick={() =>
                  (window.location.href = `https://plan.profinderr.co.uk/?business=${businessId}`)
                }
                color="primary"
              >
                Change Plan
              </Button>
            </div>
          </div>
        </Card>
      </div>
    </Page>
  );
}

// Helper component for feature items
function FeatureItem({ label, avaliable = true }) {
  return (
    <div className="flex items-start gap-3">
      <div
        className={clsx(
          "flex size-6 shrink-0 items-center justify-center rounded-full",
          avaliable
            ? "bg-primary-600/10 text-primary-600 dark:bg-primary-400/10 dark:text-primary-400"
            : "bg-warning/10 text-warning dark:bg-warning-light/10 dark:text-warning-light",
        )}
      >
        {avaliable ? (
          <CheckIcon className="size-4" />
        ) : (
          <XMarkIcon className="size-4" />
        )}
      </div>
      <span className="font-medium capitalize">{label}</span>
    </div>
  );
}
