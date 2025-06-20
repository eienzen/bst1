console.log("DOM fully loaded, initializing game...");

if (typeof ethers === "undefined") {
    alert("Ethers.js library failed to load. Please refresh the page or check your internet connection.");
    throw new Error("Ethers.js not loaded");
}

const CONTRACT_ADDRESS = "0x362815FaEf041533FcD9da66a5c0643Bf38c6ED9";
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
				"name": "_unlockAmount",
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

let provider, signer, contract, userAddress;
let isGameRunning = false;
let snake = [{ x: 5, y: 5 }];
let food = { x: 10, y: 10 };
let direction = "right";
let boxesEaten = 0;
let pendingPoints = 0;
let gamesPlayed = 0;
let totalPoints = 0;
let totalRewards = 0;
let totalReferrals = 0;
let referralPoints = 0;
let walletBalance = 0;
let flexibleStakeBalance = 0;
let lockedStakeBalances = { "60 Days": 0, "180 Days": 0, "365 Days": 0 };

const gridWidth = 20;
const gridHeight = 20;
const moveInterval = 200; // Fixed speed interval in milliseconds
let gridSize;

const canvas = document.getElementById("gameCanvas");
const ctx = canvas ? canvas.getContext("2d") : null;
const boxesEatenDisplay = document.getElementById("boxesEaten");
const pendingPointsDisplay = document.getElementById("pendingPoints");
const gamesPlayedDisplay = document.getElementById("gamesPlayed");
const totalPointsDisplay = document.getElementById("totalPoints");
const totalRewardsDisplay = document.getElementById("totalRewards");
const totalReferralsDisplay = document.getElementById("totalReferrals");
const referralPointsDisplay = document.getElementById("referralPoints");
const walletBalanceDisplay = document.getElementById("walletBalance");
const flexibleStakeBalanceDisplay = document.getElementById("flexibleStakeBalance");
const lockedStakeBalanceDisplay = document.getElementById("lockedStakeBalance");
const rewardHistoryList = document.getElementById("rewardHistory");
const taskHistoryList = document.getElementById("taskHistory");
const stakingHistoryList = document.getElementById("stakingHistory");
const gameOverPopup = document.getElementById("gameOverPopup");
const finalBoxesEatenDisplay = document.getElementById("finalBoxesEaten");
const finalPointsDisplay = document.getElementById("finalPoints");
const eatingSound = document.getElementById("eatingSound");
const gameOverSound = document.getElementById("gameOverSound");
const victorySound = document.getElementById("victorySound");
const loadingIndicator = document.getElementById("loadingIndicator");

if (!canvas || !ctx) {
    console.error("Canvas or context not available!");
    throw new Error("Canvas not initialized");
}

function showLoading(show) {
    if (loadingIndicator) {
        loadingIndicator.style.display = show ? "block" : "none";
    }
}

function updateCanvasSize() {
    if (!canvas) return console.error("Canvas not available!");
    const screenWidth = window.innerWidth * 0.9;
    const screenHeight = window.innerHeight * 0.5;
    gridSize = Math.min(screenWidth / gridWidth, screenHeight / gridHeight);
    canvas.width = gridSize * gridWidth;
    canvas.height = gridSize * gridHeight;
    canvas.style.width = `${canvas.width}px`;
    canvas.style.height = `${canvas.height}px`;
    draw();
}

window.addEventListener("resize", updateCanvasSize);

function draw() {
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = "#00ff00";
    snake.forEach(segment => {
        ctx.fillRect(segment.x * gridSize, segment.y * gridSize, gridSize - 2, gridSize - 2);
    });

    ctx.fillStyle = "#ff0000";
    ctx.fillRect(food.x * gridSize, food.y * gridSize, gridSize - 2, gridSize - 2);
}

function moveSnake() {
    const head = { x: snake[0].x, y: snake[0].y };

    if (direction === "right") head.x++;
    if (direction === "left") head.x--;
    if (direction === "up") head.y--;
    if (direction === "down") head.y++;

    if (head.x < 0 || head.x >= gridWidth || head.y < 0 || head.y >= gridHeight || snake.some(segment => segment.x === head.x && segment.y === head.y)) {
        gameOver();
        return;
    }

    snake.unshift(head);

    if (head.x === food.x && head.y === food.y) {
        boxesEaten++;
        pendingPoints += 10;
        if (boxesEatenDisplay) boxesEatenDisplay.textContent = `Boxes Eaten: ${boxesEaten}`;
        if (pendingPointsDisplay) pendingPointsDisplay.textContent = `Pending Points: ${pendingPoints} BST Points`;
        if (eatingSound) eatingSound.play().catch(err => console.warn("Eating sound failed:", err));
        spawnFood();
    } else {
        snake.pop();
    }

    draw();
}

