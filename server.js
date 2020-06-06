const express = require('express');
const app = express();
const port = 3000 || process.env.PORT;
const Web3 = require('web3');
const truffle_connect = require('./connection/app.js');
const bodyParser = require('body-parser');

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
app.use(bodyParser.json());

app.use('/', express.static('public_static'));

app.get('/getAccounts', (req, res) => {
  console.log("**** GET /getAccounts ****");
  truffle_connect.start(function (answer) {
    res.send(answer);
  })
});

// get all accounts
app.get('/api/accounts', (req, res) => {
  console.log("**** GET /getAccounts api ****");
  truffle_connect.start(function (answer) {
    console.log(answer);
    res.status(200).send({
      success: 'true',
      accounts:answer
    });
  })
});

// get one account
app.get('/api/accounts/:id', (req, res) => {
  console.log("**** GET /getAccountById ****");
  truffle_connect.start(function (answer) {
    console.log(answer[req.params.id]);
    res.status(200).send({
      success: 'true',
      accounts:answer[req.params.id]
    });
  })
});

// get account balance
app.get('/api/balance/:id', (req, res) => {
  console.log("**** GET /getBalance ****");
 var web3 = new Web3(new Web3.providers.HttpProvider("http://127.0.0.1:7545"));

  truffle_connect.start(function (answer) {
    console.log('account hash: '+answer[req.params.id]);
 web3.eth.getBalance(answer[req.params.id]).then((f) => {
  res.status(200).send({
    success: 'true',
    account:answer[req.params.id],
    balance: f
  });
});
});
    
});

// get account balance in ether
app.get('/api/balance/ether/:id', (req, res) => {
  console.log("**** GET /getBalance in ether ****");
 var web3 = new Web3(new Web3.providers.HttpProvider("http://127.0.0.1:7545"));

  truffle_connect.start(function (answer) {
    console.log('answer[req.params.id]: '+answer[req.params.id]);
 
     web3.eth.getBalance(answer[req.params.id]).then((b)=> {
      console.log('b: ' + b);
      var balance = web3.utils.fromWei(b,'ether');
      console.log('balance : '+balance);
      
      res.status(200).send({
            success: 'true',
            account:answer[req.params.id],
            balance: balance
          });
     });
  });
});


// get transaction number
app.get('/api/get/transaction/number/:id', (req, res) => {
  console.log("**** GET /getNBTransaction ****");
 var web3 = new Web3(new Web3.providers.HttpProvider("http://127.0.0.1:7545"));

  truffle_connect.start(function (answer) {
    console.log(answer[req.params.id]);
    web3.eth.getTransactionCount(answer[req.params.id]).then(f => {
      res.status(200).send({
        success: 'true',
        account:answer[req.params.id],
        NoOfTransaction:f
      });
    });
    
  })
});

// get medical info
app.get('/api/medicals', (req, res) => {   
  truffle_connect.getMedical( (answer) => { 
      res.send(answer);
    }); 
});

//sell medical
app.post('/api/sell/medical/:id', (req, res) => { 
  console.log(req.body);
  var web3 = new Web3(new Web3.providers.HttpProvider("http://127.0.0.1:7545"));

  let fullname = req.body.fullname;
  let discription = req.body.discription;
  let price = web3.utils.toWei(req.body.price, 'ether');
 
  truffle_connect.start(function (answer) {
    console.log(answer[req.params.id]); 
    truffle_connect.sellMedical(answer[req.params.id] ,
      fullname,discription,price, (answer) => {
      res.send(answer);
    });
  })

  
});

app.post('/getBalance', (req, res) => {
  console.log("**** GET /getBalance ****");
  console.log(req.body);
  let currentAcount = req.body.account;

  truffle_connect.refreshBalance(currentAcount, (answer) => {
    let account_balance = answer;
    truffle_connect.start(function(answer){
      // get list of all accounts and send it along with the response
      let all_accounts = answer;
      response = [account_balance, all_accounts]
      res.send(response);
    });
  });
});

app.post('/sendCoin', (req, res) => {
  console.log("**** GET /sendCoin ****");
  console.log(req.body);

  let amount = req.body.amount;
  let sender = req.body.sender;
  let receiver = req.body.receiver;

  truffle_connect.sendCoin(amount, sender, receiver, (balance) => {
    res.send(balance);
  });
});

app.listen(port, () => {

  // fallback - use your fallback strategy (local node / hosted node + in-dapp id mgmt / fail)
  truffle_connect.web3 = new Web3(new Web3.providers.HttpProvider("http://127.0.0.1:7545"));

  console.log("Express Listening at http://localhost:" + port);

});
