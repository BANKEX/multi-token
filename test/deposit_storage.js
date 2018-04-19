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

//

contract('DepositStorage', (accounts) => {
///*

    let gas_price = 0;

    const me = accounts[0]

    before(async () => {

        gas_price = await web3.eth.getGasPrice();

        const SafeMathInstance = await SafeMath.new()
        await DepositStorage.link('SafeMath', SafeMathInstance.address)
        await MultiToken.link(    'SafeMath', SafeMathInstance.address)
        // await ERC20.link('SafeMath', SafeMathInstance.address)
    })

/*

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

    const alice = accounts[1] // investor
    const bob   = accounts[2] // investor
    const clara = accounts[3] // profit holder

    it('should accept and pay dividents in eth for erc20', async ()=>{

        const token      = await Token.new()
        const ds         = await DepositStorage.new(zero)

        const deposit_id = Math.floor(Math.random()*10000)

        const val = {
            alice: 100,
            bob  : 300
        }

        console.log(`gas price: ${web3.utils.fromWei(gas_price.toString())}`);;

        const share = {
            alice: val.alice/(val.alice+val.bob),
            bob  :   val.bob/(val.alice+val.bob)
        }

        const initial_balance = {
            alice : await web3.eth.getBalance(alice),
            bob   : await web3.eth.getBalance(bob),
            clara : await web3.eth.getBalance(clara)
        }

        const dividents = web3.utils.toWei('10');

        await token.mint(alice, val.alice)

        var tx = await token.approve(ds.address, val.alice, {from: alice})

        var gas_cost = tx.receipt.cumulativeGasUsed*gas_price;

        await token.mint(bob, val.bob)
        await token.approve(ds.address, val.bob, {from: bob})

        var tx = await ds.acceptDeposit(token.address, 0, deposit_id, val.alice, {
            from: alice})

        gas_cost += tx.receipt.cumulativeGasUsed*gas_price;

        await ds.acceptDeposit(token.address, 0, deposit_id, val.bob, {
            from: bob})

        await ds.acceptDividendEth(token.address, 0, {
            from: clara,
            value: dividents
        })

        await web3.evm.increaseTime(3600*24); // 1 UPDATE_PERIOD

        var tx = await ds.releaseDividendEth(token.address, 0, deposit_id, {from: alice});
        await ds.releaseDividendEth(token.address, 0, deposit_id, {from: bob});

        gas_cost += tx.receipt.cumulativeGasUsed*gas_price;


        console.log(tx.logs[0].args['x'].toString());
        console.log(tx.logs[1].args['x'].toString());
        console.log(tx.logs[2].args['x'].toString());

        const alice_profit = (await web3.eth.getBalance(alice)) - initial_balance.alice;

        console.log('alice');
        console.log(web3.utils.fromWei(initial_balance.alice));
        console.log(web3.utils.fromWei(alice_profit.toString()));
        console.log(web3.utils.fromWei(gas_cost.toString()));


        console.log('clara');
        console.log(web3.utils.fromWei(initial_balance.clara));
        console.log(web3.utils.fromWei(await web3.eth.getBalance(clara)));

        // console.log(await web3.eth.getBalance(alice));

        // const bob_profit   = web3.eth.getBalance(bob)  - initial_balance.bob;

        // assert(bn(alice_profit).eq(alice.share*dividents), `wrong dividents: expected ${alice.share*dividents} got ${alice_profit}`)

    })

//*/
})