function spawnFood() {
    food.x = Math.floor(Math.random() * gridWidth);
    food.y = Math.floor(Math.random() * gridHeight);
    while (snake.some(segment => segment.x === food.x && segment.y === food.y)) {
        food.x = Math.floor(Math.random() * gridWidth);
        food.y = Math.floor(Math.random() * gridHeight);
    }
}

function gameOver() {
    isGameRunning = false;
    if (gameOverSound) gameOverSound.play().catch(err => console.warn("Game over sound failed:", err));
    if (gameOverPopup) gameOverPopup.style.display = "block";
    if (finalBoxesEatenDisplay) finalBoxesEatenDisplay.textContent = `Boxes Eaten: ${boxesEaten}`;
    if (finalPointsDisplay) finalPointsDisplay.textContent = `Earned Points: ${pendingPoints} BST Points`;
    updatePlayerStats();
}

async function updatePlayerStats() {
    if (!contract || !userAddress) return;
    try {
        const playerData = await contract.playerHistory(userAddress);
        const internalBalance = await contract.getInternalBalance(userAddress);
        const balance = await contract.balanceOf(userAddress);
        const rewards = await contract.getRewardHistory(userAddress);

        gamesPlayed = Number(playerData.gamesPlayed) + (isGameRunning ? 0 : 1);
        totalPoints = Number(internalBalance);
        totalRewards = Number(playerData.totalRewards);
        totalReferrals = Number(playerData.totalReferrals);
        referralPoints = Number(playerData.referralRewards);
        walletBalance = Number(balance);
        flexibleStakeBalance = Number(playerData.flexibleStakeBalance);

        const lockPeriods = ["60 Days", "180 Days", "365 Days"];
        for (let i = 0; i < lockPeriods.length; i++) {
            const balance = await contract.getLockedStakeBalance(userAddress, i + 1);
            lockedStakeBalances[lockPeriods[i]] = Number(balance);
        }

        if (gamesPlayedDisplay) gamesPlayedDisplay.textContent = `Games Played: ${gamesPlayed}`;
        if (totalPointsDisplay) totalPointsDisplay.textContent = `Total Points: ${totalPoints} BST Points`;
        if (totalRewardsDisplay) totalRewardsDisplay.textContent = `Total Rewards: ${totalRewards} BST Tokens`;
        if (totalReferralsDisplay) totalReferralsDisplay.textContent = `Total Referrals: ${totalReferrals}`;
        if (referralPointsDisplay) referralPointsDisplay.textContent = `Referral Points: ${referralPoints} BST Points`;
        if (walletBalanceDisplay) walletBalanceDisplay.textContent = `Wallet Balance: ${walletBalance} BST Tokens`;
        if (flexibleStakeBalanceDisplay) flexibleStakeBalanceDisplay.textContent = `Flexible Stake Balance: ${flexibleStakeBalance} BST Tokens`;
        if (lockedStakeBalanceDisplay) {
            lockedStakeBalanceDisplay.textContent = `Locked Stake Balances: 60 Days: ${lockedStakeBalances["60 Days"]}, 180 Days: ${lockedStakeBalances["180 Days"]}, 365 Days: ${lockedStakeBalances["365 Days"]}`;
        }

        if (rewardHistoryList) {
            rewardHistoryList.innerHTML = "";
            rewards.forEach(reward => {
                const li = document.createElement("li");
                li.textContent = `Reward: ${reward.amount} BST Tokens, Type: ${reward.rewardType}, Referee: ${reward.referee}, Time: ${new Date(Number(reward.timestamp) * 1000).toLocaleString()}`;
                rewardHistoryList.appendChild(li);
            });
        }
    } catch (error) {
        console.error("Error updating player stats:", error);
    }
}

