import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

interface Employee {
  id: number;
  username: string;
  fullName: string;
  phone: string;
  email: string;
  address: string;
  createdAt: string;
  role: string;
}

const initialState: Employee[] = [
  {
    id: 1,
    username: 'Cenvi_1',
    fullName: 'Lê Thăng Long',
    phone: '0342223605',
    email: 'lethanglong2807@gmail.com',
    address: 'Hải Phòng',
    createdAt: 'Ngày tạo',
    role: 'Manager'
  },
  {
    id: 2,
    username: 'Cenvi_2',
    fullName: 'Nguyễn Văn A',
    phone: '0987654321',
    email: 'nguyenvana@gmail.com',
    address: 'Hà Nội',
    createdAt: '15/03/2024',
    role: 'Staff'
  },
  {
    id: 3,
    username: 'Cenvi_3',
    fullName: 'Trần Thị B',
    phone: '0123456789',
    email: 'tranthib@gmail.com',
    address: 'Hồ Chí Minh',
    createdAt: '16/03/2024',
    role: 'Staff'
  }
];

export const fetchEmployees = createAsyncThunk('employees/fetchEmployees', async (_, { rejectWithValue }) => {
  try {
    const res = await axios.get('/api/employees');
    return res.data;
  } catch (_) {
    return rejectWithValue('no-api');
  }
});

export const addEmployeeAsync = createAsyncThunk('employees/addEmployee', async (employee: Omit<Employee, 'id' | 'createdAt'>, { rejectWithValue }) => {
  try {
    const res = await axios.post('/api/employees', employee);
    return res.data;
  } catch (_) {
    return rejectWithValue(employee);
  }
});

export const updateEmployeeAsync = createAsyncThunk('employees/updateEmployee', async (employee: Employee, { rejectWithValue }) => {
  try {
    const res = await axios.put(`/api/employees/${employee.id}`, employee);
    return res.data;
  } catch (_) {
    return rejectWithValue(employee);
  }
});

export const deleteEmployeeAsync = createAsyncThunk('employees/deleteEmployee', async (id: number, { rejectWithValue }) => {
  try {
    await axios.delete(`/api/employees/${id}`);
    return id;
  } catch (_) {
    return rejectWithValue(id);
  }
});

const employeesSlice = createSlice({
  name: 'employees',
  initialState,
  reducers: {
    addEmployee: (state, action: PayloadAction<Employee>) => {
      state.push(action.payload);
    },
    updateEmployee: (state, action: PayloadAction<Employee>) => {
      const index = state.findIndex(emp => emp.id === action.payload.id);
      if (index !== -1) {
        state[index] = action.payload;
      }
    },
    deleteEmployee: (state, action: PayloadAction<number>) => {
      return state.filter(emp => emp.id !== action.payload);
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchEmployees.pending, () => {
        // Handle pending state
      })
      .addCase(fetchEmployees.fulfilled, (_, action) => {
        return action.payload;
      })
      .addCase(fetchEmployees.rejected, () => {
        // Handle rejected state
      })
      .addCase(addEmployeeAsync.fulfilled, (state, action) => {
        state.push(action.payload);
      })
      .addCase(updateEmployeeAsync.fulfilled, (state, action) => {
        const index = state.findIndex(emp => emp.id === action.payload.id);
        if (index !== -1) {
          state[index] = action.payload;
        }
      })
      .addCase(deleteEmployeeAsync.fulfilled, (state, action) => {
        return state.filter(emp => emp.id !== action.payload);
      });
  }
});

export const { addEmployee, updateEmployee, deleteEmployee } = employeesSlice.actions;
export default employeesSlice.reducer; 