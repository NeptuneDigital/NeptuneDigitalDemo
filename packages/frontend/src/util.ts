import Web3 from 'web3';

export let web3Instance: Web3 | undefined = undefined; // Will hold the web3 instance

export const getWeb3Instance = (): Web3 | undefined => {
	//window.alert('enter into updateBalance');
	// Check if MetaMask is installed
	if (!(window as any).ethereum) {
		window.alert('Please install MetaMask first.');
	}

	if (!web3Instance) {
		try {
			// Request account access if needed
			(window as any).ethereum.enable();

			// We don't know window.web3 version, so we use our own instance of Web3
			// with the injected provider given by MetaMask
			web3Instance = new Web3((window as any).ethereum);
		} catch (error) {
			window.alert('You need to allow MetaMask.');
		}
	}
	return web3Instance;
};
