import axios from "axios";
import {showAlert} from "./alert.js";

const likeCount = document.querySelector('.like__count');
const likeBtn = document.querySelector('.song__like--button');
export const updateStatus = async () => {
    try {
        const songId = document.querySelector('.song__container--big').getAttribute('id');
        const response = await axios.get(`/api/v1/songs/isSongLiked/${songId}`);
        const isLiked = response.data.like;
        likeBtn.innerHTML = `<img style="margin-left:4px" src="/img/static/${isLiked? 'like-filled':'like'}.svg" alt="like" height="18px">`
        return isLiked
    }catch(err){
        showAlert("error",err.response.data.message);
    }
}

export const likeSong = async() =>{
    try {
        const songId = document.querySelector('.song__container--big').getAttribute('id');

        const response = await axios.patch(`/api/v1/songs/${songId}/like`);
        const isLiked = await updateStatus(likeBtn);
        if (isLiked){
            likeCount.textContent = parseInt(likeCount.textContent) + 1;
        }
        else{
            likeCount.textContent = parseInt(likeCount.textContent) - 1;
        }
        showAlert("success",response.data.message);
    }catch(err){
        showAlert("error",err.response.data.message);
    }
}