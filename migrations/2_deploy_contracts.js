var control = artifacts.require("./Control.sol");
var annuity = artifacts.require("./Annuity.sol");
var annuity2 = artifacts.require("./Annuity2.sol");
var storage = artifacts.require("./Storage.sol");
var FaceData = artifacts.require("./FaceData.sol");

module.exports = function(deployer) {
  deployer.deploy(control);
  deployer.deploy(annuity);
  deployer.deploy(annuity2);
  deployer.deploy(storage);
  deployer.deploy(FaceData);
};
