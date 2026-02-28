import { buildModule } from '@nomicfoundation/hardhat-ignition/modules';

export default buildModule('RaffleSepoliaModule', m => {
  // parameter
  const vRFConsumerBaseV2Plus = m.getParameter('vRFConsumerBaseV2Plus');
  const entranceFee = m.getParameter('entranceFee');
  const keyhash = m.getParameter('keyhash');
  const subscriptionId = m.getParameter('subscriptionId');
  const callbackGasLimit = m.getParameter('callbackGasLimit');
  const interval = m.getParameter('interval');
  const enableNativePayment = m.getParameter('enableNativePayment');

  const raffleSepolia = m.contract('Raffle', [
    vRFConsumerBaseV2Plus,
    entranceFee,
    keyhash,
    subscriptionId,
    callbackGasLimit,
    interval,
    enableNativePayment
  ]);

  return { raffleSepolia };
});
