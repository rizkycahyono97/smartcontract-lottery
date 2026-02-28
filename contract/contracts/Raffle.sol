// SPDX-License-Identifier: SEE LICENSE IN LICENSE
pragma solidity 0.8.28;

/**
 * 1. Raffle
 * 2. enter the lottery (paying some amount)
 * 3. pick a random winner
 * 4. the winner to be selected every x minutes
 * 5. chainlink oracle -> automatic executing
 */

import {VRFConsumerBaseV2Plus} from "@chainlink/contracts/src/v0.8/vrf/dev/VRFConsumerBaseV2Plus.sol";
import {VRFV2PlusClient} from "@chainlink/contracts/src/v0.8/vrf/dev/libraries/VRFV2PlusClient.sol";
import {AutomationCompatibleInterface} from "@chainlink/contracts/src/v0.8/automation/interfaces/AutomationCompatibleInterface.sol";

// error
error Raffle__notEnoughETHEntered();
error Raffle__TransferFailed();
error Raffle__RaffleNotOpen();
error Raffle__UpkeepNotNeeded(
    uint256 currentBalance,
    uint256 numPlayers,
    uint256 raffleState
);
error Raffle_PlayerIsEnough();

/**
 * @title Decentralized Raffle Contract
 * @author Rizky
 * @notice This contract implements a decentralized raffle system using Chainlink VRF v2.5
 *         for provable randomness and Chainlink Automation for automatic winner selection.
 * @dev Inherits VRFConsumerBaseV2Plus and AutomationCompatibleInterface.
 *      Uses native payment or LINK payment depending on deployment configuration.
 */
