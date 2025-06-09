import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

export interface Product {
  id: number;
  name: string;
  category: string;
  price: number;
  stock: number;
  description: string;
}

const initialState: Product[] = [
  { id: 1, name: "Laptop Dell XPS 13", category: "Laptop", price: 32000000, stock: 10, description: "Laptop cao cấp cho doanh nhân." },
  { id: 2, name: "iPhone 15 Pro", category: "Điện thoại", price: 28000000, stock: 15, description: "Điện thoại thông minh mới nhất của Apple." },
  { id: 3, name: "Máy in Canon LBP 2900", category: "Máy in", price: 3500000, stock: 8, description: "Máy in laser nhỏ gọn cho văn phòng." },
  { id: 4, name: "Bàn phím cơ Keychron K2", category: "Phụ kiện", price: 1800000, stock: 20, description: "Bàn phím cơ bluetooth cho lập trình viên." },
  { id: 5, name: "Màn hình LG 27UL850", category: "Màn hình", price: 9500000, stock: 5, description: "Màn hình 4K cho thiết kế đồ họa." },
];

export const fetchProducts = createAsyncThunk('products/fetchProducts', async (_, { rejectWithValue }) => {
  try {
    const res = await axios.get('/api/products');
    return res.data;
  } catch (e) {
    console.log(e);
    
    return rejectWithValue('no-api');
  }
});

export const addProductAsync = createAsyncThunk('products/addProduct', async (product: Omit<Product, 'id'>, { rejectWithValue }) => {
  try {
    const res = await axios.post('/api/products', product);
    return res.data;
  } catch (e) {
    console.log(e);
    return rejectWithValue(product);
  }
});

export const updateProductAsync = createAsyncThunk('products/updateProduct', async (product: Product, { rejectWithValue }) => {
  try {
    const res = await axios.put(`/api/products/${product.id}`, product);
    return res.data;
  } catch (e) {
    console.log(e);
    return rejectWithValue(product);
  }
});

export const deleteProductAsync = createAsyncThunk('products/deleteProduct', async (id: number, { rejectWithValue }) => {
  try {
    await axios.delete(`/api/products/${id}`);
    return id;
  } catch (e) {
    console.log(e);
    return rejectWithValue(id);
  }
});

const productsSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {
    addProduct: (state, action: PayloadAction<Omit<Product, 'id'>>) => {
      const newProduct: Product = {
        ...action.payload,
        id: Date.now(),
      };
      state.push(newProduct);
    },
    updateProduct: (state, action: PayloadAction<Product>) => {
      const idx = state.findIndex(p => p.id === action.payload.id);
      if (idx !== -1) state[idx] = action.payload;
    },
    deleteProduct: (state, action: PayloadAction<number>) => {
      return state.filter(p => p.id !== action.payload);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.fulfilled, (state, action) => {
        if (action.payload !== 'no-api') {
          return action.payload;
        }
      })
      .addCase(addProductAsync.fulfilled, (state, action) => {
        if (action.payload && action.payload !== 'no-api') {
          state.push(action.payload);
        }
      })
      .addCase(addProductAsync.rejected, (state, action: any) => {
        if (action.payload) {
          const newProduct: Product = {
            ...action.payload,
            id: Date.now(),
          };
          state.push(newProduct);
        }
      })
      .addCase(updateProductAsync.fulfilled, (state, action) => {
        if (action.payload && action.payload !== 'no-api') {
          const idx = state.findIndex(p => p.id === action.payload.id);
          if (idx !== -1) state[idx] = action.payload;
        }
      })
      .addCase(updateProductAsync.rejected, (state, action: any) => {
        if (action.payload) {
          const idx = state.findIndex(p => p.id === action.payload.id);
          if (idx !== -1) state[idx] = action.payload;
        }
      })
      .addCase(deleteProductAsync.fulfilled, (state, action) => {
        return state.filter(p => p.id !== action.payload);
      })
      .addCase(deleteProductAsync.rejected, (state, action: any) => {
        return state.filter(p => p.id !== action.payload);
      });
  }
});

export const { addProduct, updateProduct, deleteProduct } = productsSlice.actions;
export default productsSlice.reducer; 