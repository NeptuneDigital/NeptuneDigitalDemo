import { getWeb3Instance } from '../util';
import { AbiItem, AbiInput } from 'web3-utils';
import { handleAbiTextareaChangeCore } from './handleChange';
import React from 'react';

export class SmartContract {
	public static handleCompileSmartContract = (
		event: React.MouseEvent<HTMLButtonElement>,
		inputFileId: string,
		abiTextareaId: string,
		byteCodeTextareaId: string,
		step1Message: boolean,
		setStep2Message: React.Dispatch<React.SetStateAction<boolean>>,
		setCompileLoading: React.Dispatch<React.SetStateAction<boolean>>
	) => {
		const inputFile = document.getElementById(
			inputFileId
		) as HTMLInputElement;
		let smartContractZipFileName = '';
		if (inputFile != undefined) {
			if (
				inputFile.files == undefined ||
				inputFile.files[0] == undefined
			) {
				alert(
					'The input box of smart contract file is empty!You must complete the  step1 first.'
				);
				return;
			} else {
				smartContractZipFileName = inputFile.files[0].name;
				if (!step1Message) {
					alert(
						"You haven't uploaded the smart contract file yet.You must complete the  step1 first."
					);
					return;
				}
			}

			//alert(filename);
			fetch(`${process.env.REACT_APP_BACKEND_URL}/wuhanchain/compile`, {
				method: 'POST',
				body: JSON.stringify({ smartContractZipFileName }),
				headers: {
					//Authorization: `Bearer ${accessToken}`,
					'Content-Type': 'application/json',
				},
			})
				.then((res) => {
					//alert('status code:' + String(res));
					if (res.status == 500) {
						res.json().then((msg: string) => alert('Error:' + msg));
					} else {
						setStep2Message(true);
						res.text().then((msg: string) => {
							//alert('msg' + msg);
							const { message, abi, bytecode } = JSON.parse(
								msg
							) as {
								message: string;
								abi: string;
								bytecode: string;
							};
							alert(message);
							const abiTextare = document.getElementById(
								abiTextareaId
							) as HTMLTextAreaElement;
							abiTextare.value = abi;
							const byteCodeTextare = document.getElementById(
								byteCodeTextareaId
							) as HTMLTextAreaElement;
							byteCodeTextare.value = bytecode;

							//display init Params List and function name list
							handleAbiTextareaChangeCore(
								abiTextareaId,
								'initParamsLabelId',
								'invokeFunctionName'
							);
						});
					}
					setCompileLoading(false);
				})
				.catch((err) => {
					const error = err as Error;
					window.alert('Error:' + error.message);
					setCompileLoading(false);
				});
		}
	};

