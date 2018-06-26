// const TestingToken = artifacts.require('./TestingToken.sol');
// const Overdraft = artifacts.require('./OverdraftTest.sol');
// const web3 = global.web3;
//
// const tbn = v => web3.toBigNumber(v);
// const fbn = v => v.toString();
// const tw = v => web3.toBigNumber(v).mul(1e18);
// const fw = v => web3._extend.utils.fromWei(v).toString();
//
// const gasPrice = tw("3e-7");
//
// contract('TestingToken', (accounts) => {
//
//     let tt;
//     let ADMIN = accounts[0];
//
//     beforeEach(async () => {
//         tt = await TestingToken.new({from: ADMIN});
//         overdraft = await Overdraft.new();
//     });
//
//     describe("common check", () => {
//
//         it("allow to init token", async () => {
//             await tt.init(tbn(0x12), tw(100), {from: ADMIN});
//             assert((await tt.balanceOf(tbn(0x12), ADMIN)).eq(tw(100)));
//             assert((await tt.totalSupply(tbn(0x12))).eq(tw(100)));
//         });
//
//         it("allow to transfer token to other account", async () => {
//             await tt.init(tbn(0x12), tw(100), {from: ADMIN});
//             assert((await tt.balanceOf(tbn(0x12), ADMIN)).eq(tw(100)));
//             assert((await tt.totalSupply(tbn(0x12))).eq(tw(100)));
//             await tt.transfer(tbn(0x12), accounts[8], tw(12), {from: ADMIN});
//             assert((await tt.balanceOf(tbn(0x12), accounts[8])).eq(tw(12)));
//             assert((await tt.balanceOf(tbn(0x12), ADMIN)).eq(tw(88)));
//         });
//
//         it("allow to apporove token to other account", async () => {
//             await tt.init(tbn(0x12), tw(100), {from: ADMIN});
//             assert((await tt.balanceOf(tbn(0x12), ADMIN)).eq(tw(100)));
//             assert((await tt.totalSupply(tbn(0x12))).eq(tw(100)));
//             await tt.approve(tbn(0x12), accounts[8], tw(19), {from: ADMIN});
//             assert((await tt.allowance(tbn(0x12), ADMIN, accounts[8])).eq(tw(19)));
//         });
//
//         it("allow to decrease approval of other account", async () => {
//             await tt.init(tbn(0x12), tw(100), {from: ADMIN});
//             assert((await tt.balanceOf(tbn(0x12), ADMIN)).eq(tw(100)));
//             assert((await tt.totalSupply(tbn(0x12))).eq(tw(100)));
//             await tt.approve(tbn(0x12), accounts[8], tw(19), {from: ADMIN});
//             assert((await tt.allowance(tbn(0x12), ADMIN, accounts[8])).eq(tw(19)));
//             await tt.decreaseApproval(tbn(0x12), accounts[8], tw(1), {from: ADMIN});
//             assert((await tt.allowance(tbn(0x12), ADMIN, accounts[8])).eq(tw(18)));
//         });
//
//         it("allow to increase approval of other account", async () => {
//             await tt.init(tbn(0x12), tw(100), {from: ADMIN});
//             assert((await tt.balanceOf(tbn(0x12), ADMIN)).eq(tw(100)));
//             assert((await tt.totalSupply(tbn(0x12))).eq(tw(100)));
//             await tt.approve(tbn(0x12), accounts[8], tw(19), {from: ADMIN});
//             assert((await tt.allowance(tbn(0x12), ADMIN, accounts[8])).eq(tw(19)));
//             await tt.increaseApproval(tbn(0x12), accounts[8], tw(1), {from: ADMIN});
//             assert((await tt.allowance(tbn(0x12), ADMIN, accounts[8])).eq(tw(20)));
//         });
//
//         it("allow to transferFrom of other account", async () => {
//             await tt.init(tbn(0x12), tw(100), {from: ADMIN});
//             assert((await tt.balanceOf(tbn(0x12), ADMIN)).eq(tw(100)));
//             assert((await tt.totalSupply(tbn(0x12))).eq(tw(100)));
//             await tt.approve(tbn(0x12), accounts[8], tw(19), {from: ADMIN});
//             await tt.transferFrom(tbn(0x12), ADMIN, accounts[7], tw(19), {from: accounts[8]});
//             assert((await tt.allowance(tbn(0x12), ADMIN, accounts[8])).eq(tw(0)));
//             assert((await tt.balanceOf(tbn(0x12), accounts[7])).eq(tw(19)));
//         });
//
//         it("allow to decrease approval of other account and transferFrom later", async () => {
//             await tt.init(tbn(0x12), tw(100), {from: ADMIN});
//             assert((await tt.balanceOf(tbn(0x12), ADMIN)).eq(tw(100)));
//             assert((await tt.totalSupply(tbn(0x12))).eq(tw(100)));
//             await tt.approve(tbn(0x12), accounts[8], tw(19), {from: ADMIN});
//             assert((await tt.allowance(tbn(0x12), ADMIN, accounts[8])).eq(tw(19)));
//             await tt.decreaseApproval(tbn(0x12), accounts[8], tw(1), {from: ADMIN});
//             assert((await tt.allowance(tbn(0x12), ADMIN, accounts[8])).eq(tw(18)));
//             await tt.transferFrom(tbn(0x12), ADMIN, accounts[7], tw(18), {from: accounts[8]});
//             assert((await tt.allowance(tbn(0x12), ADMIN, accounts[8])).eq(tw(0)));
//             assert((await tt.balanceOf(tbn(0x12), accounts[7])).eq(tw(18)));
//         });
//
//         it("allow to increase approval of other account and transferFrom later", async () => {
//             await tt.init(tbn(0x12), tw(100), {from: ADMIN});
//             assert((await tt.balanceOf(tbn(0x12), ADMIN)).eq(tw(100)));
//             assert((await tt.totalSupply(tbn(0x12))).eq(tw(100)));
//             await tt.approve(tbn(0x12), accounts[8], tw(19), {from: ADMIN});
//             assert((await tt.allowance(tbn(0x12), ADMIN, accounts[8])).eq(tw(19)));
//             await tt.increaseApproval(tbn(0x12), accounts[8], tw(1), {from: ADMIN});
//             assert((await tt.allowance(tbn(0x12), ADMIN, accounts[8])).eq(tw(20)));
//             await tt.transferFrom(tbn(0x12), ADMIN, accounts[7], tw(20), {from: accounts[8]});
//             assert((await tt.allowance(tbn(0x12), ADMIN, accounts[8])).eq(tw(0)));
//             assert((await tt.balanceOf(tbn(0x12), accounts[7])).eq(tw(20)));
//         });
//     });
//
//     describe("negative check", () => {
//
//         it("should not allow to init tokens with existing ID", async () => {
//             await tt.init(tbn(0x12), tw(100), {from: ADMIN});
//             assert((await tt.balanceOf(tbn(0x12), ADMIN)).eq(tw(100)));
//             assert((await tt.totalSupply(tbn(0x12))).eq(tw(100)));
//             try {
//                 await tt.init(tbn(0x12), tw(100), {from: accounts[9]});
//             }
//             catch (e) {
//
//             }
//             assert((await tt.balanceOf(tbn(0x12), ADMIN)).eq(tw(100)));
//             assert((await tt.totalSupply(tbn(0x12))).eq(tw(100)));
//             assert((await tt.balanceOf(tbn(0x12), accounts[9])).eq(tw(0)));
//         });
//
//         it("should not allow to transfer tokens as ADMIN if not ADMIN", async () => {
//             await tt.init(tbn(0x12), tw(100), {from: ADMIN});
//             assert((await tt.balanceOf(tbn(0x12), ADMIN)).eq(tw(100)));
//             assert((await tt.totalSupply(tbn(0x12))).eq(tw(100)));
//             try {
//                 await tt.transfer(tbn(0x12), accounts[8], tw(12), {from: accounts[5]});
//             }
//             catch (e) {
//
//             }
//             assert((await tt.balanceOf(tbn(0x12), accounts[8])).eq(tw(0)));
//             assert((await tt.balanceOf(tbn(0x12), ADMIN)).eq(tw(100)));
//         });
//
//         it("should not allow to approve / decreaseApproval / increaseApproval if not ADMIN", async () => {
//             await tt.init(tbn(0x12), tw(100), {from: ADMIN});
//             assert((await tt.balanceOf(tbn(0x12), ADMIN)).eq(tw(100)));
//             assert((await tt.totalSupply(tbn(0x12))).eq(tw(100)));
//             try {
//                 await tt.approve(tbn(0x12), accounts[8], tw(19), {from: accounts[4]});
//             }
//             catch (e) {
//
//             }
//             assert((await tt.allowance(tbn(0x12), ADMIN, accounts[8])).eq(tw(0)));
//
//             try {
//                 await tt.increaseApproval(tbn(0x12), accounts[8], tw(1), {from: accounts[4]});
//             }
//             catch (e) {
//
//             }
//             assert((await tt.allowance(tbn(0x12), ADMIN, accounts[8])).eq(tw(0)));
//
//             try {
//                 await tt.decreaseApproval(tbn(0x12), accounts[8], tw(1), {from: accounts[4]});
//             }
//             catch (e) {
//
//             }
//             assert((await tt.allowance(tbn(0x12), ADMIN, accounts[8])).eq(tw(0)));
//
//         });
//
//         it("should not allow to tranferFrom if not spender", async () => {
//             await tt.init(tbn(0x12), tw(100), {from: ADMIN});
//             assert((await tt.balanceOf(tbn(0x12), ADMIN)).eq(tw(100)));
//             assert((await tt.totalSupply(tbn(0x12))).eq(tw(100)));
//             await tt.approve(tbn(0x12), accounts[8], tw(19), {from: ADMIN});
//
//             try {
//                 await tt.transferFrom(tbn(0x12), accounts[3], accounts[7], tw(18), {from: accounts[8]});
//             }
//             catch (e) {
//
//             }
//
//             try {
//                 await tt.transferFrom(tbn(0x12), ADMIN, accounts[7], tw(18), {from: accounts[4]});
//             }
//             catch (e) {
//
//             }
//             assert((await tt.allowance(tbn(0x12), ADMIN, accounts[8])).eq(tw(19)));
//             assert((await tt.balanceOf(tbn(0x12), accounts[7])).eq(tw(0)));
//         });
//     });
//
//     describe("dividends check", () => {
//
//         it("should allow to accept dividends", async () => {
//             await tt.init(tbn(0x12), tw(100), {from: ADMIN});
//             assert((await tt.balanceOf(tbn(0x12), ADMIN)).eq(tw(100)));
//             assert((await tt.totalSupply(tbn(0x12))).eq(tw(100)));
//             for (let i = 1; i < 8; i++) {
//                 await tt.acceptDividends(tbn(0x12), {from: accounts[i], value: tw(2)});
//             }
//
//             let dividends = await tt.dividendsRightsOf(tbn(0x12), ADMIN);
//             assert(dividends.eq(tw(14)));
//             assert((await web3.eth.getBalance(tt.address)).eq(tw(14)));
//         });
//
//         it("should allow to release dividends after investing", async () => {
//             await tt.init(tbn(0x12), tw(100), {from: ADMIN});
//             assert((await tt.balanceOf(tbn(0x12), ADMIN)).eq(tw(100)));
//             assert((await tt.totalSupply(tbn(0x12))).eq(tw(100)));
//             for (let i = 1; i < 8; i++) {
//                 await tt.acceptDividends(tbn(0x12), {from: accounts[i], value: tw(2)});
//             }
//             let dividends = await tt.dividendsRightsOf(tbn(0x12), ADMIN);
//             assert(dividends.eq(tw(14)));
//             assert((await web3.eth.getBalance(tt.address)).eq(tw(14)));
//             await tt.transfer(tbn(0x12), accounts[3], tw(50));
//             await tt.acceptDividends(tbn(0x12), {from: accounts[9], value: tw(10)});
//             assert((await tt.dividendsRightsOf(tbn(0x12), accounts[3])).eq(tw(5)));
//             assert((await tt.dividendsRightsOf(tbn(0x12), ADMIN)).eq(tw(19)));
//             assert((await web3.eth.getBalance(tt.address)).eq(tw(24)))
//         });
//
//         it("should allow to approve," +
//             "than invest, than increase approval, than invest and release all", async () => {
//             let balanceBefore = await web3.eth.getBalance(accounts[5]);
//             await tt.init(tbn(0x12), tw(100), {from: ADMIN});
//             assert((await tt.balanceOf(tbn(0x12), ADMIN)).eq(tw(100)));
//             assert((await tt.totalSupply(tbn(0x12))).eq(tw(100)));
//             await tt.approve(tbn(0x12), accounts[4], tw(50), {from: ADMIN});
//             await tt.transferFrom(tbn(0x12), ADMIN, accounts[5], tw(50), {from: accounts[4]});
//             for (let i = 1; i < 5; i++) {
//                 await tt.acceptDividends(tbn(0x12), {from: accounts[i], value: tw(2)});
//             }
//             for (let i = 6; i < 8; i++) {
//                 await tt.acceptDividends(tbn(0x12), {from: accounts[i], value: tw(2)});
//             }
//             let dividendsFirst = await tt.dividendsRightsOf(tbn(0x12), accounts[5]);
//             assert(dividendsFirst.eq(tw(6)));
//             await tt.increaseApproval(tbn(0x12), accounts[4], tw(25), {from: ADMIN});
//             await tt.transferFrom(tbn(0x12), ADMIN, accounts[5], tw(25), {from: accounts[4]});
//             await tt.acceptDividends(tbn(0x12), {from: accounts[9], value: tw(20)});
//             let dividendsSecond = await tt.dividendsRightsOf(tbn(0x12), accounts[5]);
//             assert(dividendsSecond.eq(tw(21)));
//             let instance = await tt.releaseDividendsRights(tbn(0x12), tw(21), {from: accounts[5], gasPrice: gasPrice});
//             let fee = instance.receipt.gasUsed * gasPrice;
//             let balanceNow = await web3.eth.getBalance(accounts[5]);
//             assert((balanceBefore.plus(tw(21))).eq(balanceNow.plus(fee)));
//         });
//
//         it("should allow to release by force", async () => {
//             let balanceBefore = await web3.eth.getBalance(accounts[5]);
//             await tt.init(tbn(0x12), tw(100), {from: ADMIN});
//             assert((await tt.balanceOf(tbn(0x12), ADMIN)).eq(tw(100)));
//             assert((await tt.totalSupply(tbn(0x12))).eq(tw(100)));
//             await tt.transfer(tbn(0x12), accounts[5], tw(50));
//             await tt.acceptDividends(tbn(0x12), {from: accounts[3], value: tw(4)});
//             let dividends = await tt.dividendsRightsOf(tbn(0x12), accounts[5]);
//             assert(dividends.eq(tw(2)));
//             await tt.releaseDividendsRightsForce(tbn(0x12), accounts[5], dividends, {from: ADMIN});
//             let balanceNow = await web3.eth.getBalance(accounts[5]);
//             assert((balanceBefore.plus(dividends)).eq(balanceNow));
//         });
//
//         it("just all in one", async () => {
//
//             let tokens = {
//                 token0: tbn(0x0),
//                 token1: tbn(0x1),
//                 token2: tbn(0x2),
//                 token3: tbn(0x3),
//                 token4: tbn(0x4)
//             };
//
//             let incorrectSums = {
//                 sum0: tw(0),
//                 sum1: tbn(2 ** 256),
//                 sum2: tbn(-1),
//                 sum3: tw(10000000),
//                 sum4: tw(-2 * 256)
//             };
//
//             let sumsToCheck = {
//                 sumd0: tw(1),
//                 sumd1: tw(2)
//             };
//
//             let fees = [];
//             let balanceBefore = await web3.eth.getBalance(accounts[2]);
//             for (let i in tokens) {
//                 await tt.init(tokens[i], tw(100), {from: ADMIN});
//                 await tt.transfer(tokens[i], accounts[2], tw(50), {from: ADMIN});
//                 await tt.acceptDividends(tokens[i], {from: accounts[6], value: tw(2)});
//                 let d = await tt.dividendsRightsOf(tokens[i], accounts[2]);
//                 let ins = await tt.releaseDividendsRights(tokens[i], d, {from: accounts[2], gasPrice: gasPrice});
//                 fees.push(ins.receipt.gasUsed * gasPrice);
//             }
//             ;
//             let balanceNow = await web3.eth.getBalance(accounts[2]);
//             let fee = 0;
//             for (let j = 0; j < 5; j++) {
//                 fee += fees[j];
//             }
//             ;
//             for (let j = 0; j < 5; j++) {
//                 assert((balanceBefore.plus(tw(5)).eq(balanceNow.plus(fee))));
//             }
//             ;
//         });
//     });
//
//     describe("dividends overdraft tests", () => {
//
//         it("should not allow to accept dividends with overdraft", async () => {
//             await tt.init(tbn(0x1), tw(1000), {from: ADMIN});
//             let ovedraftSum = await overdraft.max_value_test();
//             try {
//                 await tt.acceptDividends(ovedraftSum, {from: ADMIN, value: tw(2)});
//             }
//             catch (e) {
//
//             }
//             assert((await tt.totalSupply(ovedraftSum)).eq(tbn(0)));
//             try {
//                 await tt.acceptDividends(tbn(0x2), {from: ADMIN, value: ovedraftSum});
//             }
//             catch (e) {
//
//             }
//             assert((await tt.totalSupply(tbn(0x2))).eq(tbn(0)));
//         });
//
//         it("should not allow to tranfer with overdraft", async () => {
//             await tt.init(tbn(0x1), tw(1000), {from: ADMIN});
//             let ovedraftSum = await overdraft.max_value_test();
//             try {
//                 await tt.transfer(tbn(0x1), accounts[4], ovedraftSum, {from: ADMIN});
//             }
//             catch (e) {
//
//             }
//             assert((await tt.balanceOf(tbn(0x1), accounts[4])).eq(tbn(0)));
//         });
//
//         it("should not allow to tranferFrom with overdraft", async () => {
//             await tt.init(tbn(0x1), tw(1000), {from: ADMIN});
//             await tt.approve(tbn(0x1), accounts[4], tw(10), {from: ADMIN});
//             let ovedraftSum = await overdraft.max_value_test();
//             try {
//                 await tt.transferFrom(tbn(0x12), ADMIN, accounts[5], ovedraftSum, {from: accounts[4]});
//             }
//             catch (e) {
//
//             }
//             assert((await tt.balanceOf(tbn(0x1), accounts[5])).eq(tw(0)));
//         });
//
//         it("should not allow to release with overdraft", async () => {
//             await tt.init(tbn(0x1), tw(1000), {from: ADMIN});
//             await tt.transfer(tbn(0x1), accounts[5], tw(1000));
//             assert((await tt.balanceOf(tbn(0x1), accounts[5])).eq(tw(1000)));
//             let ovedraftSum = await overdraft.max_value_test();
//             for (let i = 6; i < 8; i++) {
//                 await tt.acceptDividends(tbn(0x1), {from: accounts[i], value: tw(2)});
//             }
//             assert((await web3.eth.getBalance(tt.address)).eq(tw(4)));
//             assert((await tt.dividendsRightsOf(tbn(0x1), accounts[5])).eq(tw(4)));
//             try {
//                 await tt.releaseDividendsRights(tbn(0x1), ovedraftSum, {from: accounts[5]});
//             }
//             catch (e) {
//
//             }
//             assert((await web3.eth.getBalance(tt.address)).eq(tw(4)));
//             assert((await tt.dividendsRightsOf(tbn(0x1), accounts[5])).eq(tw(4)));
//         });
//
//         it("should not allow to releaseByForce with overdraft", async () => {
//             await tt.init(tbn(0x1), tw(1000), {from: ADMIN});
//             await tt.transfer(tbn(0x1), accounts[5], tw(1000));
//             assert((await tt.balanceOf(tbn(0x1), accounts[5])).eq(tw(1000)));
//             let ovedraftSum = await overdraft.max_value_test();
//             for (let i = 6; i < 8; i++) {
//                 await tt.acceptDividends(tbn(0x1), {from: accounts[i], value: tw(2)});
//             }
//             assert((await web3.eth.getBalance(tt.address)).eq(tw(4)));
//             assert((await tt.dividendsRightsOf(tbn(0x1), accounts[5])).eq(tw(4)));
//
//             try {
//                 await tt.releaseDividendsRightsForce(tbn(0x1), accounts[5], ovedraftSum, {from: ADMIN});
//             }
//             catch (e) {
//
//             }
//             assert((await web3.eth.getBalance(tt.address)).eq(tw(4)));
//             assert((await tt.dividendsRightsOf(tbn(0x1), accounts[5])).eq(tw(4)));
//         });
//
//     });
// });