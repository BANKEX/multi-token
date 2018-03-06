const SafeMath       = artifacts.require('SafeMath');
const MultiToken     = artifacts.require('MultiToken');
const DepositStorage = artifacts.require('DepositStorage');
const Token          = artifacts.require('MintableToken');

const eu             = require('ethereumjs-util')

const zero           = eu.zeroAddress()

const expectThrow = require('../helpers/expectThrow');



contract('DepositStorage', (accounts) => {
/*
    before(async () => {

        const SafeMathInstance = await SafeMath.new();
        await DepositStorage.link('SafeMath', SafeMathInstance.address)
        // await ERC20.link('SafeMath', SafeMathInstance.address)
    })

    // beforeEach(async () => {
    //     _contract = await DepositStorage.new(eu.zeroAddress());
    // })


    it('should throw exception if created without arguments', (done)=> {

        DepositStorage.new().catch(e=>{done()})
    })

    it('should accept deposits in erc20', async ()=> {

        const token = await Token.new()
        const ds    = await DepositStorage.new(zero)

        const deposit_id = Math.floor(Math.random()*10000)

        const val = 100

        await token.mint(accounts[0], val)
        await token.approve(ds.address, val)

        const success = await ds.acceptDeposit.call(token.address, 0, deposit_id, val)

        assert(success)

        // await token.mint(accounts[0], val)
        // await token.approve(ds.address, val)

        // no double deposit
        ds.acceptDeposit.call(token.address, 0, deposit_id, val).catch(e=>{

            console.log('catch');
        })

    })


    it('should release deposit', async ()=> {

        const token = await Token.new()
        const ds    = await DepositStorage.new(zero)

        const deposit_id = Math.floor(Math.random()*10000)

        const val = 100

        await token.mint(accounts[0], val)
        await token.approve(ds.address, val)

        await ds.acceptDeposit.call(token.address, 0, deposit_id, val)

        const v = await ds.releaseDeposit.call(token.address, 0, deposit_id)

        // console.log(v);

        // assert(token.balanceOf(accounts[0]), val)


    })
*/

})