# Ropsten testnet PoW chain

[![Join the chat at https://gitter.im/ethereum/ropsten](https://badges.gitter.im/ethereum/ropsten.svg)](https://gitter.im/ethereum/ropsten?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge)

To resync to the revived Ropsten chain, at the command line run:
```
geth --testnet removedb
geth --testnet --syncmode "fast" --bootnodes "enode://20c9ad97c081d63397d7b685a412227a40e23c8bdc6688c6f37e97cfbc22d2b4d1db1510d8f61e6a8866ad7f0e17c02b14182d37ea7c3c8b9c2683aeb6b733a1@52.169.14.227:30303,enode://6ce05930c72abc632c58e2e4324f7c7ea478cec0ed4fa2528982cf34483094e9cbc9216e7aa349691242576d552a2a56aaeae426c5303ded677ce455ba1acd9d@13.84.180.240:30303"
```

or for Parity:
```
parity db kill --chain ropsten
parity --chain ropsten --bootnodes "enode://6332792c4a00e3e4ee0926ed89e0d27ef985424d97b6a45bf0f23e51f0dcb5e66b875777506458aea7af6f9e4ffb69f43f3778ee73c81ed9d34c51c4b16b0b0f@52.232.243.152:30303,enode://94c15d1b9e2fe7ce56e458b9a3b672ef11894ddedd0c6f247e0f1d3487f52b66208fb4aeb8179fce6e3a749ea93ed147c37976d67af557508d199d9594c35f09@192.81.208.223:30303"
```

or for cpp-ethereum:
```
eth --ropsten --kill --pin --peerset "required:6332792c4a00e3e4ee0926ed89e0d27ef985424d97b6a45bf0f23e51f0dcb5e66b875777506458aea7af6f9e4ffb69f43f3778ee73c81ed9d34c51c4b16b0b0f@52.232.243.152:30303 required:94c15d1b9e2fe7ce56e458b9a3b672ef11894ddedd0c6f247e0f1d3487f52b66208fb4aeb8179fce6e3a749ea93ed147c37976d67af557508d199d9594c35f09@192.81.208.223:30303"
```

## Troubleshooting

If you have problems syncing to the right chain, you can force your client to connect strictly to peers known to be on the revived chain. This only needs to be done for the initial sync.

For geth, start the client without connecting to any peers:
```
geth --testnet --syncmode "fast" --nodiscover
```
Then in the console (`geth attach`), add them manually:
```
admin.addPeer('enode://94c15d1b9e2fe7ce56e458b9a3b672ef11894ddedd0c6f247e0f1d3487f52b66208fb4aeb8179fce6e3a749ea93ed147c37976d67af557508d199d9594c35f09@192.81.208.223:30303')
admin.addPeer('enode://6332792c4a00e3e4ee0926ed89e0d27ef985424d97b6a45bf0f23e51f0dcb5e66b875777506458aea7af6f9e4ffb69f43f3778ee73c81ed9d34c51c4b16b0b0f@52.232.243.152:30303')
```
If you can't not access the testnet with web3.js, add the following parameters to make it work find.
```
geth --testnet --syncmode "fast" --nodiscover --rpc --rpcport "8545" --rpcapi "admin,db,eth,net,web3,personal"
```


For parity:
```
echo -e "enode://6332792c4a00e3e4ee0926ed89e0d27ef985424d97b6a45bf0f23e51f0dcb5e66b875777506458aea7af6f9e4ffb69f43f3778ee73c81ed9d34c51c4b16b0b0f@52.232.243.152:30303\nenode://94c15d1b9e2fe7ce56e458b9a3b672ef11894ddedd0c6f247e0f1d3487f52b66208fb4aeb8179fce6e3a749ea93ed147c37976d67af557508d199d9594c35f09@192.81.208.223:30303" >> ropstenpeers.txt
```
to add the peers (one per line) to a text file, and then run the client with flags:
```
parity --chain ropsten --reserved-peers ropstenpeers.txt
```

You can check that the client is on the revived chain by comparing to the block numbers on [http://ropsten.etherscan.io](http://ropsten.etherscan.io).
