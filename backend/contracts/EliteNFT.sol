// SPDX-License-Identifier: MIT
pragma solidity 0.8.19;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Strings.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

contract EliteNFT is ERC721URIStorage, Ownable, ReentrancyGuard {
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIdCounter;

    struct Elite {
        uint256 eliteId;
    }
    uint256 private _basePrice = 0.01 * 10**18; // 0.01 MATIC in wei

    event Minted(address indexed to, uint256 tokenId, uint256 eliteId);
    event TokenBuy(address seller, address buyer, uint tokenId, uint price);

    mapping(uint256 => Elite) public _elites;
    mapping(uint256 => bool) private _eliteIdExists;

    constructor() ERC721("Elite", "ELITE") {}

    function mintElite(uint256 eliteId) external payable {
        require(msg.value >= _basePrice, "Insufficient payment");
        require(_eliteIdExists[eliteId] == false, "Elite ID already minted");

        _tokenIdCounter.increment();
        uint256 tokenId = _tokenIdCounter.current();
        _mint(msg.sender, tokenId);

        _elites[tokenId].eliteId = eliteId;
        _eliteIdExists[eliteId] = true;


        emit Minted(msg.sender, tokenId, eliteId);
    }

    function buyElite(uint256 tokenId,uint256 price) public payable nonReentrant {
        require(msg.sender != ownerOf(tokenId), "You are the owner");
        require(
            msg.value >= price,
            "Ether value must be greater than price"
        );
        address owner = ownerOf(tokenId);

        (bool success, ) = owner.call{value: msg.value}("");
        require(success, "Transfer failed.");
        _transfer(owner, msg.sender, tokenId);
        approve(address(this), tokenId);
        emit TokenBuy(owner, msg.sender, tokenId, price);
    }

    function getAllNFTs() public view returns (Elite[] memory) {
        uint nftCount = _tokenIdCounter.current();
        Elite[] memory tokens = new Elite[](nftCount);
        uint currentIndex = 0;
        uint currentId;
        for (uint i = 0; i < nftCount; i++) {
            currentId = i + 1;
            Elite storage currentItem = _elites[currentId];
            tokens[currentIndex] = currentItem;
            currentIndex += 1;
        }
        return tokens;
    }

    function getMyNFTs() public view returns (Elite[] memory) {
        uint totalItemCount = _tokenIdCounter.current();
        uint itemCount = 0;
        uint currentIndex = 0;
        uint currentId;
        for (uint i = 0; i < totalItemCount; i++) {
            if (ownerOf(i + 1) == msg.sender) {
                itemCount += 1;
            }
        }

        Elite[] memory items = new Elite[](itemCount);
        for (uint i = 0; i < totalItemCount; i++) {
            if (ownerOf(i + 1) == msg.sender) {
                currentId = i + 1;
                Elite storage currentItem = _elites[currentId];
                items[currentIndex] = currentItem;
                currentIndex += 1;
            }
        }
        return items;
    }

    function getEliteId(uint256 tokenId) external view returns (uint256) {
        return _elites[tokenId].eliteId;
    }

     function withdraw() external onlyOwner {
        payable(owner()).transfer(address(this).balance);
    }
}




    


   

