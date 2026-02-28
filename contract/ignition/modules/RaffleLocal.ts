import { buildModule } from '@nomicfoundation/hardhat-ignition/modules';
import MockModule from './MockV3Coordinator.ts';

export default buildModule('RaffleLocal', m => {
  const { mockVrfCoordinator } = m.useModule(MockModule);

  const createSub = m.call(mockVrfCoordinator, 'createSubscription', []);

  const subscriptionId = m.readEventArgument(
    createSub,
    'SubscriptionCreated', // Nama event di VRFCoordinatorV2_5Mock
    'subId'
  );

  const fundTx = m.call(
    mockVrfCoordinator,
    'fundSubscription',
    [subscriptionId, '100000000000000000000'],
    { after: [createSub] }
  );

  const raffleLocal = m.contract(
    'Raffle',
    [
      mockVrfCoordinator, // Alamat Mock yang baru dideploy
      m.getParameter('entranceFee', '10000000000000000'),
      m.getParameter(
        'keyhash',
        '0x787d74caea10b2b357790d5b5247c2f63d1d91572a9846f780606e4d953677ae'
      ),
      subscriptionId,
      m.getParameter('callbackGasLimit', 500000),
      m.getParameter('interval', 60),
      m.getParameter('enableNativePayment', true)
    ],
    { after: [fundTx] }
  );

  m.call(mockVrfCoordinator, 'addConsumer', [subscriptionId, raffleLocal], {
    after: [raffleLocal]
  });

  return { raffleLocal, mockVrfCoordinator };
});
