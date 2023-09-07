import './App.css';

import React, { useEffect, useState } from 'react';

import { Login } from '../Login';
import { Profile } from '../Profile/Profile';
import { Auth } from '../types';
import logo from './logo-neptuneDigital.png';

const LS_KEY = 'login-with-metamask:auth';

interface State {
	auth?: Auth;
}

export const App = (): JSX.Element => {
	const [state, setState] = useState<State>({});

	useEffect(() => {
		// Access token is stored in localstorage
		const ls = window.localStorage.getItem(LS_KEY);
		const auth = ls && JSON.parse(ls);
		setState({ auth });
		//window.alert('useEffect');
	}, []); //如果改成 " },[]);  "" ,则第一次不会更新余额，而且每次刷新页面也会使得余额变为0. 去掉,[],表示每次都更新，但chrome的cpu render会增加到100%以上。

	const handleLoggedIn = (auth: Auth) => {
		localStorage.setItem(LS_KEY, JSON.stringify(auth));
		setState({ auth });
	};

	const handleLoggedOut = () => {
		localStorage.removeItem(LS_KEY);
		setState({ auth: undefined });
	};

	function openNewPage(url: string) {
		window.open(url);
	}

	const { auth } = state;
	const explorerUrl = 'http://explorer.ope.bsnbase.com/';
	const onlineIde =
		'https://chainide.bsnbase.com/s/dashboard/apps?code=V2d70w&state=eyJ1cmxDb2RlIjoiSURFT1BCIn0%3D&clientId=chainidebsn';

	return (
		<div className="App">
			<header className="App-header">
				<div className="App-img-div">
					<img src={logo} className="App-logo" alt="logo" />
				</div>
				<div className="App-function-div">
					<span
						className="App-function"
						onClick={() => openNewPage(explorerUrl)}
					>
						WuHanChain Explorer
					</span>
					<span
						className="App-function"
						onClick={() => openNewPage(onlineIde)}
					>
						Online IDE
					</span>
				</div>
				<div className="App-welcome-div">
					<h1 className="App-title">
						Welcome to NeptuneDigtal MetaMask Demo
					</h1>
				</div>
			</header>
			<div className="App-intro">
				{auth ? (
					<Profile auth={auth} onLoggedOut={handleLoggedOut} />
				) : (
					<Login onLoggedIn={handleLoggedIn} />
				)}
			</div>
		</div>
	);
};
