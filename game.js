const contractAddress = "0x4fe4bF5670405772941d0D1e5706863A13f17B28";
const abi = [
    {"inputs":[{"internalType":"address","name":"spender","type":"address"},{"internalType":"uint256","name":"allowance","type":"uint256"},{"internalType":"uint256","name":"needed","type":"uint256"}],"name":"ERC20InsufficientAllowance","type":"error"},
    {"inputs":[{"internalType":"address","name":"sender","type":"address"},{"internalType":"uint256","name":"balance","type":"uint256"},{"internalType":"uint256","name":"needed","type":"uint256"}],"name":"ERC20InsufficientBalance","type":"error"},
    {"inputs":[{"internalType":"address","name":"approver","type":"address"}],"name":"ERC20InvalidApprover","type":"error"},
    {"inputs":[{"internalType":"address","name":"receiver","type":"address"}],"name":"ERC20InvalidReceiver","type":"error"},
    {"inputs":[{"internalType":"address","name":"sender","type":"address"}],"name":"ERC20InvalidSender","type":"error"},
    {"inputs":[{"internalType":"address","name":"spender","type":"address"}],"name":"ERC20InvalidSpender","type":"error"},
    {"inputs":[{"internalType":"address","name":"owner","type":"address"}],"name":"OwnableInvalidOwner","type":"error"},
    {"inputs":[{"internalType":"address","name":"account","type":"address"}],"name":"OwnableUnauthorizedAccount","type":"error"},
    {"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"owner","type":"address"},{"indexed":true,"internalType":"address","name":"spender","type":"address"},{"indexed":false,"internalType":"uint256","name":"value","type":"uint256"}],"name":"Approval","type":"event"},
    {"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"oldOracle","type":"address"},{"indexed":true,"internalType":"address","name":"newOracle","type":"address"}],"name":"GameOracleUpdated","type":"event"},
    {"anonymous":false,"inputs":[{"indexed":false,"internalType":"enum BlockSnakesGame.LockPeriod","name":"period","type":"uint8"},{"indexed":false,"internalType":"uint256","name":"newRate","type":"uint256"}],"name":"LockRewardUpdated","type":"event"},
    {"anonymous":false,"inputs":[{"indexed":false,"internalType":"uint256","name":"newLimit","type":"uint256"}],"name":"MaxConversionLimitUpdated","type":"event"},
    {"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"oldWallet","type":"address"},{"indexed":true,"internalType":"address","name":"newWallet","type":"address"}],"name":"OwnerWalletUpdated","type":"event"},
    {"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"previousOwner","type":"address"},{"indexed":true,"internalType":"address","name":"newOwner","type":"address"}],"name":"OwnershipTransferred","type":"event"},
    {"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"player","type":"address"},{"indexed":false,"internalType":"uint256","name":"points","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"tokens","type":"uint256"},{"indexed":true,"internalType":"address","name":"referrer","type":"address"},{"indexed":false,"internalType":"uint256","name":"referrerPoints","type":"uint256"}],"name":"PointsConverted","type":"event"},
    {"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"referrer","type":"address"},{"indexed":true,"internalType":"address","name":"referee","type":"address"}],"name":"ReferralAdded","type":"event"},
    {"anonymous":false,"inputs":[{"indexed":false,"internalType":"uint256","name":"newRate","type":"uint256"}],"name":"ReferralCommissionRateUpdated","type":"event"},
    {"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"owner","type":"address"}],"name":"SecretKeyUpdated","type":"event"},
    {"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"owner","type":"address"},{"indexed":false,"internalType":"uint256","name":"amount","type":"uint256"}],"name":"TokensBurned","type":"event"},
    {"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"owner","type":"address"},{"indexed":false,"internalType":"uint256","name":"totalAmount","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"ownerAmount","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"contractAmount","type":"uint256"}],"name":"TokensMinted","type":"event"},
    {"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"player","type":"address"},{"indexed":false,"internalType":"uint256","name":"amount","type":"uint256"},{"indexed":false,"internalType":"enum BlockSnakesGame.LockPeriod","name":"lockPeriod","type":"uint8"}],"name":"TokensStaked","type":"event"},
    {"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"player","type":"address"},{"indexed":false,"internalType":"uint256","name":"amount","type":"uint256"},{"indexed":false,"internalType":"enum BlockSnakesGame.LockPeriod","name":"lockPeriod","type":"uint8"},{"indexed":false,"internalType":"uint256","name":"_unlockAmount","type":"uint256"}],"name":"TokensUnstaked","type":"event"},
    {"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"from","type":"address"},{"indexed":true,"internalType":"address","name":"to","type":"address"},{"indexed":false,"internalType":"uint256","name":"value","type":"uint256"}],"name":"Transfer","type":"event"},
    {"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"player","type":"address"},{"indexed":false,"internalType":"uint256","name":"points","type":"uint256"}],"name":"WelcomeBonusClaimed","type":"event"},
    {"anonymous":false,"inputs":[{"indexed":false,"internalType":"uint256","name":"newBonus","type":"uint256"}],"name":"WelcomeBonusUpdated","type":"event"},
    {"anonymous":false,"inputs":[{"indexed":false,"internalType":"uint256","name":"newFeeInBnbWei","type":"uint256"}],"name":"WithdrawalFeeUpdated","type":"event"},
    {"inputs":[{"internalType":"address","name":"spender","type":"address"},{"internalType":"uint256","name":"value","type":"uint256"}],"name":"approve","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},
    {"inputs":[{"internalType":"uint256","name":"amount","type":"uint256"},{"internalType":"string","name":"_key","type":"string"}],"name":"burnTokens","outputs":[],"stateMutability":"nonpayable","type":"function"},
    {"inputs":[],"name":"claimWelcomeBonus","outputs":[],"stateMutability":"nonpayable","type":"function"},
    {"inputs":[{"internalType":"uint256","name":"points","type":"uint256"},{"internalType":"address","name":"player","type":"address"},{"internalType":"address","name":"referrer","type":"address"}],"name":"convertPointsToTokens","outputs":[],"stateMutability":"payable","type":"function"},
    {"inputs":[{"internalType":"uint256","name":"amount","type":"uint256"},{"internalType":"string","name":"_key","type":"string"}],"name":"mintTokens","outputs":[],"stateMutability":"nonpayable","type":"function"},
    {"inputs":[],"name":"renounceOwnership","outputs":[],"stateMutability":"nonpayable","type":"function"},
    {"inputs":[{"internalType":"uint256","name":"amount","type":"uint256"},{"internalType":"enum BlockSnakesGame.LockPeriod","name":"lockPeriod","type":"uint8"}],"name":"stakeTokens","outputs":[],"stateMutability":"nonpayable","type":"function"},
    {"inputs":[{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"value","type":"uint256"}],"name":"transfer","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},
    {"inputs":[{"internalType":"address","name":"from","type":"address"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"value","type":"uint256"}],"name":"transferFrom","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},
    {"inputs":[{"internalType":"address","name":"newOwner","type":"address"}],"name":"transferOwnership","outputs":[],"stateMutability":"nonpayable","type":"function"},
    {"inputs":[{"internalType":"uint256","name":"amount","type":"uint256"},{"internalType":"enum BlockSnakesGame.LockPeriod","name":"lockPeriod","type":"uint8"}],"name":"unstakeTokens","outputs":[],"stateMutability":"nonpayable","type":"function"},
    {"inputs":[{"internalType":"uint256","name":"_newRatio","type":"uint256"},{"internalType":"string","name":"_key","type":"string"}],"name":"updateConversionRatio","outputs":[],"stateMutability":"nonpayable","type":"function"},
    {"inputs":[{"internalType":"address","name":"_newOracle","type":"address"},{"internalType":"string","name":"_key","type":"string"}],"name":"updateGameOracle","outputs":[],"stateMutability":"nonpayable","type":"function"},
    {"inputs":[{"internalType":"enum BlockSnakesGame.LockPeriod","name":"period","type":"uint8"},{"internalType":"uint256","name":"_newRate","type":"uint256"},{"internalType":"string","name":"_key","type":"string"}],"name":"updateLockReward","outputs":[],"stateMutability":"nonpayable","type":"function"},
    {"inputs":[{"internalType":"uint256","name":"_newLimit","type":"uint256"},{"internalType":"string","name":"_key","type":"string"}],"name":"updateMaxConversionLimit","outputs":[],"stateMutability":"nonpayable","type":"function"},
    {"inputs":[{"internalType":"address","name":"_newWallet","type":"address"},{"internalType":"string","name":"_key","type":"string"}],"name":"updateOwnerWallet","outputs":[],"stateMutability":"nonpayable","type":"function"},
    {"inputs":[{"internalType":"uint256","name":"_newRate","type":"uint256"},{"internalType":"string","name":"_key","type":"string"}],"name":"updateReferralCommissionRate","outputs":[],"stateMutability":"nonpayable","type":"function"},
    {"inputs":[{"internalType":"string","name":"_newKey","type":"string"},{"internalType":"string","name":"_currentKey","type":"string"}],"name":"updateSecretKey","outputs":[],"stateMutability":"nonpayable","type":"function"},
    {"inputs":[{"internalType":"uint256","name":"_newBonus","type":"uint256"},{"internalType":"string","name":"_key","type":"string"}],"name":"updateWelcomeBonus","outputs":[],"stateMutability":"nonpayable","type":"function"},
    {"inputs":[{"internalType":"uint256","name":"_newFeeInBnbWei","type":"uint256"},{"internalType":"string","name":"_key","type":"string"}],"name":"updateWithdrawalFee","outputs":[],"stateMutability":"nonpayable","type":"function"},
    {"inputs":[{"internalType":"address","name":"_gameOracle","type":"address"}],"stateMutability":"nonpayable","type":"constructor"},
    {"inputs":[{"internalType":"address","name":"owner","type":"address"},{"internalType":"address","name":"spender","type":"address"}],"name":"allowance","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},
    {"inputs":[{"internalType":"address","name":"account","type":"address"}],"name":"balanceOf","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},
    {"inputs":[],"name":"contractBalance","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},
    {"inputs":[],"name":"conversionRatio","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},
    {"inputs":[],"name":"decimals","outputs":[{"internalType":"uint8","name":"","type":"uint8"}],"stateMutability":"view","type":"function"},
    {"inputs":[],"name":"gameOracle","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},
    {"inputs":[{"internalType":"address","name":"player","type":"address"}],"name":"getInternalBalance","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},
    {"inputs":[{"internalType":"address","name":"player","type":"address"},{"internalType":"enum BlockSnakesGame.LockPeriod","name":"lockPeriod","type":"uint8"}],"name":"getLockedStakeBalance","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},
    {"inputs":[{"internalType":"address","name":"player","type":"address"},{"internalType":"enum BlockSnakesGame.LockPeriod","name":"lockPeriod","type":"uint8"}],"name":"getLockedStakeStartTime","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},
    {"inputs":[{"internalType":"address","name":"player","type":"address"}],"name":"getRewardHistory","outputs":[{"components":[{"internalType":"uint256","name":"amount","type":"uint256"},{"internalType":"uint256","name":"timestamp","type":"uint256"},{"internalType":"string","name":"rewardType","type":"string"},{"internalType":"address","name":"referee","type":"address"}],"internalType":"struct BlockSnakesGame.Reward[]","name":"","type":"tuple[]"}],"stateMutability":"view","type":"function"},
    {"inputs":[{"internalType":"address","name":"","type":"address"},{"internalType":"enum BlockSnakesGame.LockPeriod","name":"","type":"uint8"}],"name":"lockedStakeBalances","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},
    {"inputs":[{"internalType":"address","name":"","type":"address"},{"internalType":"enum BlockSnakesGame.LockPeriod","name":"","type":"uint8"}],"name":"lockedStakeStartTimes","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},
    {"inputs":[{"internalType":"enum BlockSnakesGame.LockPeriod","name":"","type":"uint8"}],"name":"lockPeriods","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},
    {"inputs":[{"internalType":"enum BlockSnakesGame.LockPeriod","name":"","type":"uint8"}],"name":"lockRewards","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},
    {"inputs":[],"name":"maxConversionLimit","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},
    {"inputs":[],"name":"name","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},
    {"inputs":[],"name":"owner","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},
    {"inputs":[],"name":"ownerWallet","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},
    {"inputs":[{"internalType":"address","name":"","type":"address"}],"name":"playerHistory","outputs":[{"internalType":"uint256","name":"gamesPlayed","type":"uint256"},{"internalType":"uint256","name":"totalRewards","type":"uint256"},{"internalType":"uint256","name":"totalReferrals","type":"uint256"},{"internalType":"uint256","name":"referralRewards","type":"uint256"},{"internalType":"bool","name":"hasClaimedWelcomeBonus","type":"bool"},{"internalType":"uint256","name":"internalBalance","type":"uint256"},{"internalType":"uint256","name":"flexibleStakeBalance","type":"uint256"}],"stateMutability":"view","type":"function"},
    {"inputs":[],"name":"referralCommissionRate","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},
    {"inputs":[{"internalType":"address","name":"","type":"address"}],"name":"referrals","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},
    {"inputs":[{"internalType":"address","name":"","type":"address"},{"internalType":"uint256","name":"","type":"uint256"}],"name":"rewardHistory","outputs":[{"internalType":"uint256","name":"amount","type":"uint256"},{"internalType":"uint256","name":"timestamp","type":"uint256"},{"internalType":"string","name":"rewardType","type":"string"},{"internalType":"address","name":"referee","type":"address"}],"stateMutability":"view","type":"function"},
    {"inputs":[],"name":"symbol","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},
    {"inputs":[],"name":"totalSupply","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},
    {"inputs":[],"name":"welcomeBonus","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},
    {"inputs":[],"name":"withdrawalFeeInBnb","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"}
];

let provider, signer, contract, account;

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
            await updatePlayerInfo();
        } catch (error) {
            alert("Error connecting to MetaMask: " + error.message);
        }
    } else {
        alert("Please install MetaMask!");
    }
}

function disconnect() {
    document.getElementById("connectWallet").style.display = "inline-block";
    document.getElementById("disconnectWallet").style.display = "none";
    document.getElementById("walletAddress").textContent = "";
    account = null;
}

let snake, food, score, gameState, direction;
const gridSize = 20;
const canvasSize = 400;

function setup() {
    let canvas = createCanvas(canvasSize, canvasSize).parent("gameCanvas");
    frameRate(10);
    resetGame();
    document.getElementById("playGame").addEventListener("click", resetGame);
}

function draw() {
    background(10, 10, 35);
    if (gameState === "playing") {
        updateGame();
        drawGame();
    }
}

function resetGame() {
    snake = [{ x: 10, y: 10 }];
    food = { x: floor(random(0, canvasSize / gridSize)), y: floor(random(0, canvasSize / gridSize)) };
    score = 0;
    gameState = "playing";
    direction = null;
    document.getElementById("boxesEaten").textContent = `Boxes Eaten: 0`;
    document.getElementById("pendingPoints").textContent = `Pending Points: 0 BST Points`;
}

function updateGame() {
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
    // Draw Snake with Eyes and Body
    fill(0, 150, 0); // Darker green body
    for (let i = 0; i < snake.length; i++) {
        rect(snake[i].x * gridSize, snake[i].y * gridSize, gridSize - 2, gridSize - 2, 5);
        if (i === 0) {
            // Draw Eyes
            fill(255); // White eyes
            ellipse(snake[i].x * gridSize + 4, snake[i].y * gridSize + 4, 6, 6);
            ellipse(snake[i].x * gridSize + 14, snake[i].y * gridSize + 4, 6, 6);
            fill(0); // Black pupils
            ellipse(snake[i].x * gridSize + 4, snake[i].y * gridSize + 4, 3, 3);
            ellipse(snake[i].x * gridSize + 14, snake[i].y * gridSize + 4, 3, 3);
        }
    }

    // Draw Food
    fill(255, 50, 50); // Brighter red food
    rect(food.x * gridSize, food.y * gridSize, gridSize - 2, gridSize - 2, 5);

    // Draw Score
    fill(0, 255, 204);
    textSize(16);
    text(`Score: ${score}`, 10, 20);
}

function showGameOver() {
    document.getElementById("gameOverPopup").style.display = "block";
    document.getElementById("finalBoxesEaten").textContent = `Final Boxes Eaten: ${score / 10}`;
    document.getElementById("finalPoints").textContent = `Final Points: ${score} BST Points`;
}

document.getElementById("closePopup").addEventListener("click", () => {
    document.getElementById("gameOverPopup").style.display = "none";
    resetGame();
});

async function updatePlayerInfo() {
    if (!account) return;
    showLoading();
    try {
        const balance = await contract.balanceOf(account);
        document.getElementById("walletBalance").textContent = `Wallet Balance: ${ethers.utils.formatEther(balance)} BST Tokens`;
        const history = await contract.playerHistory(account);
        document.getElementById("gamesPlayed").textContent = `Games Played: ${history.gamesPlayed.toString()}`;
        document.getElementById("totalPoints").textContent = `Total Points: ${history.totalRewards.toString()} BST Points`;
        document.getElementById("totalGameRewards").textContent = `Total Token Rewards: ${ethers.utils.formatEther(history.totalRewards)} BST Tokens`;
        document.getElementById("totalReferrals").textContent = `Total Referrals: ${history.totalReferrals.toString()}`;
        document.getElementById("referralPoints").textContent = `Referral Points: ${history.referralRewards.toString()} BST Points`;
        document.getElementById("pendingPointsText").textContent = `Pending Points: ${history.internalBalance.toString()} BST Points`;
        document.getElementById("flexibleStakeBalance").textContent = `Flexible Stake Balance: ${ethers.utils.formatEther(history.flexibleStakeBalance)} BST Tokens`;
        document.getElementById("lockedStakeBalance60D").textContent = `Locked Stake Balance (60D): ${ethers.utils.formatEther(await contract.getLockedStakeBalance(account, 1))} BST Tokens`;
        document.getElementById("lockedStakeBalance180D").textContent = `Locked Stake Balance (180D): ${ethers.utils.formatEther(await contract.getLockedStakeBalance(account, 2))} BST Tokens`;
        document.getElementById("lockedStakeBalance365D").textContent = `Locked Stake Balance (365D): ${ethers.utils.formatEther(await contract.getLockedStakeBalance(account, 3))} BST Tokens`;
        const rewards = await contract.getRewardHistory(account);
        const rewardList = document.getElementById("rewardHistoryList");
        rewardList.innerHTML = rewards.map(r => `<li>${ethers.utils.formatEther(r.amount)} BST at ${new Date(r.timestamp * 1000).toLocaleString()}</li>`).join("");
    } catch (error) {
        console.error("Error updating player info:", error);
        alert("Error fetching player info: " + error.message);
    } finally {
        hideLoading();
    }
}

document.getElementById("connectWallet").addEventListener("click", init);
document.getElementById("disconnectWallet").addEventListener("click", disconnect);

document.getElementById("claimWelcomeBonus").addEventListener("click", async () => {
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

document.getElementById("convertPoints").addEventListener("click", async () => {
    showLoading();
    try {
        const amount = document.getElementById("convertPointsAmount").value;
        if (!amount || amount <= 0) {
            alert("Please enter a valid amount.");
            return;
        }
        const referrer = prompt("Enter referrer address (optional):") || "0x0000000000000000000000000000000000000000";
        const tx = await contract.convertPointsToTokens(amount, account, referrer, { value: ethers.utils.parseEther("0.0002"), gasLimit: 300000 });
        await tx.wait();
        alert("Points converted!");
        await updatePlayerInfo();
    } catch (error) {
        alert("Error converting points: " + error.message);
    } finally {
        hideLoading();
    }
});

document.getElementById("stakeTokens").addEventListener("click", async () => {
    showLoading();
    try {
        const amount = document.getElementById("stakeAmount").value;
        const lockPeriod = document.getElementById("lockPeriod").value;
        if (!amount || amount <= 0) {
            alert("Please enter a valid amount.");
            return;
        }
        const tx = await contract.stakeTokens(amount, lockPeriod, { gasLimit: 300000 });
        await tx.wait();
        alert("Tokens staked!");
        await updatePlayerInfo();
    } catch (error) {
        alert("Error staking tokens: " + error.message);
    } finally {
        hideLoading();
    }
});

document.getElementById("unstakeTokens").addEventListener("click", async () => {
    showLoading();
    try {
        const amount = document.getElementById("unstakeAmount").value;
        const lockPeriod = document.getElementById("unlockPeriod").value;
        if (!amount || amount <= 0) {
            alert("Please enter a valid amount.");
            return;
        }
        const tx = await contract.unstakeTokens(amount, lockPeriod, { gasLimit: 300000 });
        await tx.wait();
        alert("Tokens unstaked!");
        await updatePlayerInfo();
    } catch (error) {
        alert("Error unstaking tokens: " + error.message);
    } finally {
        hideLoading();
    }
});

document.getElementById("getReferralLink").addEventListener("click", () => {
    const referralLink = `${window.location.origin}?ref=${account}`;
    alert(`Your referral link: ${referralLink}`);
});

function showLoading() {
    document.getElementById("loadingIndicator").style.display = "block";
}

function hideLoading() {
    document.getElementById("loadingIndicator").style.display = "none";
}
