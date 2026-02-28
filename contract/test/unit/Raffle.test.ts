import { expect } from 'chai';
import { network } from 'hardhat';

const { ethers } = await network.connect();

describe('Raffle - local unit test', function () {
  let raffle: any;
  let deployer: any;
  let vrfCoordinatorV2_5Mock: any;
  let subId: any;

  const entraceFee = ethers.parseEther('0.1');
  const interval = 60;
  const keyHash =
    '0x787d74caea10b2b357790d5b5247c2f63d1d91572a9846f780606e4d953677ae';
  const subscriptionId =
    '81002506649389566401102351510037004838750721837094787803680786457673035293785';
  const callBackGasLimit = 500000;
  const vrfCoordinator = '0x9DdfaCa8183c41ad55329BdeeD9F6A8d53168B1B';
  const enableNativePayment = false; // HARUS FALSE kalau di local

  beforeEach(async function () {
    const signers = await ethers.getSigners();
    deployer = signers[0];

    // deploy mock
    const VRFCoordinatorV2_5MockFactory = await ethers.getContractFactory(
      'VRFCoordinatorV2_5MockWrapper'
    );
    vrfCoordinatorV2_5Mock = await VRFCoordinatorV2_5MockFactory.deploy(
      ethers.parseEther('0.01'),
      1e9, // gasPriceLink
      1e15
    );

    //create subscription
    const tx = await vrfCoordinatorV2_5Mock.createSubscription();
    const txReceipt = await tx.wait(1);
    subId = (txReceipt?.logs[0] as any).args.subId;
    await vrfCoordinatorV2_5Mock.fundSubscription(
      subId,
      ethers.parseEther('100')
    );

    //deploy rafle
    const raffleFactory = await ethers.getContractFactory('Raffle');
    raffle = await raffleFactory.deploy(
      await vrfCoordinatorV2_5Mock.getAddress(), //local
      entraceFee,
      keyHash,
      subId,
      callBackGasLimit,
      interval,
      enableNativePayment
    );

    // await raffle.waitForDeployment();
    await vrfCoordinatorV2_5Mock.addConsumer(subId, await raffle.getAddress());
  });

  describe('Constructor', function () {
    it('should deploy successfully', async function () {
      const address = await raffle.getAddress();
      expect(address).to.not.equal(ethers.ZeroAddress);
    });

    it('should initialize raffle state as OPEN', async function () {
      const raffleState = await raffle.getRaffleState();
      expect(raffleState).to.equal(0); // 0 = open
    });

    it('should set the correct entrance fee', async function () {
      const fee = await raffle.getEntrance();
      expect(fee).to.equal(entraceFee);
    });

    it('should set the correct interval', async function () {
      const contractInterval = await raffle.getInterval();
      expect(contractInterval).to.equal(interval);
    });

    it('should set lastTimeStamp to current block timestamp', async function () {
      const raffleTimeStamp = await raffle.getLastestTimeStamp();
      const block = await ethers.provider.getBlock('latest');

      const blockTimeStamp = block!.timestamp;

      expect(raffleTimeStamp).to.closeTo(Number(blockTimeStamp), 5);
    });
  });

  describe('EnterRaffle', function () {
    it('reverts when not enough ETH is sent', async function () {
      await expect(raffle.enterRaffle()).to.be.revertedWithCustomError(
        raffle,
        'Raffle__notEnoughETHEntered'
      );
    });

    it('records player when they enter', async function () {
      await raffle.enterRaffle({ value: entraceFee });
      const playerFromContract = await raffle.getPlayer(0);
      expect(playerFromContract).to.equal(deployer.address);
    });

    it('emits event on enter', async function () {
      await expect(raffle.enterRaffle({ value: entraceFee })).to.emit(
        raffle,
        'RaffleEnter'
      );
    });

    it('reverts when raffle is not open', async function () {
      // 1. Masuk raffle agar s_players tidak kosong
      await raffle.enterRaffle({ value: entraceFee });

      // 2. Manipulasi waktu & trigger upkeep agar status jadi CALCULATING
      await ethers.provider.send('evm_increaseTime', [interval + 1]);
      await ethers.provider.send('evm_mine', []);
      await raffle.performUpkeep('0x');

      // 3. Sekarang status sudah CALCULATING, coba masuk lagi
      await expect(
        raffle.enterRaffle({ value: entraceFee })
      ).to.be.revertedWithCustomError(raffle, 'Raffle__RaffleNotOpen');
    });
  });

  describe('CheckUpKeep', function () {
    it("returns false if people haven't sent any ETH", async function () {
      await ethers.provider.send('evm_increaseTime', [interval + 1]);
      await ethers.provider.send('evm_mine');

      const result = await raffle.checkUpkeep('0x');
      const upkeepNeeded = result[0];
      expect(upkeepNeeded).to.equal(false);
    });

    it('returns false if raffle is not open', async function () {
      await raffle.enterRaffle({ value: entraceFee });

      await ethers.provider.send('evm_increaseTime', [interval + 1]);
      await ethers.provider.send('evm_mine');

      await raffle.performUpkeep('0x'); // supaya jadi calculating

      const raffleState = await raffle.getRaffleState();
      const result = await raffle.checkUpkeep('0x');
      const upkeepNeeded = result[0];

      expect(raffleState).to.equal(1);
      expect(upkeepNeeded).to.equal(false);
    });

    it("returns false if enough time hasn't passed", async function () {
      await raffle.enterRaffle({ value: entraceFee });

      await ethers.provider.send('evm_increaseTime', [interval - 5]);
      await ethers.provider.send('evm_mine');

      const result = await raffle.checkUpkeep('0x');
      const upkeepNeeded = result[0];
      expect(upkeepNeeded).to.equal(false);
    });

    it('returns true if enough time has passed, has players, has balance, and is open', async function () {
      await raffle.enterRaffle({ value: entraceFee });

      await ethers.provider.send('evm_increaseTime', [interval + 1]);
      await ethers.provider.send('evm_mine');

      const result = await raffle.checkUpkeep('0x');
      const upkeepNeeded = result[0];
      expect(upkeepNeeded).to.equal(true);
    });
  });

  describe('fulfillRandomWords', function () {
    it('can only be called after performUpkeep', async function () {
      await expect(
        vrfCoordinatorV2_5Mock.fulfillRandomWords(0, raffle.target)
      ).to.be.revert(ethers);
    });

    it('picks a winner, resets the lottery, and sends money', async function () {
      const additionalEntrants = 3;
      const startingAccountIndex = 1;
      const account = await ethers.getSigners();

      //memasukan beberapa player
      for (
        let i = startingAccountIndex;
        i < startingAccountIndex + additionalEntrants;
        i++
      ) {
        const raffleConnected = raffle.connect(account[i]);
        await raffleConnected.enterRaffle({ value: entraceFee });
      }

      const startingTimeStamps = await raffle.getLastestTimeStamp();

      await new Promise<void>(async (resolve, rejects) => {
        raffle.once('PickedWinner', async () => {
          console.log('Event PickedWinner');
          try {
            const recentWinner = await raffle.getRecentWinner();
            const raffleState = await raffle.getRaffleState();
            const endingTimeStamp = await raffle.getLastestTimeStamp();
            const numPlayer = await raffle.getNumberOfPlayer();
            const winnerEndingBalance =
              await ethers.provider.getBalance(recentWinner);

            expect(numPlayer).to.equal(0);
            expect(raffleState).to.equal(0);
            expect(endingTimeStamp).to.be.gt(startingTimeStamps);
            expect(winnerEndingBalance).to.be.gt(winnerStartingBalance);

            resolve();
          } catch (e) {
            rejects(e);
          }
        });

        await ethers.provider.send('evm_increaseTime', [interval + 1]);
        await ethers.provider.send('evm_mine');

        const tx = await raffle.performUpkeep('0x');
        const txReceipt = await tx.wait(1);

        const requestId = txReceipt!.logs[1].args.requestId;

        const winnerStartingBalance = await ethers.provider.getBalance(
          account[1].address
        );

        await vrfCoordinatorV2_5Mock.fulfillRandomWords(
          requestId,
          raffle.target
        );
      });
    });
  });
});
