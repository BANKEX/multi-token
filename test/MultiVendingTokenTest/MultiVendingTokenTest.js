const MultiToken = artifacts.require('./MultiVendingToken.sol');
const Overdraft = artifacts.require('./OverdraftTest.sol');
const web3 = global.web3;

const tbn = v => web3.toBigNumber(v);
const fbn = v => v.toString();
const tw = v => web3.toBigNumber(v).mul(1e18);
const fw = v => web3._extend.utils.fromWei(v).toString();

const gasPrice = tw("3e-7");

contract('MultiVendingToken', (accounts) => {

    let mt;
    let ADMIN = accounts[0];

    beforeEach(async () => {
        mt = await MultiToken.new({from: ADMIN});
        overdraft = await Overdraft.new();
    });

    describe("role check", () => {

        it("ADMIN == owner", async () => {
            assert.equal(ADMIN, await mt.owner(), "error owner != ADMIN");
        });

    });

    describe("common check", () => {

        it("allow to init token", async () => {
            await mt.init(tbn(0x12), tw(100), {from: ADMIN});
            assert((await mt.balanceOf(tbn(0x12), ADMIN)).eq(tw(100)));
            assert((await mt.totalSupply(tbn(0x12))).eq(tw(100)));
        });

        it("allow to transfer token to other account", async () => {
            await mt.init(tbn(0x12), tw(100), {from: ADMIN});
            assert((await mt.balanceOf(tbn(0x12), ADMIN)).eq(tw(100)));
            assert((await mt.totalSupply(tbn(0x12))).eq(tw(100)));
            await mt.transfer(tbn(0x12), accounts[8], tw(12), {from: ADMIN});
            assert((await mt.balanceOf(tbn(0x12), accounts[8])).eq(tw(12)));
            assert((await mt.balanceOf(tbn(0x12), ADMIN)).eq(tw(88)));
        });

        it("allow to apporove token to other account", async () => {
            await mt.init(tbn(0x12), tw(100), {from: ADMIN});
            assert((await mt.balanceOf(tbn(0x12), ADMIN)).eq(tw(100)));
            assert((await mt.totalSupply(tbn(0x12))).eq(tw(100)));
            await mt.approve(tbn(0x12), accounts[8], tw(19), {from: ADMIN});
            assert((await mt.allowance(tbn(0x12), ADMIN, accounts[8])).eq(tw(19)));
        });

        it("allow to decrease approval of other account", async () => {
            await mt.init(tbn(0x12), tw(100), {from: ADMIN});
            assert((await mt.balanceOf(tbn(0x12), ADMIN)).eq(tw(100)));
            assert((await mt.totalSupply(tbn(0x12))).eq(tw(100)));
            await mt.approve(tbn(0x12), accounts[8], tw(19), {from: ADMIN});
            assert((await mt.allowance(tbn(0x12), ADMIN, accounts[8])).eq(tw(19)));
            await mt.decreaseApproval(tbn(0x12), accounts[8], tw(1), {from: ADMIN});
            assert((await mt.allowance(tbn(0x12), ADMIN, accounts[8])).eq(tw(18)));
        });

        it("allow to increase approval of other account", async () => {
            await mt.init(tbn(0x12), tw(100), {from: ADMIN});
            assert((await mt.balanceOf(tbn(0x12), ADMIN)).eq(tw(100)));
            assert((await mt.totalSupply(tbn(0x12))).eq(tw(100)));
            await mt.approve(tbn(0x12), accounts[8], tw(19), {from: ADMIN});
            assert((await mt.allowance(tbn(0x12), ADMIN, accounts[8])).eq(tw(19)));
            await mt.increaseApproval(tbn(0x12), accounts[8], tw(1), {from: ADMIN});
            assert((await mt.allowance(tbn(0x12), ADMIN, accounts[8])).eq(tw(20)));
        });

        it("allow to transferFrom of other account", async () => {
            await mt.init(tbn(0x12), tw(100), {from: ADMIN});
            assert((await mt.balanceOf(tbn(0x12), ADMIN)).eq(tw(100)));
            assert((await mt.totalSupply(tbn(0x12))).eq(tw(100)));
            await mt.approve(tbn(0x12), accounts[8], tw(19), {from: ADMIN});
            await mt.transferFrom(tbn(0x12), ADMIN, accounts[7], tw(19), {from: accounts[8]});
            assert((await mt.allowance(tbn(0x12), ADMIN, accounts[8])).eq(tw(0)));
            assert((await mt.balanceOf(tbn(0x12), accounts[7])).eq(tw(19)));
        });

        it("allow to decrease approval of other account and transferFrom later", async () => {
            await mt.init(tbn(0x12), tw(100), {from: ADMIN});
            assert((await mt.balanceOf(tbn(0x12), ADMIN)).eq(tw(100)));
            assert((await mt.totalSupply(tbn(0x12))).eq(tw(100)));
            await mt.approve(tbn(0x12), accounts[8], tw(19), {from: ADMIN});
            assert((await mt.allowance(tbn(0x12), ADMIN, accounts[8])).eq(tw(19)));
            await mt.decreaseApproval(tbn(0x12), accounts[8], tw(1), {from: ADMIN});
            assert((await mt.allowance(tbn(0x12), ADMIN, accounts[8])).eq(tw(18)));
            await mt.transferFrom(tbn(0x12), ADMIN, accounts[7], tw(18), {from: accounts[8]});
            assert((await mt.allowance(tbn(0x12), ADMIN, accounts[8])).eq(tw(0)));
            assert((await mt.balanceOf(tbn(0x12), accounts[7])).eq(tw(18)));
        });

        it("allow to increase approval of other account and transferFrom later", async () => {
            await mt.init(tbn(0x12), tw(100), {from: ADMIN});
            assert((await mt.balanceOf(tbn(0x12), ADMIN)).eq(tw(100)));
            assert((await mt.totalSupply(tbn(0x12))).eq(tw(100)));
            await mt.approve(tbn(0x12), accounts[8], tw(19), {from: ADMIN});
            assert((await mt.allowance(tbn(0x12), ADMIN, accounts[8])).eq(tw(19)));
            await mt.increaseApproval(tbn(0x12), accounts[8], tw(1), {from: ADMIN});
            assert((await mt.allowance(tbn(0x12), ADMIN, accounts[8])).eq(tw(20)));
            await mt.transferFrom(tbn(0x12), ADMIN, accounts[7], tw(20), {from: accounts[8]});
            assert((await mt.allowance(tbn(0x12), ADMIN, accounts[8])).eq(tw(0)));
            assert((await mt.balanceOf(tbn(0x12), accounts[7])).eq(tw(20)));
        });
    });

    describe("negative check", () => {

        it("should not allow to init tokens with existing ID", async () => {
            await mt.init(tbn(0x12), tw(100), {from: ADMIN});
            assert((await mt.balanceOf(tbn(0x12), ADMIN)).eq(tw(100)));
            assert((await mt.totalSupply(tbn(0x12))).eq(tw(100)));
            try {
                await mt.init(tbn(0x12), tw(100), {from: accounts[9]});
            }
            catch (e) {

            }
            assert((await mt.balanceOf(tbn(0x12), ADMIN)).eq(tw(100)));
            assert((await mt.totalSupply(tbn(0x12))).eq(tw(100)));
            assert((await mt.balanceOf(tbn(0x12), accounts[9])).eq(tw(0)));
        });

        it("should not allow to transfer tokens as ADMIN if not ADMIN", async () => {
            await mt.init(tbn(0x12), tw(100), {from: ADMIN});
            assert((await mt.balanceOf(tbn(0x12), ADMIN)).eq(tw(100)));
            assert((await mt.totalSupply(tbn(0x12))).eq(tw(100)));
            try {
                await mt.transfer(tbn(0x12), accounts[8], tw(12), {from: accounts[5]});
            }
            catch (e) {

            }
            assert((await mt.balanceOf(tbn(0x12), accounts[8])).eq(tw(0)));
            assert((await mt.balanceOf(tbn(0x12), ADMIN)).eq(tw(100)));
        });

        it("should not allow to approve / decreaseApproval / increaseApproval if not ADMIN", async () => {
            await mt.init(tbn(0x12), tw(100), {from: ADMIN});
            assert((await mt.balanceOf(tbn(0x12), ADMIN)).eq(tw(100)));
            assert((await mt.totalSupply(tbn(0x12))).eq(tw(100)));
            try {
                await mt.approve(tbn(0x12), accounts[8], tw(19), {from: accounts[4]});
            }
            catch (e) {

            }
            assert((await mt.allowance(tbn(0x12), ADMIN, accounts[8])).eq(tw(0)));

            try {
                await mt.increaseApproval(tbn(0x12), accounts[8], tw(1), {from: accounts[4]});
            }
            catch (e) {

            }
            assert((await mt.allowance(tbn(0x12), ADMIN, accounts[8])).eq(tw(0)));

            try {
                await mt.decreaseApproval(tbn(0x12), accounts[8], tw(1), {from: accounts[4]});
            }
            catch (e) {

            }
            assert((await mt.allowance(tbn(0x12), ADMIN, accounts[8])).eq(tw(0)));

        });

        it("should not allow to tranferFrom if not spender", async () => {
            await mt.init(tbn(0x12), tw(100), {from: ADMIN});
            assert((await mt.balanceOf(tbn(0x12), ADMIN)).eq(tw(100)));
            assert((await mt.totalSupply(tbn(0x12))).eq(tw(100)));
            await mt.approve(tbn(0x12), accounts[8], tw(19), {from: ADMIN});

            try {
                await mt.transferFrom(tbn(0x12), accounts[3], accounts[7], tw(18), {from: accounts[8]});
            }
            catch (e) {

            }

            try {
                await mt.transferFrom(tbn(0x12), ADMIN, accounts[7], tw(18), {from: accounts[4]});
            }
            catch (e) {

            }
            assert((await mt.allowance(tbn(0x12), ADMIN, accounts[8])).eq(tw(19)));
            assert((await mt.balanceOf(tbn(0x12), accounts[7])).eq(tw(0)));
        });
    });

    describe("dividends check", () => {

        it("should allow to accept dividends", async () => {
            await mt.init(tbn(0x12), tw(100), {from: ADMIN});
            assert((await mt.balanceOf(tbn(0x12), ADMIN)).eq(tw(100)));
            assert((await mt.totalSupply(tbn(0x12))).eq(tw(100)));
            for (let i = 1; i < 8; i++) {
                await mt.acceptDividends(tbn(0x12), {from: accounts[i], value: tw(2)});
            }

            let dividends = await mt.dividendsRightsOf(tbn(0x12), ADMIN);
            assert(dividends.eq(tw(14)));
            assert((await web3.eth.getBalance(mt.address)).eq(tw(14)));
        });

        it("should allow to release dividends after investing", async () => {
            await mt.init(tbn(0x12), tw(100), {from: ADMIN});
            assert((await mt.balanceOf(tbn(0x12), ADMIN)).eq(tw(100)));
            assert((await mt.totalSupply(tbn(0x12))).eq(tw(100)));
            for (let i = 1; i < 8; i++) {
                await mt.acceptDividends(tbn(0x12), {from: accounts[i], value: tw(2)});
            }
            let dividends = await mt.dividendsRightsOf(tbn(0x12), ADMIN);
            assert(dividends.eq(tw(14)));
            assert((await web3.eth.getBalance(mt.address)).eq(tw(14)));
            await mt.transfer(tbn(0x12), accounts[3], tw(50));
            await mt.acceptDividends(tbn(0x12), {from: accounts[9], value: tw(10)});
            assert((await mt.dividendsRightsOf(tbn(0x12), accounts[3])).eq(tw(5)));
            assert((await mt.dividendsRightsOf(tbn(0x12), ADMIN)).eq(tw(19)));
            assert((await web3.eth.getBalance(mt.address)).eq(tw(24)))
        });

        it("should allow to approve," +
            "than invest, than increase approval, than invest and release all", async () => {
            let balanceBefore = await web3.eth.getBalance(accounts[5]);
            await mt.init(tbn(0x12), tw(100), {from: ADMIN});
            assert((await mt.balanceOf(tbn(0x12), ADMIN)).eq(tw(100)));
            assert((await mt.totalSupply(tbn(0x12))).eq(tw(100)));
            await mt.approve(tbn(0x12), accounts[4], tw(50), {from: ADMIN});
            await mt.transferFrom(tbn(0x12), ADMIN, accounts[5], tw(50), {from: accounts[4]});
            for (let i = 1; i < 5; i++) {
                await mt.acceptDividends(tbn(0x12), {from: accounts[i], value: tw(2)});
            }
            for (let i = 6; i < 8; i++) {
                await mt.acceptDividends(tbn(0x12), {from: accounts[i], value: tw(2)});
            }
            let dividendsFirst = await mt.dividendsRightsOf(tbn(0x12), accounts[5]);
            assert(dividendsFirst.eq(tw(6)));
            await mt.increaseApproval(tbn(0x12), accounts[4], tw(25), {from: ADMIN});
            await mt.transferFrom(tbn(0x12), ADMIN, accounts[5], tw(25), {from: accounts[4]});
            await mt.acceptDividends(tbn(0x12), {from: accounts[9], value: tw(20)});
            let dividendsSecond = await mt.dividendsRightsOf(tbn(0x12), accounts[5]);
            assert(dividendsSecond.eq(tw(21)));
            let instance = await mt.releaseDividendsRights(tbn(0x12), tw(21), {from: accounts[5], gasPrice: gasPrice});
            let fee = instance.receipt.gasUsed * gasPrice;
            let balanceNow = await web3.eth.getBalance(accounts[5]);
            assert((balanceBefore.plus(tw(21))).eq(balanceNow.plus(fee)));
        });

        it("should allow to release by force", async () => {
            let balanceBefore = await web3.eth.getBalance(accounts[5]);
            await mt.init(tbn(0x12), tw(100), {from: ADMIN});
            assert((await mt.balanceOf(tbn(0x12), ADMIN)).eq(tw(100)));
            assert((await mt.totalSupply(tbn(0x12))).eq(tw(100)));
            await mt.transfer(tbn(0x12), accounts[5], tw(50));
            await mt.acceptDividends(tbn(0x12), {from: accounts[3], value: tw(4)});
            let dividends = await mt.dividendsRightsOf(tbn(0x12), accounts[5]);
            assert(dividends.eq(tw(2)));
            await mt.releaseDividendsRightsForce(tbn(0x12), accounts[5], dividends, {from: ADMIN});
            let balanceNow = await web3.eth.getBalance(accounts[5]);
            assert((balanceBefore.plus(dividends)).eq(balanceNow));
        });

        it("just all in one", async () => {

            let tokens = {
                token0: tbn(0x0),
                token1: tbn(0x1),
                token2: tbn(0x2),
                token3: tbn(0x3),
                token4: tbn(0x4)
            };

            let incorrectSums = {
                sum0: tw(0),
                sum1: tbn(2 ** 256),
                sum2: tbn(-1),
                sum3: tw(10000000),
                sum4: tw(-2 * 256)
            };

            let sumsToCheck = {
                sumd0: tw(1),
                sumd1: tw(2)
            };

            let fees = [];
            let balanceBefore = await web3.eth.getBalance(accounts[2]);
            for (let i in tokens) {
                await mt.init(tokens[i], tw(100), {from: ADMIN});
                await mt.transfer(tokens[i], accounts[2], tw(50), {from: ADMIN});
                await mt.acceptDividends(tokens[i], {from: accounts[6], value: tw(2)});
                let d = await mt.dividendsRightsOf(tokens[i], accounts[2]);
                let ins = await mt.releaseDividendsRights(tokens[i], d, {from: accounts[2], gasPrice: gasPrice});
                fees.push(ins.receipt.gasUsed * gasPrice);
            }
            ;
            let balanceNow = await web3.eth.getBalance(accounts[2]);
            let fee = 0;
            for (let j = 0; j < 5; j++) {
                fee += fees[j];
            }
            ;
            for (let j = 0; j < 5; j++) {
                assert((balanceBefore.plus(tw(5)).eq(balanceNow.plus(fee))));
            }
            ;
        });
    });

    describe("dividends overdraft tests", () => {

        it("should not allow to accept dividends with overdraft", async () => {
            await mt.init(tbn(0x1), tw(1000), {from: ADMIN});
            let ovedraftSum = await overdraft.max_value_test();
            try {
                await mt.acceptDividends(ovedraftSum, {from: ADMIN, value: tw(2)});
            }
            catch (e) {

            }
            assert((await mt.totalSupply(ovedraftSum)).eq(tbn(0)));
            try {
                await mt.acceptDividends(tbn(0x2), {from: ADMIN, value: ovedraftSum});
            }
            catch (e) {

            }
            assert((await mt.totalSupply(tbn(0x2))).eq(tbn(0)));
        });

        it("should not allow to tranfer with overdraft", async () => {
            await mt.init(tbn(0x1), tw(1000), {from: ADMIN});
            let ovedraftSum = await overdraft.max_value_test();
            try {
                await mt.transfer(tbn(0x1), accounts[4], ovedraftSum, {from: ADMIN});
            }
            catch (e) {

            }
            assert((await mt.balanceOf(tbn(0x1), accounts[4])).eq(tbn(0)));
        });

        it("should not allow to tranferFrom with overdraft", async () => {
            await mt.init(tbn(0x1), tw(1000), {from: ADMIN});
            await mt.approve(tbn(0x1), accounts[4], tw(10), {from: ADMIN});
            let ovedraftSum = await overdraft.max_value_test();
            try {
                await mt.transferFrom(tbn(0x12), ADMIN, accounts[5], ovedraftSum, {from: accounts[4]});
            }
            catch (e) {

            }
            assert((await mt.balanceOf(tbn(0x1), accounts[5])).eq(tw(0)));
        });

        it("should not allow to release with overdraft", async () => {
            await mt.init(tbn(0x1), tw(1000), {from: ADMIN});
            await mt.transfer(tbn(0x1), accounts[5], tw(1000));
            assert((await mt.balanceOf(tbn(0x1), accounts[5])).eq(tw(1000)));
            let ovedraftSum = await overdraft.max_value_test();
            for (let i = 6; i < 8; i++) {
                await mt.acceptDividends(tbn(0x1), {from: accounts[i], value: tw(2)});
            }
            assert((await web3.eth.getBalance(mt.address)).eq(tw(4)));
            assert((await mt.dividendsRightsOf(tbn(0x1), accounts[5])).eq(tw(4)));
            try {
                await mt.releaseDividendsRights(tbn(0x1), ovedraftSum, {from: accounts[5]});
            }
            catch (e) {

            }
            assert((await web3.eth.getBalance(mt.address)).eq(tw(4)));
            assert((await mt.dividendsRightsOf(tbn(0x1), accounts[5])).eq(tw(4)));
        });

        it("should not allow to releaseByForce with overdraft", async () => {
            await mt.init(tbn(0x1), tw(1000), {from: ADMIN});
            await mt.transfer(tbn(0x1), accounts[5], tw(1000));
            assert((await mt.balanceOf(tbn(0x1), accounts[5])).eq(tw(1000)));
            let ovedraftSum = await overdraft.max_value_test();
            for (let i = 6; i < 8; i++) {
                await mt.acceptDividends(tbn(0x1), {from: accounts[i], value: tw(2)});
            }
            assert((await web3.eth.getBalance(mt.address)).eq(tw(4)));
            assert((await mt.dividendsRightsOf(tbn(0x1), accounts[5])).eq(tw(4)));

            try {
                await mt.releaseDividendsRightsForce(tbn(0x1), accounts[5], ovedraftSum, {from: ADMIN});
            }
            catch (e) {

            }
            assert((await web3.eth.getBalance(mt.address)).eq(tw(4)));
            assert((await mt.dividendsRightsOf(tbn(0x1), accounts[5])).eq(tw(4)));
        });
    });

    describe("dividends role tests", () => {

        it("should not allow to init tokens if not admin", async () => {
            try {
                for (let i = 2; i < 10; i++) {
                    await mt.init(tbn(0x1), tw(1000), {from: accounts[i]});
                }
            }
            catch (e) {

            }
            assert((await mt.totalSupply(tbn(0x1))).eq(tbn(0)), `error ${(await mt.totalSupply(tbn(0x1))).toString()}`);
        });

        it("should not allow to releaseByForce tokens if not admin", async () => {
            await mt.init(tbn(0x1), tw(1000), {from: ADMIN});
            await mt.transfer(tbn(0x1), accounts[5], tw(1000));
            assert((await mt.balanceOf(tbn(0x1), accounts[5])).eq(tw(1000)));
            let ovedraftSum = await overdraft.max_value_test();
            for (let i = 6; i < 8; i++) {
                await mt.acceptDividends(tbn(0x1), {from: accounts[i], value: tw(2)});
            }
            assert((await web3.eth.getBalance(mt.address)).eq(tw(4)));
            assert((await mt.dividendsRightsOf(tbn(0x1), accounts[5])).eq(tw(4)));

            try {
                for (let i = 1; i < 10; i++) {
                    await mt.releaseDividendsRightsForce(tbn(0x1), accounts[5], tw(1), {from: accounts[i]});
                }
            }
            catch (e) {
            }
            assert((await web3.eth.getBalance(mt.address)).eq(tw(4)));
            assert((await mt.dividendsRightsOf(tbn(0x1), accounts[5])).eq(tw(4)));
        });
    });

    describe("dividends negative tests", () => {

        it("should not allow to release dividends if don't have it", async () => {
            await mt.init(tbn(0x1), tw(1000), {from: ADMIN});
            await mt.transfer(tbn(0x1), accounts[5], tw(1000));
            assert((await mt.balanceOf(tbn(0x1), accounts[5])).eq(tw(1000)));
            let ovedraftSum = await overdraft.max_value_test();
            for (let i = 6; i < 8; i++) {
                await mt.acceptDividends(tbn(0x1), {from: accounts[i], value: tw(2)});
            }
            assert((await web3.eth.getBalance(mt.address)).eq(tw(4)));
            assert((await mt.dividendsRightsOf(tbn(0x1), accounts[5])).eq(tw(4)));

            try {
                await mt.releaseDividendsRights(tbn(0x1), tbn(1), {from: accounts[6]});
            }
            catch (e) {
            }
            assert((await web3.eth.getBalance(mt.address)).eq(tw(4)));
            assert((await mt.dividendsRightsOf(tbn(0x1), accounts[6])).eq(tbn(0)));
        });

        it("should not allow to transfer tokens if don't have it", async () => {
            await mt.init(tbn(0x1), tw(1000), {from: ADMIN});

            try {
                await mt.transfer(tbn(0x1), accounts[6], tw(1000), {from: accounts[5]});
            }
            catch (e) {
            }
            assert((await mt.balanceOf(tbn(0x1), accounts[5])).eq(tw(0)));
        });

        it("should not allow to transferFrom tokens if owner does not have it", async () => {
            await mt.init(tbn(0x1), tw(1000), {from: ADMIN});
            await mt.transfer(tbn(0x1), accounts[9], tw(1000));
            await mt.approve(tbn(0x1), accounts[5], tw(100), {from: ADMIN});
            try {
                await mt.transferFrom(tbn(0x1), ADMIN, accounts[5], tw(1), {from: accounts[5]});
            }
            catch (e) {
            }
            assert((await mt.balanceOf(tbn(0x1), accounts[5])).eq(tw(0)));
        });

        it("should not allow to transferFrom tokens if owner does not approve it", async () => {
            await mt.init(tbn(0x1), tw(1000), {from: ADMIN});
            await mt.approve(tbn(0x1), accounts[4], tw(100), {from: ADMIN});
            try {
                await mt.transferFrom(tbn(0x1), ADMIN, accounts[5], tw(1), {from: accounts[5]});
            }
            catch (e) {
            }
            assert((await mt.balanceOf(tbn(0x1), accounts[5])).eq(tw(0)));
        });

    });
});
