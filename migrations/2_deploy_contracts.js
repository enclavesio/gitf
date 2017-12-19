var GiftEthFactory = artifacts.require("./GiftEthFactory.sol");

module.exports = function(deployer) {
  deployer.deploy(GiftEthFactory);
};
