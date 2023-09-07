import { NextFunction, Request, Response } from 'express';
import fs from 'fs';

export const upload = (req: Request, res: Response, next: NextFunction) => {
	console.log('enter into upload function backend');
	//console.log(req.params);
	//console.log(req.file?.filename);
	if (req.file) {
		// 文件上传成功，respones给客户端
		const response = {
			message: 'Upload File  successfully',
			filename: req.file.originalname,
		};
		console.log(response);
		return res.json('Upload File successfully');
	} else {
		console.log('Upload File failed!');
		return res.status(500).json('Upload File failed!');
	}

	// if (req.file) {
	// 	const fileName = req.file.originalname;
	// 	const des_file = __dirname + '/' + req.file.originalname; //目标文件名

	// 	console.log(
	// 		'fileInfo:' +
	// 			String(req.file) +
	// 			',fileName:' +
	// 			fileName +
	// 			',des_file:' +
	// 			des_file
	// 	);

	// 	fs.readFile(req.file.path, function (err, data) {
	// 		// 异步读取文件内容
	// 		fs.writeFile(des_file, data, function (err) {
	// 			// des_file是文件名，data，文件数据，异步写入到文件
	// 			if (err) {
	// 				console.log(err);
	// 			} else {
	// 				// 文件上传成功，respones给客户端
	// 				const response = {
	// 					message: 'File uploaded successfully',
	// 					filename: fileName,
	// 				};
	// 				console.log(response);
	// 				return res.json(response);
	// 			}
	// 		});
	// 	});
	// } else {
	// }
};

export const test = (req: Request, res: Response, next: NextFunction) => {
	console.log('enter into test function backend');
	res.json(JSON.stringify('test Successfully'));
};
