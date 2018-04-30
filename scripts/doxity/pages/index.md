Use `truffle migrate --network ganache` to  deploy contract on ganache.

Use 
```bash
geth --dev --rpccorsdomain="*" --rpcaddr="0.0.0.0" --rpc --rpcapi="personal,eth,net,debug,web3,db,admin" --networkid 7555  --dev.period=1
```
to setup remix compatible debug supporting test ethereum blockchain and `truffle migrate --network geth_dev` to deploy the contract.


Strictly recommended to use solium linter. `solium -d contracts`

If you have compilation errors due to `emit Event` in solidity, update truffle.