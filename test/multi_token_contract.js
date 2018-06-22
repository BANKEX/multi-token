const MultiToken = artifacts.require('./MultiVendingToken.sol');

contract('MultiToken', (accounts) => {

    let mt;
    let ADMIN = accounts[0];

    beforeEach(async ()=> {
       mt = await MultiToken.new({from: ADMIN});
    });

    describe("common", () => {
        it("ADMIN == owner", async () => {
            assert.equal(ADMIN, await mt.owner(), "error owner != ADMIN");
        });

    });
});
