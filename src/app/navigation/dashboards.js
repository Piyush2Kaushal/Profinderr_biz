import {
  HomeIcon,
  CubeIcon,
  WrenchScrewdriverIcon,
  ClipboardDocumentCheckIcon,
} from "@heroicons/react/24/outline";
import DashboardsIcon from "assets/dualicons/dashboards.svg?react";
import {
  NAV_TYPE_ROOT,
  NAV_TYPE_ITEM,
  NAV_TYPE_COLLAPSE,
} from "constants/app.constant";

const ROOT_DASHBOARDS = "/dashboards";

const path = (root, item) => `${root}${item}`;

export const dashboards = {
  id: "dashboards",
  type: NAV_TYPE_ROOT,
  path: "/dashboards",
  title: "Dashboards",
  transKey: "nav.dashboards.dashboards",
  Icon: DashboardsIcon,
  childs: [
    {
      id: "dashboards.home",
      path: path(ROOT_DASHBOARDS, "/home"),
      type: NAV_TYPE_ITEM,
      title: "Home",
      transKey: "nav.dashboards.home",
      Icon: HomeIcon,
    },
    {
      id: "dashboards.products",
      path: path(ROOT_DASHBOARDS, "/products"),
      type: NAV_TYPE_COLLAPSE,
      title: "Products",
      Icon: CubeIcon,
      childs: [
        {
          id: "dashboards.products.list",
          path: path(ROOT_DASHBOARDS, "/products/list"),
          type: NAV_TYPE_ITEM,
          title: "Product List",
        },
        // {
        //   id: "dashboards.products.add",
        //   path: path(ROOT_DASHBOARDS, "/products/add"),
        //   type: NAV_TYPE_ITEM,
        //   title: "Add Product",
        // },
        // {
        //   id: "dashboards.products.bulkedit",
        //   path: path(ROOT_DASHBOARDS, "/products/bulkedit"),
        //   type: NAV_TYPE_ITEM,
        //   title: "Edit bulk",
        // },
        {
          id: "dashboards.products.bulk",
          path: path(ROOT_DASHBOARDS, "/products/bulkadd"),
          type: NAV_TYPE_ITEM,
          title: "Add Bulk Product",
        },
      ],
    },
    {
      id: "dashboards.services",
      path: path(ROOT_DASHBOARDS, "/services"),
      type: NAV_TYPE_COLLAPSE,
      title: "Services",
      Icon: WrenchScrewdriverIcon,
      childs: [
        {
          id: "dashboards.services.list",
          path: path(ROOT_DASHBOARDS, "/services/list"),
          type: NAV_TYPE_ITEM,
          title: "Service List",
        },
        // {
        //   id: "dashboards.services.add",
        //   path: path(ROOT_DASHBOARDS, "/services/add"),
        //   type: NAV_TYPE_ITEM,
        //   title: "Add Service",
        // },
      ],
    },
    {
      id: "dashboards.subscription",
      path: path(ROOT_DASHBOARDS, "/subscription"),
      type: NAV_TYPE_COLLAPSE,
      title: "Subscription",
      Icon: ClipboardDocumentCheckIcon,
      childs: [
        {
          id: "dashboards.subscription.MyPlanDetails",
          path: path(ROOT_DASHBOARDS, "/subscription/MyPlanDetails"),
          type: NAV_TYPE_ITEM,
          title: "My Plan Details",
        },
        {
          id: "dashboards.subscription.MyPlanFeatures",
          path: path(ROOT_DASHBOARDS, "/subscription/MyPlanFeatures"),
          type: NAV_TYPE_ITEM,
          title: "My Plan Features",
        },
        // {
        //   id: "dashboards.subscription.ChangePlan",
        //   path: path(ROOT_DASHBOARDS, "/subscription/ChangePlan"),
        //   type: NAV_TYPE_ITEM,
        //   title: "Change Plan",
        // },
      ],
    },
    {
      id: "dashboards.PrivacyPolicy",
      path: path(ROOT_DASHBOARDS, "/PrivacyPolicy"),
      type: NAV_TYPE_ITEM,
      title: "Privacy Policy",
      Icon: HomeIcon,
    },
    {
      id: "dashboards.TermsConditionsPage",
      path: path(ROOT_DASHBOARDS, "/TermsConditionsPage"),
      type: NAV_TYPE_ITEM,
      title: "Terms Conditions",
      Icon: HomeIcon,
    },
    {
      id: "dashboards. Support",
      path: path(ROOT_DASHBOARDS, "/Support"),
      type: NAV_TYPE_ITEM,
      title: "Support",
      Icon: HomeIcon,
    },
    {
      id: "dashboards.FAQ",
      path: path(ROOT_DASHBOARDS, "/FAQ"),
      type: NAV_TYPE_ITEM,
      title: "FAQ",
      Icon: HomeIcon,
    },
  ],
};
