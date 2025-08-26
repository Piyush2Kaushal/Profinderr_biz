import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Page } from "components/shared/Page";
import { Card, Button } from "components/ui";
import { getSingleService, deleteService } from "utils/API/Authapi";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
} from "@mui/material";

const ServiceView = () => {
  const { id } = useParams();
  console.log(id);
  const navigate = useNavigate();
  const [service, setService] = useState(null);
  const [loading, setLoading] = useState(true);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);

  // Fetch single service data
  useEffect(() => {
    const fetchService = async () => {
      try {
        const data = await getSingleService(id);
        console.log(data);
        // API returns an array, so pick the first item
        setService(data[0]);
      } catch (error) {
        toast.error(error.message || "Failed to fetch service details");
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchService();
    }
  }, [id]);

  // Delete service handler
  const handleDeleteConfirm = async () => {
    try {
      await deleteService(id);
      toast.success("Service deleted successfully");
      setOpenDeleteModal(false);
      setTimeout(() => {
        navigate(-1);
      }, 2000);
    } catch (error) {
      toast.error(error.message || "Failed to delete service");
    }
  };

  if (loading) {
    return <div className="p-6">Loading...</div>;
  }

  if (!service) {
    return <div className="p-6">No service found</div>;
  }

  return (
    <Page title="Service View">
      <div className="transition-content px-(--margin-x) pb-6">
        {/* Header */}
        <div className="flex flex-col items-center justify-between space-y-4 py-5 sm:flex-row sm:space-y-0 lg:py-6">
          <h2 className="dark:text-dark-50 line-clamp-1 text-xl font-medium text-gray-700">
            Service Details
          </h2>
        </div>

        {/* Image & Basic Info */}
        <Card className="flex flex-col items-center p-6">
          <img
            src={service.image || "/images/200x200.png"}
            alt={service.serviceName}
            className="mb-4 h-64 w-64 rounded-lg object-cover"
          />
          <h3 className="dark:text-dark-100 text-2xl font-semibold text-gray-800">
            {service.serviceName}
          </h3>
          <p className="text-primary text-lg font-medium">
            ${service.servicePrice}
          </p>
          {service.hasActiveDeal && (
            <p className="mt-2 text-green-600">
              Deal Price: ${service.deal?.offerPrice} <br />
              <span className="text-sm text-gray-600">
                ({new Date(service.deal?.start).toLocaleString()} -{" "}
                {new Date(service.deal?.end).toLocaleString()})
              </span>
            </p>
          )}
        </Card>

        {/* Service Basic Info */}
        <Card className="mt-6 space-y-4 p-6">
          <h4 className="text-lg font-medium">Service Basic Info</h4>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <p>
              <span className="font-medium">Name:</span> {service.serviceName}
            </p>
            <p>
              <span className="font-medium">Product:</span> {service.product}
            </p>
            <p>
              <span className="font-medium">Price:</span> $
              {service.servicePrice}
            </p>
            <p>
              <span className="font-medium">Service Time:</span>{" "}
              {service.serviceTime}
            </p>
            <p>
              <span className="font-medium">Availability:</span>{" "}
              {service.availability}
            </p>
            <p>
              <span className="font-medium">Brand / Manufacturer:</span>{" "}
              {service.brandOrManufacturer}
            </p>
          </div>
          <p>
            <span className="font-medium">Category:</span> {service.category}
          </p>
        </Card>

        {/* Description */}
        <Card className="mt-6 p-6">
          <h4 className="mb-3 text-lg font-medium">Service Description</h4>
          <div
            className="dark:text-dark-200 text-gray-600"
            dangerouslySetInnerHTML={{ __html: service.description }}
          />
        </Card>

        {/* Gallery */}
        {service.gallery?.length > 0 && (
          <Card className="mt-6 p-6">
            <h4 className="mb-3 text-lg font-medium">Gallery</h4>
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
              {service.gallery.map((img, idx) => (
                <img
                  key={idx}
                  src={img}
                  alt={`gallery-${idx}`}
                  className="h-40 w-full rounded-lg object-cover"
                />
              ))}
            </div>
          </Card>
        )}

        {/* Specifications */}
        <Card className="mt-6 space-y-2 p-6">
          <h4 className="text-lg font-medium">Specifications</h4>
          <p>
            <span className="font-medium">Status:</span> {service.status}
          </p>
          <p>
            <span className="font-medium">View Count:</span> {service.viewCount}
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
            Delete Service
          </Button>
          <Button
            onClick={() => navigate(`/dashboards/Service/Edit/${id}`)}
            variant="outlined"
            className="min-w-[8rem]"
          >
            Edit Service
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
            <strong>{service.serviceName}</strong>"?
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

export default ServiceView;
