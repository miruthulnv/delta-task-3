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
        showAlert("success", response.data.message);
    } catch (err) {
        console.log(err)
        showAlert("error", err.response.data.message);
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
        showAlert("success", response.data.message);
        return playlistId;
    } catch (err) {
        showAlert("error", err.response.data.message);
    }
}

export const removeSong = async (playlistId, songId) => {
    try {
        const response = await axios({
            method: "DELETE",
            url: `/api/v1/playlists/${playlistId}/updateSongs`,
            data: {
                song: songId,
            }
        });
        showAlert("success", response.data.message);
    } catch (err) {
        showAlert("error", err.response.data.message);
    }
}