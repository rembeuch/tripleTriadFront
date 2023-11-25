// SPDX-License-Identifier: MIT
pragma solidity 0.8.19;

import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC1155/extensions/ERC1155Supply.sol";
import "@openzeppelin/contracts/utils/Strings.sol";

contract Elite is ERC1155, Ownable, ERC1155Supply {
    uint256 public price = 0.05 ether;

    struct TokenInfo {
        string tokenType;
        uint256 totalSupply;
    }
    mapping(uint256 => TokenInfo) public tokenInfo;

    constructor() ERC1155("") {
        
    }

    function mint(uint256 id, uint256 SftNumber) public payable {
        require(msg.value >= price * SftNumber, "Insufficient payment");
        _mint(msg.sender, id, SftNumber, "");
        tokenInfo[id].totalSupply += SftNumber;
    }

    function _beforeTokenTransfer(
        address operator,
        address from,
        address to,
        uint256[] memory ids,
        uint256[] memory amounts,
        bytes memory data
    ) internal override(ERC1155, ERC1155Supply) {
        super._beforeTokenTransfer(operator, from, to, ids, amounts, data);
    }

    function withdraw() public payable onlyOwner {
        require(payable(msg.sender).send(address(this).balance));
    }
}
