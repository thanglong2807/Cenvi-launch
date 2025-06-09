import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface Blog {
  id: number;
  title: string;
  author: string;
  category: string;
  createdAt: string;
  tags: string;
  detail: string;
}

const initialState: Blog[] = [
  { id: 1, title: "Bài viết 1", author: "Admin", category: "Kế toán thuế", createdAt: "2024-06-01", tags: "doanh nghiệp", detail: "Chi tiết 1" },
  { id: 2, title: "Bài viết 2", author: "User", category: "Thành lập doanh nghiệp", createdAt: "2024-06-02", tags: "hợp tác", detail: "Chi tiết 2" },
  { id: 3, title: "Bài viết 3", author: "Admin", category: "Ngành nghề có điều kiện", createdAt: "2024-06-03", tags: "điều kiện", detail: "Chi tiết 3" },
  { id: 4, title: "Bài viết 4", author: "User", category: "Ký kết hợp tác", createdAt: "2024-06-04", tags: "hợp tác", detail: "Chi tiết 4" },
  { id: 5, title: "Bài viết 5", author: "Admin", category: "Kế toán thuế", createdAt: "2024-06-05", tags: "thuế", detail: "Chi tiết 5" },
  { id: 6, title: "Bài viết 6", author: "User", category: "Thành lập doanh nghiệp", createdAt: "2024-06-06", tags: "doanh nghiệp", detail: "Chi tiết 6" },
  { id: 7, title: "Bài viết 7", author: "Admin", category: "Ngành nghề có điều kiện", createdAt: "2024-06-07", tags: "điều kiện", detail: "Chi tiết 7" },
  { id: 8, title: "Bài viết 8", author: "User", category: "Ký kết hợp tác", createdAt: "2024-06-08", tags: "hợp tác", detail: "Chi tiết 8" },
];

const blogSlice = createSlice({
  name: 'blogs',
  initialState,
  reducers: {
    addBlog: (state, action: PayloadAction<Omit<Blog, 'id' | 'createdAt'>>) => {
      const newBlog: Blog = {
        ...action.payload,
        id: Date.now(),
        createdAt: new Date().toISOString().slice(0, 10),
      };
      state.push(newBlog);
    },
    updateBlog: (state, action: PayloadAction<Blog>) => {
      const idx = state.findIndex(b => b.id === action.payload.id);
      if (idx !== -1) state[idx] = action.payload;
    },
    deleteBlog: (state, action: PayloadAction<number>) => {
      return state.filter(b => b.id !== action.payload);
    },
  },
});

export const { addBlog, updateBlog, deleteBlog } = blogSlice.actions;
export default blogSlice.reducer; 