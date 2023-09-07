import React, { useState, useEffect } from 'react';

export class UploadFile {
	public static handleChooseFileForInputFile = (
		event: React.ChangeEvent<HTMLInputElement>,
		setState: React.Dispatch<React.SetStateAction<FormData>>
	) => {
		const files = event.currentTarget.files;
		//获取到的文件 fileData
		if (files && files[0]) {
			//alert('filename:' + files[0].name);
			const fileContent = document.getElementById(
				'fileName'
			) as HTMLInputElement | null;
			if (fileContent) {
				fileContent.value = files[0].name;
				//alert(files[0]);
				const formdata = new FormData();
				formdata.append('file', files[0]);
				setState(formdata);
			}
		}
	};

	public static handleChooseFile = (
		event: React.MouseEvent<HTMLButtonElement>,
		inputFileId: string
	) => {
		const inputFile = document.getElementById(inputFileId);
		if (inputFile != undefined) {
			inputFile.click();
		}
	};

	public static handleUploadFile = (
		event: React.MouseEvent<HTMLButtonElement>,
		setUploadLoading: React.Dispatch<React.SetStateAction<boolean>>,
		fileRawData: FormData,
		setStep1Message: React.Dispatch<React.SetStateAction<boolean>>
	) => {
		//alert('enter into handleUploadFile');
		const inputFile = document.getElementById(
			'smartContractZipFile'
		) as HTMLInputElement;
		if (inputFile != undefined) {
			if (!inputFile.value) {
				alert(
					'The input box of smart contract file is empty!You must choose file first.'
				);
				return;
			}
		}
		setUploadLoading(true);

		fetch(`${process.env.REACT_APP_BACKEND_URL}/upload`, {
			method: 'POST',
			body: fileRawData,
			headers: {
				//Authorization: `Bearer ${accessToken}`,
				//'Content-Type': 'multipart/form-data; boundary', //不能加，因为浏览器bug，加了反而会出错
			},
		})
			.then((res) => {
				if (res.status == 500) {
					res.json().then((msg: string) => alert('Error:' + msg));
				} else {
					res.json().then((msg: string) => alert(msg));
					setUploadLoading(false);
					setStep1Message(true);
				}
			})
			.catch((err) => {
				window.alert('error:' + String(err));
				setUploadLoading(false);
			});
	};
}
