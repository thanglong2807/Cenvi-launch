import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

export interface Customer {
  id: number;
  fullName: string;
  username: string;
  email: string;
  phone: string;
  address: string;
  createdAt: string;
}

const initialState: Customer[] = [
  { id: 1,username: "user1", fullName: "Nguyễn Văn A", email: "a@gmail.com", phone: "0901234567", address: "Hà Nội", createdAt: "2024-06-01" },
  { id: 2,username: "user2", fullName: "Trần Thị B", email: "b@gmail.com", phone: "0912345678", address: "Hồ Chí Minh", createdAt: "2024-06-02" },
  { id: 3,username: "user3", fullName: "Lê Văn C", email: "c@gmail.com", phone: "0923456789", address: "Đà Nẵng", createdAt: "2024-06-03" },
];

export const fetchCustomers = createAsyncThunk('customers/fetchCustomers', async (_, { rejectWithValue }) => {
  try {
    const res = await axios.get('/api/customers');
    return res.data;
  } catch (e) {
    return rejectWithValue('no-api');
  }
});

export const addCustomerAsync = createAsyncThunk('customers/addCustomer', async (customer: Omit<Customer, 'id' | 'createdAt'>, { rejectWithValue }) => {
  try {
    const res = await axios.post('/api/customers', customer);
    return res.data;
  } catch (e) {
    return rejectWithValue(customer);
  }
});

export const updateCustomerAsync = createAsyncThunk('customers/updateCustomer', async (customer: Customer, { rejectWithValue }) => {
  try {
    const res = await axios.put(`/api/customers/${customer.id}`, customer);
    return res.data;
  } catch (e) {
    return rejectWithValue(customer);
  }
});

export const deleteCustomerAsync = createAsyncThunk('customers/deleteCustomer', async (id: number, { rejectWithValue }) => {
  try {
    await axios.delete(`/api/customers/${id}`);
    return id;
  } catch (e) {
    return rejectWithValue(id);
  }
});

const customersSlice = createSlice({
  name: 'customers',
  initialState,
  reducers: {
    addCustomer: (state, action: PayloadAction<Omit<Customer, 'id' | 'createdAt'>>) => {
      const newCustomer: Customer = {
        ...action.payload,
        id: Date.now(),
        createdAt: new Date().toISOString().slice(0, 10),
      };
      state.push(newCustomer);
    },
    updateCustomer: (state, action: PayloadAction<Customer>) => {
      const idx = state.findIndex(c => c.id === action.payload.id);
      if (idx !== -1) state[idx] = action.payload;
    },
    deleteCustomer: (state, action: PayloadAction<number>) => {
      return state.filter(c => c.id !== action.payload);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCustomers.fulfilled, (state, action) => {
        if (action.payload !== 'no-api') {
          return action.payload;
        }
      })
      .addCase(addCustomerAsync.fulfilled, (state, action) => {
        if (action.payload && action.payload !== 'no-api') {
          state.push(action.payload);
        }
      })
      .addCase(addCustomerAsync.rejected, (state, action: any) => {
        if (action.payload) {
          const newCustomer: Customer = {
            ...action.payload,
            id: Date.now(),
            createdAt: new Date().toISOString().slice(0, 10),
          };
          state.push(newCustomer);
        }
      })
      .addCase(updateCustomerAsync.fulfilled, (state, action) => {
        if (action.payload && action.payload !== 'no-api') {
          const idx = state.findIndex(c => c.id === action.payload.id);
          if (idx !== -1) state[idx] = action.payload;
        }
      })
      .addCase(updateCustomerAsync.rejected, (state, action: any) => {
        if (action.payload) {
          const idx = state.findIndex(c => c.id === action.payload.id);
          if (idx !== -1) state[idx] = action.payload;
        }
      })
      .addCase(deleteCustomerAsync.fulfilled, (state, action) => {
        return state.filter(c => c.id !== action.payload);
      })
      .addCase(deleteCustomerAsync.rejected, (state, action: any) => {
        return state.filter(c => c.id !== action.payload);
      });
  }
});

export const { addCustomer, updateCustomer, deleteCustomer } = customersSlice.actions;
export default customersSlice.reducer; 