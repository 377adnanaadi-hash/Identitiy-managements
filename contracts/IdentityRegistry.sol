// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title IdentityRegistry
 * @notice Minimal on-chain identity & attribute registry with delegate-based access.
 *         This is an educational/demo contract and not production-audited.
 */
contract IdentityRegistry {
    event DIDSet(address indexed user, string did);
    event AttributeSet(address indexed user, string key, string value);
    event DelegateGranted(address indexed user, address indexed delegate);
    event DelegateRevoked(address indexed user, address indexed delegate);

    // User => DID string (e.g., "did:example:alice123" or IPFS CID)
    mapping(address => string) public dids;

    // User => (key => value)
    mapping(address => mapping(string => string)) private attributes;

    // User => delegate => allowed?
    mapping(address => mapping(address => bool)) public delegates;

    modifier onlyOwner(address user) {
        require(msg.sender == user, "Not user");
        _;
    }

    modifier onlyOwnerOrDelegate(address user) {
        require(msg.sender == user || delegates[user][msg.sender], "Not authorized");
        _;
    }

    /// @notice Set/Update your DID string.
    function setDID(string calldata did) external {
        dids[msg.sender] = did;
        emit DIDSet(msg.sender, did);
    }

    /// @notice Grant delegate permissions to an address to manage your attributes.
    function grantDelegate(address delegateAddr) external onlyOwner(msg.sender) {
        require(delegateAddr != address(0), "Zero address");
        delegates[msg.sender][delegateAddr] = true;
        emit DelegateGranted(msg.sender, delegateAddr);
    }

    /// @notice Revoke delegate permissions.
    function revokeDelegate(address delegateAddr) external onlyOwner(msg.sender) {
        delegates[msg.sender][delegateAddr] = false;
        emit DelegateRevoked(msg.sender, delegateAddr);
    }

    /// @notice Set or update an attribute (e.g., "email" => "alice@uni.edu").
    function setAttribute(address user, string calldata key, string calldata value)
        external
        onlyOwnerOrDelegate(user)
    {
        attributes[user][key] = value;
        emit AttributeSet(user, key, value);
    }

    /// @notice Read an attribute for any user by key.
    function getAttribute(address user, string calldata key)
        external
        view
        returns (string memory)
    {
        return attributes[user][key];
    }

    /// @notice Check if an address is a delegate for a user.
    function isDelegate(address user, address caller) external view returns (bool) {
        return delegates[user][caller];
    }
}
