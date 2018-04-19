var DepositStorage = artifacts.require("./DepositStorage.sol");



module.exports = function(deployer, network, accounts) {
  const operator = accounts[0];
  (async () => {
    await deployer.deploy(DepositStorage, 0, {"from" : operator});
    let depositStorage = await DepositStorage.deployed();

  })();

  
};
