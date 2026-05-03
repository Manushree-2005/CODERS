import { ethers } from "ethers";

const CONTRACT_ADDRESS = "0xc128fa8c8D7638Fe9e712eca92474B4DaceC214f";

const ABI = [
  "function addOrUpdateMedicine(string _name, uint256 _quantity, string _status)",
  "function getMedicine(string _name) view returns (string,uint256,string)"
];

let contract;

export const initBlockchain = async () => {
  const provider = new ethers.BrowserProvider(window.ethereum);
  const signer = await provider.getSigner();

  contract = new ethers.Contract(CONTRACT_ADDRESS, ABI, signer);
};

export const addStockToBlockchain = async (name, qty, status) => {
  const tx = await contract.addOrUpdateMedicine(name, qty, status);
  await tx.wait();
};