// SPDX-License-Identifier: MIT
pragma solidity 0.8.19;

import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC1155/extensions/ERC1155Supply.sol";
import "@openzeppelin/contracts/utils/Strings.sol";

contract SimpleStorage is ERC1155, Ownable, ERC1155Supply {
    uint256 public constant Ice = 0;
    uint256 public constant Fire = 1;
    uint256 public price = 0.05 ether;

    struct TokenInfo {
        string tokenType;
        uint256 maxSupply;
        uint256 totalSupply;
    }
    mapping(uint256 => TokenInfo) public tokenInfo;

    constructor() ERC1155("") {
        tokenInfo[Ice] = TokenInfo("glace", 4, 0);
        tokenInfo[Fire] = TokenInfo("feu", 4, 0);
    }

    function mint(uint256 id, uint256 SftNumber) public payable {
        require(
            tokenInfo[id].totalSupply + SftNumber <= tokenInfo[id].maxSupply,
            "Exceeds maximum supply"
        );
        require(msg.value >= price * SftNumber, "Insufficient payment");
        _mint(msg.sender, id, SftNumber, "");
        tokenInfo[id].totalSupply += SftNumber;
    }

    function uri(uint256 tokenId) public pure override returns (string memory) {
        return
            string(
                abi.encodePacked(
                    "https://ipfs.io/QmeUxrARsfhPsYho3fx7kGBCMe771DvTsSWB6aNaqK9NDF/",
                    Strings.toString(tokenId),
                    ".json"
                )
            );
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
