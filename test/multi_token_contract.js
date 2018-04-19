//const {_binaryOperators, _unaryOperators} = require('op-overload');

const MultiToken = artifacts.require('MultiToken');
const SafeMath = artifacts.require('SafeMath');

const BigNumber = require('bignumber.js').BigNumber;



contract('MultiToken', (accounts) => {


	let MULTI_TOKEN_INSTANCE;

	beforeEach(async () => {
		const SafeMathInstance = await SafeMath.new();
		await MultiToken.link('SafeMath', SafeMathInstance.address);
		MULTI_TOKEN_INSTANCE = await MultiToken.new();
	});


	it('should create MultiToken contract', async () => {
		try {
			const multiTokenInstance = await MultiToken.new();


			// check created contract owner
			const contractOwner = await multiTokenInstance.owner();
			assert(contractOwner == accounts[0], 'Invalid contract owner');
		} catch(e) {
			console.log(e);
			assert(false, 'MultiToken contract has not created');
		}
	});

	it('should create a new subtoken', async() => {
		try {
			const sender = accounts[0];
			const tokenId = 1;
			const tokensAmount = web3.toWei('1000000', 'ether');
			const toAddress = accounts[1];

			await createNewSubtoken({
				tokenId: tokenId,
				toAddress: toAddress,
				tokensAmount: tokensAmount
			}, {
				from: sender
			});


			// subtoken totalSupply should increase
			assert((await MULTI_TOKEN_INSTANCE.totalSupply(tokenId)).eq(new web3.BigNumber(tokensAmount)), 'Invalid total supply')

			// balance of toAddress should increase
			assert(await MULTI_TOKEN_INSTANCE.balanceOf(tokenId, toAddress), 'Invalid balance');
		} catch(e) {
			console.log(e);
			assert(false, 'Subtoken has not created');
		}
	});

	/*it('should make transactions from one wallet to another', async () => {
		const sender = accounts[0];
		const tokenId = 1;
		const tokensAmount = new BigNumber(web3.toWei('1000000', 'ether'));
		const transferAmount = new BigNumber(web3.toWei('10', 'ether'));

		const toAddress = accounts[1];

		await createNewSubtoken({
			tokenId: tokenId,
			toAddress: accounts[0],
			tokensAmount: tokensAmount
		}, {
			from: sender
		});
		for (let i = 1; i<10; i++)
			MULTI_TOKEN_INSTANCE.transfer(tokenId, accounts[1], transferAmount);
		assert((await MULTI_TOKEN_INSTANCE.balanceOf(tokenId, accounts[1])).eq(transferAmount.multipliedBy(10).toFixed()), 'Invalid balance after token transfer at receiver.');
		assert((await MULTI_TOKEN_INSTANCE.balanceOf(tokenId, accounts[0])).eq(tokensAmount.minus(transferAmount.multipliedBy(10)).toFixed()), 'Invalid balance after token transfer at sender.');

	});*/

	it('should throw an exception if try to create a new subtoken from non-admin account', async () => {
		try {
			const sender = accounts[1];
			const tokenId = 1;
			const tokensAmount = web3.toWei('1000000', 'ether');
			const toAddress = accounts[1];


			assert((await createNewSubtoken({
				tokenId: tokenId,
				toAddress: toAddress,
				tokensAmount: tokensAmount
			}, {
				from: sender
			})).receipt.status === "0x01", 'Exception while processing transaction: revert');
			assert(false, 'Subtoken has created from non-admin account');
		} catch(e) {
			const reverted = e.message.search('Exception while processing transaction: revert') !== -1;
			assert(reverted, 'Invalid exception message');
		}
	});

	it('should throw an exception if try to create a new subtoken with existing tokenId', async () => {
		try {
			const tokenId = 1;

			// create first subtoken
			await createNewSubtoken({tokenId: tokenId});

			// create one more subtoken with the same id
			assert((await createNewSubtoken({tokenId: tokenId})).receipt.status === "0x01", 'Exception while processing transaction: revert');

			assert(false, 'Subtoken with the same id has created');
		} catch(e) {
			const reverted = e.message.search('Exception while processing transaction: revert') !== -1;
			assert(reverted, 'Invalid exception message');
		}
	});

	it('should set subtoken allowance', async () => {
		const tokenId = 123;
		const owner = accounts[0];
		const spender = accounts[1];
		const amount = web3.toWei('999', 'ether');

		await createNewSubtoken({tokenId: tokenId, toAddress: owner}, {from: owner});

		try {
			await MULTI_TOKEN_INSTANCE.approve(tokenId, spender, amount);

			// check that spend allowance increased
			assert( (await MULTI_TOKEN_INSTANCE.allowance(tokenId, owner, spender)).eq(amount), 'Invalid allowance');

		} catch(e) {
			console.log(e);
			assert(false, 'Approve transaction failed');
		}
	});

	it('should transfer allowed amount', async() => {
		const tokenId = 1;
		const owner = accounts[0];
		const spender = accounts[1];
		const amount = web3.toWei('10', 'ether');

		const moveToAddress = accounts[2];


		await createNewSubtoken({token: tokenId, toAddress: owner}, {
			from: owner
		});

		await MULTI_TOKEN_INSTANCE.approve(tokenId, spender, amount, {
			from: owner
		});

		try {
			await MULTI_TOKEN_INSTANCE.transferFrom(tokenId, owner, moveToAddress, amount, {
				from: spender
			});

			// balance of moveToAddress should increase
			assert( (await MULTI_TOKEN_INSTANCE.balanceOf(tokenId, moveToAddress)).eq(amount), 'Balance has not increased');

			// spender allowance should decrease
			assert( (await MULTI_TOKEN_INSTANCE.allowance(tokenId, owner, spender)).eq(new web3.BigNumber(0)), 'Allowance has not descreased');
		} catch(e) {
			console.log(e);
			assert(false, 'Tokens have not transfered');
		}
	});

	it('should throw an exception if try to transferFrom more that allowed', async() => {
		const tokenId = 1;
		const owner = accounts[0];
		const spender = accounts[1];
		const amount = web3.toWei('10', 'ether');


		const moveToAddress = accounts[2];


		await createNewSubtoken({token: tokenId, toAddress: owner}, {
			from: owner
		});

		await MULTI_TOKEN_INSTANCE.approve(tokenId, spender, amount, {
			from: owner
		});

		try {
			assert((await MULTI_TOKEN_INSTANCE.transferFrom(tokenId, owner, moveToAddress, new web3.BigNumber(amount).add('10'), {
				from: spender
			})).receipt.status === "0x01", 'Exception while processing transaction: revert');

			assert(false, 'Transfered more than allowed');

		} catch(e) {
			const reverted = e.message.search('Exception while processing transaction: revert') !== -1;
			assert(reverted, 'Invalid exception message');
		}

	});

	it('should transfer tokens between accounts', async() => {
		const tokenId = 23;
		const sender = accounts[0];
		const recipient = accounts[1];
		const amount = new web3.BigNumber(web3.toWei('100', 'ether'));
		const submitAmount = new web3.BigNumber(web3.toWei('40', 'ether'));

		await createNewSubtoken({
			tokenId: tokenId,
			toAddress: sender,
			tokensAmount: amount
		}, {
			from: sender
		});


		try {
			await MULTI_TOKEN_INSTANCE.transfer(tokenId, recipient, submitAmount, {
				from: sender
			});

			// sender balance should decrease
			const senderBalance = await MULTI_TOKEN_INSTANCE.balanceOf(tokenId, sender);
			assert( senderBalance.eq(amount.minus(submitAmount)), 'Invalid sender balance');

			// recipient balance should increase
			assert( (await MULTI_TOKEN_INSTANCE.balanceOf(tokenId, recipient)).eq(submitAmount), 'Invalid recipient balance')

		} catch(e) {
			console.log(e);
		}
	});

	it('should throw an exception if try to transfer to 0x0 address', async () => {
		const tokenId = 23;
		const sender = accounts[0];
		const recipient = '0x0';
		const amount = new web3.BigNumber(web3.toWei('100', 'ether'));
		const submitAmount = new web3.BigNumber(web3.toWei('40', 'ether'));

		await createNewSubtoken({
			tokenId: tokenId,
			toAddress: sender,
			tokensAmount: amount
		}, {
			from: sender
		});

		try {
			assert((await MULTI_TOKEN_INSTANCE.transfer(tokenId, recipient, submitAmount, {
				from: sender
			})).receipt.status === "0x01", 'Exception while processing transaction: revert');

			assert(false, 'Transfer to 0x0 address');
		} catch(e) {
			const reverted = e.message.search('Exception while processing transaction: revert') !== -1;
			assert(reverted, 'Invalid exception message');
		}

	});

	it('should throw an exception fi try to transfer more than sender balance', async() => {
		const tokenId = 23;
		const sender = accounts[0];
		const recipient = '0x0';
		const amount = new web3.BigNumber(web3.toWei('100', 'ether'));
		const submitAmount = new web3.BigNumber(web3.toWei('110', 'ether'));

		await createNewSubtoken({
			tokenId: tokenId,
			toAddress: sender,
			tokensAmount: amount
		}, {
			from: sender
		});

		try {
			assert((await MULTI_TOKEN_INSTANCE.transfer(tokenId, recipient, submitAmount, {
				from: sender
			})).receipt.status === "0x01", 'Exception while processing transaction: revert');

			assert(false, 'Transfer more than sender balance');
		} catch(e) {
			const reverted = e.message.search('Exception while processing transaction: revert') !== -1;
			assert(reverted, 'Invalid exception message');
		}

	});


	function createNewSubtoken(options, tx) {
		const multiTokenContractInstance = options.multiTokenContractInstance || MULTI_TOKEN_INSTANCE;
		const tokenId = options.tokenId || 1;
		const toAddress = options.toAddress || accounts[1];
		const tokensAmount = options.tokensAmount || web3.toWei('999', 'ether');

		return multiTokenContractInstance.createNewSubtoken(tokenId, toAddress, tokensAmount, tx);
	}


});
