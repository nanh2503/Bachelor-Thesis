import express, { Application } from 'express'
import { handleLogin, handleRegister } from '../controllers/userController'

const router = express.Router()

export const webRoutes = (app: Application) => {
    router.post('/api/login', handleLogin)
    router.post('/api/register', handleRegister)
    router.get('/', (req, res) => {
        res.send("hello Nganh")
    })

    return app.use("/", router)
}