document.addEventListener("keydown", (e) => {
    if (!isGameRunning) return;
    if (e.key === "ArrowRight" && direction !== "left") direction = "right";
    if (e.key === "ArrowLeft" && direction !== "right") direction = "left";
    if (e.key === "ArrowUp" && direction !== "down") direction = "up";
    if (e.key === "ArrowDown" && direction !== "up") direction = "down";
});

let touchStartX = 0;
let touchStartY = 0;

canvas.addEventListener("touchstart", (e) => {
    touchStartX = e.touches[0].clientX;
    touchStartY = e.touches[0].clientY;
}, { passive: true });

canvas.addEventListener("touchmove", (e) => {
    if (!isGameRunning) return;
    e.preventDefault();
    const touchEndX = e.touches[0].clientX;
    const touchEndY = e.touches[0].clientY;
    const deltaX = touchEndX - touchStartX;
    const deltaY = touchEndY - touchStartY;

    if (Math.abs(deltaX) > Math.abs(deltaY)) {
        if (deltaX > 0 && direction !== "left") direction = "right";
        else if (deltaX < 0 && direction !== "right") direction = "left";
    } else {
        if (deltaY > 0 && direction !== "up") direction = "down";
        else if (deltaY < 0 && direction !== "down") direction = "up";
    }
    touchStartX = touchEndX;
    touchStartY = touchEndY;
}, { passive: false });

async function connectWallet() {
    if (!window.ethereum) {
        alert("Please install a Web3 wallet like MetaMask or Trust Wallet!");
        return;
    }

    try {
        showLoading(true);
        provider = new ethers.providers.Web3Provider(window.ethereum);
        const accounts = await provider.send("eth_requestAccounts", []);
        userAddress = accounts[0];
        signer = provider.getSigner();
        contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer);

        document.getElementById("walletAddress").textContent = `Wallet: ${userAddress}`;
        document.getElementById("connectWallet").style.display = "none";
        document.getElementById("disconnectWallet").style.display = "inline-block";

        await updatePlayerStats();
    } catch (error) {
        console.error("Wallet connection error:", error);
        alert("Failed to connect wallet: " + error.message);
    } finally {
        showLoading(false);
    }
}

function disconnectWallet() {
    provider = null;
    signer = null;
    contract = null;
    userAddress = null;

    document.getElementById("walletAddress").textContent = "Wallet: Not Connected";
    document.getElementById("connectWallet").style.display = "inline-block";
    document.getElementById("disconnectWallet").style.display = "none";

    gamesPlayed = 0;
    totalPoints = 0;
    totalRewards = 0;
    totalReferrals = 0;
    referralPoints = 0;
    walletBalance = 0;
    flexibleStakeBalance = 0;
    lockedStakeBalances = { "60 Days": 0, "180 Days": 0, "365 Days": 0 };

    if (gamesPlayedDisplay) gamesPlayedDisplay.textContent = `Games Played: ${gamesPlayed}`;
    if (totalPointsDisplay) totalPointsDisplay.textContent = `Total Points: ${totalPoints} BST Points`;
    if (totalRewardsDisplay) totalRewardsDisplay.textContent = `Total Rewards: ${totalRewards} BST Tokens`;
    if (totalReferralsDisplay) totalReferralsDisplay.textContent = `Total Referrals: ${totalReferrals}`;
    if (referralPointsDisplay) referralPointsDisplay.textContent = `Referral Points: ${referralPoints} BST Points`;
    if (walletBalanceDisplay) walletBalanceDisplay.textContent = `Wallet Balance: ${walletBalance} BST Tokens`;
    if (flexibleStakeBalanceDisplay) flexibleStakeBalanceDisplay.textContent = `Flexible Stake Balance: ${flexibleStakeBalance} BST Tokens`;
    if (lockedStakeBalanceDisplay) {
        lockedStakeBalanceDisplay.textContent = `Locked Stake Balances: 60 Days: ${lockedStakeBalances["60 Days"]}, 180 Days: ${lockedStakeBalances["180 Days"]}, 365 Days: ${lockedStakeBalances["365 Days"]}`;
    }
    if (rewardHistoryList) rewardHistoryList.innerHTML = "";
    if (taskHistoryList) taskHistoryList.innerHTML = "";
    if (stakingHistoryList) stakingHistoryList.innerHTML = "";
}

document.getElementById("connectWallet").addEventListener("click", connectWallet);
document.getElementById("disconnectWallet").addEventListener("click", disconnectWallet);

