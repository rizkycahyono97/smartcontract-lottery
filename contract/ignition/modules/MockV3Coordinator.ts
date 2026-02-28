import { buildModule } from '@nomicfoundation/hardhat-ignition/modules';

/**
 * Mock untuk VRF Coordinator V2.5
 * Argumen constructor: _baseFee, _gasPriceLink, _weiPerUnitLink
 */
export default buildModule('MockV3Coordinator', m => {
  const baseFee = m.getParameter('baseFee', '100000000000000000'); //0.1
  const gasPriceLink = m.getParameter('gasPriceLink', 1000000000); //1 gwei
  const weiPerUnitLink = m.getParameter('weiPerUnitLink', 4000000000000000); //0.004 eth

  const mockVrfCoordinator = m.contract(
    'contracts/test/VRFCoordinatorV2_5Mock.sol:VRFCoordinatorV2_5MockWrapper',
    [baseFee, gasPriceLink, weiPerUnitLink]
  );

  return { mockVrfCoordinator };
});
