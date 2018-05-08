var accounts = [];

function createAccount(newAccount){
  //push to the account-array
  accounts.push(newAccount);
  //return account
  return newAccount;
}
function getAccount(myUsername){
  var matchedAccount;
  accounts.forEach(function (account){
    if (account.username === myUsername) {
      matchedAccount = account;
    }
  });
  return matchedAccount;
}
//deposit
function Deposit (myAccount, myAmount){
  myAccount.balance += myAmount;
}
//withdraw
function Withdraw (myAccount, myAmount){
  myAccount.balance -= myAmount;
}
//get balance
function getBalance (myAccount){
  console.log(myAccount.balance);
}

Deposit (account, 1000);
getBalance(account);

Withdraw (account, 101);
getBalance(account);
