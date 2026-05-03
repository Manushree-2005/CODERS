// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract MedicineStorage {

    struct Medicine {
        string name;
        uint quantity;
        string location;
        uint timestamp;
    }

    Medicine[] public medicines;

    event Added(string name, uint quantity, string location, uint timestamp);

    function addMedicine(
        string memory _name,
        uint _quantity,
        string memory _location
    ) public {
        require(_quantity > 0, "qty > 0 required");

        medicines.push(Medicine(
            _name,
            _quantity,
            _location,
            block.timestamp
        ));

        emit Added(_name, _quantity, _location, block.timestamp);
    }

    function getCount() public view returns (uint) {
        return medicines.length;
    }
}