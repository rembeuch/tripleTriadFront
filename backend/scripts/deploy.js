const hre = require("hardhat");

async function main() {
  const Elite = await hre.ethers.getContractFactory("EliteNFT");
  const elite = await Elite.deploy();

  await elite.deployed();

  console.log(
    `Elite deployed to ${elite.address}`
  );
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
