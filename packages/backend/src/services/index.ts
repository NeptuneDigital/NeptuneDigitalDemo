import express from 'express';

import { authRouter } from './auth';
import { userRouter } from './users';
import { uploadRouter } from './upload';
import { wuhanchainRouter } from './wuhanchain';

export const services = express.Router();

services.use('/auth', authRouter);
services.use('/users', userRouter);
services.use('/upload', uploadRouter);
services.use('/wuhanchain', wuhanchainRouter);
