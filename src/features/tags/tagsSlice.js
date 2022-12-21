import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import {http} from '../../utils/http/http';

const initialState = {
    tags: [],
    tagsRetrieveStatus: 'idle',
    tagAddStatus: 'idle',
    tagUpdateStatus: 'idle',
    tagDeleteStatus: 'idle',
    getTagsError: null,
    addTagError: null,
    updateTagError: null,
    deleteTagError: null
}


export const getTagsAsync = createAsyncThunk(
	'tags/getTagsAsync',
	async () => {
        const response = await http.get('/tags');
        return response.data;
	}
);

export const addTagAsync = createAsyncThunk(
	'tags/addTagAsync',
	async (payload) => {
        const response = await http.post('/tags', payload);
		return response.data;
	}
);

export const deleteTagAsync = createAsyncThunk(
	'tags/deleteTagAsync',
	async (payload) => {
        await http.delete(`/tags/${payload._id}`);
        return payload;
	}
);

export const updateTagAsync = createAsyncThunk(
	'tags/updateTagAsync',
	async (payload) => {
        await http.put(`/tags/${payload._id}`, payload);
        return payload;
	}
);

export const tagsSlice = createSlice({
  name: 'tags',
  initialState,
	reducers: {},
	extraReducers(builder) {
        builder
        .addCase(getTagsAsync.pending, (state, action) => {
            state.tagsRetrieveStatus = 'loading'
        })
        .addCase(getTagsAsync.fulfilled, (state, action) => {
            state.tagsRetrieveStatus = 'succeeded'
            state.tags = action.payload;
        })
        .addCase(getTagsAsync.rejected, (state, action) => {
            state.tagsRetrieveStatus = 'failed'
            state.error = action.error.message
        })


        .addCase(addTagAsync.pending, (state, action) => {
            state.tagAddStatus = 'adding'
        })
        .addCase(addTagAsync.fulfilled, (state, action) => {
            state.tagAddStatus = 'succeeded';
            state.tags = state.tags.concat(action.payload)
        })
        .addCase(addTagAsync.rejected, (state, action) => {
            state.tagAddStatus = 'failed';
            state.addTagError = action.error.message;
        })

        .addCase(deleteTagAsync.pending, (state, action) => {
            state.tagDeleteStatus = 'deleting';
        })
        .addCase(deleteTagAsync.fulfilled, (state, action) => {
            state.tagDeleteStatus = 'succeeded';
            state.tags = state.tags.filter((tag) => tag._id !== action.payload._id);
        })
        .addCase(deleteTagAsync.rejected, (state, action) => {
            state.tagDeleteStatus = 'failed';
            state.deleteTagError = action.error.message;
        })

        .addCase(updateTagAsync.pending, (state, action) => {
            state.tagUpdateStatus = 'updating';
        })
        .addCase(updateTagAsync.fulfilled, (state, action) => {
            const id = action.payload.id;
            delete action.payload.id;
            state.tagUpdateStatus = 'succeeded';
            state.tags = state.tags.map((tag) => tag._id === id ?  {...tag, ...action.payload} : tag);
        })
        .addCase(updateTagAsync.rejected, (state, action) => {
            state.tagUpdateStatus = 'failed';
            state.deleteTagError = action.error.message;
        })
	}
})

export const { addTag, deleteTag } = tagsSlice.actions
export default tagsSlice.reducer;

export const selectAllTags = (state) => state.tags.tags;