document.getElementById("playGame").addEventListener("click", () => {
    if (!userAddress) {
        alert("Please connect your wallet first!");
        return;
    }
    if (isGameRunning) return;
    isGameRunning = true;
    snake = [{ x: 5, y: 5 }];
    direction = "right";
    boxesEaten = 0;
    pendingPoints = 0;
    if (boxesEatenDisplay) boxesEatenDisplay.textContent = `Boxes Eaten: ${boxesEaten}`;
    if (pendingPointsDisplay) pendingPointsDisplay.textContent = `Pending Points: ${pendingPoints} BST Points`;
    spawnFood();
    draw();
    const gameLoop = setInterval(() => {
        if (isGameRunning) moveSnake();
    }, moveInterval);
    // Clear interval on game over
    document.getElementById("closePopup").addEventListener("click", () => clearInterval(gameLoop), { once: true });
});

document.getElementById("closePopup").addEventListener("click", () => {
    if (gameOverPopup) gameOverPopup.style.display = "none";
});

document.getElementById("enterFullscreen").addEventListener("click", () => {
    if (canvas.requestFullscreen) {
        canvas.requestFullscreen();
    } else {
        alert("Fullscreen is not supported in this browser.");
    }
});

async function claimWelcomeBonus() {
    if (!contract || !userAddress) {
        alert("Please connect your wallet first!");
        return;
    }
    try {
        showLoading(true);
        const hasClaimed = await contract.playerHistory(userAddress).then(data => data.hasClaimedWelcomeBonus);
        if (hasClaimed) {
            alert("Welcome bonus already claimed!");
            return;
        }
        const bonus = await contract.welcomeBonus();
        await contract.claimWelcomeBonus({ gasLimit: 300000 });
        await updatePlayerStats();
        const li = document.createElement("li");
        li.textContent = `Claimed Welcome Bonus of ${bonus} BST Tokens at ${new Date().toLocaleString()}`;
        if (taskHistoryList) taskHistoryList.appendChild(li);
        alert("Welcome bonus claimed successfully!");
    } catch (error) {
        console.error("Error claiming welcome bonus:", error);
        alert("Failed to claim welcome bonus: " + error.message);
    } finally {
        showLoading(false);
    }
}

async function claimDailyLoginReward() {
    if (!contract || !userAddress) {
        alert("Please connect your wallet first!");
        return;
    }
    try {
        showLoading(true);
        const li = document.createElement("li");
        li.textContent = `Claimed Daily Login Reward at ${new Date().toLocaleString()}`;
        if (taskHistoryList) taskHistoryList.appendChild(li);
        alert("Daily login reward claimed successfully!");
    } catch (error) {
        console.error("Error claiming daily login reward:", error);
        alert("Failed to claim daily login reward: " + error.message);
    } finally {
        showLoading(false);
    }
}

async function claimSocialMediaShareReward() {
    if (!contract || !userAddress) {
        alert("Please connect your wallet first!");
        return;
    }
    try {
        showLoading(true);
        const li = document.createElement("li");
        li.textContent = `Claimed Social Media Share Reward at ${new Date().toLocaleString()}`;
        if (taskHistoryList) taskHistoryList.appendChild(li);
        alert("Social media share reward claimed successfully!");
    } catch (error) {
        console.error("Error claiming social media share reward:", error);
        alert("Failed to claim social media share reward: " + error.message);
    } finally {
        showLoading(false);
    }
}

async function convertPointsToTokens() {
    if (!contract || !userAddress) {
        alert("Please connect your wallet first!");
        return;
    }
    const points = Number(document.getElementById("convertPointsAmount").value);
    if (!points || points <= 0) {
        alert("Please enter a valid points amount!");
        return;
    }
    const maxLimit = await contract.maxConversionLimit();
    if (points > maxLimit) {
        alert(`Maximum conversion limit is ${maxLimit} points per transaction!`);
        return;
    }
    const referrer = document.getElementById("referrerAddress").value || "0x0000000000000000000000000000000000000000";
    try {
        showLoading(true);
        const withdrawalFee = await contract.withdrawalFeeInBnb();
        const tx = await contract.convertPointsToTokens(points, userAddress, referrer, { value: withdrawalFee, gasLimit: 500000 });
        await tx.wait();
        pendingPoints -= points;
        if (pendingPointsDisplay) pendingPointsDisplay.textContent = `Pending Points: ${pendingPoints} BST Points`;
        await updatePlayerStats();
        const commissionRate = await contract.referralCommissionRate();
        const referrerPoints = Math.floor(points * commissionRate / 100);
        if (referrer !== userAddress && ethers.utils.isAddress(referrer)) {
            await contract.convertPointsToTokens(referrerPoints, referrer, "0x0000000000000000000000000000000000000000", { value: withdrawalFee });
        }
        alert("Points converted to tokens successfully!");
    } catch (error) {
        console.error("Error converting points to tokens:", error);
        alert("Failed to convert points: " + error.message);
    } finally {
        showLoading(false);
    }
}

