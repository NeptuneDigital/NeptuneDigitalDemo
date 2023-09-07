import { AbiItem } from 'web3-utils';

export const handleAbiTextareaChange = (
	event: React.ChangeEvent<HTMLTextAreaElement>,
	abiTextareaId: string,
	initParamsLabelId: string,
	functionNameSelectID: string
) => {
	handleAbiTextareaChangeCore(
		abiTextareaId,
		initParamsLabelId,
		functionNameSelectID
	);
};

export const handleAbiTextareaChangeCore = (
	abiTextareaId: string,
	initParamsLabelId: string,
	functionNameSelectID: string
) => {
	//alert('enter into handleAbiTextareaChange');
	const abiInfo = document.getElementById(
		abiTextareaId
	) as HTMLTextAreaElement;
	const initParamsLabel = document.getElementById(
		initParamsLabelId
	) as HTMLLabelElement;
	const functionName = document.getElementById(
		functionNameSelectID
	) as HTMLSelectElement;

	initParamsLabel.textContent = '';
	if (abiInfo != undefined && abiInfo.value != '') {
		const abiArray = JSON.parse(abiInfo.value) as Array<AbiItem>;

		//remove options that generate before
		if (functionName.options.length > 0) {
			functionName.options.selectedIndex = 0;
			const num = functionName.options.length;
			for (let i = num - 1; i > 0; i--) {
				// alert(
				// 	'remove i:' +
				// 		String(i) +
				// 		':value:' +
				// 		String(functionName.options.item(i)?.value)
				// );
				functionName.options.remove(i);
			}
		}

		abiArray.forEach((functionInfo) => {
			if (functionInfo.type == 'function') {
				//add options by functionInfo
				functionName.options.add(
					new Option(functionInfo.name, functionInfo.name)
				);
			}

			if (functionInfo.type == 'constructor') {
				//alert('constructor');
				initParamsLabel.textContent = 'Init Params List: ( ';
				let paramsList = '';
				functionInfo.inputs?.forEach((paramInfo) => {
					paramsList =
						paramsList +
						paramInfo.name +
						' : ' +
						paramInfo.type +
						' , ';
				});
				paramsList = paramsList.substring(0, paramsList.length - 2);
				paramsList = paramsList + ' )';
				initParamsLabel.textContent =
					String(initParamsLabel.textContent) + paramsList;
			}
		});
	}
};

export const handleFunctionNameSelectChange = (
	event: React.ChangeEvent<HTMLSelectElement>,
	abiTextareaId: string,
	invokeParamsLabelId: string,
	inputAbiFunctionInfoId: string,
	setCallFlag: React.Dispatch<React.SetStateAction<string>>
) => {
	const functionName = event.target.value;
	const abiInfo = document.getElementById(
		abiTextareaId
	) as HTMLTextAreaElement;
	const invokeParamsLabel = document.getElementById(
		invokeParamsLabelId
	) as HTMLLabelElement;
	const abiFunctionInfo = document.getElementById(
		inputAbiFunctionInfoId
	) as HTMLInputElement;

	invokeParamsLabel.textContent = '';
	//find all info  by invoke function name
	if (abiInfo != undefined && abiInfo.value != '') {
		const abiArray = JSON.parse(abiInfo.value) as Array<AbiItem>;
		abiArray.forEach((functionInfo) => {
			if (functionInfo.name == functionName) {
				abiFunctionInfo.value = JSON.stringify(functionInfo);

				invokeParamsLabel.textContent = 'Params List: ( ';
				//build params list
				let paramsList = ' ';
				functionInfo.inputs?.forEach((paramInfo) => {
					paramsList =
						paramsList +
						paramInfo.name +
						' : ' +
						paramInfo.type +
						' , ';
				});
				paramsList = paramsList.substring(0, paramsList.length - 2);
				paramsList = paramsList + ')';
				invokeParamsLabel.innerText =
					invokeParamsLabel.innerText + paramsList;

				if (
					functionInfo.stateMutability == 'pure' ||
					functionInfo.stateMutability == 'view'
				) {
					//alert('enter into query');
					setCallFlag('query');
				} else {
					//alert('enter into invoke');
					setCallFlag('invoke');
				}
			}
		});
	}
};
