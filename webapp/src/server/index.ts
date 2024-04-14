import 'dotenv/config'
import express from 'express';
import cors from 'cors';
import userRoutes from './routes/user.ts';
import memberRoutes from './routes/member.ts';
import trainerRoutes from './routes/trainer.ts';
import adminRoutes from './routes/admin.ts';

const port = process.env.SERVER_PORT || 3000;

const webApp = express();

webApp.use(cors({
  origin: `http://localhost:${process.env.CLIENT_PORT}`
}));

webApp.use(express.json());

webApp.use('/api/user', userRoutes);
webApp.use('/api/member', memberRoutes);
webApp.use('/api/trainer', trainerRoutes);
webApp.use('/api/admin', adminRoutes);

webApp.listen(port, () => {
  console.log("Server listening on port ", port);
})
