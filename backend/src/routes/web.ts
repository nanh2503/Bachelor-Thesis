import express, { Application } from 'express'
import { handleLogin, handleRegister } from '../controllers/userController'
import { deleteData, handleFetchData, handleUpload, updateData } from '../controllers/fileController'
import { handlegenerateSignature } from '../controllers/signUploadController'
import { handleSetUserInfoController } from '../controllers/userInfoController'

const router = express.Router()

export const webRoutes = (app: Application) => {
    router.post('/api/login', handleLogin)
    router.post('/api/register', handleRegister)
    router.post('/api/upload', handleUpload)
    router.post('/api/sign-upload', handlegenerateSignature)
    router.get('/api/get-file', handleFetchData)
    router.put('/api/update', updateData)
    router.delete('/api/delete', deleteData)
    router.post('/api/setUserInfo', handleSetUserInfoController)
    router.get('/', (req, res) => {
        res.send("hello Nganh")
    })

    return app.use("/", router)
}
