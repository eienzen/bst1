const contractAddress = "0x7cB16203326C87075789e8A484044Ae8f428A46A";
const abi = [
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
		"inputs": [],
		"name": "renounceOwnership",
		"outputs": [],
		"stateMutability": "nonpayable",
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

let provider, signer, contract, account, canvasSize, p5Instance;

window.onload = function() {
    init();
    setup();
    const elements = {
        connectWallet: document.getElementById("connectWallet"),
        disconnectWallet: document.getElementById("disconnectWallet"),
        playGame: document.getElementById("playGame"),
        claimWelcomeBonus: document.getElementById("claimWelcomeBonus"),
        claimDailyLoginReward: document.getElementById("claimDailyLoginReward"),
        claimSocialMediaShareReward: document.getElementById("claimSocialMediaShareReward"),
        getReferralLink: document.getElementById("getReferralLink"),
        convertPoints: document.getElementById("convertPoints"),
        stakeTokens: document.getElementById("stakeTokens"),
        unstakeTokens: document.getElementById("unstakeTokens"),
        closePopup: document.getElementById("closePopup")
    };

    elements.connectWallet.addEventListener("click", init);
    elements.disconnectWallet.addEventListener("click", disconnect);
    elements.playGame.addEventListener("click", resetGame);
    elements.claimWelcomeBonus.addEventListener("click", async () => {
        showLoading();
        try {
            const tx = await contract.claimWelcomeBonus({ gasLimit: 300000 });
            await tx.wait();
            alert("Welcome bonus claimed!");
            await updatePlayerInfo();
        } catch (error) {
            alert("Error claiming bonus: " + error.message);
        } finally {
            hideLoading();
        }
    });
    elements.claimDailyLoginReward.addEventListener("click", async () => {
        showLoading();
        try {
            const tx = await contract.claimDailyLoginReward({ gasLimit: 300000 });
            await tx.wait();
            alert("Daily login reward claimed!");
            await updatePlayerInfo();
        } catch (error) {
            alert("Error claiming daily reward: " + error.message);
        } finally {
            hideLoading();
        }
    });
    elements.claimSocialMediaShareReward.addEventListener("click", async () => {
        showLoading();
        try {
            const tx = await contract.claimSocialMediaShareReward({ gasLimit: 300000 });
            await tx.wait();
            alert("Social media share reward claimed!");
            await updatePlayerInfo();
        } catch (error) {
            alert("Error claiming share reward: " + error.message);
        } finally {
            hideLoading();
        }
    });
    elements.getReferralLink.addEventListener("click", () => {
        const referralLink = `${window.location.origin}?ref=${account}`;
        alert(`Your referral link: ${referralLink}`);
        navigator.clipboard.writeText(referralLink);
    });
    elements.convertPoints.addEventListener("click", async () => {
        showLoading();
        try {
            const amount = parseInt(document.getElementById("convertPointsAmount").value);
            if (!amount || amount <= 0) {
                alert("Please enter a valid amount.");
                return;
            }
            const maxLimit = await contract.maxConversionLimit();
            if (amount > maxLimit.toNumber()) {
                alert(`Maximum conversion limit is ${maxLimit.toNumber()} points per transaction.`);
                return;
            }
            const internalBalance = await contract.getInternalBalance(account);
            if (amount > internalBalance.toNumber()) {
                alert(`You only have ${internalBalance.toNumber()} points available.`);
                return;
            }
            const referrer = new URLSearchParams(window.location.search).get("ref") || "0x0000000000000000000000000000000000000000";
            const tx = await contract.convertPointsToTokens(amount, account, referrer, { value: ethers.utils.parseEther("0.0002"), gasLimit: 300000 });
            await tx.wait();
            alert(`${amount} points converted to tokens!`);
            const commissionRate = await contract.referralCommissionRate();
            if (referrer !== "0x0000000000000000000000000000000000000000") {
                const referrerPoints = (amount * commissionRate.toNumber()) / 100;
                await contract.convertPointsToTokens(referrerPoints, referrer, "0x0000000000000000000000000000000000000000", { value: ethers.utils.parseEther("0.0002"), gasLimit: 300000 });
                alert(`Referrer earned ${referrerPoints} points as commission!`);
            }
            await updatePlayerInfo();
        } catch (error) {
            alert("Error converting points: " + error.message);
        } finally {
            hideLoading();
        }
    });
    elements.stakeTokens.addEventListener("click", async () => {
        showLoading();
        try {
            const amount = parseInt(document.getElementById("stakeAmount").value);
            const lockPeriod = parseInt(document.getElementById("lockPeriod").value);
            if (!amount || amount <= 0) {
                alert("Please enter a valid amount.");
                return;
            }
            const balance = await contract.balanceOf(account);
            if (amount > balance.toNumber()) {
                alert(`You only have ${ethers.utils.formatEther(balance)} BST tokens.`);
                return;
            }
            const tx = await contract.stakeTokens(amount, lockPeriod, { gasLimit: 300000 });
            await tx.wait();
            alert("Tokens staked successfully!");
            await updatePlayerInfo();
        } catch (error) {
            alert("Error staking tokens: " + error.message);
        } finally {
            hideLoading();
        }
    });
    elements.unstakeTokens.addEventListener("click", async () => {
        showLoading();
        try {
            const amount = parseInt(document.getElementById("unstakeAmount").value);
            const lockPeriod = parseInt(document.getElementById("unlockPeriod").value);
            if (!amount || amount <= 0) {
                alert("Please enter a valid amount.");
                return;
            }
            const balance = await contract.getLockedStakeBalance(account, lockPeriod);
            if (amount > balance.toNumber()) {
                alert(`You only have ${ethers.utils.formatEther(balance)} BST tokens locked for this period.`);
                return;
            }
            const tx = await contract.unstakeTokens(amount, lockPeriod, { gasLimit: 300000 });
            await tx.wait();
            alert("Tokens unstaked successfully!");
            await updatePlayerInfo();
        } catch (error) {
            alert("Error unstaking tokens: " + error.message);
        } finally {
            hideLoading();
        }
    });
    elements.closePopup.addEventListener("click", () => {
        document.getElementById("gameOverPopup").style.display = "none";
    });
};

async function init() {
    if (window.ethereum) {
        try {
            provider = new ethers.providers.Web3Provider(window.ethereum);
            await provider.send("eth_requestAccounts", []);
            signer = provider.getSigner();
            account = await signer.getAddress();
            contract = new ethers.Contract(contractAddress, abi, signer);
            document.getElementById("walletAddress").textContent = `Wallet: ${account.substring(0, 6)}...${account.substring(account.length - 4)}`;
            document.getElementById("connectWallet").style.display = "none";
            document.getElementById("disconnectWallet").style.display = "inline-block";
            if (account.toLowerCase() === (await contract.owner()).toLowerCase()) {
                document.getElementById("ownerSection").style.display = "block";
            }
            await updatePlayerInfo();
            updateCanvasSize();
        } catch (error) {
            alert("Error connecting to MetaMask: " + error.message);
        }
    } else {
        alert("Please install MetaMask or a Web3 wallet!");
    }
}

function disconnect() {
    document.getElementById("connectWallet").style.display = "inline-block";
    document.getElementById("disconnectWallet").style.display = "none";
    document.getElementById("walletAddress").textContent = "";
    document.getElementById("ownerSection").style.display = "none";
    account = null;
}

let snake, food, score, gameState, direction;
const gridSize = 20;
canvasSize = Math.min(window.innerWidth * 0.9, 400);

function setup() {
    if (!p5Instance) {
        p5Instance = new p5(p => {
            let canvas = p.createCanvas(canvasSize, canvasSize).parent("gameCanvas");
            p.frameRate(8);
            resetGame();
            p.touchStarted = () => handleTouch(p);
        });
    }
}

function updateCanvasSize() {
    canvasSize = Math.min(window.innerWidth * 0.9, 400);
    if (p5Instance) {
        p5Instance.resizeCanvas(canvasSize, canvasSize);
        resetGame();
    }
}

window.addEventListener("resize", updateCanvasSize);

function draw() {
    if (p5Instance) {
        p5Instance.background(10, 10, 35);
        if (gameState === "playing") {
            updateGame();
            drawGame();
        }
    }
}

function resetGame() {
    if (p5Instance) {
        snake = [{ x: 10, y: 10 }];
        food = { x: floor(random(0, canvasSize / gridSize)), y: floor(random(0, canvasSize / gridSize)) };
        score = 0;
        gameState = "playing";
        direction = null;
        document.getElementById("boxesEaten").textContent = `Boxes Eaten: 0`;
        document.getElementById("pendingPoints").textContent = `Pending Points: 0 BST Points`;
    }
}

function updateGame() {
    if (!p5Instance || !snake) return;
    let newHead = { x: snake[0].x, y: snake[0].y };
    if (keyIsDown(LEFT_ARROW) && direction !== "right") direction = "left";
    if (keyIsDown(RIGHT_ARROW) && direction !== "left") direction = "right";
    if (keyIsDown(UP_ARROW) && direction !== "down") direction = "up";
    if (keyIsDown(DOWN_ARROW) && direction !== "up") direction = "down";

    if (direction) {
        if (direction === "left") newHead.x -= 1;
        if (direction === "right") newHead.x += 1;
        if (direction === "up") newHead.y -= 1;
        if (direction === "down") newHead.y += 1;
    }

    newHead.x = (newHead.x + canvasSize / gridSize) % (canvasSize / gridSize);
    newHead.y = (newHead.y + canvasSize / gridSize) % (canvasSize / gridSize);

    if (newHead.x === food.x && newHead.y === food.y) {
        score += 10;
        food = { x: floor(random(0, canvasSize / gridSize)), y: floor(random(0, canvasSize / gridSize)) };
        document.getElementById("eatingSound").play();
        document.getElementById("boxesEaten").textContent = `Boxes Eaten: ${score / 10}`;
        document.getElementById("pendingPoints").textContent = `Pending Points: ${score} BST Points`;
    } else {
        snake.pop();
    }
    snake.unshift(newHead);

    if (snake.slice(1).some(segment => segment.x === newHead.x && segment.y === newHead.y)) {
        gameState = "over";
        document.getElementById("gameOverSound").play();
        showGameOver();
    }
}

function drawGame() {
    if (p5Instance) {
        p5Instance.fill(0, 150, 0);
        for (let i = 0; i < snake.length; i++) {
            p5Instance.rect(snake[i].x * gridSize, snake[i].y * gridSize, gridSize - 2, gridSize - 2, 5);
            if (i === 0) {
                p5Instance.fill(255);
                p5Instance.ellipse(snake[i].x * gridSize + 4, snake[i].y * gridSize + 4, 6, 6);
                p5Instance.ellipse(snake[i].x * gridSize + 14, snake[i].y * gridSize + 4, 6, 6);
                p5Instance.fill(0);
                p5Instance.ellipse(snake[i].x * gridSize + 4, snake[i].y * gridSize + 4, 3, 3);
                p5Instance.ellipse(snake[i].x * gridSize + 14, snake[i].y * gridSize + 4, 3, 3);
            }
        }
        p5Instance.fill(255, 50, 50);
        p5Instance.rect(food.x * gridSize, food.y * gridSize, gridSize - 2, gridSize - 2, 5);
        p5Instance.fill(0, 255, 204);
        p5Instance.textSize(16);
        p5Instance.text(`Score: ${score}`, 10, 20);
    }
}

function showGameOver() {
    document.getElementById("gameOverPopup").style.display = "block";
    document.getElementById("finalBoxesEaten").textContent = `Final Boxes Eaten: ${score / 10}`;
    document.getElementById("finalPoints").textContent = `Final Points: ${score} BST Points`;
}

function handleTouch(p) {
    if (gameState !== "playing" || !p5Instance) return;
    const touch = p.touches[0];
    const dx = touch.x - (snake[0].x * gridSize + gridSize / 2);
    const dy = touch.y - (snake[0].y * gridSize + gridSize / 2);
    if (Math.abs(dx) > Math.abs(dy)) {
        if (dx > 0 && direction !== "left") direction = "right";
        else if (dx < 0 && direction !== "right") direction = "left";
    } else {
        if (dy > 0 && direction !== "up") direction = "down";
        else if (dy < 0 && direction !== "down") direction = "up";
    }
}

async function updatePlayerInfo() {
    if (!account) return;
    showLoading();
    try {
        const balance = await contract.balanceOf(account);
        const internalBalance = await contract.getInternalBalance(account);
        const history = await contract.playerHistory(account);
        document.getElementById("walletBalance").textContent = `Wallet Balance: ${ethers.utils.formatEther(balance)} BST Tokens`;
        document.getElementById("gamesPlayed").textContent = `Games Played: ${history.gamesPlayed.toString()}`;
        document.getElementById("totalPoints").textContent = `Total Points: ${history.totalRewards.toString()} BST Points`;
        document.getElementById("totalGameRewards").textContent = `Total Token Rewards: ${ethers.utils.formatEther(history.totalRewards)} BST Tokens`;
        document.getElementById("totalReferrals").textContent = `Total Referrals: ${history.totalReferrals.toString()}`;
        document.getElementById("referralPoints").textContent = `Referral Points: ${history.referralRewards.toString()} BST Points`;
        document.getElementById("pendingPointsText").textContent = `Pending Points: ${internalBalance.toString()} BST Points`;
        document.getElementById("flexibleStakeBalance").textContent = `Flexible Stake Balance: ${ethers.utils.formatEther(history.flexibleStakeBalance)} BST Tokens`;
        document.getElementById("lockedStakeBalance60D").textContent = `Locked Stake Balance (60D): ${ethers.utils.formatEther(await contract.getLockedStakeBalance(account, 1))} BST Tokens`;
        document.getElementById("lockedStakeBalance180D").textContent = `Locked Stake Balance (180D): ${ethers.utils.formatEther(await contract.getLockedStakeBalance(account, 2))} BST Tokens`;
        document.getElementById("lockedStakeBalance365D").textContent = `Locked Stake Balance (365D): ${ethers.utils.formatEther(await contract.getLockedStakeBalance(account, 3))} BST Tokens`;
        const rewards = await contract.getRewardHistory(account);
        document.getElementById("rewardHistoryList").innerHTML = rewards.map(r => `<li>${ethers.utils.formatEther(r.amount)} BST at ${new Date(r.timestamp * 1000).toLocaleString()}</li>`).join("");
        document.getElementById("taskHistoryList").innerHTML = history.gamesPlayed > 0 ? `<li>Game played, earned ${score} points</li>` : "";
        document.getElementById("stakingHistoryList").innerHTML = history.flexibleStakeBalance > 0 ? `<li>Staked ${ethers.utils.formatEther(history.flexibleStakeBalance)} BST</li>` : "";
    } catch (error) {
        console.error("Error updating player info:", error);
        alert("Error fetching player info: " + error.message);
    } finally {
        hideLoading();
    }
}

function showLoading() {
    document.getElementById("loadingIndicator").style.display = "block";
}

function hideLoading() {
    document.getElementById("loadingIndicator").style.display = "none";
}
