// // Import Dependencies
// import { Navigate } from "react-router";

// // Local Imports
// import { AppLayout } from "app/layouts/AppLayout";
// import { DynamicLayout } from "app/layouts/DynamicLayout";
// import AuthGuard from "middleware/AuthGuard";

// // ----------------------------------------------------------------------

// const protectedRoutes = {
//   id: "protected",
//   Component: AuthGuard,
//   children: [
//     // The dynamic layout supports both the main layout and the sideblock.
//     {
//       Component: DynamicLayout,
//       children: [
//         {
//           index: true,
//           element: <Navigate to="/dashboards" />,
//         },
//         {
//           path: "dashboards",
//           children: [
//             {
//               index: true,
//               element: <Navigate to="/dashboards/home" />,
//             },
//             {
//               path: "home",
//               lazy: async () => ({
//                 Component: (await import("app/pages/dashboards/home")).default,
//               }),
//             },
//           ],
//         },
//       ],
//     },
//     // The app layout supports only the main layout. Avoid using it for other layouts.
//     {
//       Component: AppLayout,
//       children: [
//         {
//           path: "settings",
//           lazy: async () => ({
//             Component: (await import("app/pages/settings/Layout")).default,
//           }),
//           children: [
//             {
//               index: true,
//               element: <Navigate to="/settings/general" />,
//             },
//             {
//               path: "general",
//               lazy: async () => ({
//                 Component: (await import("app/pages/settings/sections/General"))
//                   .default,
//               }),
//             },
//             {
//               path: "appearance",
//               lazy: async () => ({
//                 Component: (
//                   await import("app/pages/settings/sections/Appearance")
//                 ).default,
//               }),
//             },
//           ],
//         },
//       ],
//     },
//   ],
// };

// export { protectedRoutes };

// Import Dependencies
import { Navigate } from "react-router";

// Local Imports
import { AppLayout } from "app/layouts/AppLayout";
import { DynamicLayout } from "app/layouts/DynamicLayout";
import AuthGuard from "middleware/AuthGuard";

// ----------------------------------------------------------------------

const protectedRoutes = {
  id: "protected",
  Component: AuthGuard,
  children: [
    {
      Component: DynamicLayout,
      children: [
        {
          index: true,
          element: <Navigate to="/dashboards" />,
        },
        {
          path: "dashboards",
          children: [
            {
              index: true,
              element: <Navigate to="/dashboards/home" />,
            },
            {
              path: "home",
              lazy: async () => ({
                Component: (await import("app/pages/dashboards/home")).default,
              }),
            },
            // ---------------- PRODUCTS ----------------
            {
              path: "products/list",
              lazy: async () => ({
                Component: (
                  await import("app/pages/dashboards/home/products/list")
                ).default,
              }),
            },
            {
              path: "products/view/:id",
              lazy: async () => ({
                Component: (
                  await import("app/pages/dashboards/home/products/ProductView")
                ).default,
              }),
            },
            {
              path: "products/Edit/:id",
              lazy: async () => ({
                Component: (
                  await import("app/pages/dashboards/home/products/ProductEdit")
                ).default,
              }),
            },
            {
              path: "products/add",
              lazy: async () => ({
                Component: (
                  await import(
                    "app/pages/dashboards/home/products/add-product-form/index"
                  )
                ).default,
              }),
            },
            {
              path: "products/bulkadd",
              lazy: async () => ({
                Component: (
                  await import("app/pages/dashboards/home/products/BulkAdd")
                ).default,
              }),
            },
            {
              path: "products/bulkedit",
              lazy: async () => ({
                Component: (
                  await import(
                    "app/pages/dashboards/home/products/BulkEditPriceTable"
                  )
                ).default,
              }),
            },

            // ---------------- SERVICES ----------------
            {
              path: "services/list",
              lazy: async () => ({
                Component: (
                  await import("app/pages/dashboards/home/services/list")
                ).default,
              }),
            },
            {
              path: "service/view/:id",
              lazy: async () => ({
                Component: (
                  await import("app/pages/dashboards/home/services/ServiceView")
                ).default,
              }),
            },
            {
              path: "Service/Edit/:id",
              lazy: async () => ({
                Component: (
                  await import("app/pages/dashboards/home/services/ServiceEdit")
                ).default,
              }),
            },
            {
              path: "services/add",
              lazy: async () => ({
                Component: (
                  await import(
                    "app/pages/dashboards/home/services/add-product-form/index"
                  )
                ).default,
              }),
            },
            // ---------------- SUBSCRIPTION DETAILS ----------------
            {
              path: "subscription/MyPlanDetails",
              lazy: async () => ({
                Component: (
                  await import(
                    "app/pages/dashboards/home/subscription/MyPlanDetails"
                  )
                ).default,
              }),
            },
            {
              path: "subscription/MyPlanFeatures",
              lazy: async () => ({
                Component: (
                  await import(
                    "app/pages/dashboards/home/subscription/MyPlanFeatures"
                  )
                ).default,
              }),
            },
            {
              path: "subscription/ChangePlan",
              lazy: async () => ({
                Component: (
                  await import(
                    "app/pages/dashboards/home/subscription/ChangePlan"
                  )
                ).default,
              }),
            },

            {
              path: "PrivacyPolicy",
              lazy: async () => ({
                Component: (await import("app/pages/dashboards/home/Policy"))
                  .default,
              }),
            },
            {
              path: "TermsConditionsPage",
              lazy: async () => ({
                Component: (
                  await import("app/pages/dashboards/home/TermsConditionsPage")
                ).default,
              }),
            },
            {
              path: "FAQ",
              lazy: async () => ({
                Component: (await import("app/pages/dashboards/home/Faq"))
                  .default,
              }),
            },
            {
              path: "Support",
              lazy: async () => ({
                Component: (await import("app/pages/dashboards/home/Support"))
                  .default,
              }),
            },
          ],
        },
      ],
    },

    // ---------------- SETTINGS ----------------
    {
      Component: AppLayout,
      children: [
        {
          path: "settings",
          lazy: async () => ({
            Component: (await import("app/pages/settings/Layout")).default,
          }),
          children: [
            {
              index: true,
              element: <Navigate to="/settings/general" />,
            },
            {
              path: "general",
              lazy: async () => ({
                Component: (await import("app/pages/settings/sections/General"))
                  .default,
              }),
            },
            {
              path: "appearance",
              lazy: async () => ({
                Component: (
                  await import("app/pages/settings/sections/Appearance")
                ).default,
              }),
            },
          ],
        },
      ],
    },
  ],
};

export { protectedRoutes };
