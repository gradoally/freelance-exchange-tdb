# ALFA MATER

Next-gen Freelance Center in Telegram & on TON. Deals between freelancers & customers secured by smart-contracts.

## Introduction

Hello everybody! This is ALFA MATER for HACK-TON-BERFEST 2023! We made this app to secure payments for freelance using smart-contracts, make reputation of counterparties available on-chain, 

## Contributing

Please visit issues, where we listed some ideas for contributors.

## Technical description

This project is based on Tokenized Decentralized App technology. See full information about technology and approach in its [repo](https://github.com/the-real-some-dao/TDB-template).

1. **Deploying NFT Collections**: Using the master-contract from the repository, you can deploy NFT collections that will store the main assets of the freelance exchange dApp. For example, you can deploy NFT collections for orders, freelancers, employers, and admins. These collections will serve as units to store relevant data associated with each category.

2. **Storing Data as NFTs**: With the NFT collections deployed, you can use the NFTs to store the main data of the freelance exchange dApp. Each NFT within a collection represents a unique entity such as an order, a freelancer, an employer, or an admin. You can associate metadata with each NFT to store additional information about the entity, such as the freelancer's skills, the order details, or the employer's preferences.

3. **Master-Contract Ownership and Editing**: The master-contract becomes the owner and editor of all the deployed NFT collections. As the owner and editor, the master-contract has the authority to initiate the minting of NFTs and edit their attributes. This allows for the maintenance of up-to-date data on the blockchain. For example, when the status of an order changes, the freelance exchange dApp can send a request to the master-contract to update the corresponding NFT's status attribute.

4. **Data Updates via Master-Contract**: When a change occurs in the freelance exchange dApp, such as the status of an order or the details of a freelancer, the dApp can interact with the master-contract to request the necessary updates. The dApp can send a message to the master-contract, specifying the NFT and the attribute to be edited. The master-contract then processes the request and updates the corresponding NFT attribute accordingly.

5. **Blockchain-based Data Storage**: By utilizing NFTs and storing data on the TON blockchain, the freelance exchange dApp ensures that the important information, such as order statuses, freelancer details, and employer preferences, are securely stored and tamper-resistant. The data is kept on-chain, allowing for transparency and immutability.

6. **Additional Functionality**: In addition to the core functionality of storing and updating data, you can enhance the freelance exchange dApp by adding features such as NFT transfers between users, tracking transaction history, implementing payment mechanisms using blockchain tokens, and creating a user-friendly front-end interface to interact with the dApp.