	public static handleDeploySmartContract = (
		event: React.MouseEvent<HTMLButtonElement>,
		inputFileId: string,
		inputInitParamsId: string,
		abiTextareId: string,
		byteCodeTextareaId: string,
		deployResponseTextareaId: string,
		setDeployLoading: React.Dispatch<React.SetStateAction<boolean>>,
		inputSmartContractAddressId: string,
		step2Message: boolean
	) => {
		if (!step2Message) {
			alert('You must complete the  step1 and step2 first.');
			return;
		}

		setDeployLoading(true);
		const inputFile = document.getElementById(
			inputFileId
		) as HTMLInputElement;
		const initParams = document.getElementById(
			inputInitParamsId
		) as HTMLInputElement;
		const abiTextare = document.getElementById(
			abiTextareId
		) as HTMLTextAreaElement;
		const byteCodeTextara = document.getElementById(
			byteCodeTextareaId
		) as HTMLTextAreaElement;
		const deployResonseTextara = document.getElementById(
			deployResponseTextareaId
		) as HTMLTextAreaElement;
		const smartContractAddress = document.getElementById(
			inputSmartContractAddressId
		) as HTMLInputElement;

		const web3 = getWeb3Instance();
		if (web3) {
			const contract = new web3.eth.Contract(
				JSON.parse(abiTextare.value)
			);
			const initParamsArray = initParams.value.split(',');
			const contractTx = contract.deploy({
				data: byteCodeTextara.value,
				arguments: initParamsArray,
			});
			let txid = '';
			web3.eth.getCoinbase().then((address) => {
				//alert('address:' + address);
				web3.eth
					.sendTransaction(
						{
							from: address,
							data: contractTx.encodeABI(),
							//gas: '4294967295',
						},
						(err, hash) => {
							txid = hash;
							if (txid) {
								let txReceipt;
								deployResonseTextara.value =
									'TxID is ' +
									hash +
									'.\nDeploying smart contract... Need to wait about ten seconds...\n';
							}
						}
					)
					.then((receipt) => {
						deployResonseTextara.value =
							deployResonseTextara.value +
							'Deploy Contract Successfully.Contrac Address is ' +
							String(receipt.contractAddress) +
							'.Details are as follows :' +
							JSON.stringify(receipt);
						setDeployLoading(false);
						//set smartContractAddress input
						smartContractAddress.value = String(
							receipt.contractAddress
						);
					})
					.catch((err) => {
						if (txid) {
							alert('txid:' + String(txid));
							const error = err as Error;
							let txReceipt;
							let exitflag = false;
							//Exit the cycle after  20 seconds
							setTimeout(() => {
								exitflag = true;
							}, 20000);
							while (!txReceipt) {
								try {
									txReceipt = web3.eth.getTransactionReceipt(
										txid
									);
								} catch (err) {
									const error = err as Error;
									deployResonseTextara.value =
										'Deploy Contract Failed.Error Info:' +
										error.message;
								}
								if (exitflag) {
									break;
								}
							}
							txReceipt?.then((receipt) => {
								deployResonseTextara.value =
									deployResonseTextara.value +
									'Deploy Contract Successfully.Contrac Address is ' +
									String(receipt.contractAddress) +
									'.Details are as follows :' +
									JSON.stringify(receipt);
								setDeployLoading(false);
								//set smartContractAddress input
								smartContractAddress.value = String(
									receipt.contractAddress
								);
							});
						} else {
							const error = err as Error;
							alert(
								'Deploy smart contract Failed.Error:' +
									error.message
							);
						}
						setDeployLoading(false);
					});
			});
		} else {
			alert("Can't get web3 instance");
			setDeployLoading(false);
		}
	};

