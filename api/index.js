import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import userRouter from './routes/User.js';
import authRouter from './routes/Auth.js';
import storyRouter from './routes/Story.js';
import cors from 'cors';
import cookieParser from 'cookie-parser';

dotenv.config();

mongoose 
    .connect(process.env.MONGO_URI)
    .then(() => {
        console.log('Conectado ao MongoDB!');
    })
    .catch((err) => { 
        console.log('Erro ao conectar com MongoDB: ' + err);
    })

const app = express();
const PORT = 8080;
 
app.use(express.json()); 
app.use(cors());
app.use(cookieParser());

app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
})

//-----------------------------------------------------------------//

app.use('/api/user', userRouter);
app.use('/api/auth', authRouter); 
app.use('/api/story', storyRouter); 

app.use((err,req,res,next)=>{
    const statusCode = err.statusCode || 500;
    const message = err.message || 'Internal Server Error';
    return res.status(statusCode).json({
        success: false,
        statusCode,
        message 
    })
})  