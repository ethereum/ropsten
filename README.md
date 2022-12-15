<p align="center"><strong>Ropsten (2016)</strong> | Rinkeby (2017) | <a href="https://github.com/eth-clients/goerli">Goerli (2019)</a> | <a href="https://github.com/eth-clients/sepolia">Sepolia (2021)</a></p>
<p align="center"><img src="./assets/ropsten.png" /></p>

# Ropsten Testnet
The `--ropsten` proof-of-work testnet configuration.

:warning: Ropsten has been declared **EOL as of December 2022**. Please use [Goerli](https://github.com/eth-clients/goerli) or [Sepolia](https://github.com/eth-clients/sepolia) moving forward.

## Revival

To resync to the revived Ropsten chain, at the command line run:
```
geth --testnet removedb
geth --testnet --syncmode "fast" --bootnodes "enode://6332792c4a00e3e4ee0926ed89e0d27ef985424d97b6a45bf0f23e51f0dcb5e66b875777506458aea7af6f9e4ffb69f43f3778ee73c81ed9d34c51c4b16b0b0f@52.232.243.152:30303,enode://94c15d1b9e2fe7ce56e458b9a3b672ef11894ddedd0c6f247e0f1d3487f52b66208fb4aeb8179fce6e3a749ea93ed147c37976d67af557508d199d9594c35f09@192.81.208.223:30303"
```

or for Parity:
```
parity db kill --chain ropsten
parity --chain ropsten --bootnodes "enode://6332792c4a00e3e4ee0926ed89e0d27ef985424d97b6a45bf0f23e51f0dcb5e66b875777506458aea7af6f9e4ffb69f43f3778ee73c81ed9d34c51c4b16b0b0f@52.232.243.152:30303,enode://94c15d1b9e2fe7ce56e458b9a3b672ef11894ddedd0c6f247e0f1d3487f52b66208fb4aeb8179fce6e3a749ea93ed147c37976d67af557508d199d9594c35f09@192.81.208.223:30303"
```

or for Aleth (formerly known as cpp-ethereum ):
```
aleth --ropsten --kill --pin --peerset "required:6332792c4a00e3e4ee0926ed89e0d27ef985424d97b6a45bf0f23e51f0dcb5e66b875777506458aea7af6f9e4ffb69f43f3778ee73c81ed9d34c51c4b16b0b0f@52.232.243.152:30303 required:94c15d1b9e2fe7ce56e458b9a3b672ef11894ddedd0c6f247e0f1d3487f52b66208fb4aeb8179fce6e3a749ea93ed147c37976d67af557508d199d9594c35f09@192.81.208.223:30303"
```

## Troubleshooting

If you have problems syncing to the right chain, you can force your client to connect strictly to peers known to be on the revived chain. This only needs to be done for the initial sync.

For geth, start the client without connecting to any peers:
```
geth --testnet --fast --nodiscover
```
Then in the console (`geth attach`), add them manually:
```
admin.addPeer('enode://94c15d1b9e2fe7ce56e458b9a3b672ef11894ddedd0c6f247e0f1d3487f52b66208fb4aeb8179fce6e3a749ea93ed147c37976d67af557508d199d9594c35f09@192.81.208.223:30303')
admin.addPeer('enode://6332792c4a00e3e4ee0926ed89e0d27ef985424d97b6a45bf0f23e51f0dcb5e66b875777506458aea7af6f9e4ffb69f43f3778ee73c81ed9d34c51c4b16b0b0f@52.232.243.152:30303')
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
