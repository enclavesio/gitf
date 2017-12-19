# GITF - Give The Gift Of Hodling

Ethereum contracts to allow gifting of time locked Ether.

## Testing

Run `truffle test`, you should see the output:  
```
Using network 'development'.

  Contract: GiftEthFactory
    ✓ should create a GiftEth contract and withdraw from it (958ms)
    ✓ should create a GiftEth contract with lockTs in the past and withdraw from it (474ms)

  2 passing (1s)
```

## Deployment

Run `truffle migrate`, you should see the output:  
```
Running migration: 1_initial_migration.js
  Deploying Migrations...
  ... 0x3ea0a7a697d49e7b67a6dac713aa6e500b7a130910e55b08184210b4e81dd93f
  Migrations: 0x57f2509605d28f91c237ff7eb8900644a49c6a51
Saving successful migration to network...
  ... 0x95f1321696ceadc148fe99401f69ab4e7c2edcc3a275e6ebf65b71caebff3b67
Saving artifacts...
Running migration: 2_deploy_contracts.js
  Deploying GiftEthFactory...
  ... 0xd340e4a02cd1c9cdba45a603933907bf3d097fe569eb3f78916c33200f76e46e
  GiftEthFactory: 0x6cead575f1e676554859b46332bd823daf38a8d1
Saving successful migration to network...
  ... 0xac9147abd0e3dcef54002f89888ec86d4de42f44007648cc75bb1b16cb67a4ee
Saving artifacts...
```