async function stakeTokens() {
    if (!contract || !userAddress) {
        alert("Please connect your wallet first!");
        return;
    }
    const amount = Number(document.getElementById("stakeAmount").value);
    const lockPeriod = Number(document.getElementById("lockPeriod").value);
    if (!amount || amount <= 0) {
        alert("Please enter a valid amount to stake!");
        return;
    }
    try {
        showLoading(true);
        const tx = await contract.stakeTokens(amount, lockPeriod, { gasLimit: 400000 });
        await tx.wait();
        await updatePlayerStats();
        const li = document.createElement("li");
        const periodText = lockPeriod === 0 ? "Flexible" : `${["", "60 Days", "180 Days", "365 Days"][lockPeriod]}`;
        li.textContent = `Staked ${amount} BST Tokens for ${periodText} at ${new Date().toLocaleString()}`;
        if (stakingHistoryList) stakingHistoryList.appendChild(li);
        alert("Tokens staked successfully!");
    } catch (error) {
        console.error("Error staking tokens:", error);
        alert("Failed to stake tokens: " + error.message);
    } finally {
        showLoading(false);
    }
}

async function unstakeTokens() {
    if (!contract || !userAddress) {
        alert("Please connect your wallet first!");
        return;
    }
    const amount = Number(document.getElementById("unstakeAmount").value);
    const lockPeriod = Number(document.getElementById("unlockPeriod").value);
    if (!amount || amount <= 0) {
        alert("Please enter a valid amount to unstake!");
        return;
    }
    try {
        showLoading(true);
        const tx = await contract.unstakeTokens(amount, lockPeriod, { gasLimit: 400000 });
        await tx.wait();
        await updatePlayerStats();
        const li = document.createElement("li");
        const periodText = lockPeriod === 0 ? "Flexible" : `${["", "60 Days", "180 Days", "365 Days"][lockPeriod]}`;
        li.textContent = `Unstaked ${amount} BST Tokens from ${periodText} at ${new Date().toLocaleString()}`;
        if (stakingHistoryList) stakingHistoryList.appendChild(li);
        alert("Tokens unstaked successfully!");
    } catch (error) {
        console.error("Error unstaking tokens:", error);
        alert("Failed to unstake tokens: " + error.message);
    } finally {
        showLoading(false);
    }
}

async function withdrawPendingRewards() {
    if (!contract || !userAddress) {
        alert("Please connect your wallet first!");
        return;
    }
    const amount = Number(document.getElementById("withdrawRewardAmount").value);
    if (!amount || amount <= 0) {
        alert("Please enter a valid amount to withdraw!");
        return;
    }
    try {
        showLoading(true);
        const withdrawalFee = await contract.withdrawalFeeInBnb();
        const tx = await contract.withdrawPendingRewards(amount, { value: withdrawalFee, gasLimit: 500000 });
        await tx.wait();
        await updatePlayerStats();
        alert("Pending rewards withdrawn successfully!");
    } catch (error) {
        console.error("Error withdrawing pending rewards:", error);
        alert("Failed to withdraw pending rewards: " + error.message);
    } finally {
        showLoading(false);
    }
}

async function mintTokens() {
    if (!contract || !userAddress) {
        alert("Please connect your wallet first!");
        return;
    }
    const amount = Number(document.getElementById("mintAmount").value);
    const key = document.getElementById("mintKey").value;
    if (!amount || amount <= 0 || !key) {
        alert("Please enter a valid amount and secret key!");
        return;
    }
    try {
        showLoading(true);
        const tx = await contract.mintTokens(amount, key, { gasLimit: 400000 });
        await tx.wait();
        await updatePlayerStats();
        alert("Tokens minted successfully!");
    } catch (error) {
        console.error("Error minting tokens:", error);
        alert("Failed to mint tokens: " + error.message);
    } finally {
        showLoading(false);
    }
}

