var MultiToken = artifacts.require("./MultiToken.sol");



module.exports = function(deployer, network, accounts) {
  const operator = accounts[0];
  (async () => {
    await deployer.deploy(MultiToken, {"from" : operator});
    let multiToken = await MultiToken.deployed();

  })();

  
};
