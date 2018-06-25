const TestingToken = artifacts.require('./TestingToken.sol');
const web3 = global.web3;

const tbn = v => web3.toBigNumber(v);
const fbn = v => v.toString();
const tw = v => web3.toBigNumber(v).mul(1e18);
const fw = v => web3._extend.utils.fromWei(v).toString();

const gasPrice = tw("3e-7");

contract('TestingToken', (accounts) => {

    let tt;
    let ADMIN = accounts[0];

    beforeEach(async () => {
        tt = await TestingToken.new({from: ADMIN});
    });

    describe("common check", () => {

        it("allow to init token", async () => {
            await tt.init(tbn(0x12),tw(100), {from: ADMIN});
            assert((await tt.balanceOf(tbn(0x12), ADMIN)).eq(tw(100)));
            assert((await tt.totalSupply()).eq(tw(100)));

        });

    });
});