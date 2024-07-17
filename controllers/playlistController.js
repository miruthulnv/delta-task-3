import * as factory from "./handlerFactory.js";
import Playlist from "../models/playlistModel.js";


export const getAllPlaylists = factory.getAll(Playlist);
export const createPlaylist = factory.createOne(Playlist);
export const getPlaylist = factory.getOne(Playlist)
export const updatePlaylist = factory.updateOne(Playlist);
export const deletePlaylist = factory.deleteOne(Playlist);