const MultiToken = artifacts.require('./MultiVendingToken.sol');
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
            assert.equal(ADMIN, await mt.owner(), "error owner != ADMIN");
        });

        it("should make a token for ADMIN with a correct supply", async () => {
            await mt.init(tbn(0x12), tw(100));
            let createdTokenSupply = await mt.totalSupply(tbn(0x12));
            assert(createdTokenSupply.eq(tw(100)), "supply error when creating tokens");
        });

    });
});
