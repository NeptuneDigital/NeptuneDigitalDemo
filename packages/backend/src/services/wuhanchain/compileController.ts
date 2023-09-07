import { NextFunction, Request, Response } from 'express';
import fs from 'fs';
import path from 'path';
//import jszip from 'jszip';
import { uploadPath, projectRootDir } from '../../config';
import compressing from 'compressing';
import web3 from 'web3';
const solc = require('solc');

export const compile = (req: Request, res: Response, next: NextFunction) => {
	console.log('enter into compile function backend');
	console.log(req.params);
	console.log(req.body);

	const { smartContractZipFileName } = req.body;
	if (!smartContractZipFileName)
		return res
			.status(400)
			.send({ error: 'Request should have smartContract zip file name' });

	//******Step1:Unzip the zip file
	const index = String(smartContractZipFileName).indexOf('.zip');

	//get *.sol  filename
	const smartContractZipFileNameStr = String(
		smartContractZipFileName
	).substring(0, index);

	//get /*/*.sol.zip filename
	const smartContractZipFilePath = path.join(
		projectRootDir,
		uploadPath,
		smartContractZipFileName
	);
	// read zip file
	const smartContractZipFile = fs.readFileSync(
		smartContractZipFilePath,
		'binary'
	);
	//生成解压缩存储的目录
	const unZipFilePath = smartContractZipFilePath.substring(
		0,
		smartContractZipFilePath.indexOf('.zip')
	);
	console.log('smartContractZipFilePath:' + smartContractZipFilePath);
	console.log('unZipFilePath:' + unZipFilePath);

	compressing.zip
		.uncompress(smartContractZipFilePath, unZipFilePath)
		.then(() => {
			console.log(
				'*******Unzip ' + smartContractZipFileName + ' successfully'
			);

			////******Step2:compile smart contract file
			// Compile the source code
			try {
				console.log(
					'souce sol file: ' +
						path.join(unZipFilePath, smartContractZipFileNameStr)
				);
				const input = fs.readFileSync(
					path.join(unZipFilePath, smartContractZipFileNameStr)
				);
				const contract = 'contract';
				const inputPrarm = {
					language: 'Solidity',
					sources: {
						contract: {
							content: input.toString(),
						},
					},
					settings: {
						outputSelection: {
							'*': {
								'*': ['*'],
							},
						},
					},
				};

				//1.write *.compile file
				const compileStr = solc.compile(JSON.stringify(inputPrarm));
				const output = JSON.parse(compileStr);

				//如果编译出错直接返回。
				if (output['errors']) {
					const errInfo =
						'Compile ' +
						smartContractZipFileNameStr +
						' error. ErrInfo: ' +
						JSON.stringify(output['errors']);
					console.log(errInfo);
					return res.status(500).json(errInfo);
				}
				fs.writeFileSync(
					path.join(unZipFilePath, smartContractZipFileNameStr) +
						'.compile',
					compileStr
				);

				//2.write *.bytecode file
				const solFileName = smartContractZipFileNameStr.substring(
					0,
					smartContractZipFileNameStr.indexOf('.sol')
				);
				const bytecode =
					output.contracts[contract][solFileName].evm.bytecode.object;
				fs.writeFileSync(
					path.join(unZipFilePath, smartContractZipFileNameStr) +
						'.bytecode',
					String(bytecode)
				);

				//3.write *.abi file
				const abi = output.contracts[contract][solFileName].abi;
				fs.writeFileSync(
					path.join(unZipFilePath, smartContractZipFileNameStr) +
						'.abi',
					JSON.stringify(abi)
				);

				const responseStr = {
					message:
						'Compile ' +
						smartContractZipFileNameStr +
						' successfully',
					abi: JSON.stringify(abi),
					bytecode: String(bytecode),
				};
				console.log(responseStr);
				return res.json(responseStr);
			} catch (error) {
				const err = error as Error;
				console.error('Compile error!Reason:', err);
				return res
					.status(500)
					.json('Compile error!Reason:' + err.message);
			}
		})
		.catch((error) => {
			const err = error as Error;
			console.log(
				'Unzip ' +
					smartContractZipFileName +
					' failed.ErrInfo: ' +
					err.message
			);
			return res
				.status(500)
				.json(
					'Unzip ' +
						smartContractZipFileName +
						' failed.ErrInfo: ' +
						err.message
				);
		});
};

//use jzip way
// //create smartContract root folder
// fs.mkdirSync(unZipFilePath, { recursive: true });

// jszip.loadAsync(smartContractZipFile).then((zipfiles) => {
// 	for (const filename of Object.keys(zipfiles['files'])) {
// 		console.log('unzip filename:' + filename);

// 		const writeDest = path.join(unZipFilePath, filename);

// 		// 如果该文件为目录需先创建文件夹
// 		if (
// 			zipfiles.files[filename].dir &&
// 			fs.lstatSync(writeDest).isDirectory()
// 		) {
// 			fs.mkdirSync(writeDest, { recursive: true });
// 		} else {
// 			// 把每个文件buffer写到硬盘中
// 			zipfiles.files[filename]
// 				.async('nodebuffer')
// 				.then((content: string | NodeJS.ArrayBufferView) => {
// 					fs.writeFileSync(writeDest, content);
// 				});
// 		}
// 	}
// });
