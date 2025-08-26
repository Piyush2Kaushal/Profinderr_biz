import axios from "axios";
import { APIURL } from "./URL";
import { getStorageItem } from "app/store/storage";
const authToken = getStorageItem("authToken");

const BaseUrl = APIURL();

export const LOGIN = async (data) => {
  try {
    const res = await axios.post(`${BaseUrl}/api/business/login`, data);
    if (res.data.status) {
      return res.data;
    }
  } catch (error) {
    throw new Error(error.response?.data?.message || "Login failed.");
  }
};

export const GetBusiness = async (data) => {
  try {
    const res = await axios.get(`${BaseUrl}/api/business/get-buisness`, {
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
    });
    if (res.data.status) {
      return res.data;
    }
  } catch (error) {
    throw new Error(error.response?.data?.message || "Login failed.");
  }
};
export const UpdateBusiness = async (data) => {
  try {
    const res = await axios.post(
      `${BaseUrl}/api/business/update-profile`,
      data,
      {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      },
    );
    if (res.data.status) {
      return res.data;
    }
  } catch (error) {
    throw new Error(
      error.response?.data?.message || "Failed to update business.",
    );
  }
};

export const GetSubscription = async () => {
  try {
    const res = await axios.get(`${BaseUrl}/api/plan/subscription`, {
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
    });
    return res.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message || "Failed to fetch subscription.",
    );
  }
};
export const uploadImage = async (file) => {
  try {
    const formData = new FormData();
    formData.append("images", file);

    const res = await axios.post(
      `${BaseUrl}/api/business/upload-image`,
      formData,
      {
        headers: {
          Authorization: `Bearer ${authToken}`,
          "Content-Type": "multipart/form-data",
        },
      },
    );
    if (res.data.success) {
      return {
        newImage: res.data.addedImage[0],
        allImages: res.data.myImages,
      };
    }
    throw new Error("Failed to upload image");
  } catch (error) {
    throw new Error(error.response?.data?.message || "Image upload failed.");
  }
};

// Delete Image API
export const deleteImage = async (imageUrl) => {
  try {
    const res = await axios.post(
      `${BaseUrl}/api/business/delete-image`,
      { imageUrl },
      {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      },
    );

    if (res.data.success) {
      return res.data.message;
    }
    throw new Error("Failed to delete image");
  } catch (error) {
    throw new Error(error.response?.data?.message || "Image delete failed.");
  }
};

// New function: fetch products with pagination
export const getProductsPaginated = async ({
  page = 1,
  limit = 24,
  allPages = false,
} = {}) => {
  try {
    if (!allPages) {
      // Fetch single page
      const res = await axios.get(
        `${BaseUrl}/api/business/product/get-product?page=${page}&limit=${limit}`,
        {
          headers: { Authorization: `Bearer ${authToken}` },
        },
      );

      if (res.data.success) return res.data;
      throw new Error("Failed to fetch products");
    } else {
      // Fetch all pages
      let allProducts = [];
      let currentPage = 1;
      let totalPages = 1;

      do {
        const res = await axios.get(
          `${BaseUrl}/api/business/product/get-product?page=${currentPage}&limit=${limit}`,
          {
            headers: { Authorization: `Bearer ${authToken}` },
          },
        );

        if (!res.data.success) throw new Error("Failed to fetch products");

        allProducts = allProducts.concat(res.data.data);
        totalPages = res.data.totalPages;
        currentPage++;
      } while (currentPage <= totalPages);

      return allProducts;
    }
  } catch (error) {
    throw new Error(
      error.response?.data?.message || "Failed to fetch products.",
    );
  }
};

export const getProducts = async () => {
  try {
    const res = await axios.get(`${BaseUrl}/api/business/product/get-product`, {
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
    });
    console.log(`data`, res.data);

    if (res.data.success) {
      return res.data.data;
    }

    throw new Error("Failed to fetch products");
  } catch (error) {
    throw new Error(
      error.response?.data?.message || "Failed to fetch products.",
    );
  }
};

export const getServiceList = async () => {
  try {
    const res = await axios.get(`${BaseUrl}/api/business/product/services`, {
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
    });

    if (res.data.success) {
      return res.data.data;
    }

    throw new Error("Failed to fetch service list");
  } catch (error) {
    throw new Error(
      error.response?.data?.message || "Failed to fetch service list.",
    );
  }
};

export const getSingleProduct = async (id) => {
  try {
    const res = await axios.get(
      `${BaseUrl}/api/business/product/product?id=${id}`,
      {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      },
    );
    if (res.data.success) {
      return res.data.data;
    }
    throw new Error("Failed to fetch product details");
  } catch (error) {
    throw new Error(
      error.response?.data?.message || "Failed to fetch product details.",
    );
  }
};
export const getSingleService = async (id) => {
  try {
    const res = await axios.get(
      `${BaseUrl}/api/business/product/services?_id=${id}`,
      {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      },
    );
    if (res.data.success) {
      return res.data.data;
    }

    throw new Error("Failed to fetch service details");
  } catch (error) {
    throw new Error(
      error.response?.data?.message || "Failed to fetch service details.",
    );
  }
};

