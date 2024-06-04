import express, { Application } from 'express'
import { handleCheckUserOTP, handleLogin, handleRegister } from '../controllers/userController'
import { deleteData, handleClickIncrease, handleFetchData, handleSetFavoriteFile, handleUpload, updateData } from '../controllers/fileController'
import { handlegenerateSignature } from '../controllers/signUploadController'
import { handleSetUserInfoController, handleUpdateUserInfoController } from '../controllers/userInfoController'

const router = express.Router()

export const webRoutes = (app: Application) => {
    router.post('/api/checkOTP', handleCheckUserOTP)
    router.post('/api/register', handleRegister)
    router.post('/api/login', handleLogin)
    router.post('/api/upload', handleUpload)
    router.post('/api/sign-upload', handlegenerateSignature)
    router.get('/api/get-file', handleFetchData)
    router.put('/api/update', updateData)
    router.delete('/api/delete', deleteData)
    router.post('/api/updateUserInfo', handleUpdateUserInfoController)
    router.post('/api/setUserInfo', handleSetUserInfoController)
    router.put('/api/click-increase', handleClickIncrease)
    router.put('/api/set-favorite', handleSetFavoriteFile)
    router.get('/', (req, res) => {
        res.send("hello Nganh")
    })

    return app.use("/", router)
}
