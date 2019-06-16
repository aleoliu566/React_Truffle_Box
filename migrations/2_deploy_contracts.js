var SimpleStorage = artifacts.require("./SimpleStorage.sol");
var SimpleSimple = artifacts.require("./SimpleSimple.sol");
var annuity = artifacts.require("./Annuity.sol");


module.exports = function(deployer) {
  deployer.deploy(SimpleStorage);
  deployer.deploy(SimpleSimple);
  deployer.deploy(annuity);
};
