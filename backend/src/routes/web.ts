import express, { Application } from 'express'
import { handleLogin, handleRegister } from '../controllers/userController'
import { handleUpload } from '../controllers/fileController'
import { handlegenerateSignature } from '../controllers/signUploadController'

const router = express.Router()

export const webRoutes = (app: Application) => {
    router.post('/api/login', handleLogin)
    router.post('/api/register', handleRegister)
    router.post('/api/upload', handleUpload)
    router.post('/api/sign-upload', handlegenerateSignature)
    router.get('/', (req, res) => {
        res.send("hello Nganh")
    })

    return app.use("/", router)
}
