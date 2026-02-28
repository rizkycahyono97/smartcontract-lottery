import { expect } from 'chai';
import { network } from 'hardhat';

const { ethers } = await network.connect();

describe('Raffle - Staging test', function () {
  this.timeout(500000); // untuk timeout
  let raffle: any;
  let deployer: any;
  let entraceFee: any;

  beforeEach(async function () {
    const signers = await ethers.getSigners();
    deployer = signers[0];

    const raffleAddress = '0x4CA5841B934d1D7bF4119E391379f8f87315991A';
    raffle = await ethers.getContractAt('Raffle', raffleAddress);
    entraceFee = await raffle.getEntrance();
  });

  describe('fulfillRandomWords', function () {
    it('works with live Chainlink Keepers and Chainlink VRF, we get a random winner', async function () {
      console.log('setting up test....');
      const startingTimeStamps = await raffle.getLastestTimeStamp();
      const accounts = await ethers.getSigners();

      console.log('setting up listener...');
      await new Promise<void>(async (resolve, reject) => {
        raffle.once('PickedWinner', async () => {
          console.log('PickedWinner Fired...');

          try {
            const recentWinner = await raffle.getRecentWinner();
            const raffleState = await raffle.getRaffleState();
            const endingTimeStamp = await raffle.getLastestTimeStamp();
            const numPlayers = await raffle.getNumberOfPlayer();

            expect(recentWinner).to.equal(accounts[0].address);
            expect(raffleState).to.equal(0);
            expect(numPlayers).to.equal(0);
            expect(endingTimeStamp).to.be.gt(startingTimeStamps);
          } catch (e) {
            reject(e);
          }
        });

        console.log('Entering Raffle...');
        try {
          const tx = await raffle.enterRaffle({ value: entraceFee });
          await tx.wait(1);
          console.log('Entered! Waiting for Chainlink Automation & VRF...');
        } catch (e) {
          reject(e);
        }
      });
    });
  });
});
