console.log('Starting application');

//include third party modules using require
var storage = require('node-persist');
var crypto = require('crypto-js');
var secretKey = 'ej0RT-WEO0TÇ7&/8713jkJK.D]-1';

storage.initSync();

var argv = require('yargs')
  .command('save-pass', 'Save password to node-persist', function(yargs){
    yargs.options({
      masterPassword:{
        demand: true,
        alias: 'm',
        description: 'Enter your password to access password manager',
        type: 'string'
      },
      website: {
        demand: true,
        alias: 'w',
        description: 'Enter the website here, without http/https',
        type: 'string'
      },
      username: {
        demand: true,
        alias: 'u',
        description: 'Enter your username or email address used to log in the website',
        type: 'string'
      },
      password: {
        demand: true,
        alias: 'p',
        description: 'Enter your password to the website',
        type: 'string'
      }
    });
  })
  .command('get-pass', 'Get password from node-persist', function(yargs){
    yargs.options({
      masterPassword:{
        demand: true,
        alias: 'm',
        description: 'Enter your password to access password manager',
        type: 'string'
      },
      username: {
        demand: true,
        alias: 'u',
        description: 'Enter your username or email address used to log in the website',
        type: 'string'
      }
    });
  })
  .help('help')
  .argv;
var command = argv._[0];

console.log('argv is: ');
console.log(argv);
console.log('The command got from user is ' + command + '\n');

// save credentials from command line to database
try {
  if (command === 'save-pass' && argv.masterPassword === 'badpass') {
    var accountManager = storage.getItemSync('accounts');
    console.log('accountManager is:');
    console.log(accountManager);
    console.log('type is:');
    console.log(typeof(accountManager));
    console.log('\n');
    var accountArray = {'website': argv.website, 'username': argv.username, 'password': argv.password}; //is an object
    console.log('The credentials I got is ' + argv.website + ' ' + argv.username + ' ' + argv.password);

    console.log('accountArray is:');
    console.log(accountArray);
    console.log('\n');

    //add encryption

    var encryptedJSON = crypto.AES.encrypt(JSON.stringify(accountArray), secretKey);
    console.log('The encrypted account credentials are: ' + encryptedJSON);
    console.log(encryptedJSON);
    console.log('type is:');
    console.log(typeof(encryptedJSON));
    console.log('\n');

    console.log('Pushing to accountArray..');
    accountManager.push(encryptedJSON.toString());


    //save new password to storage
    console.log('Saving to node-persist..');
    storage.setItemSync('accounts', accountManager);
    console.log('Account saved!');
  } else if (argv.masterPassword != 'badpass') {
    throw new Error('Master password not correct. Please try again.');
  }
} catch (e) {
  console.log(e.message);
}


//get credentials from database to command line
try {
  if (command === 'get-pass' && argv.masterPassword === 'badpass') {
    var accountManagerEncrypted = storage.getItemSync('accounts');
    var matchedAccount;
    for (var i = 0; i < accountManagerEncrypted.length; i++) {
      var accountEncrypted = accountManagerEncrypted[i];
      console.log('Printing accountEncrypted No.' + i + ': ');
      console.log(accountEncrypted);
      console.log('\n');

      //decrypt account
      var bytes = crypto.AES.decrypt(accountEncrypted, secretKey);
      console.log('Printing decrypted bytes:');
      console.log(bytes);
      var accountDecrypted = JSON.parse(bytes.toString(crypto.enc.Utf8));
      console.log('Decrypted object is: ' + accountDecrypted);
      console.log(accountDecrypted + '\n');
      //find account
      if (accountDecrypted.username === argv.username) {
        matchedAccount = accountDecrypted;
      }
    }

    if (typeof matchedAccount === 'undefined') {
      console.log(argv.username + " doesn't exist");
    } else {
      console.log('\nAccount found: ');
      console.log(matchedAccount);
    }
  }
} catch (e) {
  console.log(e.message);
}
