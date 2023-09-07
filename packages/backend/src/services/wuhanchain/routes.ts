import express from 'express';
import * as compileController from './compileController';
import * as deployController from './deployController';
import * as invokeController from './invokeController';

export const wuhanchainRouter = express.Router();

/** POST /api/wuchain/compile */
wuhanchainRouter.post('/compile', compileController.compile);

/** POST /api/wuchain/deploy */
wuhanchainRouter.post('/deploy', deployController.deploy);

/** POST /api/wuchain/invoke */
wuhanchainRouter.post('/invoke', invokeController.invoke);
