const GiftEthFactory = artifacts.require("./GiftEthFactory.sol");
const GiftEth = artifacts.require("./GiftEth.sol");
const assertFail = require("./helpers/assertFail");

contract('GiftEthFactory', function(accounts) {


  it("should create a GiftEth contract and withdraw from it", async () => {
    let giftEthFactory = await GiftEthFactory.deployed();
    let currentTime = await web3.eth.getBlock(web3.eth.blockNumber).timestamp;
    let result = await giftEthFactory.giftEth(accounts[1], currentTime + 24 * 60 * 60, "Message 1", {from: accounts[0], value: web3.toWei(1, 'ether')});
    let foundGift = false;
    for (let i = 0; i < result.logs.length; i++) {
      let log = result.logs[i];
      if (log.event == "GiftGenerated") {
        foundGift = true;
        assert.equal(log.args._gifter, accounts[0], "Gifter set");
        assert.equal(log.args._recipient, accounts[1], "Recipient set");
        assert.equal(log.args._amount.toNumber(), web3.toWei(1, 'ether'), "Amount set");
        assert.equal(log.args._lockTs.toNumber(), currentTime + 24 * 60 * 60, "LockTS set");
        assert.equal(log.args._giftMessage, "Message 1", "GiftMessage set");
        let giftEth = await GiftEth.at(log.args._gift);

        //Should fail as we're before withdraw time
        await assertFail(async () => {
          await giftEth.withdraw({from: accounts[1], gasPrice: 0});
        });

        currentTime = await web3.eth.getBlock(web3.eth.blockNumber).timestamp;
        await web3.currentProvider.send({jsonrpc: "2.0", method: "evm_increaseTime", params: [24 * 60 * 60], id: 0})
        await web3.currentProvider.send({jsonrpc: "2.0", method: "evm_mine", params: [], id: 0});

        //Should fail as wrong caller
        await assertFail(async () => {
          await giftEth.withdraw({from: accounts[0], gasPrice: 0});
        });
        await assertFail(async () => {
          await giftEth.withdraw({from: accounts[2], gasPrice: 0});
        });

        var beforeBalance = await web3.eth.getBalance(accounts[1]);
        await giftEth.withdraw({from: accounts[1], gasPrice: 0});
        var afterBalance = await web3.eth.getBalance(accounts[1]);
        assert.equal(beforeBalance.add(web3.toWei(1, 'ether')).toNumber(), afterBalance.toNumber(), "Withdraw successful");
      }
    }
    assert.equal(foundGift, true, "Gift Created");
  });

  it("should create a GiftEth contract with lockTs in the past and withdraw from it", async () => {
    let giftEthFactory = await GiftEthFactory.deployed();
    let currentTime = await web3.eth.getBlock(web3.eth.blockNumber).timestamp;
    let result = await giftEthFactory.giftEth(accounts[1], currentTime - 1, "testtesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttest", {from: accounts[0], value: web3.toWei(0.1, 'ether')});
    let foundGift = false;
    for (let i = 0; i < result.logs.length; i++) {
      let log = result.logs[i];
      if (log.event == "GiftGenerated") {
        foundGift = true;
        assert.equal(log.args._gifter, accounts[0], "Gifter set");
        assert.equal(log.args._recipient, accounts[1], "Recipient set");
        assert.equal(log.args._amount.toNumber(), web3.toWei(0.1, 'ether'), "Amount set");
        assert.equal(log.args._lockTs.toNumber(), currentTime - 1, "LockTS set");
        assert.equal(log.args._giftMessage, "testtesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttest", "GiftMessage set");
        let giftEth = await GiftEth.at(log.args._gift);
        var beforeBalance = await web3.eth.getBalance(accounts[1]);
        await giftEth.withdraw({from: accounts[1], gasPrice: 0});
        var afterBalance = await web3.eth.getBalance(accounts[1]);
        assert.equal(beforeBalance.add(web3.toWei(0.1, 'ether')).toNumber(), afterBalance.toNumber(), "Withdraw successful");
      }
    }
    assert.equal(foundGift, true, "Gift Created");
  });

});
