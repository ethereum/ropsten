const fs = require('fs');
const request = require('request-json');
const async = require('async');

const batch_filename = 'txs_batch_0_to_25k.json';

const txs_to_replay = JSON.parse(fs.readFileSync(batch_filename));
const total_txs = txs_to_replay.length;
console.log('txs_to_replay.length:', total_txs);


const ETH_NODE_URL = 'http://localhost:8545';
var client = request.createClient(ETH_NODE_URL);

let bad_txs = [];
let tx_hashes_success = [];



let req_id = 1;
function playTx(tx_i, retry_count) {
  retry_count = (typeof retry_count !== 'undefined') ? retry_count : 0;

  if (tx_i >= total_txs) {
    console.log('reached end of tx list, waiting for previous ones to finish.');
    return;
  }

  req_id = req_id + 1;

  let raw_tx = txs_to_replay[tx_i];
  if (retry_count == 0) {
    console.log('with req_id', req_id, ', trying tx i:', tx_i);
    console.log('raw_tx:', raw_tx);
  } else {
    console.log('with req_id', req_id, 'retrying tx i:', tx_i, ' retry ', retry_count);
    console.log('raw_tx:', raw_tx);
  }

  let request_data = {
   'jsonrpc': '2.0',
   'method': 'eth_sendRawTransaction',
   'params': ['0x'+raw_tx],
   'id': req_id
  };

  client.post('/', request_data, function(err, res, body) {
    if (err) {
      console.log('ERROR:', err);
      throw new Error('request response has err:', err);
    }

    console.log('got response for req_id', req_id, ' and try tx_i:', tx_i);
    console.log('res.statusCode:', res.statusCode);
    console.log('body:', body);

    if (body.error) {
      console.log('method returned error:', body.error);
      if (body.error.message === 'Nonce too low') {
        // continue with next
        console.log('nonce too low on ', tx_i, 'continuing with ', tx_i+1);
        done(tx_i);
        setTimeout(function() {
          playTx(tx_i+1);
        }, 50);
        return;
      } else if (body.error.message.substr(0,17) === 'known transaction') {
        // continue with next
        console.log('known transaction on ', tx_i, 'continuing with ', tx_i+1);
        done(tx_i);
        setTimeout(function() {
          playTx(tx_i+1);
        }, 50);
        return;
      } else if (body.error.message === 'Insufficient funds for gas * price + value') {
        // timeout here and then call callback
        if (retry_count == 0) {
          // start the next tx in parallel
          console.log('on tx_i:', tx_i, 'starting next in parallel.');
          setTimeout(function() {
            playTx(tx_i+1);
          }, 150);
        }
        if (retry_count < 4) {
          // retry this tx
          console.log('retrying tx_i:', tx_i);
          setTimeout(function() {
            playTx(tx_i, retry_count+1);
          }, 3500);
        } else {
          // too many retries
          console.log('got over 5 insufficient funds errors in a row');
          let bad_tx = {'tx_i': tx_i, 'raw_tx': raw_tx};
          bad_txs.push(bad_tx);
          console.log('SKIPPING BAD TX:', bad_tx);
          done(tx_i);
        }
        return;

      } else {
        // haven't seen this error before
        throw new Error('method returned error:', body.error);
      }
    } else {
      console.log('no error.');

      tx_hashes_success.push(body.result);
      done(tx_i);
      if (retry_count === 0) {
        // only do next if this was not a success after a retry
        let throttle = 50;
        if (tx_i % 1000 === 0) {
          // pause for a bit every 1000
          throttle = 3000;
        }
        setTimeout(function() {
          playTx(tx_i+1);
        }, throttle);
      }


    }


  });

}


let total_done = 0;

playTx(0);





function done(tx_i) {
  total_done = total_done + 1;
  console.log('tx_i', tx_i, ' is done. done count:', total_done);
  if (total_done < total_txs) {
    console.log('done still less than total. returning..');
    return;
  }

  console.log('tx_hashes_success:', tx_hashes_success);

  const good_outfile = 'successful_hashes-'+batch_filename;
  fs.writeFileSync(good_outfile, JSON.stringify(tx_hashes_success), 'utf8');

  const bad_outfile = 'bad_txs-'+batch_filename;
  fs.writeFileSync(bad_outfile, JSON.stringify(bad_txs), 'utf8');

  console.log('all done!');
}
