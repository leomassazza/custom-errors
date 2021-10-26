const assert = require('assert')
const hre = require('hardhat')

const { takeSnapshot, restoreSnapshot } = require('./helpers/snapshot');
const { simulateDeployer, simulateCleanDeployer } = require('./helpers/deployer');
const { assertRevert } = require('./helpers/assert-revert');

describe('TestError', function () {
  let testError;
  let snapshotId;

  before('take a snapshot', async () => {
    // In fact we don't need to take the snapshot, 
    // just accessing the provider will make it fail
    // if you comment the following line will make the test succeed
    let provider = hre.ethers.provider;
    
    // Not taking the snapshot for the test
    // snapshotId = await takeSnapshot(hre.ethers.provider);
  });

  before('simulate deployer', async () => {
    // Deployment will update a contract and call COMPILE task again
    await simulateDeployer();
  })

  after('restore the snapshot', async () => {
    // Not taking the snapshot for the test
    // await restoreSnapshot(snapshotId, hre.ethers.provider);
  });

  after('simulate clean deployment', async () => {
    await simulateCleanDeployer();
  })

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