export const editProduct = async (id, data) => {
  try {
    const res = await axios.post(
      `${BaseUrl}/api/business/product/edit/${id}`,
      data,
      {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      },
    );

    if (res.data.success) {
      return res.data.data;
    }

    throw new Error("Failed to edit product");
  } catch (error) {
    throw new Error(error.response?.data?.message || "Failed to edit product.");
  }
};

export const editService = async (id, data) => {
  try {
    const res = await axios.post(
      `${BaseUrl}/api/business/product/service/${id}`,
      data,
      { headers: { Authorization: `Bearer ${getStorageItem("authToken")}` } },
    );
    return res.data;
  } catch (err) {
    throw err.response?.data || err;
  }
};
export const deleteProduct = async (id) => {
  try {
    const res = await axios.delete(
      `${BaseUrl}/api/business/product/permanent-delete/${id}`,
      {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      },
    );

    if (res.data.success) {
      return res.data.data;
    }

    throw new Error("Failed to delete product");
  } catch (error) {
    throw new Error(
      error.response?.data?.message || "Failed to delete product.",
    );
  }
};
export const deleteService = async (id) => {
  try {
    console.log("👉 API CALL DELETE ID:", id);
    const url = `${BaseUrl}/api/business/product/service/trash-handle/${id}?type=delete`;
    console.log("👉 Final Delete URL:", url);

    const res = await axios.get(
      url,
      {},
      {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      },
    );
    console.log("👉 Delete response:", res.data);

    if (res.data.success || res.data.status) {
      return res.data;
    }

    throw new Error(res.data.message || "Failed to delete service");
  } catch (error) {
    console.error(
      "❌ Delete service error:",
      error.response?.data || error.message,
    );
    throw new Error(
      error.response?.data?.message || "Failed to delete service.",
    );
  }
};

export const getMyProductCategories = async () => {
  try {
    const res = await axios.get(
      `${BaseUrl}/api/business/my-categories?type=Product`,
      {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      },
    );
    if (res.data.status) {
      return res.data.allCategories;
    }
    throw new Error("Failed to fetch product categories");
  } catch (error) {
    throw new Error(
      error.response?.data?.message || "Failed to fetch product categories.",
    );
  }
};

export const getMyProductCategoriesDashboard = async () => {
  try {
    const res = await axios.get(
      `${BaseUrl}/api/business/my-categories?type=Product`,
      {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      },
    );
    if (res.data.status) {
      return res.data.categories;
    }
    throw new Error("Failed to fetch product categories");
  } catch (error) {
    throw new Error(
      error.response?.data?.message || "Failed to fetch product categories.",
    );
  }
};
export const getMyServiceCategories = async () => {
  try {
    const res = await axios.get(
      `${BaseUrl}/api/business/my-categories?type=Service`,
      {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      },
    );

    if (res.data.status) {
      return res.data.allCategories;
    }

    throw new Error("Failed to fetch service categories");
  } catch (error) {
    throw new Error(
      error.response?.data?.message || "Failed to fetch service categories.",
    );
  }
};
export const getMyServiceCategoriesDashboard = async () => {
  try {
    const res = await axios.get(
      `${BaseUrl}/api/business/my-categories?type=Service`,
      {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      },
    );

    if (res.data.status) {
      return res.data.categories;
    }

    throw new Error("Failed to fetch service categories");
  } catch (error) {
    throw new Error(
      error.response?.data?.message || "Failed to fetch service categories.",
    );
  }
};
export const addProduct = async (productData) => {
  try {
    const res = await axios.post(
      `${BaseUrl}/api/business/product/add-product`,
      productData,
      {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      },
    );

    if (res.data.success) {
      return res.data.data;
    }

    throw new Error("Failed to add product");
  } catch (error) {
    throw new Error(error.response?.data?.message || "Failed to add product.");
  }
};

// Get Deal Products
export const getDealProducts = async () => {
  try {
    const res = await axios.get(
      `${BaseUrl}/api/business/product/get-product?deal=true`,
      {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      },
    );

    if (res.data.success) {
      return res.data.data;
    }

    throw new Error("Failed to fetch deal products");
  } catch (error) {
    throw new Error(
      error.response?.data?.message || "Failed to fetch deal products.",
    );
  }
};

// Add Service
export const addService = async (serviceData) => {
  try {
    const res = await axios.post(
      `${BaseUrl}/api/business/product/add-service`,
      serviceData,
      {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      },
    );

    if (res.data.success) {
      return res.data.data;
    }

    throw new Error("Failed to add service");
  } catch (error) {
    throw new Error(error.response?.data?.message || "Failed to add service.");
  }
};

// Get Service Deals
export const getServiceDeals = async () => {
  try {
    const res = await axios.get(
      `${BaseUrl}/api/business/product/services?deal=true`,
      {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      },
    );

    if (res.data.success) {
      return res.data.data;
    }

    throw new Error("Failed to fetch service deals");
  } catch (error) {
    throw new Error(
      error.response?.data?.message || "Failed to fetch service deals.",
    );
  }
};

