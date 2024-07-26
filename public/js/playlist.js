import axios from "axios";
import {showAlert} from "./alert.js";

export const addSong = async (playlistId, songId) => {
    try {
        console.log(playlistId, songId)
        const response = await axios(
            {
                method: "POST",
                url: `/api/v1/playlists/${playlistId}/updateSongs`,
                data: {
                    song: songId,
                }
            }
        );
    } catch (err) {
        console.log(err)
    }
}

export const removeSong = async (playlistId, songId) => {
    try {
        await axios({
            method: "DELETE",
            url: `/api/v1/playlists/${playlistId}/updateSongs`,
            data: {
                song: songId,
            }
        });
    } catch (err) {
        console.log(err)
    }
}

export const addPlaylist = async (name) => {
    try {
        const response = await axios({
            method: "POST",
            url: `/api/v1/playlists`,
            data: {
                name,
            }
        });
        const playlistId = response.data.data._id;
        return playlistId;
    } catch (err) {
        // console.log(err)
    }
}

export const closePlaylistModal = () => {
    document.getElementById('myModal').style.display = 'none';
}

export const submitPlaylistModel = async (e) => {
    e.preventDefault();
    try{
        const songId = window.location.href.split('/').pop();
        console.log('Form submitted');
        // Get list of all the check boxes chosen in that form
        const checkboxes = [...document.querySelectorAll('input[type="checkbox"]:checked')].map(el=> el.value);
        const uncheckboxes = [...document.querySelectorAll('input[type="checkbox"]:not(:checked)')].map(el=> el.value);
        await checkboxes.forEach(el => {
            addSong(el, songId);
            // Add songs to all these playlists
        });
        await uncheckboxes.forEach(el => {
            // Remove songs from all these playlists
            removeSong(el,songId);
        });
        // Get the input text given by user

        const inputText = document.getElementById('newPlaylist').value;
        if (inputText!== '') {
            const playlistId = await addPlaylist(inputText);
            // Create a new playlist with input text and add song to that
            await addSong(playlistId, songId);
        }
        showAlert('success','Updated playlist(s)');
        closePlaylistModal();
    }catch(err){
        showAlert('error',err.response.data.message);
    }
}

export const deletePlaylist = async (e)=>{
    e.preventDefault();
    const playlistId = document.querySelector('.song__card').getAttribute('id');
    const op = await axios({
        method: 'DELETE',
        url: `/api/v1/playlists/${playlistId}`,
    });
    if(op.data.status === 'success'){
        showAlert('success','Playlist deleted successfully');
        window.location.href = '/playlists';
    }else{
        showAlert('error','Error deleting playlist');
    }
}