async function burnTokens() {
    if (!contract || !userAddress) {
        alert("Please connect your wallet first!");
        return;
    }
    const amount = Number(document.getElementById("burnAmount").value);
    const key = document.getElementById("burnKey").value;
    if (!amount || amount <= 0 || !key) {
        alert("Please enter a valid amount and secret key!");
        return;
    }
    try {
        showLoading(true);
        const tx = await contract.burnTokens(amount, key, { gasLimit: 400000 });
        await tx.wait();
        await updatePlayerStats();
        alert("Tokens burned successfully!");
    } catch (error) {
        console.error("Error burning tokens:", error);
        alert("Failed to burn tokens: " + error.message);
    } finally {
        showLoading(false);
    }
}

async function updateWelcomeBonus() {
    if (!contract || !userAddress) {
        alert("Please connect your wallet first!");
        return;
    }
    const newBonus = Number(document.getElementById("newWelcomeBonus").value);
    const key = document.getElementById("welcomeBonusKey").value;
    if (!newBonus || newBonus <= 0 || !key) {
        alert("Please enter a valid bonus amount and secret key!");
        return;
    }
    try {
        showLoading(true);
        const tx = await contract.updateWelcomeBonus(newBonus, key, { gasLimit: 400000 });
        await tx.wait();
        alert("Welcome bonus updated successfully!");
    } catch (error) {
        console.error("Error updating welcome bonus:", error);
        alert("Failed to update welcome bonus: " + error.message);
    } finally {
        showLoading(false);
    }
}

async function updateReferralCommissionRate() {
    if (!contract || !userAddress) {
        alert("Please connect your wallet first!");
        return;
    }
    const newRate = Number(document.getElementById("newReferralRate").value);
    const key = document.getElementById("referralRateKey").value;
    if (!newRate || newRate <= 0 || !key) {
        alert("Please enter a valid rate and secret key!");
        return;
    }
    try {
        showLoading(true);
        const tx = await contract.updateReferralCommissionRate(newRate, key, { gasLimit: 400000 });
        await tx.wait();
        alert("Referral commission rate updated successfully!");
    } catch (error) {
        console.error("Error updating referral commission rate:", error);
        alert("Failed to update referral commission rate: " + error.message);
    } finally {
        showLoading(false);
    }
}

async function updateWithdrawalFee() {
    if (!contract || !userAddress) {
        alert("Please connect your wallet first!");
        return;
    }
    const newFee = Number(document.getElementById("newWithdrawalFee").value);
    const key = document.getElementById("withdrawalFeeKey").value;
    if (!newFee || newFee <= 0 || !key) {
        alert("Please enter a valid fee and secret key!");
        return;
    }
    try {
        showLoading(true);
        const tx = await contract.updateWithdrawalFee(newFee, key, { gasLimit: 400000 });
        await tx.wait();
        alert("Withdrawal fee updated successfully!");
    } catch (error) {
        console.error("Error updating withdrawal fee:", error);
        alert("Failed to update withdrawal fee: " + error.message);
    } finally {
        showLoading(false);
    }
}

async function updateMaxConversionLimit() {
    if (!contract || !userAddress) {
        alert("Please connect your wallet first!");
        return;
    }
    const newLimit = Number(document.getElementById("newMaxConversionLimit").value);
    const key = document.getElementById("maxConversionLimitKey").value;
    if (!newLimit || newLimit <= 0 || !key) {
        alert("Please enter a valid limit and secret key!");
        return;
    }
    try {
        showLoading(true);
        const tx = await contract.updateMaxConversionLimit(newLimit, key, { gasLimit: 400000 });
        await tx.wait();
        alert("Max conversion limit updated successfully!");
    } catch (error) {
        console.error("Error updating max conversion limit:", error);
        alert("Failed to update max conversion limit: " + error.message);
    } finally {
        showLoading(false);
    }
}

