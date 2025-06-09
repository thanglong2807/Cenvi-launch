import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

export interface Category {
  id: number;
  name: string;
}

const initialState: Category[] = [
  { id: 1, name: "Thành lập doanh nghiệp" },
  { id: 2, name: "Kế toán thuế" },
  { id: 3, name: "Ngành nghề có điều kiện" },
  { id: 4, name: "Ký kết hợp tác" },
  { id: 5, name: "Phụ kiện" },
  { id: 6, name: "Laptop" },
  { id: 7, name: "Điện thoại" },
  { id: 8, name: "Màn hình" },
  { id: 9, name: "Máy in" },
];

export const fetchCategories = createAsyncThunk('categories/fetchCategories', async (_, { rejectWithValue }) => {
  try {
    const res = await axios.get('/api/categories');
    return res.data;
  } catch (e) {
    return rejectWithValue('no-api');
  }
});

export const addCategoryAsync = createAsyncThunk('categories/addCategory', async (category: Omit<Category, 'id'>, { rejectWithValue }) => {
  try {
    const res = await axios.post('/api/categories', category);
    return res.data;
  } catch (e) {
    return rejectWithValue(category);
  }
});

export const updateCategoryAsync = createAsyncThunk('categories/updateCategory', async (category: Category, { rejectWithValue }) => {
  try {
    const res = await axios.put(`/api/categories/${category.id}`, category);
    return res.data;
  } catch (e) {
    return rejectWithValue(category);
  }
});

export const deleteCategoryAsync = createAsyncThunk('categories/deleteCategory', async (id: number, { rejectWithValue }) => {
  try {
    await axios.delete(`/api/categories/${id}`);
    return id;
  } catch (e) {
    return rejectWithValue(id);
  }
});

const categoriesSlice = createSlice({
  name: 'categories',
  initialState,
  reducers: {
    addCategory: (state, action: PayloadAction<Omit<Category, 'id'>>) => {
      const newCategory: Category = {
        ...action.payload,
        id: Date.now(),
      };
      state.push(newCategory);
    },
    updateCategory: (state, action: PayloadAction<Category>) => {
      const idx = state.findIndex(c => c.id === action.payload.id);
      if (idx !== -1) state[idx] = action.payload;
    },
    deleteCategory: (state, action: PayloadAction<number>) => {
      return state.filter(c => c.id !== action.payload);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCategories.fulfilled, (state, action) => {
        if (action.payload !== 'no-api') {
          return action.payload;
        }
      })
      .addCase(addCategoryAsync.fulfilled, (state, action) => {
        if (action.payload && action.payload !== 'no-api') {
          state.push(action.payload);
        }
      })
      .addCase(addCategoryAsync.rejected, (state, action: any) => {
        if (action.payload) {
          const newCategory: Category = {
            ...action.payload,
            id: Date.now(),
          };
          state.push(newCategory);
        }
      })
      .addCase(updateCategoryAsync.fulfilled, (state, action) => {
        if (action.payload && action.payload !== 'no-api') {
          const idx = state.findIndex(c => c.id === action.payload.id);
          if (idx !== -1) state[idx] = action.payload;
        }
      })
      .addCase(updateCategoryAsync.rejected, (state, action: any) => {
        if (action.payload) {
          const idx = state.findIndex(c => c.id === action.payload.id);
          if (idx !== -1) state[idx] = action.payload;
        }
      })
      .addCase(deleteCategoryAsync.fulfilled, (state, action) => {
        return state.filter(c => c.id !== action.payload);
      })
      .addCase(deleteCategoryAsync.rejected, (state, action: any) => {
        return state.filter(c => c.id !== action.payload);
      });
  }
});

export const { addCategory, updateCategory, deleteCategory } = categoriesSlice.actions;
export default categoriesSlice.reducer;