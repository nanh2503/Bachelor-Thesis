import express, { Application } from 'express'
import { handleDeleteUser, handleGetUser, requestRefreshToken } from '../controllers/userController'
import { deleteData, handleClickIncrease, handleFetchData, handleGetFavoriteFile, handleSetFavoriteFile, handleUpload, updateData } from '../controllers/fileController'
import { handlegenerateSignature } from '../controllers/signUploadController'
import { handleSetUserInfoController, handleUpdateUserInfoController } from '../controllers/userInfoController'
import middlewareController from '../middlewares/middlewareController'
import { handleCheckUserOTP, handleForgetPasswordUser, handleLogin, handleRegister, handleResetPasswordUser } from '../controllers/authController'
import { CreateAlbum, addFileToAlbum, getALlAlbum, viewFileInAlbum } from '../controllers/albumController'

const router = express.Router()

export const webRoutes = (app: Application) => {
    router.post('/api/checkOTP', handleCheckUserOTP)
    router.post('/api/register', handleRegister)
    router.post('/api/login', handleLogin)
    router.get('/api/get-user', middlewareController.verifyToken, handleGetUser)
    router.delete('/api/delete-user', middlewareController.verifyToken, handleDeleteUser)
    router.post('/api/upload', handleUpload)
    router.post('/api/sign-upload', handlegenerateSignature)
    router.get('/api/get-file', handleFetchData)
    router.get('/api/get-favorite-file', handleGetFavoriteFile)
    router.put('/api/update', updateData)
    router.delete('/api/delete', deleteData)
    router.post('/api/updateUserInfo', handleUpdateUserInfoController)
    router.post('/api/setUserInfo', handleSetUserInfoController)
    router.put('/api/click-increase', handleClickIncrease)
    router.put('/api/set-favorite', handleSetFavoriteFile)
    router.post('/api/forgerPassword', handleForgetPasswordUser)
    router.post('/api/resetPassword', handleResetPasswordUser)
    router.post('/refresh', requestRefreshToken);
    router.post('/api/create-album', CreateAlbum);
    router.get('/api/get-album', getALlAlbum)
    router.post('/api/add-file-to-album', addFileToAlbum)
    router.get('/api/view-file-in-album', viewFileInAlbum)

    router.get('/', (req, res) => {
        res.send("hello Nganh")
    })

    return app.use("/", router)
}
