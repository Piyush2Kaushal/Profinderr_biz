import { XMarkIcon } from "@heroicons/react/20/solid";
import { useState, useEffect } from "react";
import { HiPencil } from "react-icons/hi";
import { useSelector } from "react-redux";
import { UpdateBusiness } from "utils/API/Authapi";
import { useNavigate } from "react-router-dom";

import { PreviewImg } from "components/shared/PreviewImg";
import { Avatar, Button, Input, Upload } from "components/ui";
import { selectCurrentUser } from "app/store/features/authSlice";
import { toast } from "react-toastify";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { uploadImage, deleteImage } from "utils/API/Authapi";
import { object } from "prop-types";

export default function General() {
  const navigate = useNavigate();
  const user = useSelector(selectCurrentUser);
  const primaryAddress = user?.address?.[0];
  const [avatar, setAvatar] = useState(null);
  const [banner, setBanner] = useState(null);
  const [logo, setLogo] = useState(null);
  const [accountType, setAccountType] = useState(
    user?.accountType || "Service Provider",
  );
  const [pendingType, setPendingType] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [selectedBanner, setSelectedBanner] = useState(null);
  const [gallery, setGallery] = useState(user?.gallery || []);
  const [profileImage, setProfileImage] = useState(user?.profileImage || null);
  const [saving, setSaving] = useState(false);

  const sharedImage =
    avatar ||
    banner ||
    profileImage ||
    selectedBanner ||
    user?.gallery?.[0] ||
    "/images/200x200.png";

  useEffect(() => {
    if (user) {
      setFormData({
        ...formData,
        companyName: user.companyName || "",
        companyNumber: user.companyNumber || "",
        vatNumber: user.vatNumber || "",
        contactPersonName: user.contactPersonName || "",
        postCode: user.postCode || "",
        address: [
          {
            address: user?.address?.[0]?.address || "",
            addressLine1: user?.address?.[0]?.addressLine1 || "",
            addressLine2: user?.address?.[0]?.addressLine2 || "",
            postCode: user?.address?.[0]?.postCode || "",
            city: user?.address?.[0]?.city || "",
            lat: user?.address?.[0]?.lat || "",
            long: user?.address?.[0]?.long || "",
            postcodeLat: user?.address?.[0]?.postcodeLat || "",
            postcodeLong: user?.address?.[0]?.postcodeLong || "",
            postcodeAddress: user?.address?.[0]?.postcodeAddress || "",
          },
        ],
      });
    }
    if (user?.gallery) {
      setGallery(user.gallery);
    }
    if (user?.logo) {
      setLogo(user.logo);
    }
    setProfileImage(user?.profileImage || null);
  }, [user]);

  const [formData, setFormData] = useState({
    companyName: user?.companyName || "",
    companyNumber: user?.companyNumber || "",
    vatNumber: user?.vatNumber || "",
    contactPersonName: user?.contactPersonName || "",
    postCode: user?.postCode || "",
    address: [
      {
        address: user?.address?.[0]?.address || "",
        addressLine1: user?.address?.[0]?.addressLine1 || "",
        addressLine2: user?.address?.[0]?.addressLine2 || "",
        postCode: user?.address?.[0]?.postCode || "",
        city: user?.address?.[0]?.city || "",
        lat: user?.address?.[0]?.lat || "",
        long: user?.address?.[0]?.long || "",
        postcodeLat: user?.address?.[0]?.postcodeLat || "",
        postcodeLong: user?.address?.[0]?.postcodeLong || "",
        postcodeAddress: user?.address?.[0]?.postcodeAddress || "",
      },
    ],
  });

  const handleChange = (key, value, nested = false) => {
    if (nested) {
      setFormData((prev) => ({
        ...prev,
        address: [{ ...prev.address[0], [key]: value }],
      }));
    } else {
      setFormData((prev) => ({ ...prev, [key]: value }));
    }
  };
  const handleBannerUpload = async (file) => {
    try {
      const res = await uploadImage(file);

      const updatedGallery = [...gallery, res.newImage];
      setGallery(updatedGallery);

      const payload = {
        ...formData,
        gallery: updatedGallery,
      };

      await UpdateBusiness(payload);
      toast.success("Banner uploaded & gallery updated");
    } catch (err) {
      toast.error("Upload failed: " + err.message);
    }
  };
  const handleSelectBanner = async (img) => {
    try {
      setSelectedBanner(img);
      setProfileImage(img);

      const payload = {
        ...formData,
        gallery,
        profileImage: img,
      };

      await UpdateBusiness(payload);
      toast.success("Banner image updated");
    } catch (err) {
      toast.error("Failed: " + err.message);
    }
  };

  return (
    <div className="flex justify-center px-4">
      <div className="w-full max-w-3xl 2xl:max-w-5xl">
        <h5 className="dark:text-dark-50 text-lg font-medium text-gray-800">
          Edit Profile
        </h5>
        <p className="dark:text-dark-200 mt-0.5 text-sm text-balance text-gray-500">
          Update your account settings.
        </p>
        <div className="dark:bg-dark-500 my-5 h-px bg-gray-200" />

        {/* -------------------- Banner Image -------------------- */}
        <div className="mt-4 flex flex-col space-y-1.5">
          <span className="dark:text-dark-100 text-base font-medium text-gray-800">
            Banner Image
          </span>
          <div className="flex flex-wrap gap-3">
            {gallery.map((img, index) => (
              <div
                key={index}
                className={`relative inline-block cursor-pointer ring-offset-2 transition ${
                  profileImage === img
                    ? "rounded-xl ring-2 ring-orange-500"
                    : ""
                }`}
                onClick={() => handleSelectBanner(img)}
              >
                <Avatar
                  size={20}
                  imgComponent={PreviewImg}
                  src={img}
                  classNames={{
                    root: "rounded-xl",
                    display: "rounded-xl object-contain",
                  }}
                />
                <button
                  onClick={async (e) => {
                    e.stopPropagation(); // prevent banner select
                    try {
                      await deleteImage(img);

                      // remove from local gallery
                      const updatedGallery = gallery.filter((g) => g !== img);
                      setGallery(updatedGallery);

                      // update backend
                      const payload = {
                        ...formData,
                        gallery: updatedGallery,
                        profileImage,
                        logo,
                      };
                      await UpdateBusiness(payload);

                      toast.success("Image deleted successfully");
                    } catch (err) {
                      toast.error("Delete failed: " + err.message);
                    }
                  }}
                  className="absolute -top-2 -right-2 rounded-full bg-red-500 p-1 text-white hover:bg-red-600"
                >
                  <XMarkIcon className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-8 space-y-2">
          <p className="dark:text-dark-100 text-sm font-medium text-gray-800">
            Upload Banner Image (820x180 PX)
          </p>
          <div className="dark:border-dark-300 relative h-[180px] w-full overflow-hidden rounded-xl border border-dashed border-gray-300">
            {sharedImage ? (
              <img
                src={
                  typeof sharedImage === "string"
                    ? sharedImage
                    : URL.createObjectURL(sharedImage)
                }
                alt="Banner"
                className="h-full w-full object-contain"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center text-sm text-gray-400">
                No banner uploaded
              </div>
            )}
            {gallery.length < 5 && (
              <Upload
                name="banner"
                onChange={(file) => handleBannerUpload(file)}
                accept="image/*"
              >
                {({ ...props }) => (
                  <Button
                    {...props}
                    isIcon
                    className="absolute right-2 bottom-2 size-8 rounded-full bg-orange-500 text-white hover:bg-orange-600"
                  >
                    <HiPencil className="size-4" />
                  </Button>
                )}
              </Upload>
            )}
          </div>
        </div>

        <div className="mt-8 space-y-2">
          <p className="dark:text-dark-100 text-sm font-medium text-gray-800">
            Your Logo
          </p>
          <div className="dark:border-dark-300 relative h-20 w-20 overflow-hidden rounded-xl border border-dashed border-gray-300">
            {logo ? (
              <>
                <img
                  src={
                    typeof logo === "string" ? logo : URL.createObjectURL(logo)
                  }
                  alt="Logo"
                  className="h-full w-full object-contain"
                />
                <button
                  onClick={async () => {
                    try {
                      await deleteImage(logo);
                      setLogo(null);

                      const payload = {
                        ...formData,
                        gallery,
                        profileImage,
                        logo: null,
                      };
                      await UpdateBusiness(payload);

                      toast.success("Logo deleted successfully");
                    } catch (err) {
                      toast.error("Logo delete failed: " + err.message);
                    }
                  }}
                  className="absolute top-1 right-1 rounded-full bg-red-500 p-1 text-white hover:bg-red-600"
                >
                  <XMarkIcon className="h-4 w-4" />
                </button>
              </>
            ) : user?.logo ? (
              <img
                src={user.logo}
                alt="Logo"
                className="h-full w-full object-contain"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center text-sm text-gray-400">
                No logo
              </div>
            )}

            <Upload
              name="logo"
              onChange={async (file) => {
                try {
                  const res = await uploadImage(file);
                  setLogo(res.newImage);
                  const payload = {
                    ...formData,
                    gallery,
                    profileImage,
                    logo: res.newImage,
                  };

                  await UpdateBusiness(payload);
                  toast.success("Logo uploaded successfully");
                } catch (err) {
                  toast.error("Logo upload failed: " + err.message);
                }
              }}
              accept="image/*"
            >
              {({ ...props }) => (
                <Button
                  {...props}
                  isIcon
                  className="absolute right-1 bottom-1 size-6 rounded-full bg-orange-500 text-white hover:bg-orange-600"
                >
                  <HiPencil className="size-3.5" />
                </Button>
              )}
            </Upload>
          </div>
        </div>

        {/* -------------------- Account Type-------------------- */}
        <div className="mt-8 space-y-2">
          <p className="dark:text-dark-100 text-sm font-medium text-gray-800">
            Account Type
          </p>
          <Input
            value={user?.accountType || "N/A"}
            readOnly
            className="rounded-xl"
          />
        </div>

        {/* -------------------- Company Information -------------------- */}
        <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Input
            placeholder="Company Name"
            label="Company Name"
            value={formData.companyName}
            onChange={(e) => handleChange("companyName", e.target.value)}
            className="rounded-xl"
          />
          <Input
            placeholder="Company Number"
            label="Company Number"
            value={formData.companyNumber}
            onChange={(e) => handleChange("companyNumber", e.target.value)}
            className="rounded-xl"
          />
          <Input
            placeholder="123456"
            label="VAT Number"
            value={formData.vatNumber}
            onChange={(e) => handleChange("vatNumber", e.target.value)}
            className="rounded-xl"
            prefix={
              <span className="text-sm font-medium text-gray-500">GB</span>
            }
          />
          <Input
            placeholder="Contact Person"
            label="Contact Person"
            value={formData.contactPersonName}
            onChange={(e) => handleChange("contactPersonName", e.target.value)}
            className="rounded-xl"
          />
          <Input
            placeholder="Email Address"
            label="Email Address"
            value={user?.email || ""}
            readOnly
            className="rounded-xl"
          />
          <div className="flex items-center gap-2">
            <Input
              placeholder="Code"
              label="Code"
              value={user?.country_code || "+44"}
              readOnly
              className="w-20 rounded-xl"
            />
            <Input
              placeholder="Phone Number"
              label="Phone Number"
              value={user?.phone_number || ""}
              readOnly
              className="flex-1 rounded-xl"
            />
          </div>
        </div>

        {/* -------------------- Contact & Location -------------------- */}
        <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Input
            placeholder="Post Code"
            label="Post Code"
            value={formData.postCode}
            onChange={(e) => handleChange("postCode", e.target.value)}
            className="rounded-xl"
          />
          <Input
            placeholder="Address"
            label="Address"
            value={formData.address[0].address}
            onChange={(e) => handleChange("address", e.target.value, true)}
            className="rounded-xl"
          />
          <Input
            placeholder="Address Line 1"
            label="Address Line 1"
            value={formData.address[0].addressLine1}
            onChange={(e) => handleChange("addressLine1", e.target.value, true)}
            className="rounded-xl"
          />
          <Input
            placeholder="Address Line 2 (Optional)"
            label="Address Line 2"
            value={formData.address[0].addressLine2}
            onChange={(e) => handleChange("addressLine2", e.target.value, true)}
            className="rounded-xl"
          />
          <Input
            placeholder="City"
            label="City"
            value={formData.address[0].city}
            onChange={(e) => handleChange("city", e.target.value, true)}
            className="rounded-xl"
          />

          <Input
            placeholder="lat"
            value={formData.address[0].lat}
            onChange={(e) => handleChange("lat", e.target.value, true)}
            className="rounded-xl"
            style={{ display: "none" }}
          />
          <Input
            placeholder="long"
            value={formData.address[0].long}
            onChange={(e) => handleChange("long", e.target.value, true)}
            className="rounded-xl"
            style={{ display: "none" }}
          />
          <Input
            placeholder="postcodeLat"
            value={formData.address[0].postcodeLat}
            onChange={(e) => handleChange("postcodeLat", e.target.value, true)}
            className="rounded-xl"
            style={{ display: "none" }}
          />
          <Input
            placeholder="postcodeLong"
            value={formData.address[0].postcodeLong}
            onChange={(e) => handleChange("postcodeLong", e.target.value, true)}
            className="rounded-xl"
            style={{ display: "none" }}
          />
          <Input
            placeholder="postcodeAddress"
            value={formData.address[0].postcodeAddress}
            onChange={(e) =>
              handleChange("postcodeAddress", e.target.value, true)
            }
            className="rounded-xl"
            style={{ display: "none" }}
          />
        </div>

        {/* <div className="mt-8">
          <Input
            placeholder="Search your location manually"
            label="Your Location"
            className="rounded-xl"
            readOnly
          />
          <Button variant="outline" color="primary" className="mt-3">
            <span className="flex items-center gap-2">
              <svg
                className="h-4 w-4"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 12m-8 0a8 8 0 1 1 16 0 8 8 0 1 1-16 0zm0 0l5 5"
                />
              </svg>
              Use My Location
            </span>
          </Button>
        </div> */}

        {/* -------------------- Existing Buttons -------------------- */}
        <div className="mt-8 flex justify-end space-x-3">
          <Button
            className="min-w-[7rem]"
            onClick={() => navigate("/dashboards/home")}
          >
            Cancel
          </Button>

          <Button
            disabled={saving}
            className="min-w-[7rem]"
            color="primary"
            onClick={async () => {
              try {
                setSaving(true);
                const payload = {
                  ...formData,
                  gallery,
                  profileImage,
                  logo,
                };
                const res = await UpdateBusiness(payload);
                toast.success("Profile updated successfully");
                console.log("API Response:", res);
                setTimeout(() => {
                  window.location.reload();
                }, 100);
              } catch (err) {
                toast.error(
                  "Failed " + (err.response?.data?.message || err.message),
                );
              } finally {
                setSaving(false);
              }
            }}
          >
            {saving ? "Saving..." : "Save"}
          </Button>
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="dark:bg-dark-800 w-full max-w-md rounded-xl bg-white p-6 shadow-lg">
            <h3 className="dark:text-dark-50 mb-2 text-lg font-semibold text-gray-800">
              {accountType === "Trader" && pendingType === "Service Provider"
                ? "Change your Account from Trader to Service Provider"
                : "Change your Account from Service Provider to Trader"}
            </h3>
            <p className="dark:text-dark-200 text-sm text-gray-600">
              {accountType === "Trader" && pendingType === "Service Provider"
                ? "Switching to Service Provider will hide your uploaded products"
                : "Switching to Trader will hide your uploaded services"}
            </p>

            <div className="mt-6 flex justify-end space-x-3">
              <Button onClick={() => setShowModal(false)}>No</Button>
              <Button
                color="primary"
                onClick={() => {
                  setAccountType(pendingType);
                  setShowModal(false);
                }}
              >
                Yes
              </Button>
            </div>
          </div>
        </div>
      )}
      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
}
