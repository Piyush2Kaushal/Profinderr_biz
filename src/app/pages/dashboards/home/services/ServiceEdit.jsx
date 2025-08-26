import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Page } from "components/shared/Page";
import { Card, Button, Input, Upload } from "components/ui";
import { HiPencil } from "react-icons/hi";
import { XMarkIcon } from "@heroicons/react/20/solid";
import {
  getSingleService,
  editService,
  getMyServiceCategories,
} from "utils/API/Authapi";
import { uploadImage, deleteImage } from "utils/API/Authapi";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ReactQuill from "react-quill-new";
import "react-quill-new/dist/quill.snow.css";

const ServiceEdit = () => {
  const { id } = useParams();
  const [service, setService] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState("");
  const [oldImageUrl, setOldImageUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const data = await getSingleService(id);
      const srv = Array.isArray(data) ? data[0] : data;

      setService({
        image: srv.image || "/images/200x200.png",
        serviceName: srv.serviceName || "",
        description: srv.description || "",
        product: srv.product || "",
        brandOrManufacturer: srv.brandOrManufacturer || "",
        category: srv.category || "",
        categoryId: srv.categoryId || null,
        availability: srv.availability || "Yes",
        serviceTime: srv.serviceTime || "",
        servicePrice: srv.servicePrice || 0,
        status: srv.status || "active",
        deal: srv.deal || null,
        hasActiveDeal: srv.hasActiveDeal || false,
        currentPrice: srv.currentPrice || srv.servicePrice,
        gallery: srv.gallery || [],
      });

      setImagePreview(srv.image || "/images/200x200.png");
      setOldImageUrl(srv.image || "");
    } catch (err) {
      toast.error(err.message || "Failed to load service");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [id]);
  const fetchCategories = async () => {
    try {
      const data = await getMyServiceCategories();
      setCategories(data || []);
    } catch (err) {
      toast.error(err.message || "Failed to load categories");
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleInputChange = (field, value) => {
    setService((prev) => ({ ...prev, [field]: value }));
  };

  const handleImageUpload = (file) => {
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };
  const handleGalleryUpload = async (file) => {
    if (!file) return;
    try {
      setUploading(true);

      const { newImage } = await uploadImage(file);

      const updatedGallery = [...(service.gallery || []), newImage];

      await editService(id, { ...service, gallery: updatedGallery });

      setService((prev) => ({
        ...prev,
        gallery: updatedGallery,
      }));

      toast.success("Image added to gallery successfully!");
    } catch (err) {
      toast.error(err.message || "Failed to upload gallery image");
    } finally {
      setUploading(false);
    }
  };
  const handleGalleryDelete = async (imgUrl) => {
    try {
      setUploading(true);

      await deleteImage(imgUrl);
      const updatedGallery = service.gallery.filter((img) => img !== imgUrl);
      await editService(id, { ...service, gallery: updatedGallery });
      setService((prev) => ({
        ...prev,
        gallery: updatedGallery,
      }));

      toast.success("Image deleted successfully!");
    } catch (err) {
      toast.error(err.message || "Failed to delete image");
    } finally {
      setUploading(false);
    }
  };
  const handleMainImageDelete = async () => {
    if (!service.image) return;
    try {
      setUploading(true);

      await deleteImage(service.image);

      await editService(id, { ...service, image: "" });

      setService((prev) => ({
        ...prev,
        image: "",
      }));
      setImagePreview("/images/200x200.png");

      toast.success("Main image deleted successfully!");
    } catch (err) {
      toast.error(err.message || "Failed to delete main image");
    } finally {
      setUploading(false);
    }
  };

  const handleSave = async () => {
    try {
      setUploading(true);

      let finalImageUrl = service.image;

      if (imageFile) {
        const { newImage } = await uploadImage(imageFile);
        finalImageUrl = newImage;
      }

      const payload = {
        serviceName: service.serviceName,
        description: service.description,
        product: service.product,
        brandOrManufacturer: service.brandOrManufacturer,
        category: service.category,
        categoryId: service.categoryId,
        availability: service.availability,
        serviceTime: service.serviceTime,
        servicePrice: Number(service.servicePrice),
        image: finalImageUrl,
        gallery: service.gallery || [],
        status: service.status,
      };

      if (service.deal) {
        payload.deal = {
          start: service.deal.start,
          end: service.deal.end,
          offerPrice: Number(service.deal.offerPrice),
        };
      }

      console.log("Final payload being sent:", payload);

      await editService(id, payload);

      if (imageFile && oldImageUrl && oldImageUrl !== finalImageUrl) {
        try {
          await deleteImage(oldImageUrl);
          console.log("Old image deleted:", oldImageUrl);
        } catch (err) {
          console.warn("Failed to delete old image:", err.message);
        }
      }
      toast.success("Service updated successfully");
      fetchData();
      setImageFile(null);
    } catch (err) {
      toast.error(err.message || "Failed to update service");
    } finally {
      setUploading(false);
    }
  };

  if (loading) return <div className="p-6">Loading...</div>;
  if (!service) return <div className="p-6">No service found</div>;

  return (
    <Page title="Edit Service">
      <ToastContainer position="top-right" autoClose={3000} />
      <div className="transition-content px-(--margin-x) pb-6">
        <div className="flex flex-col items-center justify-between space-y-4 py-5 sm:flex-row sm:space-y-0 lg:py-6">
          <h2 className="dark:text-dark-50 text-xl font-medium text-gray-700">
            Edit Service
          </h2>
        </div>

        <Card className="space-y-6 p-6">
          {/* Image Upload */}
          <div className="flex flex-col items-center">
            <div className="dark:border-dark-300 relative h-64 w-64 overflow-hidden rounded-lg border border-dashed border-gray-300">
              <img
                src={imagePreview}
                alt="Service"
                className="h-full w-full object-cover"
              />
              <Upload
                name="serviceImage"
                onChange={handleImageUpload}
                accept="image/*"
              >
                {({ ...props }) => (
                  <Button
                    {...props}
                    isIcon
                    disabled={uploading}
                    className="absolute right-2 bottom-2 size-8 rounded-full bg-orange-500 text-white hover:bg-orange-600"
                  >
                    {uploading ? (
                      <div className="loader border-white"></div>
                    ) : (
                      <HiPencil className="size-4" />
                    )}
                  </Button>
                )}
              </Upload>
              {service.image && (
                <button
                  onClick={handleMainImageDelete}
                  disabled={uploading}
                  className="absolute top-2 right-2 rounded-full bg-red-500 p-1 text-white shadow hover:bg-red-600"
                >
                  <XMarkIcon className="h-4 w-4" />
                </button>
              )}
            </div>
          </div>

          {/* Service Basic Info */}
          <div className="space-y-4">
            <h4 className="text-lg font-medium">Service Basic Info</h4>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <Input
                label="Service Name"
                value={service.serviceName}
                onChange={(e) =>
                  handleInputChange("serviceName", e.target.value)
                }
              />
              <Input
                label="Service Code"
                value={service.product}
                onChange={(e) => handleInputChange("product", e.target.value)}
              />
              <Input
                label="Service Price"
                type="number"
                value={service.servicePrice}
                onChange={(e) =>
                  handleInputChange("servicePrice", e.target.value)
                }
              />
              <Input
                label="Brand / Manufacturer"
                value={service.brandOrManufacturer}
                onChange={(e) =>
                  handleInputChange("brandOrManufacturer", e.target.value)
                }
              />
              <Input
                label="Service Time"
                value={service.serviceTime}
                onChange={(e) =>
                  handleInputChange("serviceTime", e.target.value)
                }
              />
              <div className="flex flex-col gap-1.5">
                <label className="dark:text-dark-100 text-sm font-medium text-gray-800">
                  Availability
                </label>
                <select
                  value={service.availability}
                  onChange={(e) =>
                    handleInputChange("availability", e.target.value)
                  }
                  className="dark:border-dark-300 dark:bg-dark-700 dark:text-dark-50 rounded-xl border border-gray-300 bg-white px-3 py-2 text-sm text-gray-800"
                >
                  <option value="Yes">Yes</option>
                  <option value="No">No</option>
                </select>
              </div>
            </div>
          </div>
          {/* Category Dropdown */}
          <div className="flex flex-col gap-1.5">
            <label className="dark:text-dark-100 text-sm font-medium text-gray-800">
              Category
            </label>
            <select
              value={service.categoryId || ""}
              onChange={(e) => {
                const selectedId = e.target.value;
                const selectedCategory = categories.find(
                  (c) => c._id === selectedId,
                );
                handleInputChange("categoryId", selectedId);
                handleInputChange("category", selectedCategory?.name || "");
              }}
              className="dark:border-dark-300 dark:bg-dark-700 dark:text-dark-50 rounded-xl border border-gray-300 bg-white px-3 py-2 text-sm text-gray-800"
            >
              <option value="">-- Select Category --</option>
              {categories.map((cat) => (
                <option key={cat._id} value={cat._id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>

          {/* {service.gallery?.length > 0 && (
            <Card className="relative mt-6 p-6">
              <h4 className="mb-3 text-lg font-medium">Gallery</h4>
              <div className="flex gap-4 overflow-x-auto pb-2">
                {service.gallery.map((img, idx) => (
                  <div key={idx} className="relative">
                    <img
                      src={img}
                      alt={`gallery-${idx}`}
                      className="h-40 w-40 flex-shrink-0 rounded-lg border object-cover"
                    />
                    <button
                      onClick={() => handleGalleryDelete(img)}
                      disabled={uploading}
                      className="absolute top-1 right-1 rounded-full bg-red-500 p-1 text-white shadow hover:bg-red-600"
                    >
                      <XMarkIcon className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>

              {service.gallery?.length < 5 && (
                <Upload
                  name="galleryImage"
                  onChange={handleGalleryUpload}
                  accept="image/*"
                >
                  {({ ...props }) => (
                    <Button
                      {...props}
                      isIcon
                      disabled={uploading}
                      className="absolute right-4 bottom-4 size-10 rounded-full bg-orange-500 text-white shadow-lg hover:bg-orange-600"
                    >
                      {uploading ? (
                        <div className="loader border-white"></div>
                      ) : (
                        <HiPencil className="size-5" />
                      )}
                    </Button>
                  )}
                </Upload>
              )}
            </Card>
          )} */}

          <Card className="relative mt-6 p-6">
            <h4 className="mb-3 text-lg font-medium">Gallery</h4>

            {service.gallery?.length > 0 ? (
              <div className="flex gap-4 overflow-x-auto pb-2">
                {service.gallery.map((img, idx) => (
                  <div key={idx} className="relative">
                    <img
                      src={img}
                      alt={`gallery-${idx}`}
                      className="h-40 w-40 flex-shrink-0 rounded-lg border object-cover"
                    />
                    <button
                      onClick={() => handleGalleryDelete(img)}
                      disabled={uploading}
                      className="absolute top-1 right-1 rounded-full bg-red-500 p-1 text-white shadow hover:bg-red-600"
                    >
                      <XMarkIcon className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <p className="mb-3 text-sm text-gray-500">
                No images in gallery yet
              </p>
            )}

            {(!service.gallery || service.gallery.length < 5) && (
              <Upload
                name="galleryImage"
                onChange={handleGalleryUpload}
                accept="image/*"
              >
                {({ ...props }) => (
                  <Button
                    {...props}
                    isIcon
                    disabled={uploading}
                    className="absolute right-4 bottom-4 size-10 rounded-full bg-orange-500 text-white shadow-lg hover:bg-orange-600"
                  >
                    {uploading ? (
                      <div className="loader border-white"></div>
                    ) : (
                      <HiPencil className="size-5" />
                    )}
                  </Button>
                )}
              </Upload>
            )}
          </Card>

          {/* Description */}
          <div>
            <h4 className="mb-3 text-lg font-medium">Service Description</h4>
            <ReactQuill
              theme="snow"
              value={service.description || ""}
              onChange={(value) => handleInputChange("description", value)}
              modules={{
                toolbar: [
                  [{ header: [1, 2, false] }],
                  ["bold", "italic", "underline", "strike"],
                  [{ list: "ordered" }, { list: "bullet" }],
                  ["link", "image"],
                  ["clean"],
                ],
              }}
            />
          </div>

          {/* Deal Info if available */}
          {service.deal && (
            <div className="space-y-4">
              <h4 className="text-lg font-medium">Active Deal</h4>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                <Input
                  label="Offer Price"
                  type="number"
                  value={service.deal.offerPrice}
                  onChange={(e) =>
                    handleInputChange("deal", {
                      ...service.deal,
                      offerPrice: e.target.value,
                    })
                  }
                />
                <Input
                  label="Start Date"
                  type="datetime-local"
                  value={service.deal.start?.slice(0, 16) || ""}
                  onChange={(e) =>
                    handleInputChange("deal", {
                      ...service.deal,
                      start: e.target.value,
                    })
                  }
                />
                <Input
                  label="End Date"
                  type="datetime-local"
                  value={service.deal.end?.slice(0, 16) || ""}
                  onChange={(e) =>
                    handleInputChange("deal", {
                      ...service.deal,
                      end: e.target.value,
                    })
                  }
                />
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex flex-wrap gap-3 pt-4">
            <Button
              variant="outlined"
              className="min-w-[8rem]"
              onClick={() => navigate(-1)}
            >
              Cancel
            </Button>
            <Button
              color="primary"
              className="min-w-[8rem]"
              onClick={handleSave}
              disabled={uploading}
            >
              {uploading
                ? imageFile
                  ? "Uploading Image..."
                  : "Saving..."
                : "Save Changes"}
            </Button>
          </div>
        </Card>
      </div>
    </Page>
  );
};

export default ServiceEdit;
