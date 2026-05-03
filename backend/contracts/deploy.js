const { ethers } = require("ethers");
const fs = require("fs");
const path = require("path");

async function main() {
  console.log("Deploying...");

  // Ganache RPC
  const provider = new ethers.JsonRpcProvider("http://127.0.0.1:7545");

  // ✅ Your PRIVATE KEY (DO NOT SHARE THIS PUBLICLY AGAIN)
  const privateKey = "0xea7dee4b0d7d43c1f37979927143d777fccc89c80cfd71b28c5e62124e60317f";

  const wallet = new ethers.Wallet(privateKey, provider);

  console.log("Deploying from:", wallet.address);

  // Load compiled contract
  const artifact = JSON.parse(
    fs.readFileSync(path.join(__dirname, "build", "MedicineStorage.json"), "utf8")
  );

  const abi = artifact.abi;
  const bytecode = artifact.bytecode;

  // Deploy contract
  const factory = new ethers.ContractFactory(abi, bytecode, wallet);

  const contract = await factory.deploy();

  await contract.waitForDeployment();

  console.log("Contract deployed at:", await contract.getAddress());
}

main().catch((err) => {
  console.error("Deployment failed:", err);
});