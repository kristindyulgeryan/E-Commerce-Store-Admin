import { create } from "zustand";
import toast from "react-hot-toast";
import axios from "../lib/axios";

export const useProductStore = create((set) => ({
  products: [],
  loading: false,

  setProducts: (products) => set({ products }),

  createProduct: async (productData) => {
    set({ loading: true });

    try {
      const res = await axios.post("/products", productData);
      set((prevState) => ({
        products: [...prevState.products, res.data],
        loading: false,
      }));
    } catch (error) {
      toast.error(error.response.data.error);
      set({ loading: false });
    }
  },

  fetchAllProducts: async () => {
    set({ loading: true });
    try {
      const response = await axios.get("/products");
      set({ products: response.data.products, loding: false });
    } catch (error) {
      set({ error: "Faild to fetch products", loading: flase });
      toast.error(error.response.data.error || "Faild to fetch products");
    }
  },
  deleteProduct: async (id) => {},
  toggleFeaturedProduct: async (productId) => {
    set({ loading: true });
    try {
      // this will update the isFeatured prop of the product
      const response = await axios.patch(`/products/${productId}`);
      set((prevProduct) => ({
        products: prevProduct.products.map((product) =>
          product._id === productId
            ? { ...product, isFeatured: response.data.isFeatured }
            : product
        ),
        loading: false,
      }));
    } catch (error) {
      set({ loading: false });
      toast.error(error.response.data.error || "Faild to update product");
    }
  },
}));
