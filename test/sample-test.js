const path = require('path');
const { copyFile } = require('fs/promises');
const hre = require('hardhat')
const assert = require('assert')
const { ethers } = hre
const { TASK_COMPILE } = require('hardhat/builtin-tasks/task-names');

describe('TestError', function () {
  let testError

  bootstrap();

  before('create the contract', async () => {
    const TestError = await ethers.getContractFactory('TestError')
    testError = await TestError.deploy()
    await testError.deployed()
  })

  describe('when setting a valid value', () => {
    before('Set some valid value', async () => {
      const tx = await testError.setValueA(1)
      await tx.wait()
    })

    it("doesn't revert and gives the value back", async () => {
      assert.equal(await testError.getValueA(), 1)
    })
  })

  describe('when setting an invalid value', () => {
    it('reverts', async () => {
      await assertRevert(testError.setValueA(42), 'SomeFancyError');
    })
  })
})

async function assertRevert(tx, expectedMessage) {
  let error

  try {
    await (await tx).wait()
  } catch (err) {
    error = err
  }

  if (!error) {
    throw new Error('Transaction was expected to revert, but it did not')
  } else if (expectedMessage) {
    const receivedMessage = error.toString()

    console.log(receivedMessage);
    if (
      !receivedMessage.includes(expectedMessage) 
    ) {
      throw new Error(
        `Transaction was expected to revert with "${expectedMessage}", but reverted with "${receivedMessage}"`,
      )
    }
  }
}

async function simulateDeployer() {
  const CONTRACTS = path.join(this.hre.config.paths.root, 'contracts');
  const TEST_CONTRACTS = path.join(this.hre.config.paths.root, 'test', 'mocks');
  // Change some contracts
  await Promise.all([
    // Create new module
    copyFile(path.join(TEST_CONTRACTS, 'TestError_updated.sol'), path.join(CONTRACTS, 'TestError.sol')),
  ]);

  // Recompile
  await hre.run(TASK_COMPILE, { force: true, quiet: true });
}

async function simulateCleanDeployer() {
  const CONTRACTS = path.join(this.hre.config.paths.root, 'contracts');
  const TEST_CONTRACTS = path.join(this.hre.config.paths.root, 'test', 'mocks');
  // Restore the contracts
  await Promise.all([
    // Create new module
    copyFile(path.join(TEST_CONTRACTS, 'TestError_original.sol'), path.join(CONTRACTS, 'TestError.sol')),
  ]);

  // Recompile
  await hre.run(TASK_COMPILE, { force: true, quiet: true });
}

function bootstrap() {
  let snapshotId;

  before('take a snapshot', async () => {
    snapshotId = await takeSnapshot(hre.ethers.provider);
  });

  before('simulate deployer', async () => {
    await simulateDeployer();
  })

  after('restore the snapshot', async () => {
    await restoreSnapshot(snapshotId, hre.ethers.provider);
  });

  after('simulate clean deployment', async () => {
    await simulateCleanDeployer();
  })
}

async function takeSnapshot(provider) {
  const snapshotId = await provider.send('evm_snapshot', []);

  await mineBlock(provider);

  return snapshotId;
}

async function restoreSnapshot(snapshotId, provider) {
  await provider.send('evm_revert', [snapshotId]);

  await mineBlock(provider);
}

async function mineBlock(provider) {
  await provider.send('evm_mine');
}
