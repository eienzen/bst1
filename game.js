document.addEventListener("DOMContentLoaded", () => {
    console.log("DOM fully loaded, initializing game...");

    // Game state variables
    let account = null;
    let contract = null;
    let animationFrameId = null;
    const TARGET_NETWORK_ID = "97"; // BNB Chain Testnet
    let WITHDRAWAL_FEE_BNB = "0.0002";
    let MAX_CONVERSION_LIMIT = 1000;
    let CONVERSION_RATIO = 1;
    let isGameRunning = false;

    // Player data stored in localStorage
    let playerData = JSON.parse(localStorage.getItem("playerData")) || {
        gamesPlayed: 0,
        totalPoints: 0,
        totalRewards: 0,
        boxesEaten: 0,
        pendingPoints: 0,
        totalReferrals: 0,
        referralPoints: 0,
        pendingReferral: null,
        pendingReferrerPoints: 0,
        rewardHistory: [],
        taskHistory: [],
        stakingHistory: [],
        hasClaimedWelcomeBonus: false,
        walletBalance: 0,
        walletAddress: null,
        flexibleStakeBalance: 0,
        lockedStakeBalances: { 0: 0, 1: 0, 2: 0, 3: 0 },
        lockedStakeStartTimes: { 0: 0, 1: 0, 2: 0, 3: 0 },
        lastLogin: 0
    };

    // Handle referral link from URL
    const urlParams = new URLSearchParams(window.location.search);
    const referrerAddress = urlParams.get("ref");
    if (referrerAddress && !playerData.pendingReferral && ethers.utils.isAddress(referrerAddress)) {
        playerData.pendingReferral = referrerAddress;
    }

    // Contract configuration
    const CONTRACT_ADDRESS = "0x846cf1087f7805D95aFbc8F37156b577679dB11C";
    const GAME_ORACLE_ADDRESS = "0x6C12d2802cCF7072e9ED33b3bdBB0ce4230d5032";
    const CONTRACT_ABI = [
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "spender",
				"type": "address"
			},
			{
				"internalType": "uint256",
				"name": "allowance",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "needed",
				"type": "uint256"
			}
		],
		"name": "ERC20InsufficientAllowance",
		"type": "error"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "sender",
				"type": "address"
			},
			{
				"internalType": "uint256",
				"name": "balance",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "needed",
				"type": "uint256"
			}
		],
		"name": "ERC20InsufficientBalance",
		"type": "error"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "approver",
				"type": "address"
			}
		],
		"name": "ERC20InvalidApprover",
		"type": "error"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "receiver",
				"type": "address"
			}
		],
		"name": "ERC20InvalidReceiver",
		"type": "error"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "sender",
				"type": "address"
			}
		],
		"name": "ERC20InvalidSender",
		"type": "error"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "spender",
				"type": "address"
			}
		],
		"name": "ERC20InvalidSpender",
		"type": "error"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "owner",
				"type": "address"
			}
		],
		"name": "OwnableInvalidOwner",
		"type": "error"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "account",
				"type": "address"
			}
		],
		"name": "OwnableUnauthorizedAccount",
		"type": "error"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "address",
				"name": "owner",
				"type": "address"
			},
			{
				"indexed": true,
				"internalType": "address",
				"name": "spender",
				"type": "address"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "value",
				"type": "uint256"
			}
		],
		"name": "Approval",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "address",
				"name": "oldOracle",
				"type": "address"
			},
			{
				"indexed": true,
				"internalType": "address",
				"name": "newOracle",
				"type": "address"
			}
		],
		"name": "GameOracleUpdated",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "newLimit",
				"type": "uint256"
			}
		],
		"name": "MaxConversionLimitUpdated",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "address",
				"name": "oldWallet",
				"type": "address"
			},
			{
				"indexed": true,
				"internalType": "address",
				"name": "newWallet",
				"type": "address"
			}
		],
		"name": "OwnerWalletUpdated",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "address",
				"name": "previousOwner",
				"type": "address"
			},
			{
				"indexed": true,
				"internalType": "address",
				"name": "newOwner",
				"type": "address"
			}
		],
		"name": "OwnershipTransferred",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "address",
				"name": "player",
				"type": "address"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "points",
				"type": "uint256"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "tokens",
				"type": "uint256"
			},
			{
				"indexed": true,
				"internalType": "address",
				"name": "referrer",
				"type": "address"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "referrerPoints",
				"type": "uint256"
			}
		],
		"name": "PointsConverted",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "address",
				"name": "referrer",
				"type": "address"
			},
			{
				"indexed": true,
				"internalType": "address",
				"name": "referee",
				"type": "address"
			}
		],
		"name": "ReferralAdded",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "newRate",
				"type": "uint256"
			}
		],
		"name": "ReferralCommissionRateUpdated",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "address",
				"name": "owner",
				"type": "address"
			}
		],
		"name": "SecretKeyUpdated",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "address",
				"name": "owner",
				"type": "address"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "amount",
				"type": "uint256"
			}
		],
		"name": "TokensBurned",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "address",
				"name": "owner",
				"type": "address"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "totalAmount",
				"type": "uint256"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "ownerAmount",
				"type": "uint256"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "contractAmount",
				"type": "uint256"
			}
		],
		"name": "TokensMinted",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "address",
				"name": "player",
				"type": "address"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "amount",
				"type": "uint256"
			},
			{
				"indexed": false,
				"internalType": "enum BlockSnakesGame.LockPeriod",
				"name": "lockPeriod",
				"type": "uint8"
			}
		],
		"name": "TokensStaked",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "address",
				"name": "player",
				"type": "address"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "amount",
				"type": "uint256"
			},
			{
				"indexed": false,
				"internalType": "enum BlockSnakesGame.LockPeriod",
				"name": "lockPeriod",
				"type": "uint8"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "reward",
				"type": "uint256"
			}
		],
		"name": "TokensUnstaked",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "address",
				"name": "from",
				"type": "address"
			},
			{
				"indexed": true,
				"internalType": "address",
				"name": "to",
				"type": "address"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "value",
				"type": "uint256"
			}
		],
		"name": "Transfer",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "address",
				"name": "player",
				"type": "address"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "points",
				"type": "uint256"
			}
		],
		"name": "WelcomeBonusClaimed",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "newBonus",
				"type": "uint256"
			}
		],
		"name": "WelcomeBonusUpdated",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "newFeeInBnbWei",
				"type": "uint256"
			}
		],
		"name": "WithdrawalFeeUpdated",
		"type": "event"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "spender",
				"type": "address"
			},
			{
				"internalType": "uint256",
				"name": "value",
				"type": "uint256"
			}
		],
		"name": "approve",
		"outputs": [
			{
				"internalType": "bool",
				"name": "",
				"type": "bool"
			}
		],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "amount",
				"type": "uint256"
			},
			{
				"internalType": "string",
				"name": "_key",
				"type": "string"
			}
		],
		"name": "burnTokens",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "claimWelcomeBonus",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "points",
				"type": "uint256"
			},
			{
				"internalType": "address",
				"name": "player",
				"type": "address"
			},
			{
				"internalType": "address",
				"name": "referrer",
				"type": "address"
			}
		],
		"name": "convertPointsToTokens",
		"outputs": [],
		"stateMutability": "payable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "amount",
				"type": "uint256"
			},
			{
				"internalType": "string",
				"name": "_key",
				"type": "string"
			}
		],
		"name": "mintTokens",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "renounceOwnership",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "string",
				"name": "_currentKey",
				"type": "string"
			}
		],
		"name": "resetSecretKey",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "amount",
				"type": "uint256"
			},
			{
				"internalType": "enum BlockSnakesGame.LockPeriod",
				"name": "lockPeriod",
				"type": "uint8"
			}
		],
		"name": "stakeTokens",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "to",
				"type": "address"
			},
			{
				"internalType": "uint256",
				"name": "value",
				"type": "uint256"
			}
		],
		"name": "transfer",
		"outputs": [
			{
				"internalType": "bool",
				"name": "",
				"type": "bool"
			}
		],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "from",
				"type": "address"
			},
			{
				"internalType": "address",
				"name": "to",
				"type": "address"
			},
			{
				"internalType": "uint256",
				"name": "value",
				"type": "uint256"
			}
		],
		"name": "transferFrom",
		"outputs": [
			{
				"internalType": "bool",
				"name": "",
				"type": "bool"
			}
		],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "newOwner",
				"type": "address"
			}
		],
		"name": "transferOwnership",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "_gameOracle",
				"type": "address"
			}
		],
		"stateMutability": "nonpayable",
		"type": "constructor"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "amount",
				"type": "uint256"
			},
			{
				"internalType": "enum BlockSnakesGame.LockPeriod",
				"name": "lockPeriod",
				"type": "uint8"
			}
		],
		"name": "unstakeTokens",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "_newRatio",
				"type": "uint256"
			},
			{
				"internalType": "string",
				"name": "_key",
				"type": "string"
			}
		],
		"name": "updateConversionRatio",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "_newOracle",
				"type": "address"
			},
			{
				"internalType": "string",
				"name": "_key",
				"type": "string"
			}
		],
		"name": "updateGameOracle",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "_newLimit",
				"type": "uint256"
			},
			{
				"internalType": "string",
				"name": "_key",
				"type": "string"
			}
		],
		"name": "updateMaxConversionLimit",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "_newWallet",
				"type": "address"
			},
			{
				"internalType": "string",
				"name": "_key",
				"type": "string"
			}
		],
		"name": "updateOwnerWallet",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "_newRate",
				"type": "uint256"
			},
			{
				"internalType": "string",
				"name": "_key",
				"type": "string"
			}
		],
		"name": "updateReferralCommissionRate",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "string",
				"name": "_newKey",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "_currentKey",
				"type": "string"
			}
		],
		"name": "updateSecretKey",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "_newBonus",
				"type": "uint256"
			},
			{
				"internalType": "string",
				"name": "_key",
				"type": "string"
			}
		],
		"name": "updateWelcomeBonus",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "_newFeeInBnbWei",
				"type": "uint256"
			},
			{
				"internalType": "string",
				"name": "_key",
				"type": "string"
			}
		],
		"name": "updateWithdrawalFee",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "owner",
				"type": "address"
			},
			{
				"internalType": "address",
				"name": "spender",
				"type": "address"
			}
		],
		"name": "allowance",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "account",
				"type": "address"
			}
		],
		"name": "balanceOf",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "contractBalance",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "conversionRatio",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "decimals",
		"outputs": [
			{
				"internalType": "uint8",
				"name": "",
				"type": "uint8"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "gameOracle",
		"outputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "player",
				"type": "address"
			}
		],
		"name": "getInternalBalance",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "player",
				"type": "address"
			},
			{
				"internalType": "enum BlockSnakesGame.LockPeriod",
				"name": "lockPeriod",
				"type": "uint8"
			}
		],
		"name": "getLockedStakeBalance",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "player",
				"type": "address"
			},
			{
				"internalType": "enum BlockSnakesGame.LockPeriod",
				"name": "lockPeriod",
				"type": "uint8"
			}
		],
		"name": "getLockedStakeStartTime",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "player",
				"type": "address"
			}
		],
		"name": "getRewardHistory",
		"outputs": [
			{
				"components": [
					{
						"internalType": "uint256",
						"name": "amount",
						"type": "uint256"
					},
					{
						"internalType": "uint256",
						"name": "timestamp",
						"type": "uint256"
					},
					{
						"internalType": "string",
						"name": "rewardType",
						"type": "string"
					},
					{
						"internalType": "address",
						"name": "referee",
						"type": "address"
					}
				],
				"internalType": "struct BlockSnakesGame.Reward[]",
				"name": "",
				"type": "tuple[]"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			},
			{
				"internalType": "enum BlockSnakesGame.LockPeriod",
				"name": "",
				"type": "uint8"
			}
		],
		"name": "lockedStakeBalances",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			},
			{
				"internalType": "enum BlockSnakesGame.LockPeriod",
				"name": "",
				"type": "uint8"
			}
		],
		"name": "lockedStakeStartTimes",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "enum BlockSnakesGame.LockPeriod",
				"name": "",
				"type": "uint8"
			}
		],
		"name": "lockPeriods",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "enum BlockSnakesGame.LockPeriod",
				"name": "",
				"type": "uint8"
			}
		],
		"name": "lockRewards",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "maxConversionLimit",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "name",
		"outputs": [
			{
				"internalType": "string",
				"name": "",
				"type": "string"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "owner",
		"outputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "ownerWallet",
		"outputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			}
		],
		"name": "playerHistory",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "gamesPlayed",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "totalRewards",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "totalReferrals",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "referralRewards",
				"type": "uint256"
			},
			{
				"internalType": "bool",
				"name": "hasClaimedWelcomeBonus",
				"type": "bool"
			},
			{
				"internalType": "uint256",
				"name": "internalBalance",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "flexibleStakeBalance",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "referralCommissionRate",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			}
		],
		"name": "referrals",
		"outputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			},
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"name": "rewardHistory",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "amount",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "timestamp",
				"type": "uint256"
			},
			{
				"internalType": "string",
				"name": "rewardType",
				"type": "string"
			},
			{
				"internalType": "address",
				"name": "referee",
				"type": "address"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "symbol",
		"outputs": [
			{
				"internalType": "string",
				"name": "",
				"type": "string"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "totalSupply",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "welcomeBonus",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "withdrawalFeeInBnb",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	}
];

    // Initialize provider for game oracle
    let gameOracleProvider;
    try {
        gameOracleProvider = new ethers.providers.JsonRpcProvider("https://data-seed-prebsc-1-s1.bnbchain.org:8545");
        console.log("Connected to primary JSON-RPC provider.");
    } catch (error) {
        console.error("Failed to connect to primary provider:", error);
        try {
            gameOracleProvider = new ethers.providers.JsonRpcProvider("https://data-seed-prebsc-2-s1.bnbchain.org:8545");
            console.log("Connected to backup JSON-RPC provider.");
        } catch (backupError) {
            console.error("Failed to connect to backup provider:", backupError);
            alert("Cannot connect to BNB Testnet. Please check your network.");
            return;
        }
    }

    // Game setup
    const canvas = document.getElementById("gameCanvas");
    const ctx = canvas ? canvas.getContext("2d") : null;
    const gridWidth = 30;
    const gridHeight = 20;
    let gridSize;
    let snake = [{ x: 10, y: 10 }];
    let boxes = [];
    let direction = "right";
    let boxesEaten = 0;
    let gamePoints = 0;
    const baseSnakeSpeed = 150;
    let lastMoveTime = 0;

    // Audio elements with fallback
    const eatingSound = document.getElementById("eatingSound") || new Audio();
    const gameOverSound = document.getElementById("gameOverSound") || new Audio();
    const victorySound = document.getElementById("victorySound") || new Audio();

    // Utility Functions
    function showLoading(show) {
        const loadingIndicator = document.getElementById("loadingIndicator");
        if (loadingIndicator) {
            loadingIndicator.style.display = show ? "block" : "none";
        }
    }

    function updateCanvasSize() {
        if (!canvas || !ctx) {
            console.error("Canvas not available!");
            return;
        }
        const screenWidth = window.innerWidth * 0.9;
        const screenHeight = window.innerHeight * 0.7;
        gridSize = Math.min(screenWidth / gridWidth, screenHeight / gridHeight);
        canvas.width = gridSize * gridWidth;
        canvas.height = gridSize * gridHeight;
        canvas.style.width = `${canvas.width}px`;
        canvas.style.height = `${canvas.height}px`;
        draw();
    }

    function enterFullscreen() {
        if (!canvas) return;
        if (document.fullscreenEnabled) {
            canvas.requestFullscreen().catch(err => console.warn("Fullscreen failed:", err));
        }
        updateCanvasSize();
    }

    function generateBoxes() {
        boxes = [];
        const numBoxes = 10;
        for (let i = 0; i < numBoxes; i++) {
            let newBox;
            do {
                newBox = { x: Math.floor(Math.random() * gridWidth), y: Math.floor(Math.random() * gridHeight) };
            } while (snake.some(segment => segment.x === newBox.x && segment.y === newBox.y) || boxes.some(b => b.x === newBox.x && b.y === newBox.y));
            boxes.push(newBox);
        }
    }

    function draw() {
        if (!ctx) {
            console.error("Canvas context not available!");
            return;
        }
        ctx.fillStyle = "#0a0a23";
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        snake.forEach((segment, index) => {
            ctx.fillStyle = index === 0 ? "#ffd700" : "#800080";
            ctx.fillRect(segment.x * gridSize, segment.y * gridSize, gridSize - 2, gridSize - 2);

            if (index === 0) {
                // Draw snake eyes
                ctx.beginPath();
                ctx.arc(segment.x * gridSize + gridSize * 0.25, segment.y * gridSize + gridSize * 0.3, gridSize * 0.1, 0, Math.PI * 2);
                ctx.fillStyle = "white";
                ctx.fill();
                ctx.beginPath();
                ctx.arc(segment.x * gridSize + gridSize * 0.25, segment.y * gridSize + gridSize * 0.3, gridSize * 0.05, 0, Math.PI * 2);
                ctx.fillStyle = "black";
                ctx.fill();

                ctx.beginPath();
                ctx.arc(segment.x * gridSize + gridSize * 0.75, segment.y * gridSize + gridSize * 0.3, gridSize * 0.1, 0, Math.PI * 2);
                ctx.fillStyle = "white";
                ctx.fill();
                ctx.beginPath();
                ctx.arc(segment.x * gridSize + gridSize * 0.75, segment.y * gridSize + gridSize * 0.3, gridSize * 0.05, 0, Math.PI * 2);
                ctx.fillStyle = "black";
                ctx.fill();
            }
        });

        boxes.forEach(box => {
            ctx.fillStyle = "#ff5555";
            ctx.fillRect(box.x * gridSize, box.y * gridSize, gridSize - 2, gridSize - 2);
        });

        const boxesEatenElement = document.getElementById("boxesEaten");
        const pendingPointsElement = document.getElementById("pendingPoints");
        if (boxesEatenElement) boxesEatenElement.textContent = `Boxes Eaten: ${boxesEaten}`;
        if (pendingPointsElement) pendingPointsElement.textContent = `Pending Points: ${(playerData.pendingPoints || 0).toFixed(2)} BST Points`;
    }

    function gameLoop(currentTime) {
        if (!isGameRunning) return;
        if (currentTime - lastMoveTime >= baseSnakeSpeed) {
            move();
            lastMoveTime = currentTime;
        }
        animationFrameId = requestAnimationFrame(gameLoop);
    }

    function move() {
        if (!isGameRunning || !ctx) return;

        let head = { x: snake[0].x, y: snake[0].y };
        if (direction === "right") head.x++;
        if (direction === "left") head.x--;
        if (direction === "up") head.y--;
        if (direction === "down") head.y++;

        // Check for collisions
        if (head.x < 0 || head.x >= gridWidth || head.y < 0 || head.y >= gridHeight || snake.some(segment => segment.x === head.x && segment.y === head.y)) {
            if (gameOverSound) gameOverSound.play().catch(err => console.warn("Game over sound failed:", err));
            showGameOverPopup();
            return;
        }

        snake.unshift(head);
        const eatenBoxIndex = boxes.findIndex(box => box.x === head.x && box.y === head.y);
        if (eatenBoxIndex !== -1) {
            if (eatingSound) eatingSound.play().catch(err => console.warn("Eating sound failed:", err));
            boxesEaten++;
            const point = 0.5;
            playerData.pendingPoints = (playerData.pendingPoints || 0) + point;
            gamePoints += point;
            playerData.totalPoints = (playerData.totalPoints || 0) + point;
            playerData.rewardHistory.push({ amount: point, timestamp: Date.now(), rewardType: "Game", referee: "N/A" });

            // Handle referral points
            if (playerData.pendingReferral && ethers.utils.isAddress(playerData.pendingReferral)) {
                const referrerPoint = point * 0.01;
                playerData.pendingReferrerPoints = (playerData.pendingReferrerPoints || 0) + referrerPoint;
                playerData.referralPoints = (playerData.referralPoints || 0) + referrerPoint;
                playerData.totalReferrals = (playerData.totalReferrals || 0) + 1;
                playerData.rewardHistory.push({ amount: referrerPoint, timestamp: Date.now(), rewardType: "Referral", referee: playerData.pendingReferral });
            }

            boxes.splice(eatenBoxIndex, 1);
            if (boxes.length < 5) generateBoxes();
            if (boxesEaten % 10 === 0 || boxesEaten % 20 === 0 || boxesEaten % 30 === 0) {
                if (victorySound) victorySound.play().catch(err => console.warn("Victory sound failed:", err));
            }
        } else {
            snake.pop();
        }

        draw();
        updatePlayerHistoryUI();
        localStorage.setItem("playerData", JSON.stringify(playerData));
    }

    function showGameOverPopup() {
        const popup = document.getElementById("gameOverPopup");
        if (!popup) return;
        const finalBoxesEaten = document.getElementById("finalBoxesEaten");
        const finalPoints = document.getElementById("finalPoints");
        if (finalBoxesEaten) finalBoxesEaten.textContent = `Boxes Eaten: ${boxesEaten}`;
        if (finalPoints) finalPoints.textContent = `Earned Points: ${gamePoints.toFixed(2)} BST Points`;
        popup.style.display = "block";
        isGameRunning = false;
        const closePopup = document.getElementById("closePopup");
        if (closePopup) {
            closePopup.onclick = () => {
                popup.style.display = "none";
                resetGame().catch(err => console.error("Error resetting game:", err));
            };
        }
    }

    async function resetGame() {
        if (animationFrameId) cancelAnimationFrame(animationFrameId);
        isGameRunning = false;
        console.log("Resetting game...");
        showLoading(true);

        playerData.gamesPlayed = (playerData.gamesPlayed || 0) + 1;
        boxesEaten = 0;
        gamePoints = 0;
        snake = [{ x: 10, y: 10 }];
        direction = "right";
        generateBoxes();
        updateCanvasSize();
        draw();

        isGameRunning = true;
        lastMoveTime = 0;
        animationFrameId = requestAnimationFrame(gameLoop);
        showLoading(false);
        updatePlayerHistoryUI();
        localStorage.setItem("playerData", JSON.stringify(playerData));
    }

    // Blockchain Interaction Functions
    async function claimWelcomeBonus() {
        if (!account) return alert("Connect wallet first!");
        if (playerData.hasClaimedWelcomeBonus) return alert("Bonus already claimed!");
        if (!contract) return alert("Contract not initialized!");
        try {
            showLoading(true);
            const tx = await contract.claimWelcomeBonus({ gasLimit: 200000 });
            await tx.wait();
            playerData.hasClaimedWelcomeBonus = true;
            const welcomeBonus = Number(ethers.utils.formatUnits(await contract.welcomeBonus(), 18));
            playerData.pendingPoints = (playerData.pendingPoints || 0) + welcomeBonus;
            playerData.totalPoints = (playerData.totalPoints || 0) + welcomeBonus;
            playerData.rewardHistory.push({ amount: welcomeBonus, timestamp: Date.now(), rewardType: "Welcome Bonus", referee: "N/A" });
            await loadPlayerHistory(); // Sync with blockchain
            updatePlayerHistoryUI();
            localStorage.setItem("playerData", JSON.stringify(playerData));
            alert(`Welcome bonus of ${welcomeBonus} BST Points claimed!`);
        } catch (error) {
            console.error("Error claiming welcome bonus:", error);
            alert("Failed to claim bonus: " + (error.reason || error.message || "Unknown error"));
        } finally {
            showLoading(false);
        }
    }

    async function claimDailyLoginReward() {
        if (!account) return alert("Connect wallet first!");
        const currentTime = Date.now();
        const oneDayInMs = 24 * 60 * 60 * 1000;
        if (currentTime - playerData.lastLogin < oneDayInMs) return alert("You can claim daily login reward once every 24 hours!");
        try {
            showLoading(true);
            const dailyReward = 1;
            playerData.pendingPoints = (playerData.pendingPoints || 0) + dailyReward;
            playerData.totalPoints = (playerData.totalPoints || 0) + dailyReward;
            playerData.lastLogin = currentTime;
            playerData.taskHistory.push({ amount: dailyReward, timestamp: currentTime, taskType: "Daily Login" });
            updatePlayerHistoryUI();
            localStorage.setItem("playerData", JSON.stringify(playerData));
            alert(`Daily login reward of ${dailyReward} BST Points claimed!`);
        } catch (error) {
            console.error("Error claiming daily login reward:", error);
            alert("Failed to claim daily reward: " + (error.message || "Unknown error"));
        } finally {
            showLoading(false);
        }
    }

    async function claimSocialMediaShareReward() {
        if (!account) return alert("Connect wallet first!");
        try {
            showLoading(true);
            const shareReward = 2;
            playerData.pendingPoints = (playerData.pendingPoints || 0) + shareReward;
            playerData.totalPoints = (playerData.totalPoints || 0) + shareReward;
            playerData.taskHistory.push({ amount: shareReward, timestamp: Date.now(), taskType: "Social Media Share" });
            updatePlayerHistoryUI();
            localStorage.setItem("playerData", JSON.stringify(playerData));
            alert(`Social media share reward of ${shareReward} BST Points claimed!`);
        } catch (error) {
            console.error("Error claiming social media share reward:", error);
            alert("Failed to claim share reward: " + (error.message || "Unknown error"));
        } finally {
            showLoading(false);
        }
    }

    async function convertPointsToTokens() {
        if (!contract || !account) return alert("Connect wallet first!");
        const pointsToConvert = parseFloat(document.getElementById("convertPointsAmount").value) || 0;
        if (pointsToConvert <= 0) return alert("Enter a valid amount!");
        if (pointsToConvert > MAX_CONVERSION_LIMIT) return alert(`Cannot convert more than ${MAX_CONVERSION_LIMIT} BST Points at once!`);
        if (pointsToConvert > playerData.pendingPoints) return alert("Insufficient BST Points!");
        try {
            showLoading(true);
            const provider = new ethers.providers.Web3Provider(window.ethereum);
            const balance = await provider.getBalance(account);
            const feeInWei = ethers.utils.parseUnits(WITHDRAWAL_FEE_BNB, "ether");
            if (balance.lt(feeInWei)) {
                throw new Error(`Need ${WITHDRAWAL_FEE_BNB} BNB for conversion fee.`);
            }
            const pointsInWei = ethers.utils.parseUnits(pointsToConvert.toString(), 18);
            const tokensToReceive = pointsToConvert / CONVERSION_RATIO;
            const tokensInWei = ethers.utils.parseUnits(tokensToReceive.toString(), 18);
            const contractBal = await contract.contractBalance();
            if (ethers.BigNumber.from(contractBal).lt(tokensInWei)) {
                throw new Error("Contract does not have enough BST tokens!");
            }
            const tx = await contract.convertPointsToTokens(
                pointsInWei,
                account,
                playerData.pendingReferral || ethers.constants.AddressZero,
                { value: feeInWei, gasLimit: 500000 }
            );
            await tx.wait();
            playerData.pendingPoints -= pointsToConvert;
            playerData.totalRewards += tokensToReceive;
            playerData.rewardHistory.push({ amount: tokensToReceive, timestamp: Date.now(), rewardType: "Points Conversion", referee: "N/A" });
            if (playerData.pendingReferral) {
                const referrerPoints = pointsToConvert * 0.01;
                playerData.pendingReferrerPoints = (playerData.pendingReferrerPoints || 0) + referrerPoints;
                playerData.referralPoints = (playerData.referralPoints || 0) + referrerPoints;
                playerData.rewardHistory.push({ amount: referrerPoints, timestamp: Date.now(), rewardType: "Referral", referee: playerData.pendingReferral });
            }
            playerData.pendingReferral = null;
            await loadPlayerHistory(); // Sync with blockchain
            updatePlayerHistoryUI();
            localStorage.setItem("playerData", JSON.stringify(playerData));
            alert(`${pointsToConvert} BST Points converted to ${tokensToReceive} BST Tokens!`);
        } catch (error) {
            console.error("Error converting points to tokens:", error);
            alert("Failed to convert points: " + (error.reason || error.message || "Unknown error"));
        } finally {
            showLoading(false);
        }
    }

    async function stakeTokens() {
        if (!contract || !account) return alert("Connect wallet first!");
        const amount = parseFloat(document.getElementById("stakeAmount").value) || 0;
        const lockPeriod = parseInt(document.getElementById("lockPeriod").value);
        if (amount <= 0) return alert("Enter a valid amount!");
        try {
            showLoading(true);
            const amountInWei = ethers.utils.parseUnits(amount.toString(), 18);
            const walletBalance = await contract.balanceOf(account);
            if (ethers.BigNumber.from(walletBalance).lt(amountInWei)) {
                throw new Error("Insufficient BST Tokens in wallet!");
            }
            const tx = await contract.stakeTokens(amountInWei, lockPeriod, { gasLimit: 500000 });
            await tx.wait();
            if (lockPeriod === 0) {
                playerData.flexibleStakeBalance = (playerData.flexibleStakeBalance || 0) + amount;
            } else {
                playerData.lockedStakeBalances[lockPeriod] = (playerData.lockedStakeBalances[lockPeriod] || 0) + amount;
                playerData.lockedStakeStartTimes[lockPeriod] = Math.floor(Date.now() / 1000);
            }
            playerData.stakingHistory.push({ amount, timestamp: Date.now(), lockPeriod, action: "Stake" });
            await loadPlayerHistory(); // Sync with blockchain
            updatePlayerHistoryUI();
            alert(`${amount} BST Tokens staked successfully!`);
            document.getElementById("stakeAmount").value = "";
        } catch (error) {
            console.error("Error staking tokens:", error);
            alert("Failed to stake: " + (error.reason || error.message || "Unknown error"));
        } finally {
            showLoading(false);
        }
    }

    async function unstakeTokens() {
        if (!contract || !account) return alert("Connect wallet first!");
        const amount = parseFloat(document.getElementById("unstakeAmount").value) || 0;
        const lockPeriod = parseInt(document.getElementById("unlockPeriod").value);
        if (amount <= 0) return alert("Enter a valid amount!");
        try {
            showLoading(true);
            const amountInWei = ethers.utils.parseUnits(amount.toString(), 18);
            const tx = await contract.unstakeTokens(amountInWei, lockPeriod, { gasLimit: 500000 });
            await tx.wait();
            if (lockPeriod === 0) {
                playerData.flexibleStakeBalance = Math.max(0, (playerData.flexibleStakeBalance || 0) - amount);
            } else {
                playerData.lockedStakeBalances[lockPeriod] = Math.max(0, (playerData.lockedStakeBalances[lockPeriod] || 0) - amount);
            }
            playerData.stakingHistory.push({ amount, timestamp: Date.now(), lockPeriod, action: "Unstake" });
            await loadPlayerHistory(); // Sync with blockchain
            updatePlayerHistoryUI();
            alert(`${amount} BST Tokens unstaked successfully!`);
            document.getElementById("unstakeAmount").value = "";
        } catch (error) {
            console.error("Error unstaking tokens:", error);
            alert("Failed to unstake: " + (error.reason || error.message || "Unknown error"));
        } finally {
            showLoading(false);
        }
    }

    async function connectWallet() {
        if (!window.ethereum) return alert("Please install MetaMask!");
        try {
            showLoading(true);
            const provider = new ethers.providers.Web3Provider(window.ethereum);
            await provider.send("eth_requestAccounts", []);
            const network = await provider.getNetwork();
            const chainId = network.chainId.toString();
            if (chainId !== TARGET_NETWORK_ID) {
                try {
                    await window.ethereum.request({
                        method: "wallet_switchEthereumChain",
                        params: [{ chainId: "0x61" }]
                    });
                } catch (switchError) {
                    if (switchError.code === 4902) {
                        await window.ethereum.request({
                            method: "wallet_addEthereumChain",
                            params: [{
                                chainId: "0x61",
                                chainName: "BNB Smart Chain Testnet",
                                rpcUrls: ["https://data-seed-prebsc-1-s1.bnbchain.org:8545/"],
                                nativeCurrency: { name: "BNB", symbol: "BNB", decimals: 18 },
                                blockExplorerUrls: ["https://testnet.bscscan.com"]
                            }]
                        });
                    } else {
                        throw switchError;
                    }
                }
            }
            const accounts = await provider.send("eth_requestAccounts", []);
            account = accounts[0];
            playerData.walletAddress = account;
            contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, provider.getSigner());
            WITHDRAWAL_FEE_BNB = ethers.utils.formatUnits(await contract.withdrawalFeeInBnb(), "ether");
            MAX_CONVERSION_LIMIT = Number(ethers.utils.formatUnits(await contract.maxConversionLimit(), 18));
            CONVERSION_RATIO = Number(ethers.utils.formatUnits(await contract.conversionRatio(), 18));
            await loadPlayerHistory();
            updatePlayerHistoryUI();
            document.getElementById("connectWallet").style.display = "none";
            document.getElementById("disconnectWallet").style.display = "block";
            const walletAddressElement = document.getElementById("walletAddress");
            if (walletAddressElement) walletAddressElement.textContent = `Connected: ${account.slice(0, 6)}...`;
            alert("Wallet connected successfully!");
        } catch (error) {
            console.error("Wallet connection error:", error);
            alert("Failed to connect wallet: " + (error.reason || error.message || "Unknown error"));
        } finally {
            showLoading(false);
        }
    }

    function disconnectWallet() {
        account = null;
        contract = null;
        document.getElementById("connectWallet").style.display = "block";
        document.getElementById("disconnectWallet").style.display = "none";
        const walletAddressElement = document.getElementById("walletAddress");
        if (walletAddressElement) walletAddressElement.textContent = "";
        updatePlayerHistoryUI();
        alert("Wallet disconnected!");
    }

    function getReferralLink() {
        if (!account) return alert("Connect wallet first!");
        const baseUrl = window.location.origin + window.location.pathname;
        const referralLink = `${baseUrl}?ref=${account}`;
        navigator.clipboard.writeText(referralLink).then(() => {
            alert(`Referral link copied: ${referralLink}`);
        }).catch(err => {
            console.error("Failed to copy referral link:", err);
            alert("Failed to copy referral link. Please copy manually: " + referralLink);
        });
    }

    async function loadPlayerHistory() {
        if (!contract || !account) {
            updatePlayerHistoryUI();
            return;
        }
        try {
            showLoading(true);
            const history = await contract.playerHistory(account);
            playerData.gamesPlayed = Number(history.gamesPlayed) || 0;
            playerData.totalRewards = Number(ethers.utils.formatUnits(history.totalRewards || 0, 18));
            playerData.totalReferrals = Number(history.totalReferrals) || 0;
            playerData.referralPoints = Number(ethers.utils.formatUnits(history.referralRewards || 0, 18));
            playerData.hasClaimedWelcomeBonus = history.hasClaimedWelcomeBonus || false;
            playerData.pendingPoints = Number(ethers.utils.formatUnits(await contract.getInternalBalance(account), 18));
            playerData.walletBalance = Number(ethers.utils.formatUnits(await contract.balanceOf(account), 18));
            playerData.flexibleStakeBalance = Number(ethers.utils.formatUnits(history.flexibleStakeBalance || 0, 18));

            playerData.lockedStakeBalances[0] = playerData.flexibleStakeBalance;
            for (let i = 1; i <= 3; i++) {
                playerData.lockedStakeBalances[i] = Number(ethers.utils.formatUnits(await contract.getLockedStakeBalance(account, i), 18));
                playerData.lockedStakeStartTimes[i] = Number(await contract.getLockedStakeStartTime(account, i));
            }

            const rewards = await contract.getRewardHistory(account);
            playerData.rewardHistory = rewards.map(reward => ({
                amount: Number(ethers.utils.formatUnits(reward.amount, 18)),
                timestamp: Number(reward.timestamp) * 1000,
                rewardType: reward.rewardType,
                referee: reward.referee === ethers.constants.AddressZero ? "N/A" : reward.referee
            }));

            updatePlayerHistoryUI();
            localStorage.setItem("playerData", JSON.stringify(playerData));
        } catch (error) {
            console.error("Error loading player history:", error);
            alert("Failed to load history: " + (error.reason || error.message || "Unknown error"));
        } finally {
            showLoading(false);
        }
    }

    function updatePlayerHistoryUI() {
        const elements = {
            gamesPlayed: document.getElementById("gamesPlayed"),
            totalPoints: document.getElementById("totalPoints"),
            totalGameRewards: document.getElementById("totalGameRewards"),
            totalReferrals: document.getElementById("totalReferrals"),
            referralPoints: document.getElementById("referralPoints"),
            pendingPointsText: document.getElementById("pendingPointsText"),
            flexibleStakeBalance: document.getElementById("flexibleStakeBalance"),
            lockedStakeBalance60D: document.getElementById("lockedStakeBalance60D"),
            lockedStakeBalance180D: document.getElementById("lockedStakeBalance180D"),
            lockedStakeBalance365D: document.getElementById("lockedStakeBalance365D"),
            walletBalance: document.getElementById("walletBalance"),
            walletAddress: document.getElementById("walletAddress"),
            rewardHistoryList: document.getElementById("rewardHistoryList"),
            taskHistoryList: document.getElementById("taskHistoryList"),
            stakingHistoryList: document.getElementById("stakingHistoryList")
        };

        if (elements.gamesPlayed) elements.gamesPlayed.textContent = `Games Played: ${playerData.gamesPlayed || 0}`;
        if (elements.totalPoints) elements.totalPoints.textContent = `Total Points: ${(playerData.totalPoints || 0).toFixed(2)} BST Points`;
        if (elements.totalGameRewards) elements.totalGameRewards.textContent = `Total Token Rewards: ${(playerData.totalRewards || 0).toFixed(2)} BST Tokens`;
        if (elements.totalReferrals) elements.totalReferrals.textContent = `Total Referrals: ${playerData.totalReferrals || 0}`;
        if (elements.referralPoints) elements.referralPoints.textContent = `Referral Points: ${(playerData.referralPoints || 0).toFixed(2)} BST Points`;
        if (elements.pendingPointsText) elements.pendingPointsText.textContent = `Pending Points: ${(playerData.pendingPoints || 0).toFixed(2)} BST Points`;
        if (elements.flexibleStakeBalance) elements.flexibleStakeBalance.textContent = `Flexible Stake Balance: ${(playerData.flexibleStakeBalance || 0).toFixed(2)} BST Tokens`;
        if (elements.lockedStakeBalance60D) elements.lockedStakeBalance60D.textContent = `Locked Stake Balance (60D): ${(playerData.lockedStakeBalances[1] || 0).toFixed(2)} BST Tokens`;
        if (elements.lockedStakeBalance180D) elements.lockedStakeBalance180D.textContent = `Locked Stake Balance (180D): ${(playerData.lockedStakeBalances[2] || 0).toFixed(2)} BST Tokens`;
        if (elements.lockedStakeBalance365D) elements.lockedStakeBalance365D.textContent = `Locked Stake Balance (365D): ${(playerData.lockedStakeBalances[3] || 0).toFixed(2)} BST Tokens`;
        if (elements.walletBalance) elements.walletBalance.textContent = `Wallet Balance: ${(playerData.walletBalance || 0).toFixed(2)} BST Tokens`;
        if (elements.walletAddress) elements.walletAddress.textContent = account ? `Connected: ${account.slice(0, 6)}...` : "";
        if (elements.rewardHistoryList) {
            elements.rewardHistoryList.innerHTML = (playerData.rewardHistory || []).map(entry =>
                `<li>${entry.rewardType}: ${entry.amount.toFixed(2)} ${entry.rewardType.includes("Conversion") ? "BST Tokens" : "BST Points"} on ${new Date(entry.timestamp).toLocaleString()}${entry.referee !== "N/A" ? ` (Referee: ${entry.referee.slice(0, 6)}...)` : ""}</li>`
            ).join("");
        }
        if (elements.taskHistoryList) {
            elements.taskHistoryList.innerHTML = (playerData.taskHistory || []).map(entry =>
                `<li>${entry.taskType}: ${entry.amount.toFixed(2)} BST Points on ${new Date(entry.timestamp).toLocaleString()}</li>`
            ).join("");
        }
        if (elements.stakingHistoryList) {
            elements.stakingHistoryList.innerHTML = (playerData.stakingHistory || []).map(entry =>
                `<li>${entry.action}: ${entry.amount.toFixed(2)} BST Tokens on ${new Date(entry.timestamp).toLocaleString()} (Lock Period: ${entry.lockPeriod === 0 ? "Flexible" : entry.lockPeriod === 1 ? "60 Days" : entry.lockPeriod === 2 ? "180 Days" : "365 Days"})</li>`
            ).join("");
        }
    }

    // Event Listeners
    const playGameButton = document.getElementById("playGame");
    if (playGameButton) {
        playGameButton.addEventListener("click", async () => {
            if (!account) return alert("Connect wallet!");
            showLoading(true);
            enterFullscreen();
            await resetGame().catch(err => console.error("Error resetting game:", err));
            showLoading(false);
        });
    }

    const connectWalletButton = document.getElementById("connectWallet");
    if (connectWalletButton) connectWalletButton.addEventListener("click", connectWallet);

    const disconnectWalletButton = document.getElementById("disconnectWallet");
    if (disconnectWalletButton) disconnectWalletButton.addEventListener("click", disconnectWallet);

    const claimWelcomeBonusButton = document.getElementById("claimWelcomeBonus");
    if (claimWelcomeBonusButton) claimWelcomeBonusButton.addEventListener("click", claimWelcomeBonus);

    const claimDailyLoginRewardButton = document.getElementById("claimDailyLoginReward");
    if (claimDailyLoginRewardButton) claimDailyLoginRewardButton.addEventListener("click", claimDailyLoginReward);

    const claimSocialMediaShareRewardButton = document.getElementById("claimSocialMediaShareReward");
    if (claimSocialMediaShareRewardButton) claimSocialMediaShareRewardButton.addEventListener("click", claimSocialMediaShareReward);

    const convertPointsButton = document.getElementById("convertPoints");
    if (convertPointsButton) convertPointsButton.addEventListener("click", convertPointsToTokens);

    const stakeTokensButton = document.getElementById("stakeTokens");
    if (stakeTokensButton) stakeTokensButton.addEventListener("click", stakeTokens);

    const unstakeTokensButton = document.getElementById("unstakeTokens");
    if (unstakeTokensButton) unstakeTokensButton.addEventListener("click", unstakeTokens);

    const getReferralLinkButton = document.getElementById("getReferralLink");
    if (getReferralLinkButton) getReferralLinkButton.addEventListener("click", getReferralLink);

    document.addEventListener("keydown", (event) => {
        if (isGameRunning) {
            if (event.key === "ArrowUp" && direction !== "down") direction = "up";
            if (event.key === "ArrowDown" && direction !== "up") direction = "down";
            if (event.key === "ArrowLeft" && direction !== "right") direction = "left";
            if (event.key === "ArrowRight" && direction !== "left") direction = "right";
        }
    });

    let touchStartX = 0, touchStartY = 0, lastTouchTime = 0;
    if (canvas) {
        canvas.addEventListener("touchstart", (event) => {
            touchStartX = event.touches[0].clientX;
            touchStartY = event.touches[0].clientY;
        });
        canvas.addEventListener("touchmove", (event) => {
            if (!isGameRunning) return;
            const touch = event.touches[0];
            const deltaX = touch.clientX - touchStartX;
            const deltaY = touch.clientY - touchStartY;
            if (Date.now() - lastTouchTime < 150) return;
            if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > 50) {
                if (deltaX > 0 && direction !== "left") direction = "right";
                else if (deltaX < 0 && direction !== "right") direction = "left";
            } else if (Math.abs(deltaY) > 50) {
                if (deltaY > 0 && direction !== "up") direction = "down";
                else if (deltaY < 0 && direction !== "down") direction = "up";
            }
            lastTouchTime = Date.now();
        });
    }

    window.addEventListener("resize", updateCanvasSize);

    // Initial setup
    updateCanvasSize();
    generateBoxes();
    draw();
    animationFrameId = requestAnimationFrame(gameLoop);
    updatePlayerHistoryUI();
});