contract Raffle is VRFConsumerBaseV2Plus, AutomationCompatibleInterface {
    // types declaration
    enum RaffleState {
        OPEN,
        CALCULATING
    }

    // state variabel
    uint256 private immutable i_entranceFee;
    address payable[] private s_players;
    bytes32 private immutable i_keyhash;
    uint256 private immutable i_subscriptionId;
    uint32 private immutable i_callbackGasLimit;
    uint16 private constant REQUEST_CONFIRMATION = 3;
    uint32 private constant NUMWORDS = 1;
    uint256 private constant MIN_PLAYERS = 3;

    // lottery variable
    address private s_recentWinner;
    RaffleState private s_raffleState;
    uint256 private s_lastTimeStamp;
    uint256 private immutable i_interval;
    bool private immutable i_enableNativePayment;

    //event
    event RaffleEnter(address indexed player);
    event RequestSent(uint256 requestId);
    event PickedWinner(address recentWinner);

    constructor(
        address vRFConsumerBaseV2Plus,
        uint256 entranceFee,
        bytes32 keyhash,
        uint256 subscriptionId,
        uint32 callbackGasLimit,
        uint256 interval,
        bool enableNativePayment
    ) VRFConsumerBaseV2Plus(vRFConsumerBaseV2Plus) {
        i_entranceFee = entranceFee;
        i_keyhash = keyhash;
        i_subscriptionId = subscriptionId;
        i_callbackGasLimit = callbackGasLimit;
        s_raffleState = RaffleState.OPEN;
        s_lastTimeStamp = block.timestamp;
        i_interval = interval;
        i_enableNativePayment = enableNativePayment;
    }

    /**
     * @notice function untuk entrance fee user pertama kali masuk
     * @dev Reverts if:
     *      - Not enough ETH is sent.
     *      - Raffle state is not OPEN.
     *      Adds sender to players array and emits RaffleEnter event.
     */
    function enterRaffle() public payable {
        if (msg.value < i_entranceFee) revert Raffle__notEnoughETHEntered();
        if (s_raffleState != RaffleState.OPEN) revert Raffle__RaffleNotOpen();
        if (s_players.length >= MIN_PLAYERS) revert Raffle_PlayerIsEnough();
        s_players.push(payable(msg.sender));
        emit RaffleEnter(msg.sender);
    }

    /**
     * @notice otomatis akan dicek oleh chainlink automation, dengan beberapa kriteria harus true
     * @dev Conditions:
     *      - Raffle must be OPEN.
     *      - Time interval must have passed.
     *      - There must be at least one player.
     *      - Contract must have ETH balance.
     *      - https://automation.chain.link/
     *      - https://docs.chain.link/chainlink-automation/guides/register-upkeep
     *      Called off-chain by Chainlink Automation nodes.
     * @return upKeepNeeded Boolean indicating whether performUpkeep should be executed.
     * @return performData Data passed to performUpkeep (unused).
     */
    function checkUpkeep(
        bytes memory /* checkData */
    )
        public
        view
        override
        returns (bool upKeepNeeded, bytes memory /* performData */)
    {
        bool isOpen = RaffleState.OPEN == s_raffleState;
        bool timePassed = (block.timestamp - s_lastTimeStamp) > i_interval;
        bool hasPlayers = s_players.length >= MIN_PLAYERS;
        bool hasBalance = address(this).balance > 0;
        upKeepNeeded = (isOpen && timePassed && hasPlayers && hasBalance);

        return (upKeepNeeded, "");
    }

    /**
     * @notice mengeksekusi  pemenang lottery secara otomatis menggunakan VRF chainlink
     * @dev Revalidates upkeep conditions before execution.
     *      Changes raffle state to CALCULATING.
     *      Requests random words from Chainlink VRF.
     *      Emits RequestSent event.
     */
    function performUpkeep(bytes calldata /* performData */) external override {
        (bool upKeepNeeded, ) = checkUpkeep("");
        if (!upKeepNeeded)
            revert Raffle__UpkeepNotNeeded(
                address(this).balance,
                s_players.length,
                uint256(s_raffleState)
            );

        s_raffleState = RaffleState.CALCULATING;

        uint256 requestId = s_vrfCoordinator.requestRandomWords(
            VRFV2PlusClient.RandomWordsRequest({
                keyHash: i_keyhash,
                subId: i_subscriptionId,
                requestConfirmations: REQUEST_CONFIRMATION,
                callbackGasLimit: i_callbackGasLimit,
                numWords: NUMWORDS,
                extraArgs: VRFV2PlusClient._argsToBytes(
                    VRFV2PlusClient.ExtraArgsV1({
                        nativePayment: i_enableNativePayment
                    })
                )
            })
        );

        emit RequestSent(requestId);
    }

    /**
     * @notice Callback function used by Chainlink VRF to deliver randomness.
     * @dev Can only be called by VRF Coordinator.
     *      - Calculates winner index using modulo operation.
     *      - Resets players array.
     *      - Resets raffle state to OPEN.
     *      - Updates last timestamp.
     *      - Transfers contract balance to winner.
     *      Emits PickedWinner event.
     * @param _randomWords Array of random numbers provided by VRF.
     */
    function fulfillRandomWords(
        uint256 /* requestId */,
        uint256[] calldata _randomWords
    ) internal override {
        uint256 indexOfWinner = _randomWords[0] % s_players.length;
        address payable recentWinner = s_players[indexOfWinner];
        s_recentWinner = recentWinner;
        s_players = new address payable[](0); //reset
        s_lastTimeStamp = block.timestamp;
        s_raffleState = RaffleState.OPEN; //state kembali open

        (bool success, ) = recentWinner.call{value: address(this).balance}("");
        if (!success) {
            revert Raffle__TransferFailed();
        }

        emit PickedWinner(recentWinner);
    }

    /**
     * @notice getter function
     */
    function getEntrance() public view returns (uint256) {
        return i_entranceFee;
    }

    function getPlayer(uint256 index) public view returns (address) {
        return s_players[index];
    }

    function getInterval() public view returns (uint256) {
        return i_interval;
    }

    function getLastestTimeStamp() public view returns (uint256) {
        return s_lastTimeStamp;
    }

    function getRecentWinner() public view returns (address) {
        return s_recentWinner;
    }

    function getRaffleState() public view returns (RaffleState) {
        return s_raffleState;
    }

    function getNumWords() public pure returns (uint32) {
        return NUMWORDS;
    }

    function getNumberOfPlayer() public view returns (uint256) {
        return s_players.length;
    }

    function getRequestInformations() public pure returns (uint16) {
        return REQUEST_CONFIRMATION;
    }

    function getMinPlayers() public pure returns (uint256) {
        return MIN_PLAYERS;
    }
}
