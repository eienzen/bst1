document.addEventListener("DOMContentLoaded", () => {
    console.log("DOM fully loaded, initializing game...");

    let account = null;
    let contract = null;
    let animationFrameId = null;
    const TARGET_NETWORK_ID = "97"; // BNB Chain Testnet
    let WITHDRAWAL_FEE_BNB = "0.0002";
    let MAX_CONVERSION_LIMIT = 1000;
    let CONVERSION_RATIO = 1;
    let isGameRunning = false;

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

    const urlParams = new URLSearchParams(window.location.search);
    const referrerAddress = urlParams.get("ref");
    if (referrerAddress && !playerData.pendingReferral && ethers.utils.isAddress(referrerAddress)) {
        playerData.pendingReferral = referrerAddress;
    }

    const CONTRACT_ADDRESS = "0xD2d5e0566C11878CeEac45e1A19B0c73CBd2161a"; // Update with new address
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
				"internalType": "enum BlockSnakesGame.LockPeriod",
				"name": "period",
				"type": "uint8"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "newRate",
				"type": "uint256"
			}
		],
		"name": "LockRewardUpdated",
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
				"internalType": "enum BlockSnakesGame.LockPeriod",
				"name": "period",
				"type": "uint8"
			},
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
		"name": "updateLockReward",
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
]; // Update with new ABI from Remix

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
        }
    }

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

    const eatingSound = document.getElementById("eatingSound");
    const gameOverSound = document.getElementById("gameOverSound");
    const victorySound = document.getElementById("victorySound");

    function showLoading(show) {
        const loadingIndicator = document.getElementById("loadingIndicator");
        if (loadingIndicator) {
            loadingIndicator.style.display = show ? "block" : "none";
        }
    }

    function updateCanvasSize() {
        if (!canvas) return console.error("Canvas not available!");
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
        if (document.fullscreenEnabled && canvas) {
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
        if (!ctx) return console.error("Canvas context not available!");
        ctx.fillStyle = "#0a0a23";
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        snake.forEach((segment, index) => {
            ctx.fillStyle = index === 0 ? "#ffd700" : "#800080";
            ctx.fillRect(segment.x * gridSize, segment.y * gridSize, gridSize - 2, gridSize - 2);

            if (index === 0) {
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
        if (boxesEatenElement) {
            boxesEatenElement.textContent = `Boxes Eaten: ${boxesEaten}`;
        }
        const pendingPointsElement = document.getElementById("pendingPoints");
        if (pendingPointsElement) {
            pendingPointsElement.textContent = `Pending Points: ${(playerData.pendingPoints || 0).toFixed(2)} BST Points`;
        }
    }

    function gameLoop(currentTime) {
        if (isGameRunning && ctx) {
            if (currentTime - lastMoveTime >= baseSnakeSpeed) {
                move();
                lastMoveTime = currentTime;
            }
            animationFrameId = requestAnimationFrame(gameLoop);
        }
    }

    function move() {
        if (!isGameRunning || !ctx) return;

        let head = { x: snake[0].x, y: snake[0].y };
        if (direction === "right") head.x++;
        if (direction === "left") head.x--;
        if (direction === "up") head.y--;
        if (direction === "down") head.y++;

        if (head.x < 0 || head.x >= gridWidth || head.y < 0 || head.y >= gridHeight || snake.some(segment => segment.x === head.x && segment.y === head.y)) {
            if (gameOverSound) gameOverSound.play();
            showGameOverPopup();
            return;
        }

        snake.unshift(head);
        const eatenBoxIndex = boxes.findIndex(box => box.x === head.x && box.y === head.y);
        if (eatenBoxIndex !== -1) {
            if (eatingSound) eatingSound.play();
            boxesEaten++;
            const point = 0.5;
            playerData.pendingPoints = (playerData.pendingPoints || 0) + point;
            gamePoints += point;
            playerData.totalPoints = (playerData.totalPoints || 0) + point;
            playerData.rewardHistory.push({ amount: point, timestamp: Date.now(), rewardType: "Game", referee: "N/A" });
            if (playerData.pendingReferral) {
                const referrerPoint = point * 0.01;
                playerData.pendingReferrerPoints = (playerData.pendingReferrerPoints || 0) + referrerPoint;
                playerData.referralPoints = (playerData.referralPoints || 0) + referrerPoint;
                playerData.totalReferrals = (playerData.totalReferrals || 0) + 1;
                playerData.rewardHistory.push({ amount: referrerPoint, timestamp: Date.now(), rewardType: "Referral", referee: playerData.pendingReferral });
            }
            boxes.splice(eatenBoxIndex, 1);
            if (boxes.length < 5) generateBoxes();
            if (boxesEaten % 10 === 0 || boxesEaten % 20 === 0 || boxesEaten % 30 === 0) {
                if (victorySound) victorySound.play();
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

    async function claimWelcomeBonus() {
        if (!account) return alert("Connect wallet first!");
        if (playerData.hasClaimedWelcomeBonus) return alert("Bonus already claimed!");
        try {
            showLoading(true);
            const tx = await contract.claimWelcomeBonus({ gasLimit: 200000 });
            await tx.wait();
            playerData.hasClaimedWelcomeBonus = true;
            const welcomeBonus = Number(ethers.utils.formatUnits(await contract.welcomeBonus(), 18));
            playerData.pendingPoints = (playerData.pendingPoints || 0) + welcomeBonus;
            playerData.totalPoints = (playerData.totalPoints || 0) + welcomeBonus;
            playerData.rewardHistory.push({ amount: welcomeBonus, timestamp: Date.now(), rewardType: "Welcome Bonus", referee: "N/A" });
            updatePlayerHistoryUI();
            localStorage.setItem("playerData", JSON.stringify(playerData));
            alert(`Welcome bonus of ${welcomeBonus} BST Points claimed!`);
        } catch (error) {
            console.error("Error claiming welcome bonus:", error);
            alert("Failed to claim bonus: " + (error.message || "Unknown error"));
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
                alert(`Need ${WITHDRAWAL_FEE_BNB} BNB for conversion fee.`);
                return;
            }
            const pointsInWei = ethers.utils.parseUnits(pointsToConvert.toString(), 18);
            const tokensToReceive = pointsToConvert / CONVERSION_RATIO;
            const tokensInWei = ethers.utils.parseUnits(tokensToReceive.toString(), 18);
            const contractBal = await contract.contractBalance();
            if (ethers.BigNumber.from(contractBal).lt(tokensInWei)) {
                alert("Contract does not have enough BST tokens!");
                return;
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
            playerData.walletBalance = Number(ethers.utils.formatUnits(await contract.balanceOf(account), 18));
            playerData.rewardHistory.push({ amount: tokensToReceive, timestamp: Date.now(), rewardType: "Points Conversion", referee: "N/A" });
            if (playerData.pendingReferral) {
                const referrerPoints = pointsToConvert * 0.01;
                playerData.pendingReferrerPoints = (playerData.pendingReferrerPoints || 0) + referrerPoints;
                playerData.referralPoints = (playerData.referralPoints || 0) + referrerPoints;
                playerData.rewardHistory.push({ amount: referrerPoints, timestamp: Date.now(), rewardType: "Referral", referee: playerData.pendingReferral });
            }
            playerData.pendingReferral = null;
            updatePlayerHistoryUI();
            localStorage.setItem("playerData", JSON.stringify(playerData));
            alert(`${pointsToConvert} BST Points converted to ${tokensToReceive} BST Tokens!`);
        } catch (error) {
            console.error("Error converting points to tokens:", error);
            alert("Failed to convert points: " + (error.message || "Unknown error"));
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
                alert("Insufficient BST Tokens in wallet!");
                return;
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
            playerData.walletBalance = Number(ethers.utils.formatUnits(await contract.balanceOf(account), 18));
            await loadPlayerHistory();
            updatePlayerHistoryUI();
            alert(`${amount} BST Tokens staked successfully!`);
            document.getElementById("stakeAmount").value = "";
        } catch (error) {
            console.error("Error staking tokens:", error);
            alert("Failed to stake: " + (error.message || "Unknown error"));
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
                playerData.flexibleStakeBalance = (playerData.flexibleStakeBalance || 0) - amount;
            } else {
                playerData.lockedStakeBalances[lockPeriod] = (playerData.lockedStakeBalances[lockPeriod] || 0) - amount;
            }
            playerData.stakingHistory.push({ amount, timestamp: Date.now(), lockPeriod, action: "Unstake" });
            playerData.walletBalance = Number(ethers.utils.formatUnits(await contract.balanceOf(account), 18));
            await loadPlayerHistory();
            updatePlayerHistoryUI();
            alert(`${amount} BST Tokens unstaked successfully!`);
            document.getElementById("unstakeAmount").value = "";
        } catch (error) {
            console.error("Error unstaking tokens:", error);
            alert("Failed to unstake: " + (error.message || "Unknown error"));
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
            const connectWalletBtn = document.getElementById("connectWallet");
            const disconnectWalletBtn = document.getElementById("disconnectWallet");
            if (connectWalletBtn) connectWalletBtn.style.display = "none";
            if (disconnectWalletBtn) disconnectWalletBtn.style.display = "block";
            const walletAddressElement = document.getElementById("walletAddress");
            if (walletAddressElement) walletAddressElement.textContent = `Connected: ${account.slice(0, 6)}...`;
            alert("Wallet connected successfully!");
        } catch (error) {
            console.error("Wallet connection error:", error);
            alert("Failed to connect wallet: " + (error.message || "Unknown error"));
        } finally {
            showLoading(false);
        }
    }

    function disconnectWallet() {
        account = null;
        contract = null;
        playerData.walletAddress = null;
        playerData.walletBalance = 0;
        const connectWalletBtn = document.getElementById("connectWallet");
        const disconnectWalletBtn = document.getElementById("disconnectWallet");
        if (connectWalletBtn) connectWalletBtn.style.display = "block";
        if (disconnectWalletBtn) disconnectWalletBtn.style.display = "none";
        const walletAddressElement = document.getElementById("walletAddress");
        if (walletAddressElement) walletAddressElement.textContent = "Wallet: Not Connected";
        updatePlayerHistoryUI();
        localStorage.setItem("playerData", JSON.stringify(playerData));
        alert("Wallet disconnected!");
    }

    async function loadPlayerHistory() {
        if (!contract || !account) return;
        try {
            const history = await contract.playerHistory(account);
            playerData.gamesPlayed = Number(history.gamesPlayed);
            playerData.totalRewards = Number(ethers.utils.formatUnits(history.totalRewards, 18));
            playerData.totalReferrals = Number(history.totalReferrals);
            playerData.referralPoints = Number(ethers.utils.formatUnits(history.referralRewards, 18));
            playerData.hasClaimedWelcomeBonus = history.hasClaimedWelcomeBonus;
            playerData.pendingPoints = Number(ethers.utils.formatUnits(await contract.getInternalBalance(account), 18));
            playerData.flexibleStakeBalance = Number(ethers.utils.formatUnits(history.flexibleStakeBalance, 18));
            playerData.walletBalance = Number(ethers.utils.formatUnits(await contract.balanceOf(account), 18));

            for (let i = 1; i <= 3; i++) {
                playerData.lockedStakeBalances[i] = Number(ethers.utils.formatUnits(await contract.getLockedStakeBalance(account, i), 18));
                playerData.lockedStakeStartTimes[i] = Number(await contract.getLockedStakeStartTime(account, i));
            }

            const rewards = await contract.getRewardHistory(account);
            playerData.rewardHistory = rewards.map(reward => ({
                amount: Number(ethers.utils.formatUnits(reward.amount, 18)),
                timestamp: Number(reward.timestamp) * 1000,
                rewardType: reward.rewardType,
                referee: reward.referee
            }));
        } catch (error) {
            console.error("Error loading player history:", error);
        }
    }

    function updatePlayerHistoryUI() {
        document.getElementById("gamesPlayed").textContent = `Games Played: ${playerData.gamesPlayed || 0}`;
        document.getElementById("totalPoints").textContent = `Total Points: ${(playerData.totalPoints || 0).toFixed(2)} BST Points`;
        document.getElementById("totalRewards").textContent = `Total Rewards: ${(playerData.totalRewards || 0).toFixed(2)} BST Tokens`;
        document.getElementById("totalReferrals").textContent = `Total Referrals: ${playerData.totalReferrals || 0}`;
        document.getElementById("referralPoints").textContent = `Referral Points: ${(playerData.referralPoints || 0).toFixed(2)} BST Points`;
        document.getElementById("walletBalance").textContent = `Wallet Balance: ${(playerData.walletBalance || 0).toFixed(2)} BST Tokens`;
        document.getElementById("flexibleStakeBalance").textContent = `Flexible Stake Balance: ${(playerData.flexibleStakeBalance || 0).toFixed(2)} BST Tokens`;
        document.getElementById("lockedStakeBalance").textContent = `Locked Stake Balances: 60 Days: ${(playerData.lockedStakeBalances[1] || 0).toFixed(2)}, 180 Days: ${(playerData.lockedStakeBalances[2] || 0).toFixed(2)}, 365 Days: ${(playerData.lockedStakeBalances[3] || 0).toFixed(2)}`;

        const rewardHistory = document.getElementById("rewardHistory");
        rewardHistory.innerHTML = "";
        playerData.rewardHistory.forEach(reward => {
            const li = document.createElement("li");
            li.textContent = `${reward.rewardType}: ${reward.amount.toFixed(2)} BST at ${new Date(reward.timestamp).toLocaleString()} (Referee: ${reward.referee})`;
            rewardHistory.appendChild(li);
        });

        const taskHistory = document.getElementById("taskHistory");
        taskHistory.innerHTML = "";
        playerData.taskHistory.forEach(task => {
            const li = document.createElement("li");
            li.textContent = `${task.taskType}: ${task.amount.toFixed(2)} BST Points at ${new Date(task.timestamp).toLocaleString()}`;
            taskHistory.appendChild(li);
        });

        const stakingHistory = document.getElementById("stakingHistory");
        stakingHistory.innerHTML = "";
        playerData.stakingHistory.forEach(stake => {
            const li = document.createElement("li");
            li.textContent = `${stake.action}: ${stake.amount.toFixed(2)} BST Tokens (Lock Period: ${stake.lockPeriod}) at ${new Date(stake.timestamp).toLocaleString()}`;
            stakingHistory.appendChild(li);
        });
    }

    async function mintTokens() {
        if (!contract || !account) return alert("Connect wallet first!");
        const amount = parseFloat(document.getElementById("mintAmount").value) || 0;
        const key = document.getElementById("mintKey").value;
        if (amount <= 0) return alert("Enter a valid amount!");
        if (!key) return alert("Enter the secret key!");
        try {
            showLoading(true);
            const amountInWei = ethers.utils.parseUnits(amount.toString(), 18);
            const tx = await contract.mintTokens(amountInWei, key, { gasLimit: 500000 });
            await tx.wait();
            playerData.walletBalance = Number(ethers.utils.formatUnits(await contract.balanceOf(account), 18));
            updatePlayerHistoryUI();
            alert(`${amount} BST Tokens minted successfully!`);
        } catch (error) {
            console.error("Error minting tokens:", error);
            alert("Failed to mint tokens: " + (error.message || "Unknown error"));
        } finally {
            showLoading(false);
        }
    }

    async function burnTokens() {
        if (!contract || !account) return alert("Connect wallet first!");
        const amount = parseFloat(document.getElementById("burnAmount").value) || 0;
        const key = document.getElementById("burnKey").value;
        if (amount <= 0) return alert("Enter a valid amount!");
        if (!key) return alert("Enter the secret key!");
        try {
            showLoading(true);
            const amountInWei = ethers.utils.parseUnits(amount.toString(), 18);
            const tx = await contract.burnTokens(amountInWei, key, { gasLimit: 500000 });
            await tx.wait();
            playerData.walletBalance = Number(ethers.utils.formatUnits(await contract.balanceOf(account), 18));
            updatePlayerHistoryUI();
            alert(`${amount} BST Tokens burned successfully!`);
        } catch (error) {
            console.error("Error burning tokens:", error);
            alert("Failed to burn tokens: " + (error.message || "Unknown error"));
        } finally {
            showLoading(false);
        }
    }

    async function updateWelcomeBonus() {
        if (!contract || !account) return alert("Connect wallet first!");
        const newBonus = parseFloat(document.getElementById("newWelcomeBonus").value) || 0;
        const key = document.getElementById("welcomeBonusKey").value;
        if (newBonus <= 0) return alert("Enter a valid bonus amount!");
        if (!key) return alert("Enter the secret key!");
        try {
            showLoading(true);
            const newBonusInWei = ethers.utils.parseUnits(newBonus.toString(), 18);
            const tx = await contract.updateWelcomeBonus(newBonusInWei, key, { gasLimit: 200000 });
            await tx.wait();
            alert(`Welcome bonus updated to ${newBonus} BST Points!`);
        } catch (error) {
            console.error("Error updating welcome bonus:", error);
            alert("Failed to update welcome bonus: " + (error.message || "Unknown error"));
        } finally {
            showLoading(false);
        }
    }

    async function updateReferralCommissionRate() {
        if (!contract || !account) return alert("Connect wallet first!");
        const newRate = parseFloat(document.getElementById("newReferralRate").value) || 0;
        const key = document.getElementById("referralRateKey").value;
        if (newRate <= 0) return alert("Enter a valid rate!");
        if (!key) return alert("Enter the secret key!");
        try {
            showLoading(true);
            const newRateInWei = ethers.utils.parseUnits(newRate.toString(), 18);
            const tx = await contract.updateReferralCommissionRate(newRateInWei, key, { gasLimit: 200000 });
            await tx.wait();
            alert(`Referral commission rate updated to ${newRate}!`);
        } catch (error) {
            console.error("Error updating referral commission rate:", error);
            alert("Failed to update referral rate: " + (error.message || "Unknown error"));
        } finally {
            showLoading(false);
        }
    }

    async function updateWithdrawalFee() {
        if (!contract || !account) return alert("Connect wallet first!");
        const newFee = parseFloat(document.getElementById("newWithdrawalFee").value) || 0;
        const key = document.getElementById("withdrawalFeeKey").value;
        if (newFee <= 0) return alert("Enter a valid fee!");
        if (!key) return alert("Enter the secret key!");
        try {
            showLoading(true);
            const newFeeInWei = ethers.utils.parseUnits(newFee.toString(), "ether");
            const tx = await contract.updateWithdrawalFee(newFeeInWei, key, { gasLimit: 200000 });
            await tx.wait();
            WITHDRAWAL_FEE_BNB = ethers.utils.formatUnits(await contract.withdrawalFeeInBnb(), "ether");
            alert(`Withdrawal fee updated to ${newFee} BNB!`);
        } catch (error) {
            console.error("Error updating withdrawal fee:", error);
            alert("Failed to update withdrawal fee: " + (error.message || "Unknown error"));
        } finally {
            showLoading(false);
        }
    }

    async function updateMaxConversionLimit() {
        if (!contract || !account) return alert("Connect wallet first!");
        const newLimit = parseFloat(document.getElementById("newMaxConversionLimit").value) || 0;
        const key = document.getElementById("maxConversionLimitKey").value;
        if (newLimit <= 0) return alert("Enter a valid limit!");
        if (!key) return alert("Enter the secret key!");
        try {
            showLoading(true);
            const newLimitInWei = ethers.utils.parseUnits(newLimit.toString(), 18);
            const tx = await contract.updateMaxConversionLimit(newLimitInWei, key, { gasLimit: 200000 });
            await tx.wait();
            MAX_CONVERSION_LIMIT = Number(ethers.utils.formatUnits(await contract.maxConversionLimit(), 18));
            alert(`Max conversion limit updated to ${newLimit} BST Points!`);
        } catch (error) {
            console.error("Error updating max conversion limit:", error);
            alert("Failed to update max conversion limit: " + (error.message || "Unknown error"));
        } finally {
            showLoading(false);
        }
    }

    async function updateConversionRatio() {
        if (!contract || !account) return alert("Connect wallet first!");
        const newRatio = parseFloat(document.getElementById("newConversionRatio").value) || 0;
        const key = document.getElementById("conversionRatioKey").value;
        if (newRatio <= 0) return alert("Enter a valid ratio!");
        if (!key) return alert("Enter the secret key!");
        try {
            showLoading(true);
            const newRatioInWei = ethers.utils.parseUnits(newRatio.toString(), 18);
            const tx = await contract.updateConversionRatio(newRatioInWei, key, { gasLimit: 200000 });
            await tx.wait();
            CONVERSION_RATIO = Number(ethers.utils.formatUnits(await contract.conversionRatio(), 18));
            alert(`Conversion ratio updated to ${newRatio}!`);
        } catch (error) {
            console.error("Error updating conversion ratio:", error);
            alert("Failed to update conversion ratio: " + (error.message || "Unknown error"));
        } finally {
            showLoading(false);
        }
    }

    async function updateLockReward() {
        if (!contract || !account) return alert("Connect wallet first!");
        const period = parseInt(document.getElementById("lockRewardPeriod").value);
        const newRate = parseFloat(document.getElementById("newLockRewardRate").value) || 0;
        const key = document.getElementById("lockRewardKey").value;
        if (newRate < 0) return alert("Enter a valid rate!");
        if (!key) return alert("Enter the secret key!");
        try {
            showLoading(true);
            const newRateInWei = ethers.utils.parseUnits(newRate.toString(), 18);
            const tx = await contract.updateLockReward(period, newRateInWei, key, { gasLimit: 200000 });
            await tx.wait();
            alert(`Lock reward for period ${period} updated to ${newRate}!`);
        } catch (error) {
            console.error("Error updating lock reward:", error);
            alert("Failed to update lock reward: " + (error.message || "Unknown error"));
        } finally {
            showLoading(false);
        }
    }

    async function updateGameOracle() {
        if (!contract || !account) return alert("Connect wallet first!");
        const newOracle = document.getElementById("newGameOracle").value;
        const key = document.getElementById("gameOracleKey").value;
        if (!ethers.utils.isAddress(newOracle)) return alert("Enter a valid address!");
        if (!key) return alert("Enter the secret key!");
        try {
            showLoading(true);
            const tx = await contract.updateGameOracle(newOracle, key, { gasLimit: 200000 });
            await tx.wait();
            alert(`Game oracle updated to ${newOracle}!`);
        } catch (error) {
            console.error("Error updating game oracle:", error);
            alert("Failed to update game oracle: " + (error.message || "Unknown error"));
        } finally {
            showLoading(false);
        }
    }

    async function updateOwnerWallet() {
        if (!contract || !account) return alert("Connect wallet first!");
        const newWallet = document.getElementById("newOwnerWallet").value;
        const key = document.getElementById("ownerWalletKey").value;
        if (!ethers.utils.isAddress(newWallet)) return alert("Enter a valid address!");
        if (!key) return alert("Enter the secret key!");
        try {
            showLoading(true);
            const tx = await contract.updateOwnerWallet(newWallet, key, { gasLimit: 200000 });
            await tx.wait();
            alert(`Owner wallet updated to ${newWallet}!`);
        } catch (error) {
            console.error("Error updating owner wallet:", error);
            alert("Failed to update owner wallet: " + (error.message || "Unknown error"));
        } finally {
            showLoading(false);
        }
    }

    async function updateSecretKey() {
        if (!contract || !account) return alert("Connect wallet first!");
        const newKey = document.getElementById("newSecretKey").value;
        const currentKey = document.getElementById("currentSecretKey").value;
        if (!newKey || !currentKey) return alert("Enter both keys!");
        try {
            showLoading(true);
            const tx = await contract.updateSecretKey(newKey, currentKey, { gasLimit: 200000 });
            await tx.wait();
            alert("Secret key updated successfully!");
        } catch (error) {
            console.error("Error updating secret key:", error);
            alert("Failed to update secret key: " + (error.message || "Unknown error"));
        } finally {
            showLoading(false);
        }
    }

    // Event Listeners
    document.getElementById("connectWallet").addEventListener("click", connectWallet);
    document.getElementById("disconnectWallet").addEventListener("click", disconnectWallet);
    document.getElementById("playGame").addEventListener("click", resetGame);
    document.getElementById("enterFullscreen").addEventListener("click", enterFullscreen);
    document.getElementById("claimWelcomeBonus").addEventListener("click", claimWelcomeBonus);
    document.getElementById("claimDailyLoginReward").addEventListener("click", claimDailyLoginReward);
    document.getElementById("claimSocialMediaShareReward").addEventListener("click", claimSocialMediaShareReward);
    document.getElementById("convertPointsToTokens").addEventListener("click", convertPointsToTokens);
    document.getElementById("stakeTokens").addEventListener("click", stakeTokens);
    document.getElementById("unstakeTokens").addEventListener("click", unstakeTokens);
    document.getElementById("mintTokens").addEventListener("click", mintTokens);
    document.getElementById("burnTokens").addEventListener("click", burnTokens);
    document.getElementById("updateWelcomeBonus").addEventListener("click", updateWelcomeBonus);
    document.getElementById("updateReferralCommissionRate").addEventListener("click", updateReferralCommissionRate);
    document.getElementById("updateWithdrawalFee").addEventListener("click", updateWithdrawalFee);
    document.getElementById("updateMaxConversionLimit").addEventListener("click", updateMaxConversionLimit);
    document.getElementById("updateConversionRatio").addEventListener("click", updateConversionRatio);
    document.getElementById("updateLockReward").addEventListener("click", updateLockReward);
    document.getElementById("updateGameOracle").addEventListener("click", updateGameOracle);
    document.getElementById("updateOwnerWallet").addEventListener("click", updateOwnerWallet);
    document.getElementById("updateSecretKey").addEventListener("click", updateSecretKey);

    // Keyboard Controls
    document.addEventListener("keydown", (e) => {
        if (!isGameRunning) return;
        switch (e.key) {
            case "ArrowUp":
                if (direction !== "down") direction = "up";
                break;
            case "ArrowDown":
                if (direction !== "up") direction = "down";
                break;
            case "ArrowLeft":
                if (direction !== "right") direction = "left";
                break;
            case "ArrowRight":
                if (direction !== "left") direction = "right";
                break;
        }
    });

    // Initial Setup
    updateCanvasSize();
    generateBoxes();
    draw();
    updatePlayerHistoryUI();
});
