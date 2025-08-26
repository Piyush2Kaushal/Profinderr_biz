import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Page } from "components/shared/Page";
import { Card, Button, Upload } from "components/ui";
import { HiPencil } from "react-icons/hi";
import { register } from "swiper/element/bundle";
import invariant from "tiny-invariant";
import { useThemeContext } from "app/contexts/theme/context";
import { useLocaleContext } from "app/contexts/locale/context";
import { useIsomorphicEffect } from "hooks";
import {
  getDashboardAnalytics,
  getProducts,
  getMyProductCategoriesDashboard,
  getDealProducts,
  getMyServiceCategoriesDashboard,
  getServiceDeals,
  getServiceList,
} from "utils/API/Authapi";
import { useSelector } from "react-redux";
import { selectSubscription } from "app/store/features/authSlice";
import { selectCurrentUser } from "app/store/features/authSlice";
register();

const Dashboard = () => {
  const navigate = useNavigate();
  const [analytics, setAnalytics] = useState(null);
  const [loadingAnalytics, setLoadingAnalytics] = useState(true);
  const [products, setProducts] = useState([]);
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [bannerImages, setBannerImages] = useState([]);
  const user = useSelector(selectCurrentUser);
  const [dealProducts, setDealProducts] = useState([]);
  const [loadingDealProducts, setLoadingDealProducts] = useState(true);
  const [productCategories, setProductCategories] = useState([]);
  const [loadingProductCategories, setLoadingProductCategories] =
    useState(true);
  const [serviceCategories, setServiceCategories] = useState([]);
  const [loadingServiceCategories, setLoadingServiceCategories] =
    useState(true);

  const [dealServices, setDealServices] = useState([]);
  const [loadingDealServices, setLoadingDealServices] = useState(true);
  const [services, setServices] = useState([]);
  const [loadingServices, setLoadingServices] = useState(true);

  const { primaryColorScheme: primary } = useThemeContext();
  const { direction } = useLocaleContext();
  const carouselRef = useRef(null);
  const storeName = user?.companyName || "Your Company";
  const subscription = useSelector(selectSubscription);
  const profileName = user?.accountType || "User";

  useEffect(() => {
    const fetchData = async (
      fetchFn,
      setData,
      setLoading,
      sliceCount,
      filterFn,
    ) => {
      try {
        let data = await fetchFn();
        if (filterFn) {
          data = data.filter(filterFn);
        }

        setData(sliceCount ? data.slice(0, sliceCount) : data);
      } catch (err) {
        console.error(
          `Failed to fetch ${fetchFn.name.replace("get", "").toLowerCase()}:`,
          err,
        );
      } finally {
        setLoading(false);
      }
    };

    fetchData(getDashboardAnalytics, setAnalytics, setLoadingAnalytics);
    fetchData(
      getMyProductCategoriesDashboard,
      setProductCategories,
      setLoadingProductCategories,
      4,
      (category) => category.name !== "All",
    );
    fetchData(getProducts, setProducts, setLoadingProducts, 4);
    fetchData(getDealProducts, setDealProducts, setLoadingDealProducts, 4);
    fetchData(
      getMyServiceCategoriesDashboard,
      setServiceCategories,
      setLoadingServiceCategories,
      4,
      (category) => category.name !== "All",
    );
    fetchData(getServiceDeals, setDealServices, setLoadingDealServices, 4);
    fetchData(getServiceList, setServices, setLoadingServices, 4);
  }, []);

  useEffect(() => {
    if (user?.gallery && Array.isArray(user.gallery)) {
      setBannerImages(
        user.gallery.map((imgUrl, index) => ({
          id: `${index}-${Date.now()}`,
          img: imgUrl,
        })),
      );
    }
  }, [user]);

  useIsomorphicEffect(() => {
    invariant(carouselRef.current, "carouselRef is null");
    const params = {
      pagination: { clickable: true },
      autoplay: {
        delay: 3000,
        disableOnInteraction: false,
      },
      loop: true,
    };
    Object.assign(carouselRef.current, params);
    setTimeout(() => {
      carouselRef.current.initialize();
    });
  }, []);

  const handleBannerUpload = (file) => {
    const newImage = { id: Date.now(), img: URL.createObjectURL(file) };
    setBannerImages((prev) => [...prev, newImage]);
  };

  return (
    <Page title="Dashboard">
      <div className="space-y-6 px-(--margin-x) pb-6">
        <h2 className="dark:text-dark-50 flex items-center justify-between pt-4 text-2xl font-semibold text-gray-800">
          <div className="dark:text-dark-50 flex flex-wrap items-center gap-2 text-2xl font-semibold text-gray-800">
            <span>WELCOME</span>
            <span style={{ color: primary[600] }}>{storeName}</span>
            <span>BUSINESS</span>

            {profileName && (
              <span className="text-primary-600 ml-0 rounded-md border border-green-200 bg-green-100 px-3 py-0.5 text-sm whitespace-nowrap sm:ml-4">
                {profileName === "Both"
                  ? "Trade & Service Provider"
                  : profileName}
              </span>
            )}
          </div>

          {/* Subscription status */}
          {subscription && subscription.planId ? (
            <div className="flex items-center gap-1 rounded-md border border-green-200 bg-green-100 px-3 py-1 text-sm text-green-700">
              <span className="font-medium">{subscription.planId.name}</span>
              <span className="rounded-full bg-green-600 px-2 py-0.5 text-xs text-white">
                {subscription.status}
              </span>
            </div>
          ) : (
            <div className="rounded-md bg-red-600 px-3 py-1 text-xs font-medium text-white">
              Subscription not active
            </div>
          )}
        </h2>

        {/* Banner Carousel */}
        <div className="dark:border-dark-300 relative overflow-hidden rounded-xl border border-gray-300">
          <swiper-container
            ref={carouselRef}
            init="false"
            slides-per-view="1"
            dir={direction}
            space-between="16"
            style={{
              "--swiper-theme-color": primary[400],
              "--swiper-pagination-color": primary[600],
            }}
          >
            {bannerImages.map(({ img, id }) => (
              <swiper-slide key={id}>
                <img
                  src={img}
                  alt="Banner"
                  className="h-56 w-full bg-black object-contain"
                />
              </swiper-slide>
            ))}
          </swiper-container>

          {/* Edit Button */}
          <div className="absolute right-2 bottom-2 z-10">
            <Upload
              name="banner"
              onChange={handleBannerUpload}
              accept="image/*"
            >
              {({ ...props }) => (
                <Button
                  {...props}
                  isIcon
                  onClick={() => navigate("/settings/general")}
                  className="size-8 rounded-full text-white hover:opacity-90"
                  style={{ backgroundColor: primary[600] }}
                >
                  <HiPencil className="size-4" />
                </Button>
              )}
            </Upload>
          </div>
        </div>

        {/* Insights Section */}
        <h4 className="mt-2 mb-0 pb-0 text-lg font-medium">Insights</h4>
        <div className="flex gap-4 overflow-x-auto pb-2">
          {loadingAnalytics ? (
            <p>Loading...</p>
          ) : (
            analytics && (
              <>
                {/* --- PRODUCTS --- */}
                {Object.entries(analytics.products).map(([key, value], idx) => (
                  <Card
                    key={`product-${key}`}
                    className={`relative flex w-50 flex-shrink-0 cursor-pointer flex-col overflow-hidden rounded-lg bg-linear-to-br text-center ${
                      [
                        "from-indigo-500 to-indigo-600",
                        "from-pink-500 to-rose-500",
                        "from-amber-400 to-orange-600",
                      ][idx % 3]
                    } p-4 shadow-md transition hover:shadow-lg`}
                  >
                    <p className="text-2xl font-semibold text-white">{value}</p>
                    <p className="text-sm text-white/80 uppercase">
                      {key === "total"
                        ? "Total Products"
                        : key === "views"
                          ? "Views on Products"
                          : key === "wishlists"
                            ? "Products in Wishlist"
                            : key}
                    </p>
                    <p className="mt-1 text-xs text-white/90">
                      {analytics.period}
                    </p>
                  </Card>
                ))}
                {/* --- SERVICES --- */}
                {Object.entries(analytics.services).map(([key, value], idx) => (
                  <Card
                    key={`service-${key}`}
                    className={`relative flex w-50 flex-shrink-0 cursor-pointer flex-col overflow-hidden rounded-lg bg-linear-to-br text-center ${
                      [
                        "from-pink-500 to-rose-500",
                        "from-info to-info-darker",
                        "from-amber-400 to-orange-600",
                      ][idx % 3]
                    } p-4 shadow-md transition hover:shadow-lg`}
                  >
                    <p className="text-2xl font-semibold text-white">{value}</p>
                    <p className="text-sm text-white/80 uppercase">
                      {key === "total"
                        ? "Total Services"
                        : key === "views"
                          ? "Views on Services"
                          : key === "wishlists"
                            ? "Services in Wishlist"
                            : key}
                    </p>
                    <p className="mt-1 text-xs text-white/90">
                      {analytics.period}
                    </p>
                  </Card>
                ))}
              </>
            )
          )}
        </div>

        {/* My Product Categories */}
        {!loadingProductCategories && productCategories.length > 0 && (
          <Card className="space-y-4 p-4">
            <div className="flex items-center justify-between">
              <h4 className="text-lg font-medium">My Product Categories</h4>
            </div>

            
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
              {loadingProductCategories ? (
                <p>Loading...</p>
              ) : (
                productCategories.map((cat, index) => {
                 
                  const colors = [
                    { card: "bg-yellow-200", circle: "border-yellow-900" },
                    { card: "bg-blue-200", circle: "border-blue-900" },
                    { card: "bg-green-200", circle: "border-green-900" },
                    { card: "bg-pink-200", circle: "border-pink-900" },
                  ];
                  const { card, circle } = colors[index % colors.length];

                  return (
                    <Card
                      key={cat._id}
                      className={`flex cursor-pointer flex-col items-center justify-center p-4 transition hover:shadow-lg ${card}`}
                      onClick={() =>
                        navigate(`/dashboards/products/list?catId=${cat._id}`)
                      }
                    >
                      <div
                        className={`mb-3 flex h-20 w-20 items-center justify-center overflow-hidden rounded-full border ${circle}`}
                      >
                        <img
                          src={cat.imageUrl || "/images/200x200.png"}
                          alt={cat.name}
                          className="h-full w-full rounded-full object-cover"
                        />
                      </div>
                      <h5 className="text-center text-sm font-medium text-black">
                        {cat.name}
                      </h5>
                    </Card>
                  );
                })
              )}
            </div>
          </Card>
        )}

        {!loadingServiceCategories && serviceCategories.length > 0 && (
          <Card className="space-y-4 p-4">
            <div className="flex items-center justify-between">
              <h4 className="text-lg font-medium">My Service Categories</h4>
            </div>

            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
              {loadingServiceCategories ? (
                <p>Loading...</p>
              ) : (
                serviceCategories.map((cat, index) => {
                  const colors = [
                    { card: "bg-yellow-200", circle: "border-yellow-900" },
                    { card: "bg-blue-200", circle: "border-blue-900" },
                    { card: "bg-green-200", circle: "border-green-900" },
                    { card: "bg-pink-200", circle: "border-pink-900" },
                  ];
                  const { card, circle } = colors[index % colors.length];

                  return (
                    <Card
                      key={cat._id}
                      className={`flex cursor-pointer flex-col items-center justify-center p-4 transition hover:shadow-lg ${card}`}
                      onClick={() =>
                        navigate(`/dashboards/services/list?catid=${cat._id}`)
                      }
                    >
                      <div
                        className={`mb-3 flex h-20 w-20 items-center justify-center overflow-hidden rounded-full border ${circle}`}
                      >
                        <img
                          src={cat.imageUrl || "/images/200x200.png"}
                          alt={cat.name}
                          className="h-full w-full rounded-full object-cover"
                        />
                      </div>
                      <h5 className="text-center text-sm font-medium text-black">
                        {cat.name}
                      </h5>
                    </Card>
                  );
                })
              )}
            </div>
          </Card>
        )}

        {/* My Products Section */}
        {!loadingProducts && products.length > 0 && (
          <Card className="space-y-4 p-4">
            <div className="flex items-center justify-between">
              <h4 className="text-lg font-medium">My Products</h4>
              <Button
                variant="text"
                onClick={() => navigate("/dashboards/products/list")}
                size="sm"
              >
                View All
              </Button>
            </div>

            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
              {loadingProducts ? (
                <p>Loading...</p>
              ) : (
                products.map((p) => (
                  <div
                    key={p._id}
                    className="relative cursor-pointer overflow-hidden rounded-lg border"
                  >
                    <img
                      src={p.imageUrl || "/images/200x200.png"}
                      alt={p.productName}
                      className="h-40 w-full bg-gray-100 object-contain"
                    />
                    <div className="p-2">
                      <h5 className="text-sm font-medium">{p.productName}</h5>
                      <p className="mt-1 text-xs text-green-600">
                        {p.availability}
                      </p>
                    </div>
                    <div
                      style={{ backgroundColor: primary[600] }}
                      className="absolute top-2 right-2 rounded px-2 py-0.5 text-xs text-white"
                    >
                      £{p.price}
                    </div>
                  </div>
                ))
              )}
            </div>
          </Card>
        )}
        {/* My Services Section */}
        {!loadingServices && services.length > 0 && (
          <Card className="space-y-4 p-4">
            <div className="flex items-center justify-between">
              <h4 className="text-lg font-medium">My Services</h4>
              <Button
                variant="text"
                onClick={() => navigate("/dashboards/services/list")}
                size="sm"
              >
                View All
              </Button>
            </div>

            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
              {loadingServices ? (
                <p>Loading...</p>
              ) : (
                services.map((s) => (
                  <div
                    key={s._id}
                    className="relative cursor-pointer overflow-hidden rounded-lg border"
                  >
                    <img
                      src={s.image || "/images/200x200.png"}
                      alt={s.serviceName}
                      className="h-40 w-full bg-gray-100 object-contain"
                    />
                    <div className="p-2">
                      <h5 className="text-sm font-medium">{s.serviceName}</h5>
                      <p className="mt-1 text-xs text-green-600">
                        Availability: {s.availability}
                      </p>
                      <p className="mt-1 text-xs text-gray-500">
                        {s.serviceTime}
                      </p>
                    </div>
                    <div
                      style={{ backgroundColor: primary[600] }}
                      className="absolute top-2 right-2 rounded px-2 py-0.5 text-xs text-white"
                    >
                      £{s.servicePrice}
                    </div>
                  </div>
                ))
              )}
            </div>
          </Card>
        )}

        {!loadingDealProducts && dealProducts.length > 0 && (
          <Card className="space-y-4 p-4">
            <div className="flex items-center justify-between">
              <h4 className="text-lg font-medium">Product Deals</h4>
              <Button
                variant="text"
                // onClick={() => navigate("/dashboards/products/deals")}
                size="sm"
              >
                View All
              </Button>
            </div>

            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
              {dealProducts.map((p) => (
                <div
                  key={p._id}
                  className="relative cursor-pointer overflow-hidden rounded-lg border"
                >
                  <img
                    src={p.imageUrl || "/images/200x200.png"}
                    alt={p.productName}
                    className="h-40 w-full bg-gray-100 object-contain"
                  />
                  <div className="p-2">
                    <h5 className="text-sm font-medium">{p.productName}</h5>
                    <p className="mt-1 text-xs text-green-600">
                      {p.availability}
                    </p>
                    <p>
                      <span className="mt-1 text-xs text-red-600">
                        Expire on:{" "}
                      </span>
                      {new Date(p.deal.end).toLocaleString("en-IN", {
                        dateStyle: "medium",
                        timeStyle: "short",
                      })}
                    </p>
                  </div>
                  <div className="absolute top-2 right-2 flex flex-col items-end space-y-1">
                    <span className="rounded bg-red-500 px-2 py-0.5 text-xs text-white line-through">
                      £{p.price}
                    </span>
                    <span
                      style={{ backgroundColor: primary[600] }}
                      className="rounded px-2 py-0.5 text-xs text-white"
                    >
                      £{p.deal?.offerPrice}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        )}

        {!loadingDealServices && dealServices.length > 0 && (
          <Card className="space-y-4 p-4">
            <div className="flex items-center justify-between">
              <h4 className="text-lg font-medium">Service Deals</h4>
              <Button
                variant="text"
                // onClick={() => navigate("/dashboards/services/deals")}
                size="sm"
              >
                View All
              </Button>
            </div>

            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
              {dealServices.map((s) => (
                <div
                  key={s._id}
                  className="relative cursor-pointer overflow-hidden rounded-lg border"
                >
                  <img
                    src={s.image || "/images/200x200.png"}
                    alt={s.serviceName}
                    className="h-40 w-full bg-gray-100 object-contain"
                  />
                  <div className="p-2">
                    <h5 className="text-sm font-medium">{s.serviceName}</h5>
                    <p className="mt-1 text-xs text-green-600">
                      Availability: {s.availability}
                    </p>
                    <p>
                      <span className="mt-1 text-xs text-red-600">
                        Expire on:{" "}
                      </span>
                      {new Date(s.deal.end).toLocaleString("en-IN", {
                        dateStyle: "medium",
                        timeStyle: "short",
                      })}
                    </p>
                  </div>
                  <div className="absolute top-2 right-2 flex flex-col items-end space-y-1">
                    <span className="rounded bg-red-500 px-2 py-0.5 text-xs text-white line-through">
                      £{s.servicePrice}
                    </span>
                    <span
                      style={{ backgroundColor: primary[600] }}
                      className="rounded px-2 py-0.5 text-xs text-white"
                    >
                      £{s.deal?.offerPrice}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        )}
      </div>
    </Page>
  );
};

export default Dashboard;
