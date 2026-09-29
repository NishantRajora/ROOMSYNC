const hre = require("hardhat");
const fs = require("fs");
const path = require("path");

async function main() {
  console.log("Deploying AgreementRegistry...");

  const AgreementRegistry = await hre.ethers.getContractFactory("AgreementRegistry");
  const registry = await AgreementRegistry.deploy();

  await registry.waitForDeployment();
  const address = await registry.getAddress();

  console.log(`AgreementRegistry deployed to: ${address}`);

  const outputPath = path.join(__dirname, "..", "deployed-address.json");
  fs.writeFileSync(
    outputPath,
    JSON.stringify({ address }, null, 2)
  );
  console.log(`Address written to ${outputPath}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
