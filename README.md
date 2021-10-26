# Custom Error playground

This small project shows that if there's an update of contracts and recompilation in the tests (simulating a deployment) custom-errors will fail to be properly detected by hardhat the first time, but will succed a second one.

To test it just get the repo, install the dependencies (npm install) and execute:

`rm -drf artifacts  cache && npm test || npm test`

you are going to see that the test will run twice, the first time will fail and the second succeed.

