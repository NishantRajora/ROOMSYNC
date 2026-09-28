// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

contract AgreementRegistry {
    struct Record { address registrant; uint256 timestamp; }
    mapping(bytes32 => Record) private records;
    event Registered(bytes32 indexed hash, address indexed registrant, uint256 timestamp);
    function register(bytes32 hash) external {
        require(records[hash].timestamp == 0, "hash already registered");
        records[hash] = Record(msg.sender, block.timestamp);
        emit Registered(hash, msg.sender, block.timestamp);
    }
    function get(bytes32 hash) external view returns (Record memory) { return records[hash]; }
}
