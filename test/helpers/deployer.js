const path = require('path');
const { copyFile } = require('fs/promises');
const { TASK_COMPILE } = require('hardhat/builtin-tasks/task-names');

async function simulateDeployer() {
  const CONTRACTS = path.join(this.hre.config.paths.root, 'contracts')
  const TEST_CONTRACTS = path.join(this.hre.config.paths.root, 'test', 'mocks')
  // Change some contracts
  await Promise.all([
    // Create new module
    copyFile(
      path.join(TEST_CONTRACTS, 'TestError_updated.sol'),
      path.join(CONTRACTS, 'TestError.sol'),
    ),
  ])

  // Recompile
  await hre.run(TASK_COMPILE, { force: true, quiet: true })
}

async function simulateCleanDeployer() {
  const CONTRACTS = path.join(this.hre.config.paths.root, 'contracts')
  const TEST_CONTRACTS = path.join(this.hre.config.paths.root, 'test', 'mocks')
  // Restore the contracts
  await Promise.all([
    // Create new module
    copyFile(
      path.join(TEST_CONTRACTS, 'TestError_original.sol'),
      path.join(CONTRACTS, 'TestError.sol'),
    ),
  ])

  // Recompile
  await hre.run(TASK_COMPILE, { force: true, quiet: true })
}

module.exports = {
  simulateDeployer,
  simulateCleanDeployer,
}
