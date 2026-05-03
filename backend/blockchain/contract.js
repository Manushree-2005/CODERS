import Web3 from "web3";
import MedicineStorage from "./MedicineStorage.json";

let web3;
let contract;
let account;

export const initBlockchain = async () => {
  if (window.ethereum) {
    web3 = new Web3(window.ethereum);

    await window.ethereum.request({ method: "eth_requestAccounts" });

    const accounts = await web3.eth.getAccounts();
    account = accounts[0];

    const networkId = await web3.eth.net.getId();

    const deployedNetwork = MedicineStorage.networks[networkId];

    contract = new web3.eth.Contract(
      MedicineStorage.abi,
      deployedNetwork && deployedNetwork.address
    );
  } else {
    alert("Install MetaMask");
  }
};

export const addStockToBlockchain = async (medicine, quantity, status) => {
  const result = await contract.methods
    .updateStock(medicine, quantity, status)
    .send({ from: account });

  return result.transactionHash;
};