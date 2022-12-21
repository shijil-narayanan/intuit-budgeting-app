

import {useEffect} from 'react';
import { useSelector, useDispatch  } from 'react-redux';
import { selectAllTags, getTagsAsync, addTagAsync, deleteTagAsync, updateTagAsync } from '../features/tags/tagsSlice';

export function useTags(){
    const dispatch = useDispatch();
    const tags = useSelector(selectAllTags);
    const tagsRetrieveStatus = useSelector((state) => state.tags.tagsRetrieveStatus);
    const error = useSelector((state) => state.tags.error);

    const addTag = (payload) => {
        dispatch(addTagAsync(payload));
    }

    const deleteTag = (payload) => {
        dispatch(deleteTagAsync(payload));
    }

    const updateTag = (payload) => {
        dispatch(updateTagAsync(payload))
    } 
    
    useEffect(() => {
        if (tagsRetrieveStatus === 'idle') {
          dispatch(getTagsAsync())
        }
    }, [tagsRetrieveStatus, dispatch]);

    return {tags, tagsRetrieveStatus, error, addTag, deleteTag, updateTag}
}

