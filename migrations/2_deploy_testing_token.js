var TestingToken = artifacts.require("./TestingToken.sol");

module.exports = function (deployer, network, accounts) {
    const operator = accounts[0];
    (async () => {
        await deployer.deploy(TestingToken, {"from": operator});
        let testingToken = await TestingToken.deployed();

    })();
};
