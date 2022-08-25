import express from "express"
import multer from "multer"
import cors from "cors"

import mongoose from "mongoose";
import {loginValidation, registerValidation} from "./validations/auth.js"
import {postCreateValidation} from "./validations/post.js";


import {UserController, PostController} from "./controllers/index.js"
import {handleValidationErrors, checkAuth} from "./utils/index.js";


const PORT = 4444
export const SECRET_KEY = 'secret key'
const API_URL = "mongodb+srv://admin:12345@cluster0.tjfokrc.mongodb.net/blog?retryWrites=true&w=majority"

mongoose.connect(`${API_URL}`).then(() => {
    console.log('database is connected')
}).catch((err) => console.log(err, "database error"))
const app = express()

const storage = multer.diskStorage({
    destination: (_, __, cb) => {
        cb(null, "uploads")
    }, filename: (_, file, cb) => {
        cb(null, file.originalname)
    },
})

const upload = multer({storage})
app.use(express.json())
app.use(cors())
app.use('/uploads', express.static('uploads'))

app.post('/auth/login', loginValidation, handleValidationErrors, UserController.login)
app.post('/auth/register', registerValidation, handleValidationErrors, UserController.register)
app.get('/auth/me', checkAuth, UserController.getMe)

app.post('/upload', checkAuth, upload.single('image'), async (req, res) => {
    try {
        res.json({
            url: `uploads/${req.file.originalname}`
        })
    } catch (err) {
        console.log(err)
    }
})

app.get('/posts', PostController.getAll)
app.get('/posts/tags', PostController.getLastTags)
app.get('/posts/:id', PostController.getOne)
app.post('/posts', checkAuth, postCreateValidation, handleValidationErrors, PostController.create)
app.delete('/posts/:id', checkAuth, PostController.remove)
app.patch('/posts/:id', checkAuth, postCreateValidation, handleValidationErrors, PostController.update)


app.listen(PORT, (err) => {
    if (err) {
        return console.log(err)
    }
    console.log(`Server started on ${PORT}`)
})