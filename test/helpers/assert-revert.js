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

    console.log('---> Revert message received from hardhat: ', receivedMessage)
    if (!receivedMessage.includes(expectedMessage)) {
      throw new Error(
        `Transaction was expected to revert with "${expectedMessage}", but reverted with "${receivedMessage}"`,
      )
    }
  }
}

module.exports = {
  assertRevert,
}
