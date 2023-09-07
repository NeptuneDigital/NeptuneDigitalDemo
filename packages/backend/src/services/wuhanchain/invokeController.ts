import { NextFunction, Request, Response } from 'express';
import fs from 'fs';
import path from 'path';
//import jszip from 'jszip';
import { uploadPath, projectRootDir } from '../../config';
import compressing from 'compressing';
import web3 from 'web3';
const solc = require('solc');

export const invoke = (req: Request, res: Response, next: NextFunction) => {
	console.log('enter into invoke function backend');
	//console.log(req.params);
};
