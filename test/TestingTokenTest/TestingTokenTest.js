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
            assert((await tt.totalSupply(tbn(0x12))).eq(tw(100)));
        });

        it("allow to transfer token to other account", async () => {
            await tt.init(tbn(0x12),tw(100), {from: ADMIN});
            assert((await tt.balanceOf(tbn(0x12), ADMIN)).eq(tw(100)));
            assert((await tt.totalSupply(tbn(0x12))).eq(tw(100)));
            await tt.transfer(tbn(0x12), accounts[8], tw(12), {from : ADMIN});
            assert((await tt.balanceOf(tbn(0x12), accounts[8])).eq(tw(12)));
            assert((await tt.balanceOf(tbn(0x12), ADMIN)).eq(tw(88)));
        });

        it("allow to apporove token to other account", async () => {
            await tt.init(tbn(0x12),tw(100), {from: ADMIN});
            assert((await tt.balanceOf(tbn(0x12), ADMIN)).eq(tw(100)));
            assert((await tt.totalSupply(tbn(0x12))).eq(tw(100)));
            await tt.approve(tbn(0x12), accounts[8], tw(19), {from: ADMIN});
            assert((await tt.allowance(tbn(0x12), ADMIN, accounts[8])).eq(tw(19)));
        });

        it("allow to decrease approval of other account", async () => {
            await tt.init(tbn(0x12),tw(100), {from: ADMIN});
            assert((await tt.balanceOf(tbn(0x12), ADMIN)).eq(tw(100)));
            assert((await tt.totalSupply(tbn(0x12))).eq(tw(100)));
            await tt.approve(tbn(0x12), accounts[8], tw(19), {from: ADMIN});
            assert((await tt.allowance(tbn(0x12), ADMIN, accounts[8])).eq(tw(19)));
            await tt.decreaseApproval(tbn(0x12), accounts[8], tw(1), {from: ADMIN});
            assert((await tt.allowance(tbn(0x12), ADMIN, accounts[8])).eq(tw(18)));
        });

        it("allow to increase approval of other account", async () => {
            await tt.init(tbn(0x12),tw(100), {from: ADMIN});
            assert((await tt.balanceOf(tbn(0x12), ADMIN)).eq(tw(100)));
            assert((await tt.totalSupply(tbn(0x12))).eq(tw(100)));
            await tt.approve(tbn(0x12), accounts[8], tw(19), {from: ADMIN});
            assert((await tt.allowance(tbn(0x12), ADMIN, accounts[8])).eq(tw(19)));
            await tt.increaseApproval(tbn(0x12), accounts[8], tw(1), {from: ADMIN});
            assert((await tt.allowance(tbn(0x12), ADMIN, accounts[8])).eq(tw(20)));
        });

        it("allow to transferFrom of other account", async () => {
            await tt.init(tbn(0x12),tw(100), {from: ADMIN});
            assert((await tt.balanceOf(tbn(0x12), ADMIN)).eq(tw(100)));
            assert((await tt.totalSupply(tbn(0x12))).eq(tw(100)));
            await tt.approve(tbn(0x12), accounts[8], tw(19), {from: ADMIN});
            await tt.transferFrom(tbn(0x12), ADMIN, accounts[7], tw(19), {from: accounts[8]});
            assert((await tt.allowance(tbn(0x12), ADMIN, accounts[8])).eq(tw(0)));
            assert((await tt.balanceOf(tbn(0x12), accounts[7])).eq(tw(19)));
        });

        it("allow to decrease approval of other account and transferFrom later", async () => {
            await tt.init(tbn(0x12),tw(100), {from: ADMIN});
            assert((await tt.balanceOf(tbn(0x12), ADMIN)).eq(tw(100)));
            assert((await tt.totalSupply(tbn(0x12))).eq(tw(100)));
            await tt.approve(tbn(0x12), accounts[8], tw(19), {from: ADMIN});
            assert((await tt.allowance(tbn(0x12), ADMIN, accounts[8])).eq(tw(19)));
            await tt.decreaseApproval(tbn(0x12), accounts[8], tw(1), {from: ADMIN});
            assert((await tt.allowance(tbn(0x12), ADMIN, accounts[8])).eq(tw(18)));
            await tt.transferFrom(tbn(0x12), ADMIN, accounts[7], tw(18), {from: accounts[8]});
            assert((await tt.allowance(tbn(0x12), ADMIN, accounts[8])).eq(tw(0)));
            assert((await tt.balanceOf(tbn(0x12), accounts[7])).eq(tw(18)));
        });

        it("allow to increase approval of other account and transferFrom later", async () => {
            await tt.init(tbn(0x12),tw(100), {from: ADMIN});
            assert((await tt.balanceOf(tbn(0x12), ADMIN)).eq(tw(100)));
            assert((await tt.totalSupply(tbn(0x12))).eq(tw(100)));
            await tt.approve(tbn(0x12), accounts[8], tw(19), {from: ADMIN});
            assert((await tt.allowance(tbn(0x12), ADMIN, accounts[8])).eq(tw(19)));
            await tt.increaseApproval(tbn(0x12), accounts[8], tw(1), {from: ADMIN});
            assert((await tt.allowance(tbn(0x12), ADMIN, accounts[8])).eq(tw(20)));
            await tt.transferFrom(tbn(0x12), ADMIN, accounts[7], tw(20), {from: accounts[8]});
            assert((await tt.allowance(tbn(0x12), ADMIN, accounts[8])).eq(tw(0)));
            assert((await tt.balanceOf(tbn(0x12), accounts[7])).eq(tw(20)));
        });
    });

    describe("negative check", () => {

        it("should not allow to init tokens with existing ID", async () => {
            await tt.init(tbn(0x12),tw(100), {from: ADMIN});
            assert((await tt.balanceOf(tbn(0x12), ADMIN)).eq(tw(100)));
            assert((await tt.totalSupply(tbn(0x12))).eq(tw(100)));
            try {
                await tt.init(tbn(0x12), tw(100), {from: accounts[9]});
            }
            catch (e) {

            }
            assert((await tt.balanceOf(tbn(0x12), ADMIN)).eq(tw(100)));
            assert((await tt.totalSupply(tbn(0x12))).eq(tw(100)));
            assert((await tt.balanceOf(tbn(0x12), accounts[9])).eq(tw(0)));
        });

        it("should not allow to transfer tokens as ADMIN if not ADMIN", async () => {
            await tt.init(tbn(0x12),tw(100), {from: ADMIN});
            assert((await tt.balanceOf(tbn(0x12), ADMIN)).eq(tw(100)));
            assert((await tt.totalSupply(tbn(0x12))).eq(tw(100)));
            try {
                await tt.transfer(tbn(0x12), accounts[8], tw(12), {from : accounts[5]});
            }
            catch (e) {
                
            }
            assert((await tt.balanceOf(tbn(0x12), accounts[8])).eq(tw(0)));
            assert((await tt.balanceOf(tbn(0x12), ADMIN)).eq(tw(100)));
        });

        it("should not allow to approve / decreaseApproval / increaseApproval if not ADMIN", async () => {
            await tt.init(tbn(0x12),tw(100), {from: ADMIN});
            assert((await tt.balanceOf(tbn(0x12), ADMIN)).eq(tw(100)));
            assert((await tt.totalSupply(tbn(0x12))).eq(tw(100)));
            try {
                await tt.approve(tbn(0x12), accounts[8], tw(19), {from: accounts[4]});
            }
            catch (e) {

            }
            assert((await tt.allowance(tbn(0x12), ADMIN, accounts[8])).eq(tw(0)));

            try {
                await tt.increaseApproval(tbn(0x12), accounts[8], tw(1), {from: accounts[4]});
            }
            catch (e) {

            }
            assert((await tt.allowance(tbn(0x12), ADMIN, accounts[8])).eq(tw(0)));

            try {
                await tt.decreaseApproval(tbn(0x12), accounts[8], tw(1), {from: accounts[4]});
            }
            catch (e) {

            }
            assert((await tt.allowance(tbn(0x12), ADMIN, accounts[8])).eq(tw(0)));

        });

        it("should not allow to tranferFrom if not spender", async () => {
            await tt.init(tbn(0x12),tw(100), {from: ADMIN});
            assert((await tt.balanceOf(tbn(0x12), ADMIN)).eq(tw(100)));
            assert((await tt.totalSupply(tbn(0x12))).eq(tw(100)));
            await tt.approve(tbn(0x12), accounts[8], tw(19), {from: ADMIN});

            try {
                await tt.transferFrom(tbn(0x12), accounts[3], accounts[7], tw(18), {from: accounts[8]});
            }
            catch (e) {

            }

            try {
                await tt.transferFrom(tbn(0x12), ADMIN, accounts[7], tw(18), {from: accounts[4]});
            }
            catch (e) {

            }

            assert((await tt.allowance(tbn(0x12), ADMIN, accounts[8])).eq(tw(19)));
            assert((await tt.balanceOf(tbn(0x12), accounts[7])).eq(tw(0)));
        });
    });


});