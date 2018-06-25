const MultiToken = artifacts.require('contracts/token/multiToken/MultiToken.sol');
const web3 = global.web3;

const tbn = v => web3.toBigNumber(v);
const fbn = v => v.toString();
const tw = v => web3.toBigNumber(v).mul(1e18);
const fw = v => web3._extend.utils.fromWei(v).toString();

const gasPrice = tw("3e-7");

contract('MultiToken', (accounts) => {

    let mt;
    let ADMIN = accounts[0];

    beforeEach(async () => {
        mt = await MultiToken.new({from: ADMIN});
    });

    describe("common check", () => {

        it("ADMIN == owner", async () => {

        });

    });
});