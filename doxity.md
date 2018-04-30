
# how to get doxity docs

1. install global doxity

    `yarn global add doxity`
    `yarn global add truffle-contract`

2. tweak truffle-compile settings

    add "metadata", "devdoc", "userdoc" to list of compiler settings (with "abi" ) in global truffle-compile module

3. copy files to script/doxity

    from https://github.com/hitchcott/doxity-demo/tree/master/scripts/doxity

4. run `doxity compile`

5. run `doxity develop`


