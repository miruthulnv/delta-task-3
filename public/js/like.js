import axios from "axios";
import {showAlert} from "./alert.js";


export const updateStatus = async (likeBtn) => {
    try {
        const songId = window.location.href.split('/').pop();
        const response = await axios.get(`/api/v1/songs/isSongLiked/${songId}`);
        const isLiked = response.data.like;
        likeBtn.innerHTML = `<img style="margin-left:4px" src="/img/static/${isLiked? 'like-filled':'like'}.svg" alt="like" height="18px">`

    }catch(err){
        showAlert("error",err.response.data.message);
    }
}

export const likeSong = async(likeBtn) =>{
    try {
        const songId = window.location.href.split('/').pop();
        const response = await axios.patch(`/api/v1/songs/${songId}/like`);
        await updateStatus(likeBtn);
        showAlert("success",response.data.message);
    }catch(err){
        showAlert("error",err.response.data.message);
    }
}