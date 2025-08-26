import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Page } from "components/shared/Page";
import { Card, Button, Input, Textarea, Upload } from "components/ui";
import { HiPencil } from "react-icons/hi";
import { useParams } from "react-router-dom";
import { XMarkIcon } from "@heroicons/react/20/solid";

import {
  getSingleProduct,
  editProduct,
  uploadImage,
  deleteImage,
} from "utils/API/Authapi";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ReactQuill from "react-quill-new";
import "react-quill-new/dist/quill.snow.css";
import { getMyProductCategories } from "utils/API/Authapi";

const ProductEdit = () => {
  const { id } = useParams();
  const [categories, setCategories] = useState([]);
  const [product, setProduct] = useState(null);
  const [imagePreview, setImagePreview] = useState("");
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const navigate = useNavigate();
  const [oldImageUrl, setOldImageUrl] = useState("");
  const [saving, setSaving] = useState(false);

  const fetchData = async () => {
    try {
      setLoading(true);
      const data = await getSingleProduct(id);
      setProduct({
        image: data.imageUrl || "/images/200x200.png",
        productName: data.productName || "",
        price: data.price || 0,
        price2: data.price2 || 0,
        price3: data.price3 || 0,
        productCode: data.productCode || "",
        sku: data.sku || "",
        availability: data.availability || "In Stock",
        quantity: data.quantity || 0,
        brand: data.brand || "",
        category: data.category || "",
        categoryId: data.categoryId || null,
        description: data.description || "",
        minimumQuantity: data.minimumQuantity || 1,
        minimumQuantity2: data.minimumQuantity2 || 1,
        minimumQuantity3: data.minimumQuantity3 || 1,
        gallery: data.gallery || [],
        deal: {
          start: data.deal?.start || "",
          end: data.deal?.end || "",
          offerPrice: data.deal?.offerPrice || 0,
          offerPrice2: data.deal?.offerPrice2 || 0,
          offerPrice3: data.deal?.offerPrice3 || 0,
        },
        features: data.variants?.length
          ? data.variants
          : [
              {
                name: "Default Title",
                values: [
                  {
                    value: "Default Value",
                    price: 0,
                    regularPrice: null,
                    gallery: [],
                    _id: Date.now().toString(), // unique id for React
                  },
                ],
                _id: Date.now().toString(),
              },
            ],
      });
      setImagePreview(data.imageUrl || "/images/200x200.png");
      const catRes = await getMyProductCategories();
      setCategories(catRes || []);
      setOldImageUrl(data.imageUrl || "");
    } catch (err) {
      toast.error(err.message || "Failed to load product");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    const fetchCategories = async () => {
      try {
        const cats = await getMyProductCategories();
        console.log("Categories fetched:", cats); // 👀 Debug log
        setCategories(cats || []);
      } catch (err) {
        toast.error(err.message || "Failed to load categories");
      }
    };

    fetchCategories();
  }, [id]);

  const handleCategoryChange = (e) => {
    const selectedId = e.target.value;
    const selectedCat = categories.find((cat) => cat._id === selectedId);
    setProduct((prev) => ({
      ...prev,
      category: selectedCat ? selectedCat.name : "",
      categoryId: selectedCat ? selectedCat._id : null,
    }));
  };

  const handleInputChange = (field, value) => {
    setProduct((prev) => ({ ...prev, [field]: value }));
  };

  // ---------- IMAGE UPLOAD -------
  const handleImageUpload = async (file) => {
    if (!file) return;
    try {
      setUploading(true);
      setImagePreview(URL.createObjectURL(file));

      const { newImage } = await uploadImage(file);
      setProduct((prev) => ({ ...prev, image: newImage }));
    } catch (err) {
      toast.error(err.message || "Image upload failed");
      setImagePreview(oldImageUrl || "/images/200x200.png");
    } finally {
      setUploading(false);
    }
  };

  // --------- GALLERY UPLOAD ----------
  const handleGalleryUpload = async (file) => {
    if (!file) return;
    try {
      setUploading(true);

      const { newImage } = await uploadImage(file);

      const updatedGallery = [...(product.gallery || []), newImage];

      await editProduct(id, { ...product, gallery: updatedGallery });

      setProduct((prev) => ({
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

  // --------- GALLERY DELETE ----------
  const handleGalleryDelete = async (imgUrl) => {
    try {
      setUploading(true);

      await deleteImage(imgUrl);

      const updatedGallery = product.gallery.filter((img) => img !== imgUrl);

      await editProduct(id, { ...product, gallery: updatedGallery });

      setProduct((prev) => ({
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
    if (!product.image) return;
    try {
      setUploading(true);

      await deleteImage(product.image);

      await editProduct(id, { ...product, image: "" });

      setProduct((prev) => ({
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
      setSaving(true);

      await editProduct(id, product);
      toast.success("Product updated successfully");

      // delete old image only if replaced
      if (oldImageUrl && oldImageUrl !== product.image) {
        try {
          await deleteImage(oldImageUrl);
          console.log("Old image deleted:", oldImageUrl);
        } catch (err) {
          console.warn("Failed to delete old image:", err.message);
        }
      }

      // update reference for next time
      setOldImageUrl(product.image);
      fetchData();
    } catch (err) {
      toast.error(err.message || "Failed to update product");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="p-6">Loading...</div>;
  }

  if (!product) {
    return <div className="p-6">No product found</div>;
  }

  return (
    <Page title="Edit Product">
      <ToastContainer position="top-right" autoClose={3000} />
      <div className="transition-content px-(--margin-x) pb-6">
        <div className="flex flex-col items-center justify-between space-y-4 py-5 sm:flex-row sm:space-y-0 lg:py-6">
          <h2 className="dark:text-dark-50 text-xl font-medium text-gray-700">
            Edit Product
          </h2>
        </div>

        <Card className="space-y-6 p-6">
          {/* Image Upload */}
          <div className="flex flex-col items-center">
            <div className="dark:border-dark-300 relative h-64 w-64 overflow-hidden rounded-lg border border-dashed border-gray-300">
              <img
                src={imagePreview}
                alt="Product"
                className="h-full w-full object-cover"
              />
              <Upload
                name="productImage"
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
                      <div className="loader border-white"></div> // loader styling adjust as per your UI
                    ) : (
                      <HiPencil className="size-4" />
                    )}
                  </Button>
                )}
              </Upload>
              {product.image && (
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

          {/* Product Basic Info */}
          <div className="space-y-4">
            <h4 className="text-lg font-medium">Product Basic Info</h4>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <Input
                label="Name"
                value={product.productName}
                onChange={(e) =>
                  handleInputChange("productName", e.target.value)
                }
              />
              <Input
                label="Product Code"
                value={product.productCode}
                onChange={(e) =>
                  handleInputChange("productCode", e.target.value)
                }
              />
              <Input
                label="Price"
                type="number"
                value={product.price}
                onChange={(e) => handleInputChange("price", e.target.value)}
              />
              <Input
                label="Minimum Quantity"
                type="number"
                value={product.minimumQuantity}
                onChange={(e) =>
                  handleInputChange(
                    "minimumQuantity",
                    parseInt(e.target.value) || 0,
                  )
                }
              />
              <Input
                label="Deal Price"
                type="number"
                value={product.deal?.offerPrice}
                onChange={(e) =>
                  setProduct((prev) => ({
                    ...prev,
                    deal: {
                      ...prev.deal,
                      offerPrice: parseFloat(e.target.value) || 0,
                    },
                  }))
                }
              />
              {/* <Input
                label="SKU"
                value={product.sku}
                onChange={(e) => handleInputChange("sku", e.target.value)}
              /> */}
              <div className="flex flex-col gap-1.5">
                <label className="dark:text-dark-100 text-sm font-medium text-gray-800">
                  Availability
                </label>
                <select
                  value={product.availability}
                  onChange={(e) =>
                    handleInputChange("availability", e.target.value)
                  }
                  className="dark:border-dark-300 dark:bg-dark-700 dark:text-dark-50 rounded-xl border border-gray-300 bg-white px-3 py-2 text-sm text-gray-800"
                >
                  <option value="In Stock">In Stock</option>
                  <option value="Out of Stock">Out of Stock</option>
                </select>
              </div>
              <Input
                label="Quantity in Stock"
                type="number"
                value={product.quantity}
                onChange={(e) => handleInputChange("quantity", e.target.value)}
              />
              <Input
                label="Brand / Manufacturer"
                value={product.brand}
                onChange={(e) => handleInputChange("brand", e.target.value)}
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="dark:text-dark-100 text-sm font-medium text-gray-800">
                Category
              </label>
              <select
                value={product.categoryId || ""}
                onChange={handleCategoryChange}
                className="dark:border-dark-300 dark:bg-dark-700 dark:text-dark-50 rounded-xl border border-gray-300 bg-white px-3 py-2 text-sm text-gray-800"
              >
                <option value="">Select Category</option>
                {categories.map((cat) => (
                  <option key={cat._id} value={cat._id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* ✅ Trader Section */}
          <div className="space-y-4 border-t pt-4">
            <h4 className="text-lg font-medium">Trader</h4>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <Input
                label="Trader Price"
                type="number"
                value={product.price2}
                onChange={(e) =>
                  handleInputChange("price2", parseFloat(e.target.value) || 0)
                }
              />
              <Input
                label="Trader Minimum Quantity"
                type="number"
                value={product.minimumQuantity2}
                onChange={(e) =>
                  handleInputChange(
                    "minimumQuantity2",
                    parseInt(e.target.value) || 0,
                  )
                }
              />
              <Input
                label="Trader Deal Price"
                type="number"
                value={product.deal?.offerPrice2}
                onChange={(e) =>
                  setProduct((prev) => ({
                    ...prev,
                    deal: {
                      ...prev.deal,
                      offerPrice2: parseFloat(e.target.value) || 0,
                    },
                  }))
                }
              />
            </div>
          </div>

          {/* ✅ Wholesaler Section */}
          <div className="space-y-4 border-t pt-4">
            <h4 className="text-lg font-medium">Wholesaler</h4>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <Input
                label="Wholesaler Price"
                type="number"
                value={product.price3}
                onChange={(e) =>
                  handleInputChange("price3", parseFloat(e.target.value) || 0)
                }
              />
              <Input
                label="Wholesaler Minimum Quantity"
                type="number"
                value={product.minimumQuantity3}
                onChange={(e) =>
                  handleInputChange(
                    "minimumQuantity3",
                    parseInt(e.target.value) || 0,
                  )
                }
              />
              <Input
                label="Wholesaler Deal Price"
                type="number"
                value={product.deal?.offerPrice3}
                onChange={(e) =>
                  setProduct((prev) => ({
                    ...prev,
                    deal: {
                      ...prev.deal,
                      offerPrice3: parseFloat(e.target.value) || 0,
                    },
                  }))
                }
              />
            </div>
          </div>
          {/* ✅ Gallery Section */}
          <Card className="relative mt-6 p-6">
            <h4 className="mb-3 text-lg font-medium">Gallery</h4>

            {product.gallery?.length > 0 ? (
              <div className="flex gap-4 overflow-x-auto pb-2">
                {product.gallery.map((img, idx) => (
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

            {/* Add Button only if gallery < 5 */}
            {(!product.gallery || product.gallery.length < 5) && (
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
            <h4 className="mb-3 text-lg font-medium">Product Description</h4>
            <ReactQuill
              theme="snow"
              value={product.description || ""}
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

          {/* Key Features / Variants */}
          <div className="space-y-3">
            <h4 className="text-lg font-medium">Key Features</h4>
            {product.features?.map((feature, index) => (
              <Card key={feature._id} className="border border-gray-200 p-4">
                <Input
                  label="Feature Name"
                  value={feature.name}
                  onChange={(e) => {
                    const newFeatures = [...product.features];
                    newFeatures[index].name = e.target.value;
                    setProduct((prev) => ({ ...prev, features: newFeatures }));
                  }}
                />
                {feature.values?.map((val, valIndex) => (
                  <div
                    key={val._id}
                    className="mt-2 grid grid-cols-1 gap-2 sm:grid-cols-3"
                  >
                    <Input
                      label="Value"
                      value={val.value}
                      onChange={(e) => {
                        const newFeatures = [...product.features];
                        newFeatures[index].values[valIndex].value =
                          e.target.value;
                        setProduct((prev) => ({
                          ...prev,
                          features: newFeatures,
                        }));
                      }}
                    />
                    <Input
                      label="Price"
                      type="number"
                      value={val.price}
                      onChange={(e) => {
                        const newFeatures = [...product.features];
                        newFeatures[index].values[valIndex].price =
                          parseFloat(e.target.value) || 0;
                        setProduct((prev) => ({
                          ...prev,
                          features: newFeatures,
                        }));
                      }}
                    />
                    <Input
                      label="Regular Price"
                      type="number"
                      value={val.regularPrice || ""}
                      onChange={(e) => {
                        const newFeatures = [...product.features];
                        newFeatures[index].values[valIndex].regularPrice = e
                          .target.value
                          ? parseFloat(e.target.value) || 0
                          : null;
                        setProduct((prev) => ({
                          ...prev,
                          features: newFeatures,
                        }));
                      }}
                    />
                  </div>
                ))}
              </Card>
            ))}
          </div>
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
              disabled={saving || uploading}
            >
              {saving ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        </Card>
      </div>
    </Page>
  );
};

export default ProductEdit;
