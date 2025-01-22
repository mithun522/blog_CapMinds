import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface Blog {
    id: number;
    title: string;
    author: string;
    content: string;
    image_url: string;
}

interface BlogState {
    blogs: Blog[];
    currentBlog: Blog | null;
}

const initialState: BlogState = {
    blogs: [],
    currentBlog: null,
};

const blogSlice = createSlice({
    name: 'blogs',
    initialState,
    reducers: {
        setBlogs: (state, action: PayloadAction<Blog[]>) => {
            state.blogs = action.payload;
        },
        setCurrentBlog: (state, action: PayloadAction<Blog>) => {
            state.currentBlog = action.payload;
        },
        addBlog: (state, action: PayloadAction<Blog>) => {
            state.blogs.push(action.payload);
        },
        updateBlog: (state, action: PayloadAction<Blog>) => {
            const index = state.blogs.findIndex(blog => blog.id === action.payload.id);
            if (index !== -1) {
                state.blogs[index] = action.payload;
            }
        },
        deleteBlog: (state, action: PayloadAction<number>) => {
            state.blogs = state.blogs.filter(blog => blog.id !== action.payload);
        },
    },
});

export const { setBlogs, setCurrentBlog, addBlog, updateBlog, deleteBlog } = blogSlice.actions;

export default blogSlice.reducer;
