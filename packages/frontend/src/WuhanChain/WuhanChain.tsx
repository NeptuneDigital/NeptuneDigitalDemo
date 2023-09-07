import './WuhanChain.css';

import jwtDecode from 'jwt-decode';
import React, { useState, useEffect } from 'react';
import Blockies from 'react-blockies';
import { web3Instance } from '../util';
import success from './success.png';
import fs from 'fs';
import { UploadFile } from './uploadFile';
import { SmartContract } from './smartContract';
import { values } from 'lodash';
import { AbiItem } from 'web3-utils';
import {
	handleAbiTextareaChange,
	handleFunctionNameSelectChange,
} from './handleChange';

export const WuhanChain = (): JSX.Element => {
	const [fileRawData, setFile] = useState(new FormData());

	//Loading flag
	const [uploadLoading, setUploadLoading] = useState(false);
	const [compileLoading, setCompileLoading] = useState(false);
	const [deployLoading, setDeployLoading] = useState(false);
	const [invokeLoading, setInvokeLoading] = useState(false);

	//Step message flag
	const [step1Message, setStep1Message] = useState(false);
	const [step2Message, setStep2Message] = useState(false);

	//callFalg, query or invoke
	const [callFalg, setCallFlag] = useState('invoke');

	useEffect(() => {
		console.log('effect');
		setCallFlag(callFalg);
	}, []); //如果改成 " },[]);  "" ,则第一次不会

	// const initInitParms=(functionInfo:AbiItem,initParamsLabel:HTMLLabelElement)=>{

	// }

	return (
		<>
			<div>
				<p>
					<b>1.Test Deploy Smart Contract</b>
				</p>
				<label htmlFor="addressForSend">
					Step1: Upload Smart Contract File(*.zip) :{' '}
				</label>
				<form
					id="fileForm"
					className="hidden"
					action="http://localhost:8000/upload/"
					method="post"
					encType="multipart/form-data"
				>
					<input
						className="inputFile"
						id="smartContractZipFile"
						type="file"
						name="smartContractZipFile"
						accept=".zip"
						onChange={(e) =>
							UploadFile.handleChooseFileForInputFile(e, setFile)
						}
					/>
					<input id="submitButton" type="submit" className="hidden" />
				</form>
				<button
					className="button-choose-file "
					onClick={(e) =>
						UploadFile.handleChooseFile(e, 'smartContractZipFile')
					}
					name="Choose File"
				>
					Choose File
				</button>
				<input id="fileName" className="input-params" readOnly={true} />
				<span>
					<p className="note-style">(Example: Store.sol.zip )</p>
				</span>
				<button
					className="button-upload-style "
					disabled={uploadLoading}
					onClick={(e) =>
						UploadFile.handleUploadFile(
							e,
							setUploadLoading,
							fileRawData,
							setStep1Message
						)
					}
				>
					{uploadLoading ? 'Loading...' : 'Upload'}
				</button>
				{step1Message ? (
					<span id="step1Span">
						<img
							src={success}
							className="profile-success"
							alt="success"
						/>
						<span id="step1Message" className="stepMessage">
							Step1 finished!
						</span>
					</span>
				) : (
					''
				)}
				<br />
				<span className="uploadFileNote">
					<p className="note-style">
						(Note:The zip file name must be consistent with the sol
						file name in the zip package and the class name of the
						smart contract )
					</p>
				</span>
				<br />
				<br />
				<label htmlFor="compileSmartContract">
					Step2: Compile Smart Contract:{' '}
				</label>
				<button
					className="button-compile-style "
					disabled={compileLoading}
					onClick={(e) =>
						SmartContract.handleCompileSmartContract(
							e,
							'smartContractZipFile',
							'abiTextarea',
							'byteCodeTextarea',
							step1Message,
							setStep2Message,
							setCompileLoading
						)
					}
				>
					{compileLoading ? 'Loading...' : 'Compile'}
				</button>
				{step2Message ? (
					<span id="step2Span">
						<img
							src={success}
							className="profile-success"
							alt="success"
						/>
						<span id="step2Message" className="stepMessage">
							Step2 finished!
						</span>
					</span>
				) : (
					''
				)}
				<br />
				<span className="textarea-style">
					<label className="textarea-lable">ABI:</label>
					<textarea
						id="abiTextarea"
						className="textarea-style"
						cols={50}
						rows={5}
						readOnly={false}
						placeholder={'ABI info will display here.'}
						onChange={(e) =>
							handleAbiTextareaChange(
								e,
								'abiTextarea',
								'initParamsLabelId',
								'invokeFunctionName'
							)
						}
					/>
				</span>
				<span className="textarea-style">
					<label className="textarea-lable">ByteCode:</label>
					<textarea
						id="byteCodeTextarea"
						className="textarea-style"
						cols={50}
						rows={5}
						readOnly={true}
						placeholder={'ByteCode info will display here.'}
					/>
				</span>
				<br />
				<span className="lable-step3">
					Step3: Deploy Smart Contract:
				</span>
				<br />
				<label htmlFor="initParms" className="lable-step3">
					Init params:{' '}
				</label>
				<input
					name="initParams"
					id="initParams"
					className="input-params"
				/>
				<label id="initParamsLabelId" className="param-style"></label>
				<br />
				<span className="deploy-note-style">
					<p className="note-style">
						(Note: The number and type of init parameters must be
						consistent with the smart contract construct
						function.Example: [123,abc] )
					</p>
				</span>
				<br />
				<button
					className="button-deploy-style "
					disabled={deployLoading}
					onClick={(e) =>
						SmartContract.handleDeploySmartContract(
							e,
							'smartContractZipFile',
							'initParams',
							'abiTextarea',
							'byteCodeTextarea',
							'deployResponseTextarea',
							setDeployLoading,
							'smartContractAddress',
							step2Message
						)
					}
				>
					{deployLoading ? 'Loading...' : 'Deploy'}
				</button>
				<br />
				<span className="textarea-deploy">
					<textarea
						id="deployResponseTextarea"
						className="textarea-style"
						cols={100}
						rows={8}
						readOnly={true}
						placeholder={'Deploy contract info will display here.'}
					/>
				</span>
			</div>
			<p>
				<b>2.Test Invoke Smart Contract</b>
			</p>
			<div>
				<label htmlFor="smartContractAddress">
					Smart Contract Address:
				</label>
				<input id="smartContractAddress" className="input-address" />
				<span>
					<p className="note-style">
						(Note:Fill in the smart contract address that was
						generated by deploying a smart contract.)
					</p>
				</span>
				<br />
				<label htmlFor="invokeFunctionName">Function Name: </label>
				<select
					id="invokeFunctionName"
					className="input-function-name"
					onChange={(e) =>
						handleFunctionNameSelectChange(
							e,
							'abiTextarea',
							'invokeParamsLabelId',
							'abiFunctionInfo',
							setCallFlag
						)
					}
				>
					<option value="">choose function name</option>
				</select>

				<br />
				<label htmlFor="invokeParams">Function Params: </label>
				<input id="invokeParams" className="input-params" />
				<input id="abiFunctionInfo" className="hidden" />
				<label id="invokeParamsLabelId" className="param-style"></label>
				<br />
				<br />
				{callFalg == 'query' ? (
					<button
						className="button-invoke-style"
						disabled={invokeLoading}
						onClick={(e) =>
							SmartContract.handleQueryOrInvokeSmartContract(
								e,
								'smartContractAddress',
								'invokeFunctionName',
								'invokeParams',
								'abiFunctionInfo',
								'invokeResponseTextarea',
								'abiTextarea',
								setInvokeLoading,
								callFalg
							)
						}
					>
						{invokeLoading ? 'Loading...' : 'Query'}
					</button>
				) : (
					<button
						className="button-invoke-style"
						disabled={invokeLoading}
						onClick={(e) =>
							SmartContract.handleQueryOrInvokeSmartContract(
								e,
								'smartContractAddress',
								'invokeFunctionName',
								'invokeParams',
								'abiFunctionInfo',
								'invokeResponseTextarea',
								'abiTextarea',
								setInvokeLoading,
								callFalg
							)
						}
					>
						{invokeLoading ? 'Loading...' : 'Invoke'}
					</button>
				)}

				<br />
				<textarea
					id="invokeResponseTextarea"
					className="textarea-style"
					cols={100}
					rows={8}
					readOnly={true}
					placeholder={
						'Invoke contract  function info will display here.'
					}
				/>
			</div>
		</>
	);
};
