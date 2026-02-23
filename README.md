# Decentralized File Sharing System

A decentralized file sharing application built using Ethereum smart contracts, IPFS, and Hardhat.
The system allows users to upload file URLs, manage access permissions, and share files without relying on centralized storage.

---

## Features

* Secure file ownership using blockchain
* Upload file references (IPFS URLs)
* Grant and revoke access permissions to other users
* Transparent access control via smart contracts
* Decentralized storage using IPFS
* Smart contract deployment with Hardhat

---

## Project Structure

```
├── client/               # Frontend application
├── contracts/            # Solidity smart contracts
│   └── Upload.sol
├── scripts/              # Deployment scripts
│   └── deploy.js
├── hardhat.config.js     # Hardhat configuration
├── package.json          # Dependencies
└── .gitignore
```

---

## Smart Contract Overview

### Upload.sol

The smart contract manages:

* File storage references
* Ownership permissions
* Access control between users

### Core Functions

#### Add File

```solidity
function add(address _user, string memory url) external
```

Adds a file URL for a specific user.

#### Allow Access

```solidity
function allow(address user) external
```

Grants access permission to another user.

#### Disallow Access

```solidity
function disallow(address user) public
```

Revokes previously granted access.

#### Display Files

```solidity
function display(address _user) external view returns(string[] memory)
```

Returns file URLs if the requester has permission.

#### Share Access List

```solidity
function shareAccess() public view returns(Access[] memory)
```

Shows users who have access permissions.

---

## Installation & Setup

### Clone Repository

```bash
git clone https://github.com/ayushwth/decentralized-file-sharing.git
cd decentralized-file-sharing
```

### Install Dependencies

```bash
npm install
```

### Compile Smart Contract

```bash
npx hardhat compile
```

### Deploy Contract

```bash
npx hardhat run scripts/deploy.js --network localhost
```

---

## Running Local Blockchain

Start Hardhat node:

```bash
npx hardhat node
```

Deploy again in another terminal.

---

## Technology Stack

* Solidity
* Ethereum
* Hardhat
* IPFS
* JavaScript / Node.js
* React (Frontend)

---

## How It Works

1. User uploads a file to IPFS.
2. IPFS returns a unique hash (URL).
3. The URL is stored on the blockchain via the smart contract.
4. Users can grant or revoke access permissions.
5. Authorized users can view shared files securely.

---

## Future Improvements

* File encryption before IPFS upload
* MetaMask authentication
* Multi-chain deployment
* Gas optimization
* UI/UX enhancements

---

## Author

Ayush Srivastava
GitHub: https://github.com/ayushwth

---

## License

This project is licensed under the GPL-3.0 License.
