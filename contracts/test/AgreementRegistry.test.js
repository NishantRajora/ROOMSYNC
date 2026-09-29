const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("AgreementRegistry", function () {
  let registry;
  let owner;
  let otherAccount;
  const sampleHash = ethers.id("Sample Agreement Document");

  beforeEach(async function () {
    [owner, otherAccount] = await ethers.getSigners();
    const AgreementRegistry = await ethers.getContractFactory("AgreementRegistry");
    registry = await AgreementRegistry.deploy();
  });

  it("should register a hash successfully", async function () {
    const tx = await registry.register(sampleHash);
    await tx.wait();

    const record = await registry.get(sampleHash);
    expect(record.registrant).to.equal(owner.address);
    expect(record.timestamp).to.be.greaterThan(0);
  });

  it("should emit Registered event with correct args", async function () {
    await expect(registry.register(sampleHash))
      .to.emit(registry, "Registered")
      .withArgs(sampleHash, owner.address, (val) => val > 0);
  });

  it("should reject duplicate hash registration", async function () {
    await registry.register(sampleHash);
    await expect(registry.register(sampleHash)).to.be.revertedWith("hash already registered");
  });

  it("should get correct record", async function () {
    const tx = await registry.connect(otherAccount).register(sampleHash);
    await tx.wait();

    const record = await registry.get(sampleHash);
    expect(record.registrant).to.equal(otherAccount.address);
  });

  it("should return zero for unregistered hash", async function () {
    const record = await registry.get(sampleHash);
    expect(record.registrant).to.equal(ethers.ZeroAddress);
    expect(record.timestamp).to.equal(0);
  });
});
