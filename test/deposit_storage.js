const SafeMath       = artifacts.require('SafeMath');
const MultiToken     = artifacts.require('MultiToken');
const DepositStorage = artifacts.require('DepositStorage');
const Token          = artifacts.require('MintableToken');

const eu             = require('ethereumjs-util')

const zero           = eu.zeroAddress()

const expectThrow = require('../helpers/expectThrow');

const is_ok = tx => !!tx.receipt && tx.receipt.status === '0x01'

const is_reverted = e => e.toString().indexOf('VM Exception while processing transaction: revert') !== -1

const BigNumber = require('bignumber.js').BigNumber;

const bn = v => new BigNumber(v)

/*
const Web3 = require('web3');
const web3 = new Web3();

web3.setProvider('http://127.0.0.1:8545')

//ganache hacks
web3.extend({
    property: 'evm',
    methods: [{
        name: 'increaseTime',
        call: 'evm_increaseTime',
        params: 1,
        inputFormatter: [null]
    },{
        name: 'mine',
        call: 'evm_mine'
    }]
})

//*/

contract('DepositStorage', (accounts) => {
///*

    const me = accounts[0]

    before(async () => {

        const SafeMathInstance = await SafeMath.new()
        await DepositStorage.link('SafeMath', SafeMathInstance.address)
        await MultiToken.link(    'SafeMath', SafeMathInstance.address)
        // await ERC20.link('SafeMath', SafeMathInstance.address)
    })

///*

    it('should throw exception if created without arguments', (done)=> {

        DepositStorage.new().catch(e=>{done()})
    })

    it('should accept deposits in erc20', async ()=> {

        const token = await Token.new()
        const ds    = await DepositStorage.new(zero)

        const deposit_id = Math.floor(Math.random()*10000)

        const val = 100

        await token.mint(me, val)
        await token.approve(ds.address, val)

        assert(is_ok(await ds.acceptDeposit(token.address, 0, deposit_id, val)))

        await token.mint(me, val)
        await token.approve(ds.address, val)

        try {

            await ds.acceptDeposit(token.address, 0, deposit_id, val)
            assert(false, 'Double deposit')

        } catch (e) {

            assert(is_reverted(e), 'no revert of double deposit')
        }

        const sum = await ds.depositCollected(token.address, 0)

        assert(bn(val).eq(sum), `wrong depositCollected: expected ${val} got ${sum.toString()}`);

    })

    it('should release deposit of erc20', async ()=> {

        const token = await Token.new()
        const ds    = await DepositStorage.new(zero)

        const deposit_id = Math.floor(Math.random()*10000)

        const val = 100

        await token.mint(me, val)
        await token.approve(ds.address, val)

        await ds.acceptDeposit( token.address, 0, deposit_id, val)
        await ds.releaseDeposit(token.address, 0, deposit_id)

        const released = await token.balanceOf(me)

        assert(bn(val).eq(released), `wrong amount returned from deposit: expected ${val} got ${released.toString()}`);

        assert(bn(0).eq(await ds.depositCollected(token.address, 0)) , 'deposit sum not reduced');

    })

    it('should accept and release funds in Multi Token', async ()=>{

        const multitoken = await MultiToken.new()
        const ds         = await DepositStorage.new(zero)

        const deposit_id = Math.floor(Math.random()*10000)

        const val = 200
        const subtoken   = Math.floor(Math.random()*1024)

        await multitoken.createNewSubtoken(subtoken, me, val)
        await multitoken.approve(subtoken, ds.address, val)

        await ds.acceptDeposit( multitoken.address, subtoken, deposit_id, val)
        await ds.releaseDeposit(multitoken.address, subtoken, deposit_id)

        const released = await multitoken.balanceOf(subtoken, me)

        assert(bn(val).eq(released), `wrong amount returned from deposit: expected ${val} got ${released.toString()}`);

        assert(bn(0).eq(await ds.depositCollected(multitoken.address, subtoken)) , 'deposit sum not reduced');

    })

//*/
})