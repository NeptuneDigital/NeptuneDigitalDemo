import express from 'express';
import multer from 'multer';
import * as controller from './controller';
import { config, uploadPath } from '../../config';

export const uploadRouter = express.Router();

const upload = multer({
	storage: multer.diskStorage({
		destination: function (req, file, cb) {
			cb(null, uploadPath);
		},
		filename: function (req, file, cb) {
			// const changedName =
			// 	String(new Date().getTime()) + String('-') + file.originalname;
			cb(null, file.originalname);
		},
	}),
});

/** POST /api/upload */
uploadRouter.post('/', upload.single('file'), controller.upload);

/** POST /api/upload */
uploadRouter.route('/').get(controller.test);
