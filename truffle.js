module.exports = {
    // See <http://truffleframework.com/docs/advanced/configuration>
    // to customize your Truffle configuration!
    networks: {
        development: {
            host: "127.0.0.1",
            port: 8545,
            network_id: "*", // Match any network id,
            gas: 4600000
        },
        ganache: {
            host: '127.0.0.1',
            port:7545,
            network_id: 5777,
            gas: 6721975
        },
        kovan: {
            host: 'localhost',
            port: 8545,
            network_id: 42,
            gas: 4700000,
            gasPrice: 20000000000
        },
        rinkeby: {
            host: "localhost", // Connect to geth on the specified
            port: 8545,
            network_id: 4,
            gas: 4612388,
            gasPrice: 20000000000,
            from: "0xf17f52151EbEF6C7334FAD080c5704D77216b732"
        },
        bankexTestNetwork: {
            host: '52.166.13.111',
            port: 8535,
            network_id: 488412,
            gasPrice: 180000000000,
            from: "0xf17f52151EbEF6C7334FAD080c5704D77216b732"
        },
        solc: {
            optimizer: {
                enabled: true,
                runs: 200
            }
        },
        migrations_directory: './migrations'
    }
};
