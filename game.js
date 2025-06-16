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

    const CONTRACT_ADDRESS = "0xc05697BA9841Bd09f5F41BaDD121d3c29B20642A"; // Update after deployment
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
];

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
        const connectWalletBtn =
