// const publicRoutes = {
//   id: "public",
//   children: [],
// };

// export { publicRoutes };

const publicRoutes = {
  id: "public",
  children: [
    {
      path: "forgot-password",
      // lazy: () =>
      //   import("app/pages/auth/ForgotPassword").then((module) => ({
      //     Component: module.default,
      //   })),
    },
  ],
};

export { publicRoutes };
