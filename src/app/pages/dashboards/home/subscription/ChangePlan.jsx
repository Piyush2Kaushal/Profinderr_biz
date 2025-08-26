// Import Dependencies
import { CheckIcon, XMarkIcon } from "@heroicons/react/24/outline";
import clsx from "clsx";

// Local Imports
import { Page } from "components/shared/Page";
import { Button, Card } from "components/ui";

// ----------------------------------------------------------------------

const plans = [
  {
    name: "Basic",
    price: "$25/month",
    serviceProviderMaxServices: 50,
    traderMaxProducts: 200,
    bothMaxServices: 50,
    bothMaxProducts: 200,
    maxDeals: 20,
    dealPeriod: 15,
    features: {
      viewOnMap: true,
      whatsappSharing: false,
      followOption: true,
      aiDescription: false,
      standardSupport: true,
      advancedSupport: false,
      advancedFeatures: false,
      adminInsights: false,
      pos: false,
      stockManagement: false,
      accounting: false,
      dedicatedManager: false,
      customIntegrations: false,
      dedicatedStorePage: true,
      websitePage: false,
      domainConnectivity: false,
    },
  },
  {
    name: "Standard",
    price: "$50/month",
    serviceProviderMaxServices: 100,
    traderMaxProducts: 500,
    bothMaxServices: 100,
    bothMaxProducts: 500,
    maxDeals: 50,
    dealPeriod: 30,
    features: {
      viewOnMap: true,
      whatsappSharing: true,
      followOption: true,
      aiDescription: true,
      standardSupport: true,
      advancedSupport: true,
      advancedFeatures: false,
      adminInsights: true,
      pos: true,
      stockManagement: true,
      accounting: false,
      dedicatedManager: false,
      customIntegrations: false,
      dedicatedStorePage: true,
      websitePage: true,
      domainConnectivity: false,
    },
  },
  {
    name: "Premium",
    price: "$100/month",
    serviceProviderMaxServices: 200,
    traderMaxProducts: 1000,
    bothMaxServices: 200,
    bothMaxProducts: 1000,
    maxDeals: 100,
    dealPeriod: 60,
    features: {
      viewOnMap: true,
      whatsappSharing: true,
      followOption: true,
      aiDescription: true,
      standardSupport: true,
      advancedSupport: true,
      advancedFeatures: true,
      adminInsights: true,
      pos: true,
      stockManagement: true,
      accounting: true,
      dedicatedManager: true,
      customIntegrations: true,
      dedicatedStorePage: true,
      websitePage: true,
      domainConnectivity: true,
    },
    current: true, // Mark as current plan
  },
  {
    name: "Enterprise",
    price: "$200/month",
    serviceProviderMaxServices: "Unlimited",
    traderMaxProducts: "Unlimited",
    bothMaxServices: "Unlimited",
    bothMaxProducts: "Unlimited",
    maxDeals: "Unlimited",
    dealPeriod: "Unlimited",
    features: {
      viewOnMap: true,
      whatsappSharing: true,
      followOption: true,
      aiDescription: true,
      standardSupport: true,
      advancedSupport: true,
      advancedFeatures: true,
      adminInsights: true,
      pos: true,
      stockManagement: true,
      accounting: true,
      dedicatedManager: true,
      customIntegrations: true,
      dedicatedStorePage: true,
      websitePage: true,
      domainConnectivity: true,
    },
  },
];

// Convert plan object to list for rendering
const getPlanItems = (plan) => [
  {
    label: `Service Provider (Max Services): ${plan.serviceProviderMaxServices}`,
    avaliable: true,
  },
  {
    label: `Trader (Max Products): ${plan.traderMaxProducts}`,
    avaliable: true,
  },
  { label: `Both (Max Services): ${plan.bothMaxServices}`, avaliable: true },
  { label: `Both (Max Products): ${plan.bothMaxProducts}`, avaliable: true },
  { label: `Max Deals: ${plan.maxDeals}`, avaliable: true },
  { label: `Deal Period: ${plan.dealPeriod}`, avaliable: true },
  ...Object.entries(plan.features).map(([key, value]) => ({
    label: key.replace(/([A-Z])/g, " $1"),
    avaliable: value,
  })),
];

export default function PlansPage() {
  return (
    <Page title="Plans">
      <div className="transition-content w-full px-(--margin-x) pb-8">
        <div className="py-5 text-center lg:py-6">
          <p className="text-sm uppercase">Choose Your Plan</p>
          <h3 className="dark:text-dark-100 mt-1 text-xl font-semibold text-gray-600">
            Select the best plan for your needs
          </h3>
        </div>

        <div className="mx-auto grid max-w-7xl grid-cols-1 gap-4 sm:grid-cols-2 md:gap-5 lg:grid-cols-4 2xl:gap-6">
          {plans.map((plan, idx) => (
            <Card key={idx} className="flex flex-col">
              {/* Header */}
              <div
                className={clsx(
                  "rounded-t-lg p-4 text-center sm:p-5",
                  plan.current
                    ? "bg-primary-500 text-white"
                    : "bg-gray-150 dark:bg-dark-800",
                )}
              >
                <p
                  className={clsx(
                    "text-xl font-medium",
                    plan.current
                      ? "text-white"
                      : "dark:text-dark-100 text-gray-800",
                  )}
                >
                  {plan.name}
                </p>
                <p
                  className={clsx(
                    "mt-3 text-3xl font-semibold",
                    plan.current
                      ? "text-white"
                      : "dark:text-dark-50 text-gray-800",
                  )}
                >
                  {plan.price}
                </p>
              </div>

              {/* Content */}
              <div className="flex flex-1 flex-col p-4 sm:p-5">
                <div className="mt-3 flex-1 space-y-4 text-left">
                  {getPlanItems(plan).map((item, index) => (
                    <div key={index} className="flex items-start gap-3">
                      <div
                        className={clsx(
                          "flex size-6 shrink-0 items-center justify-center rounded-full",
                          item.avaliable
                            ? "bg-primary-600/10 text-primary-600 dark:bg-primary-400/10 dark:text-primary-400"
                            : "bg-warning/10 text-warning dark:bg-warning-light/10 dark:text-warning-light",
                        )}
                      >
                        {item.avaliable ? (
                          <CheckIcon className="size-4" />
                        ) : (
                          <XMarkIcon className="size-4" />
                        )}
                      </div>
                      <span className="font-medium capitalize">
                        {item.label}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Button / Current Plan */}
                <div className="mt-8">
                  {plan.current ? (
                    <p className="text-primary-500 text-center font-semibold">
                      Current Plan
                    </p>
                  ) : (
                    <Button className="w-full" color="primary">
                      Buy Plan
                    </Button>
                  )}
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </Page>
  );
}
