var rates = require('./rates.js');
var argv = require('yargs')
  .options({
    convertEUR: {
      demand: false,
      alias: 'eur',
      description: 'Please enter the amount of EUR to be converted to SEK. E.g. 10.5',
      type: 'number'
    },
    convertSEK: {
      demand: false,
      alias: 'sek',
      description: 'Please enter the amount of SEK to be converted to EUR. E.g. 80.35',
      type: 'number'
    }
  })
  .argv;


var amountInEUR = argv.eur;
if (amountInEUR != null) {
    //check for a valid input
    if (amountInEUR < 0 || isNaN(amountInEUR) ) {
      //invalid input
      console.log('Please enter a positive number, with or without decimals.');
    } else {
      //valid input
      rates().then(
        function(EurPerSEK) {
          var amountInSEK = amountInEUR * EurPerSEK;
          console.log(amountInEUR + ' EUR is equal to ' + amountInSEK.toFixed(2) + ' SEK' );
        }
      ).catch()
    }
}
