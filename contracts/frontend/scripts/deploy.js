const hre = require("hardhat");

async function main() {
  const Registry = await hre.ethers.getContractFactory("IdentityRegistry");
  const registry = await Registry.deploy();
  await registry.deployed();
  console.log("IdentityRegistry deployed to:", registry.address);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
