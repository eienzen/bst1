const contractAddress = "0xF83955Fe45B7db6E162FE159D6E7138FA00F82B6";
const contractABI = [
    // (Your provided ABI remains unchanged)
    // Copy the full ABI from your previous message here
];

let provider, signer, contract, userAccount;

async function connectWallet() {
    try {
        if (window.ethereum) {
            provider = new ethers.BrowserProvider(window.ethereum);
            await provider.send("eth_requestAccounts", []);
            userAccount = (await provider.listAccounts())[0];
            signer = await provider.getSigner();
            contract = new ethers.Contract(contractAddress, contractABI, signer);
        } else {
            const walletConnectProvider = new window.WalletConnectProvider({
                rpc: { 97: "https://data-seed-prebsc-1-s1.binance.org:8545/" },
            });
            await walletConnectProvider.enable();
            provider = new ethers.BrowserProvider(walletConnectProvider);
            userAccount = (await provider.listAccounts())[0].address;
            signer = await provider.getSigner();
            contract = new ethers.Contract(contractAddress, contractABI, signer);
        }
        document.getElementById('userAddress').innerText = userAccount;
        document.getElementById('connectWallet').classList.add('hidden');
        document.getElementById('dashboard').classList.remove('hidden');
        await updateDashboard();
        await checkStatus();
    } catch (error) {
        alert('Error connecting wallet: ' + error.message);
    }
}

async function updateDashboard() {
    try {
        const balance = await contract.balanceOf(userAccount);
        document.getElementById('awtBalance').innerText = ethers.formatEther(balance);
        const referralCount = await contract.referralCount(userAccount);
        document.getElementById('referralCount').innerText = referralCount.toString();
        document.getElementById('referralLink').innerText = `${window.location.origin}/?ref=${userAccount}`;
    } catch (error) {
        console.error('Error updating dashboard:', error);
    }
}

async function checkStatus() {
    try {
        const isPaused = await contract.paused();
        const referralsPaused = await contract.referralsPaused();
        const statusDiv = document.getElementById('status');
        if (isPaused) {
            statusDiv.innerText = "Staking is currently paused.";
            statusDiv.classList.remove('hidden');
        } else if (referralsPaused) {
            statusDiv.innerText = "Referrals are currently paused.";
            statusDiv.classList.remove('hidden');
        } else {
            statusDiv.classList.add('hidden');
        }
    } catch (error) {
        console.error('Error checking status:', error);
    }
}

async function claimWelcomeBonus() {
    try {
        const tx = await contract.claimWelcomeBonus({ value: ethers.parseEther("0.0005") });
        await tx.wait();
        alert('Welcome bonus claimed successfully!');
        await updateDashboard();
    } catch (error) {
        alert('Error: ' + (error.reason || error.message));
    }
}

async function refer() {
    const referrer = document.getElementById('referrerAddress').value;
    const amount = document.getElementById('referAmount').value;
    if (referrer && !ethers.isAddress(referrer)) {
        alert('Invalid referrer address');
        return;
    }
    try {
        const tx = await contract.refer(
            referrer || "0x0000000000000000000000000000000000000000",
            ethers.parseEther(amount),
            { value: ethers.parseEther("0.0005"), gasLimit: 300000 }
        );
        await tx.wait();
        alert('Referral successful!');
        await updateDashboard();
        await checkStatus();
    } catch (error) {
        alert('Error: ' + (error.reason || error.message));
    }
}

async function transfer() {
    const to = document.getElementById('transferTo').value;
    const amount = document.getElementById('transferAmount').value;
    if (!ethers.isAddress(to)) {
        alert('Invalid recipient address');
        return;
    }
    try {
        const tx = await contract.transfer(to, ethers.parseEther(amount), { gasLimit: 300000 });
        await tx.wait();
        alert('Transfer successful!');
        await updateDashboard();
    } catch (error) {
        alert('Error: ' + (error.reason || error.message));
    }
}

async function withdraw() {
    const amount = document.getElementById('withdrawAmount').value;
    try {
        const tx = await contract.withdraw(ethers.parseEther(amount), { value: ethers.parseEther("0.0005"), gasLimit: 300000 });
        await tx.wait();
        alert('Withdrawal successful!');
        await updateDashboard();
    } catch (error) {
        alert('Error: ' + (error.reason || error.message));
    }
}

document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('connectWalletBtn').addEventListener('click', connectWallet);
    document.getElementById('claimBonusBtn').addEventListener('click', claimWelcomeBonus);
    document.getElementById('referBtn').addEventListener('click', refer);
    document.getElementById('transferBtn').addEventListener('click', transfer);
    document.getElementById('withdrawBtn').addEventListener('click', withdraw);

    if (window.ethereum) {
        window.ethereum.on('accountsChanged', () => window.location.reload());
        connectWallet();
    }
});
