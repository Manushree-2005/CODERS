const solc = require("solc");
const fs = require("fs");

const source = fs.readFileSync("MedicineStorage.sol", "utf8");

const input = {
  language: "Solidity",
  sources: {
    "MedicineStorage.sol": { content: source },
  },
  settings: {
    outputSelection: {
      "*": {
        "*": ["abi", "evm.bytecode"]
      }
    }
  }
};

const output = JSON.parse(solc.compile(JSON.stringify(input)));

const contract =
  output.contracts["MedicineStorage.sol"]["MedicineStorage"];

fs.writeFileSync(
  "MedicineStorage.json",
  JSON.stringify({
    abi: contract.abi,
    bytecode: contract.evm.bytecode.object
  }, null, 2)
);

console.log("✅ Compiled successfully");