async function updateConversionRatio() {
    if (!contract || !userAddress) {
        alert("Please connect your wallet first!");
        return;
    }
    const newRatio = Number(document.getElementById("newConversionRatio").value);
    const key = document.getElementById("conversionRatioKey").value;
    if (!newRatio || newRatio <= 0 || !key) {
        alert("Please enter a valid ratio and secret key!");
        return;
    }
    try {
        showLoading(true);
        const tx = await contract.updateConversionRatio(newRatio, key, { gasLimit: 400000 });
        await tx.wait();
        alert("Conversion ratio updated successfully!");
    } catch (error) {
        console.error("Error updating conversion ratio:", error);
        alert("Failed to update conversion ratio: " + error.message);
    } finally {
        showLoading(false);
    }
}

async function updateLockReward() {
    if (!contract || !userAddress) {
        alert("Please connect your wallet first!");
        return;
    }
    const period = Number(document.getElementById("lockRewardPeriod").value);
    const newRate = Number(document.getElementById("newLockRewardRate").value);
    const key = document.getElementById("lockRewardKey").value;
    if (!newRate || newRate <= 0 || !key) {
        alert("Please enter a valid rate and secret key!");
        return;
    }
    try {
        showLoading(true);
        const tx = await contract.updateLockReward(period, newRate, key, { gasLimit: 400000 });
        await tx.wait();
        alert("Lock reward updated successfully!");
    } catch (error) {
        console.error("Error updating lock reward:", error);
        alert("Failed to update lock reward: " + error.message);
    } finally {
        showLoading(false);
    }
}

async function updateGameOracle() {
    if (!contract || !userAddress) {
        alert("Please connect your wallet first!");
        return;
    }
    const newOracle = document.getElementById("newGameOracle").value;
    const key = document.getElementById("gameOracleKey").value;
    if (!ethers.utils.isAddress(newOracle) || !key) {
        alert("Please enter a valid oracle address and secret key!");
        return;
    }
    try {
        showLoading(true);
        const tx = await contract.updateGameOracle(newOracle, key, { gasLimit: 400000 });
        await tx.wait();
        alert("Game oracle updated successfully!");
    } catch (error) {
        console.error("Error updating game oracle:", error);
        alert("Failed to update game oracle: " + error.message);
    } finally {
        showLoading(false);
    }
}

async function updateOwnerWallet() {
    if (!contract || !userAddress) {
        alert("Please connect your wallet first!");
        return;
    }
    const newWallet = document.getElementById("newOwnerWallet").value;
    const key = document.getElementById("ownerWalletKey").value;
    if (!ethers.utils.isAddress(newWallet) || !key) {
        alert("Please enter a valid wallet address and secret key!");
        return;
    }
    try {
        showLoading(true);
        const tx = await contract.updateOwnerWallet(newWallet, key, { gasLimit: 400000 });
        await tx.wait();
        alert("Owner wallet updated successfully!");
    } catch (error) {
        console.error("Error updating owner wallet:", error);
        alert("Failed to update owner wallet: " + error.message);
    } finally {
        showLoading(false);
    }
}

async function updateSecretKey() {
    if (!contract || !userAddress) {
        alert("Please connect your wallet first!");
        return;
    }
    const newKey = document.getElementById("newSecretKey").value;
    const currentKey = document.getElementById("currentSecretKey").value;
    if (!newKey || !currentKey) {
        alert("Please enter both new and current secret keys!");
        return;
    }
    try {
        showLoading(true);
        const tx = await contract.updateSecretKey(newKey, currentKey, { gasLimit: 400000 });
        await tx.wait();
        alert("Secret key updated successfully!");
    } catch (error) {
        console.error("Error updating secret key:", error);
        alert("Failed to update secret key: " + error.message);
    } finally {
        showLoading(false);
    }
}

document.getElementById("claimWelcomeBonus").addEventListener("click", claimWelcomeBonus);
document.getElementById("claimDailyLoginReward").addEventListener("click", claimDailyLoginReward);
document.getElementById("claimSocialMediaShareReward").addEventListener("click", claimSocialMediaShareReward);
document.getElementById("convertPointsToTokens").addEventListener("click", convertPointsToTokens);
document.getElementById("stakeTokens").addEventListener("click", stakeTokens);
document.getElementById("unstakeTokens").addEventListener("click", unstakeTokens);
document.getElementById("withdrawPendingRewards").addEventListener("click", withdrawPendingRewards);
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

updateCanvasSize();
draw();
