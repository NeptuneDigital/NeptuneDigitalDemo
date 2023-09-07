import { NextFunction, Request, Response } from 'express';
import fs from 'fs';
import path from 'path';
//import jszip from 'jszip';
import { uploadPath, projectRootDir } from '../../config';
import compressing from 'compressing';
import web3 from 'web3';
const solc = require('solc');

export const deploy = (req: Request, res: Response, next: NextFunction) => {
	console.log('enter into deploy function backend');
	console.log(req.params);
	console.log(req.body);

	// const { smartContractZipFileName,initParams } = req.body;

	// const index = String(smartContractZipFileName).indexOf('.zip');

	// // /*/*.sol
	// const smartContractZipFileNameStr = String(
	// 	smartContractZipFileName
	// ).substring(0, index);

	// const smartContractZipFilePath = path.join(
	// 	projectRootDir,
	// 	uploadPath,
	// 	smartContractZipFileName
	// );

	// const unZipFilePath = smartContractZipFilePath.substring(
	// 	0,
	// 	smartContractZipFilePath.indexOf('.zip')
	// );

	// // Initialization
	// const bytecode = fs.readFileSync(
	// 	path.join(unZipFilePath,smartContractZipFileNameStr,".bytecode"),
	// 	'binary'
	// );
	// const abi = fs.readFileSync(
	// 	path.join(unZipFilePath,smartContractZipFileNameStr,".abi"),
	// 	'binary'
	// );
	// const privKey =
	// 	'99B3C12287537E38C90A9219D4CB074A89A16E9CDB20BF85728EBD97C343E342'; // Genesis private key
	// const address = '0x6Be02d1d3665660d22FF9624b7BE0551ee1Ac91b';
	// const web3 = new Web3('http://localhost:9933');
	// // Deploy contract
	// const deploy = async () => {
	// 	console.log('Attempting to deploy from account:', address);
	// 	const incrementer = new web3.eth.Contract(abi);
	// 	const incrementerTx = incrementer.deploy({
	// 		data: bytecode,
	// 		arguments: [5],
	// 	});
	// 	const createTransaction = await web3.eth.accounts.signTransaction(
	// 		{
	// 			from: address,
	// 			data: incrementerTx.encodeABI(),
	// 			gas: '4294967295',
	// 		},
	// 		privKey
	// 	);
	// 	const createReceipt = await web3.eth.sendSignedTransaction(
	// 		createTransaction.rawTransaction
	// 	);
	// 	console.log('Contract deployed at address', createReceipt.contractAddress);
	// };
};
