import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Page } from "components/shared/Page";
import { Card, Button } from "components/ui";
import { getSingleProduct, deleteProduct } from "utils/API/Authapi";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import dayjs from "dayjs";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
} from "@mui/material";

const ProductView = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);

  // Fetch single product data
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const data = await getSingleProduct(id);
        setProduct(data);
      } catch (error) {
        toast.error(error.message || "Failed to fetch product details");
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchProduct();
    }
  }, [id]);

  // Delete product handler
  const handleDeleteConfirm = async () => {
    try {
      await deleteProduct(id);
      toast.success("Product deleted successfully");
      setOpenDeleteModal(false);
      setTimeout(() => {
        navigate(-1);
      }, 2000);
    } catch (error) {
      toast.error(error.message || "Failed to delete product");
    }
  };

  if (loading) {
    return <div className="p-6">Loading...</div>;
  }

  if (!product) {
    return <div className="p-6">No product found</div>;
  }

  return (
    <Page title="Product View">
      <div className="transition-content px-(--margin-x) pb-6">
        {/* Header */}
        <div className="flex flex-col items-center justify-between space-y-4 py-5 sm:flex-row sm:space-y-0 lg:py-6">
          <h2 className="dark:text-dark-50 line-clamp-1 text-xl font-medium text-gray-700">
            Product Details
          </h2>
        </div>

        {/* Image & Basic Info */}
        <Card className="flex flex-col items-center p-6">
          <img
            src={product.imageUrl || "/images/200x200.png"}
            alt={product.productName}
            className="mb-4 h-64 w-64 rounded-lg object-cover"
          />
          <h3 className="dark:text-dark-100 text-2xl font-semibold text-gray-800">
            {product.productName}
          </h3>
          <p className="text-primary text-lg font-medium">${product.price}</p>
        </Card>

        {/* Product Basic Info */}
        <Card className="mt-6 space-y-4 p-6">
          <h4 className="text-lg font-medium">Product Basic Info</h4>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <p>
              <span className="font-medium">Name:</span> {product.productName}
            </p>
            <p>
              <span className="font-medium">Product Code:</span>{" "}
              {product.productCode}
            </p>
            <p>
              <span className="font-medium">Price:</span> ${product.price}
            </p>
            {/* <p>
              <span className="font-medium">SKU:</span> {product._id}
            </p> */}
            <p>
              <span className="font-medium">Availability:</span>{" "}
              {product.availability}
            </p>
            <p>
              <span className="font-medium">Quantity in Stock:</span>{" "}
              {product.quantity}
            </p>
            <p>
              <span className="font-medium">Brand / Manufacturer:</span>{" "}
              {product.brand}
            </p>
          </div>
          <p>
            <span className="font-medium">Category:</span> {product.category}
          </p>
        </Card>
        {/* Pricing & Deal Sections */}
        <Card className="mt-6 space-y-6 p-6">
          <h4 className="text-lg font-medium">Pricing & Deals</h4>

          {/* Normal User Section */}
          <div className="space-y-2">
            <h5 className="text-primary-600 text-xl font-semibold">
              Normal User
            </h5>
            <p>
              <span className="font-medium">Price:</span> ${product.price}
            </p>
            <p>
              <span className="font-medium">Minimum Quantity:</span>{" "}
              {product.minimumQuantity}
            </p>
            {product.deal?.offerPrice && (
              <p>
                <span className="font-medium">Offer Price:</span> $
                {product.deal.offerPrice}
              </p>
            )}
            {product.deal?.start && product.deal?.end && (
              <p>
                <span className="font-medium">Deal Period:</span>{" "}
                {dayjs(product.deal.start).format("DD MMM YYYY")} -{" "}
                {dayjs(product.deal.end).format("DD MMM YYYY")}
              </p>
            )}
          </div>

          {/* Trader Section */}
          <div className="space-y-2 border-t pt-4">
            <h5 className="text-primary-600 text-xl font-semibold">Trader</h5>
            <p>
              <span className="font-medium">Trader Price:</span> $
              {product.price2}
            </p>
            <p>
              <span className="font-medium">Minimum Quantity:</span>{" "}
              {product.minimumQuantity2}
            </p>
            {product.deal?.offerPrice2 && (
              <p>
                <span className="font-medium">Offer Price:</span> $
                {product.deal.offerPrice2}
              </p>
            )}
            {product.deal?.start && product.deal?.end && (
              <p>
                <span className="font-medium">Deal Period:</span>{" "}
                {dayjs(product.deal.start).format("DD MMM YYYY")} -{" "}
                {dayjs(product.deal.end).format("DD MMM YYYY")}
              </p>
            )}
          </div>

          {/* Wholesaler Section */}
          <div className="space-y-2 border-t pt-4">
            <h5 className="text-primary-600 text-xl font-semibold">
              Wholesaler
            </h5>
            <p>
              <span className="font-medium">Wholesaler Price:</span> $
              {product.price3}
            </p>
            <p>
              <span className="font-medium">Minimum Quantity:</span>{" "}
              {product.minimumQuantity3}
            </p>
            {product.deal?.offerPrice3 && (
              <p>
                <span className="font-medium">Offer Price:</span> $
                {product.deal.offerPrice3}
              </p>
            )}
            {product.deal?.start && product.deal?.end && (
              <p>
                <span className="font-medium">Deal Period:</span>{" "}
                {dayjs(product.deal.start).format("DD MMM YYYY")} -{" "}
                {dayjs(product.deal.end).format("DD MMM YYYY")}
              </p>
            )}
          </div>
        </Card>
        {/* Product Gallery */}
        {product.gallery && product.gallery.length > 0 && (
          <Card className="mt-6 p-6">
            <h4 className="mb-3 text-lg font-medium">Product Gallery</h4>
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
              {product.gallery.map((imgUrl, index) => (
                <img
                  key={index}
                  src={imgUrl}
                  alt={`Gallery ${index + 1}`}
                  className="h-40 w-full rounded-lg object-cover"
                  onError={(e) => (e.target.src = "/images/200x200.png")}
                />
              ))}
            </div>
          </Card>
        )}

        {/* Description */}
        <Card className="mt-6 p-6">
          <h4 className="mb-3 text-lg font-medium">Product Description</h4>
          <div
            className="dark:text-dark-200 text-gray-600"
            dangerouslySetInnerHTML={{ __html: product.description }}
          />
        </Card>

        {/* Key Features */}
        {/* Key Features */}
        {product.variants?.length > 0 && (
          <Card className="mt-6 p-6">
            <h4 className="mb-3 text-lg font-medium">Key Features</h4>
            <div className="space-y-4">
              {product.variants.map((variant) => (
                <div key={variant._id}>
                  <h5 className="dark:text-dark-100 mb-1 font-semibold text-gray-800">
                    {variant.name}:
                  </h5>
                  <ul className="list-disc space-y-1 pl-5">
                    {variant.values.map((v) => (
                      <li
                        key={v._id}
                        className="dark:text-dark-200 text-gray-600"
                      >
                        <span className="font-medium">{v.value}</span>
                        {v.price !== undefined && (
                          <span> - Price: ${v.price}</span>
                        )}
                        {v.regularPrice !== null &&
                          v.regularPrice !== undefined && (
                            <span> | Regular Price: ${v.regularPrice}</span>
                          )}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </Card>
        )}

        {/* Specifications */}
        <Card className="mt-6 space-y-2 p-6">
          <h4 className="text-lg font-medium">Specifications</h4>
          {/* <p>
            <span className="font-medium">SKU:</span> {product._id}
          </p> */}
          <p>
            <span className="font-medium">Availability:</span>{" "}
            {product.availability}
          </p>
        </Card>

        {/* Action Buttons */}
        <div className="mt-6 flex flex-wrap gap-3">
          {/* <Button color="primary" className="min-w-[8rem]">
            Add To Deal
          </Button> */}
          <Button
            color="error"
            className="min-w-[8rem]"
            onClick={() => setOpenDeleteModal(true)}
          >
            Delete Product
          </Button>
          <Button
            onClick={() => navigate(`/dashboards/products/Edit/${id}`)}
            variant="outlined"
            className="min-w-[8rem]"
          >
            Edit Product
          </Button>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      <Dialog
        open={openDeleteModal}
        onClose={() => setOpenDeleteModal(false)}
        maxWidth="xs"
        fullWidth
      >
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete "
            <strong>{product.productName}</strong>"?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button variant="outlined" onClick={() => setOpenDeleteModal(false)}>
            Cancel
          </Button>
          <Button color="error" onClick={handleDeleteConfirm}>
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      <ToastContainer position="top-right" autoClose={3000} />
    </Page>
  );
};

export default ProductView;
