// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

// Import langsung dari library Chainlink yang sudah Anda install lewat pnpm
import {VRFCoordinatorV2_5Mock} from "@chainlink/contracts/src/v0.8/vrf/mocks/VRFCoordinatorV2_5Mock.sol";

/**
 * @title VRFCoordinatorV2_5Mock
 * @dev Kita membungkus Mock asli dari Chainlink agar bisa kita compile di folder lokal kita.
 */
contract VRFCoordinatorV2_5MockWrapper is VRFCoordinatorV2_5Mock {
    constructor(
        uint96 _baseFee,
        uint96 _gasPriceLink,
        int256 _weiPerUnitLink
    ) VRFCoordinatorV2_5Mock(_baseFee, _gasPriceLink, _weiPerUnitLink) {}
}
