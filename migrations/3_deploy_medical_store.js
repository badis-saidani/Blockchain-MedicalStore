var MedicalStore = artifacts.require("./MedicalStore.sol");

module.exports = function(deployer) {
  deployer.deploy(MedicalStore);
};
