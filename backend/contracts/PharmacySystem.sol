pragma solidity ^0.8.0;

contract PharmacySystem {

    struct Pharmacy {
        string name;
        string city;
        address owner;
    }

    Pharmacy[] public pharmacies;

    function registerPharmacy(string memory _name, string memory _city) public {
        pharmacies.push(Pharmacy(_name, _city, msg.sender));
    }

    function getPharmacies() public view returns (Pharmacy[] memory) {
        return pharmacies;
    }
}