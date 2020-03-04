import httpStatus from 'http-status';
import request from 'supertest';
import MetaTxHandler from 'metatx-handler';

import { initializeDatabase } from './helpers/database';

import app from '~/server';
import web3, { provider } from '~/common/services/web3';
import {
  getRelayerContract,
  getVoteContract,
} from '~/common/services/contracts';

let metaTxHandler;

describe('API', () => {
  let relayer;
  let vote;
  let sender;

  beforeAll(async () => {
    await initializeDatabase();
    relayer = getRelayerContract(process.env.RELAYER_CONTRACT);
    vote = getVoteContract(process.env.VOTE_CONTRACT);
    sender = web3.eth.accounts.create();
    metaTxHandler = new MetaTxHandler(
      process.env.PAYER_PRIV_KEY,
      provider,
      relayer.options.address,
      relayer.options.jsonInterface,
    );
  });

  describe('POST /api/relay', () => {
    it('should respond with a successful message', async () => {
      const metaNonce = await relayer.methods.getNonce(sender.address).call();
      const txParams = {
        from: sender.address,
        to: vote.options.address,
        value: 0,
        nonce: metaNonce,
        data: vote.methods.recordVote(sender.address).encodeABI(),
      };
      const metaSignedTx = await metaTxHandler.signMetaTx(
        txParams,
        sender.privateKey.substring(2),
        metaNonce,
      );
      await request(app)
        .post('/api/relay')
        .send({
          metaNonce,
          metaSignedTx,
        })
        .expect(httpStatus.OK);
    });
  });
});