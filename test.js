
var bitcoin = require('bitcoinjs-lib');
var regtestUtils = require('./testutils')

var testnet = bitcoin.networks.testnet

function rng () { return Buffer.from('fuckit') }
//var regtest = regtestUtils.network



// генерация кошелька 
var keyPair = bitcoin.ECPair.makeRandom({ network: testnet })
var wif = keyPair.toWIF()
var address = keyPair.getAddress()
console.log('private: ', wif,'\n adr: ', address)
//bitcoin.ECPair.makeRandom().toWIF()


// Подпись транзакции со скриптом
var btcPrivate = 'cTFuNMzRsqJdZ8XHXXcqRaEA4QaWMj9LkWeqcA2rgye2NSmxEXFA'
//console.log(btcPrivate)
var data = Buffer.from('huynya', 'utf8') // текст
var dataScript = bitcoin.script.nullData.output.encode(data)
var keyPair = bitcoin.ECPair.fromWIF(btcPrivate, testnet)

var txb = new bitcoin.TransactionBuilder(testnet)
txb.addInput('d31e364e9b5dffaccbfca00426373d7dddb47e5d06194679d6510c5d13477200', 0) //< входы
//txb.addInput('56382e38c0e472fabcb1959fd60fa1684b505870b960a07f978505fe13980cad', 1)

txb.addOutput(dataScript, 2000)
txb.addOutput('mumvTiJg22JLfkUrKqeBepZv3d6z6wUcM2', 65000000-5000) //выход
txb.sign(0,  keyPair )
console.log(txb.build().toHex()) //подписанная транза , пушится в https://testnet.blockchain.info/pushtx



// bip38 (парольная защита ключа)


var bip38 = require('bip38')
var wif = require('wif')
var private = '5KN7MzqK5wt2TP1fQCYyHBtDrXdJuXbUzm4A9rKAteGu3Qi5CVR'
console.log('original ',private)

var decoded = wif.decode(private)
var encryptedKey = bip38.encrypt(decoded.privateKey, decoded.compressed, 'TestingOneTwoThree')
console.log('encoded ',encryptedKey)


var decryptedKey = bip38.decrypt(encryptedKey, 'TestingOneTwoThree', function (status) {
    //console.log(status.percent) // will print the precent every time current increases by 1000
  })
  
console.log('decoded', wif.encode(0x80, decryptedKey.privateKey, decryptedKey.compressed))

//console.log('decoded ',decoded, '\n')

/*
regtestUtils.faucet(keyPair.getAddress(), 5e4, function (err, unspent0) {
    if (err) return done(err)
    console.log(unspent0.vout)
})
//regtestUtils.unspents('mwLx2fWdagiZGMLDCYVKSDwPua5YtAck83', { console.log(this) })


txb.addInput('18e29cfb5c28d9d0d77f6a21db51e9b372e345419a848396eadbd4517d428d0d', unspent.vout)
txb.addOutput(dataScript, 1000)
txb.addOutput(regtestUtils.RANDOM_ADDRESS, 1e5)
txb.sign(0, keyPair)


/*
regtestUtils.faucet(keyPair.getAddress(), 2e5, function (err, unspent) {
              if (err) return done(err)
        
              var txb = new bitcoin.TransactionBuilder(regtest)
              var data = Buffer.from('bitcoinjs-lib', 'utf8')
              var dataScript = bitcoin.script.nullData.output.encode(data)
        
              txb.addInput(unspent.txId, unspent.vout)
              txb.addOutput(dataScript, 1000)
              txb.addOutput(regtestUtils.RANDOM_ADDRESS, 1e5)
              txb.sign(0, keyPair)
        
              // build and broadcast to the RegTest network
              regtestUtils.broadcast(txb.build().toHex(), done)
})
*/