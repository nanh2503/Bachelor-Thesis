import { FileItemInterface } from "src/components/common/SelectAlbumDialog"
import axios from "../axios"

export const handleCreateAlbumService = (userId: string, avatarUrl: string, albumName: string, description: string) => {
    return axios.post('/api/create-album', { userId, avatarUrl, albumName, description })
}

export const handleGetAllAlbumService = (userId: string, arg: string) => {
    return axios.get('/api/get-album', { params: { userId, arg } })
}

export const handleAddFileToAlbumService = (userId: string, albumId: string, file: FileItemInterface) => {
    return axios.post('/api/add-file-to-album', { userId, albumId, file })
}

export const handleViewFileInAlbumService = (userId: string, albumId: string) => {
    return axios.get('/api/view-file-in-album', { params: { userId, albumId } })
}