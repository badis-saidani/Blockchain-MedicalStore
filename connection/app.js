const contract = require('truffle-contract');

const metacoin_artifact = require('../build/contracts/MetaCoin.json');
var MetaCoin = contract(metacoin_artifact);

const medicalstore_artifact = require('../build/contracts/MedicalStore.json');
var MedicalStore = contract(medicalstore_artifact);

module.exports = {
  start: function(callback) {
    var self = this;

    // Bootstrap the MetaCoin abstraction for Use.
    MetaCoin.setProvider(self.web3.currentProvider);

    // Get the initial account balance so it can be displayed.
    self.web3.eth.getAccounts(function(err, accs) {
      if (err != null) {
        console.log("There was an error fetching your accounts.");
        return;
      }

      if (accs.length == 0) {
        console.log("Couldn't get any accounts! Make sure your Ethereum client is configured correctly.");
        return;
      }
      self.accounts = accs;
      self.account = self.accounts[2];

      callback(self.accounts);
    });
  },
  refreshBalance: function(account, callback) {
    var self = this;

    // Bootstrap the MetaCoin abstraction for Use.
    MetaCoin.setProvider(self.web3.currentProvider);

    var meta;
    MetaCoin.deployed().then(function(instance) {
      console.log('instanc: '+instance);
      
      meta = instance;
      return meta.getBalance.call(account, {from: account});
    }).then(function(value) {
        callback(value.valueOf());
    }).catch(function(e) {
        console.log(e);
        callback("Error 404");
    });
  },

  sellMedical: function(sender ,fullname,discription,price, callback) {
    var self = this;
    MedicalStore.setProvider(self.web3.currentProvider);

    var meta;
    MedicalStore.deployed().then(function(instance) {
      meta = instance;
      return meta.sellMedical(fullname,discription,price, {from: sender});
    }).then(function() {
      self.getMedical(  function (answer) {
        callback(answer);
      });
    }).catch(function(e) {
      console.log(e);
      callback("ERROR 404");
    });
  },



  getMedical: function(  callback) {
    var self = this; 
    MedicalStore.setProvider(self.web3.currentProvider); 
    var meta;
    MedicalStore.deployed().then(function(instance) {
      meta = instance;
      return meta.getMedical();
    }).then(function(value) {
        callback(value );
    }).catch(function(e) {
        console.log(e);
        callback("Error 404");
    });
  },
  
  sendCoin: function(amount, sender, receiver, callback) {
    var self = this;

    // Bootstrap the MetaCoin abstraction for Use.
    MetaCoin.setProvider(self.web3.currentProvider);

    var meta;
    MetaCoin.deployed().then(function(instance) {
      meta = instance;
      return meta.sendCoin(receiver, amount, {from: sender});
    }).then(function() {
      self.refreshBalance(sender, function (answer) {
        callback(answer);
      });
    }).catch(function(e) {
      console.log(e);
      callback("ERROR 404");
    });
  }
}