//  Dashboard & Subscription

// Dashboard Analytics
export const getDashboardAnalytics = async () => {
  try {
    const res = await axios.get(
      `${BaseUrl}/api/business/action/getProductAnalytics`,
      {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      },
    );

    if (res.data.success) {
      return res.data.data;
    }

    throw new Error("Failed to fetch dashboard analytics");
  } catch (error) {
    throw new Error(
      error.response?.data?.message || "Failed to fetch dashboard analytics.",
    );
  }
};
// Download CSV
// UPLOAD Shopify Bulk Data
export const uploadShopifyBulkData = async (file, newBusinessId) => {
  try {
    const formData = new FormData();
    // ✅ Keys ko Postman wale jaisa rakha
    formData.append("csvFile", file);
    formData.append("newBusinessid", newBusinessId);

    const res = await axios.post(
      `${BaseUrl}/api/business/web/bulk-import/shopify-import`,
      formData,
      {
        headers: {
          Authorization: `Bearer ${authToken}`,
          "Content-Type": "multipart/form-data",
        },
      },
    );

    if (res.data.success) {
      return res.data;
    }

    throw new Error(res.data.message || "Failed to upload Shopify bulk data");
  } catch (error) {
    console.error(
      "Shopify upload error:",
      error.response?.data || error.message,
    );
    throw new Error(
      error.response?.data?.message ||
        error.message ||
        "Failed to upload Shopify bulk data",
    );
  }
};
export const uploadWordPressBulkData = async (file, newBusinessId) => {
  try {
    const formData = new FormData();
    // ✅ Keys ko Postman wale jaisa rakha
    formData.append("csvFile", file);
    formData.append("newBusinessid", newBusinessId);

    const res = await axios.post(
      `${BaseUrl}/api/business/web/bulk-import/wordpress-import`,
      formData,
      {
        headers: {
          Authorization: `Bearer ${authToken}`,
          "Content-Type": "multipart/form-data",
        },
      },
    );

    if (res.data.success) {
      return res.data;
    }

    throw new Error(res.data.message || "Failed to upload Shopify bulk data");
  } catch (error) {
    console.error(
      "Shopify upload error:",
      error.response?.data || error.message,
    );
    throw new Error(
      error.response?.data?.message ||
        error.message ||
        "Failed to upload Shopify bulk data",
    );
  }
};

// UPLOAD Normal CSV
// utils/API/Authapi.js

export const downloadProductsCSV = async (businessId, productIds) => {
  try {
    const res = await axios.post(
      `${BaseUrl}/api/business/web/products/download`,
      { businessId, productIds },
      {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
        responseType: "blob", // important for CSV download
      },
    );

    // Create download link
    const url = window.URL.createObjectURL(new Blob([res.data]));
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "products.csv"); // filename
    document.body.appendChild(link);
    link.click();
    link.remove();

    return true;
  } catch (error) {
    throw new Error(
      error.response?.data?.message || "Failed to download products CSV.",
    );
  }
};

export const uploadNormalCSV = async (file, newBusinessId) => {
  try {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("newBusinessId", newBusinessId);

    const res = await axios.post(
      `${BaseUrl}/api/business/web/products/Upload-csv`,
      formData,
      {
        headers: {
          Authorization: `Bearer ${authToken}`,
          "Content-Type": "multipart/form-data",
        },
      },
    );
    console.log(`qqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqq`, res);

    // ✅ Backend kabhi success=false ke saath bhi success message bhej raha hai
    if (
      res.data.success ||
      res.data.message?.includes("uploaded successfully")
    ) {
      return res.data;
    }

    throw new Error(res.data.message || "Failed to upload normal CSV");
  } catch (error) {
    console.error("Upload error:", error.response?.data || error.message);
    throw new Error(
      error.response?.data?.message || error.message || "Upload failed",
    );
  }
};

export const bulkUpdateProducts = async ({
  productIds,
  categoryId,
  category,
}) => {
  try {
    const res = await axios.post(
      `${BaseUrl}/api/business/web/products/bukl-update`,
      { productIds, categoryId, category },
      {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      },
    );

    if (res.data.success) {
      return res.data.data;
    }

    throw new Error("Bulk update failed");
  } catch (error) {
    throw new Error(error.response?.data?.message || "Bulk update failed.");
  }
};

export const deleteMultipleProducts = async (productIds) => {
  try {
    const res = await axios.delete(
      `${BaseUrl}/api/business/product/permanent-delete-multi`,
      {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
        data: { productIds }, // DELETE ke sath body bhejne ke liye "data" use hota hai
      },
    );

    if (res.data.success) {
      return res.data.data;
    }

    throw new Error("Failed to delete multiple products");
  } catch (error) {
    throw new Error(
      error.response?.data?.message || "Failed to delete multiple products.",
    );
  }
};