	public static handleQueryOrInvokeSmartContract = (
		event: React.MouseEvent<HTMLButtonElement>,
		inputSmartContractAddressId: string,
		inputInvokeFunctionNameId: string,
		inputInvokeParamsId: string,
		inputAbiFunctionInfoId: string,
		invokeResponseTextareaId: string,
		abiTextareId: string,
		setInvokeLoading: React.Dispatch<React.SetStateAction<boolean>>,
		callFlag: string
	) => {
		setInvokeLoading(true);
		const smartContractAddress = document.getElementById(
			inputSmartContractAddressId
		) as HTMLInputElement;
		const invokeFunctionName = document.getElementById(
			inputInvokeFunctionNameId
		) as HTMLSelectElement;
		const invokeParams = document.getElementById(
			inputInvokeParamsId
		) as HTMLInputElement;
		const inputAbiFunctionInfo = document.getElementById(
			inputAbiFunctionInfoId
		) as HTMLInputElement;
		const abiTextare = document.getElementById(
			abiTextareId
		) as HTMLTextAreaElement;
		const invokeResponse = document.getElementById(
			invokeResponseTextareaId
		) as HTMLTextAreaElement;

		if (smartContractAddress.value == '' || abiTextare.value == '') {
			alert("SmartContractAddress and ABI can't be empty");
			setInvokeLoading(false);
			return;
		}
		invokeResponse.value = '';

		// Contract Call
		const web3 = getWeb3Instance();
		if (web3) {
			web3.eth.getCoinbase().then((address) => {
				//alert('address:' + address);
				const abiInfo = JSON.parse(abiTextare.value) as Array<AbiItem>;
				const contract = new web3.eth.Contract(
					abiInfo,
					smartContractAddress.value
				);

				invokeResponse.value =
					'Making a call to smart contract at address ' +
					smartContractAddress.value +
					'.Please wait...\n';

				let invokeParamsStr = '';
				//consider the case that function with no param
				if (
					invokeParams.value != undefined &&
					invokeParams.value != ''
				) {
					invokeParamsStr = invokeParams.value;
				}

				const abiFunctionItem = JSON.parse(
					inputAbiFunctionInfo.value
				) as AbiItem;
				const invokeParamsArray: string[] = [];
				if (
					invokeParams.value != undefined &&
					invokeParams.value != ''
				) {
					invokeParams.value.split(',').forEach((item) => {
						//alert('enter split,item:' + item);
						if (item != '') {
							invokeParamsArray.push(item);
						}
					});
				}

				//alert(invokeParamsArray);
				let abiEncode;
				try {
					abiEncode = web3.eth.abi.encodeFunctionCall(
						{
							name: invokeFunctionName.value,
							type: 'function',
							inputs: abiFunctionItem.inputs,
						},
						invokeParamsArray
					);
				} catch {
					(err: Error) => {
						alert(
							'The input parameters and number must be consistent with \
						the number and type of parameters of the contract function.\
						ABI encode failed.Error: ' +
								err.message
						);
					};
				}

				//web3.eth.abi.encodeFunctionCall
				if (callFlag == 'query') {
					web3.eth
						.call({
							to: smartContractAddress.value,
							data: abiEncode,
						})
						.then((data: string) => {
							//alert('enter query callback');
							const outPutTypes = abiFunctionItem.outputs as Array<{
								name: string;
								type: string;
							}>;

							const responseArray = web3.eth.abi.decodeParameters(
								outPutTypes,
								data
							);
							let responseStr = '';
							for (const key in responseArray) {
								if (key != '__length__') {
									responseStr =
										responseStr +
										String(responseArray[key]) +
										',';
								}
							}
							responseStr = responseStr.substring(
								0,
								responseStr.length - 1
							);

							invokeResponse.value =
								invokeResponse.value +
								'Response is :' +
								//JSON.stringify(responseArray);
								responseStr;
							setInvokeLoading(false);
						})
						.catch((err) => {
							const error = err as Error;
							alert(
								'Query smart contract function failed.Error:' +
									error.message +
									'.\n Note:The input parameters and number must be consistent with the number and type of parameters of the contract function.'
							);
							invokeResponse.value = '';
							setInvokeLoading(false);
						});
				}
				if (callFlag == 'invoke') {
					let txid = '';
					web3.eth
						.sendTransaction(
							{
								from: address,
								to: smartContractAddress.value,
								data: abiEncode,
							},
							(err, hash) => {
								txid = hash;
								if (txid) {
									let txReceipt;
									invokeResponse.value =
										'TxID is ' +
										hash +
										'.\nInvoking smart contract function... Need to wait about ten seconds...\n';
								}
							}
						)
						.then((receipt) => {
							//alert('enter invoke callback');
							invokeResponse.value =
								invokeResponse.value +
								'Invoke smart contract function successfully.\n' +
								'Details are as follows :' +
								JSON.stringify(receipt);
							setInvokeLoading(false);
						})
						.catch((err) => {
							//alert('enter invoke catch allback');
							if (txid) {
								//alert('txid:' + String(txid));
								const error = err as Error;
								let txReceipt;
								let exitflag = false;
								//Exit the cycle after  20 seconds
								setTimeout(() => {
									exitflag = true;
								}, 20000);
								while (!txReceipt) {
									try {
										txReceipt = web3.eth.getTransactionReceipt(
											txid
										);
									} catch (err) {
										const error = err as Error;
										invokeResponse.value =
											invokeResponse.value +
											'Invoke Smart Contract Funcion Failed.Error Info:' +
											error.message;
									}
									if (exitflag) {
										break;
									}
								}
								txReceipt?.then((receipt) => {
									invokeResponse.value =
										invokeResponse.value +
										'Invoke Contract Function Successfully.' +
										'.Details are as follows :' +
										JSON.stringify(receipt);
									setInvokeLoading(false);
								});
							} else {
								const error = err as Error;
								alert(
									'Invoke smart contract funcion failed.Error:' +
										error.message +
										'.\n Note:The input parameters and number must be consistent with the number and type of parameters of the contract function.'
								);
								invokeResponse.value = '';
							}
							setInvokeLoading(false);
						});
				}
			});
		} else {
			alert("Can't get web3 instance");
			setInvokeLoading(false);
		}
	};
}
