import './Profile.css';

import jwtDecode from 'jwt-decode';
import React, { useState, useEffect } from 'react';
import Blockies from 'react-blockies';
import Web3 from 'web3';
import success from './success.png';
import fs from 'fs';
import { WuhanChain } from '../WuhanChain';
import { getWeb3Instance } from '../util';

import { Auth } from '../types';

interface Props {
	auth: Auth;
	onLoggedOut: () => void;
}

interface State {
	loading: boolean;
	user?: {
		id: number;
		username: string;
	};
	username: string;
	balance: number;
	chainID: number;
}

interface JwtDecoded {
	payload: {
		id: string;
		publicAddress: string;
	};
}

export const Profile = ({ auth, onLoggedOut }: Props): JSX.Element => {
	const [fileRawData, setFile] = useState(new FormData());

	//Loading flag
	const [uploadLoading, setUploadLoading] = useState(false);
	const [compileLoading, setCompileLoading] = useState(false);
	const [deployLoading, setDeployLoading] = useState(false);
	const [invokeLoading, setInvokeLoading] = useState(false);

	//Step message flag
	const [step1Message, setStep1Message] = useState(false);
	const [step2Message, setStep2Message] = useState(false);

	const [state, setState] = useState<State>({
		loading: false,
		user: undefined,
		username: '',
		balance: 0,
		chainID: 0,
	});

	const updateBalance = () => {
		const web3 = getWeb3Instance();
		//window.alert('enter into web3');
		try {
			if (web3 != undefined) {
				web3.eth.getCoinbase().then((address) => {
					if (address == undefined || address == null) {
						window.alert(
							"Can't get Account address,please check the metamask"
						);
						return;
					}
					//window.alert('enter into getCoinbase');
					//alert('adress=' + address.toLowerCase());
					web3.eth.getBalance(address).then((balanceTmp) => {
						//window.alert('enter into getBalance,adress=' + address);
						const newBalance =
							Number(balanceTmp) / Math.pow(10, 18);
						state.balance = newBalance;
						setState({ ...state, balance: newBalance });
						//alert('balanceTmp=' + String(state.balance));
					});
				});
				web3.eth.getChainId().then((chainIDTmp) => {
					//alert('chainID' + String(chainIDTmp));
					state.chainID = chainIDTmp;
					setState({ ...state, chainID: chainIDTmp });
				});
			}
		} catch {
			(err: Error) => {
				window.alert('Error:' + err.message);
			};
		}
	};

	useEffect(() => {
		//window.alert('Profile useEffect');
		updateBalance();
		const { accessToken } = auth;
		const {
			payload: { id },
		} = jwtDecode<JwtDecoded>(accessToken);

		fetch(`${process.env.REACT_APP_BACKEND_URL}/users/${id}`, {
			headers: {
				Authorization: `Bearer ${accessToken}`,
			},
		})
			.then((response) => response.json())
			.then((user) => {
				setState({ ...state, user });
			})
			.catch(window.alert);
	}, []); //如果改成 " },[]);  "" ,则第一次不会

	const { accessToken } = auth;

	const {
		payload: { publicAddress },
	} = jwtDecode<JwtDecoded>(accessToken);

	const { loading } = state;

	return (
		<div className="identicon">
			<div className="logined-div">
				<p>
					Logged in as <Blockies seed={publicAddress} />
					{'  '}
					<button className="button-div" onClick={onLoggedOut}>
						Logout
					</button>
				</p>
			</div>
			<div className="profile-div">
				My Address is
				<span className="publicAddressFont"> {publicAddress}</span>
				<br />
				My Balance is
				<span className="balanceFont">
					{' '}
					{state.balance ? state.balance : 0}{' '}
				</span>
				BSNB
				<br />
				My ChainInfo is
				<span className="publicAddressFont">
					{' '}
					{state.chainID == 5555
						? '  ChainID: ' +
						  String(state.chainID) +
						  ', ChainName: WuHanChain(Open Permissioned Ethereum)'
						: 'ChainID:' + String(state.chainID)}{' '}
				</span>
				<WuhanChain />
			</div>
		</div>
	);
};
