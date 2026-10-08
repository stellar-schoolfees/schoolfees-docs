# Testnet demonstration deployment and explorer instructions

Prepared October 8, 2026. The three demonstrations are now deployed and verified;
see [actual addresses and results](testnet-demonstrations.md). This guide also
describes the commands used and how to inspect or reproduce them.
These instructions are for the three implemented contracts, not the unfinished
Ajo or DuesTreasury scaffolds. App and docs repositories use their project's
contract address; they do not each need another contract.

## Decision before sending transactions

Existing repository instructions require real pilot partners before deployment.
Either satisfy those gates with real evidence, or have the maintainer explicitly
authorize a separate synthetic-data testnet demonstration and record that exception.
Never set `PILOT_CONFIRMED=yes` merely to bypass a gate or invent a partner.
An automated demonstration is not a real pilot or evidence of Drips acceptance.

Review the current revision and checks, decide who controls the testnet signing
identity and SchoolFees admin, and record the artifact actually deployed.
SchoolFees initialize is separate from deployment and records the first supplied
admin: complete and verify initialization before sharing an instance for use.

## 1. Check tools in PowerShell

```powershell
Set-Location C:\Users\ADMIN\Desktop\Drips
Get-Command stellar | Select-Object Source
stellar --version
```

The PATH executable was verified as Stellar CLI 28.1.0 at
`C:\Program Files (x86)\Stellar CLI\stellar.exe`. The older executable at
`C:\Users\ADMIN\.stellar-bin\stellar.exe` is 27.1.0; do not accidentally use it.
Our contracts use Soroban SDK 28 and target `wasm32v1-none`.
For rebuilding on this Windows machine, use the existing GNU Rust toolchain and
installed MinGW linker; see each contract's AGENTS.md. Build and run the required
checks from each repository root before deploying a changed artifact.

## 2. Create a dedicated testnet identity after authorization

Use a new descriptive alias. The command below generates local signing material
and obtains free testnet XLM through Friendbot; it must not overwrite an existing
identity. Keep the signing material out of Git and do not print or share it.

```powershell
stellar keys generate drips-demo-20261008 --network testnet --fund
stellar keys address drips-demo-20261008
```

The second command prints the public account address, starting with `G`.
CLI identity storage uses its configuration directory outside this workspace by
default. Do not use `keys show`, `--as-secret`, or a secret pasted into a command.
The same testnet signing identity can deploy all three independent instances.

## 3. Record and deploy each tested artifact

Run separately for each row, replacing the variables with that row's values:

| Project | Repository | Wasm filename | New alias |
|---|---|---|---|
| SchoolFees | stellar-schoolfees/schoolfees-contracts | schoolfees.wasm | schoolfees-demo-20261008 |
| EventBadges | stellar-eventbadges/eventbadges-contracts | eventbadges.wasm | eventbadges-demo-20261008 |
| InvoicePay | stellar-invoicepay/invoicepay-contracts | invoicepay.wasm | invoicepay-demo-20261008 |

Example for EventBadges:

```powershell
Set-Location C:\Users\ADMIN\Desktop\Drips\stellar-eventbadges\eventbadges-contracts
$demoAlias = 'eventbadges-demo-20261008'
$wasmPath = 'target/wasm32v1-none/release/eventbadges.wasm'
git rev-parse HEAD
git status --short
stellar contract info hash --wasm $wasmPath
stellar contract deploy --wasm $wasmPath --source-account drips-demo-20261008 --network testnet --alias $demoAlias
```

Stop if a command fails. Record the actual returned `C...` contract ID, successful
deployment transaction hash, date, public deployer account, source revision and
Wasm hash. Read both upload and creation output: the upload's Wasm hash is not
the deployed contract ID. Do not rerun deployment just to recover a log; a new
deployment may create a different instance. Alias names should be new because
deploying with an existing alias can overwrite its recorded mapping.

Compare the hash reported for the deployed instance with the recorded local hash:

```powershell
stellar contract info hash --id $demoAlias --network testnet
stellar contract info interface --id $demoAlias --network testnet
```

A matching Wasm hash identifies the code, not the correctness of its initialization,
stored state, payment flows or access controls.

## 4. Initialize SchoolFees

Only SchoolFees has a separate initializer. After its own deployment, from its
contract repository, initialize the demo using the chosen testnet account:

```powershell
$demoAdmin = stellar keys address drips-demo-20261008
stellar contract invoke --id schoolfees-demo-20261008 --source-account drips-demo-20261008 --network testnet --send=yes -- initialize --admin $demoAdmin
stellar contract invoke --id schoolfees-demo-20261008 --source-account drips-demo-20261008 --network testnet --send=no -- admin
```

Check the returned admin matches the public address and save the initialization
transaction hash. EventBadges and InvoicePay have no initializer; do not invent
one. Deploying alone does not demonstrate an event claim or an invoice payment.

## 5. Inspect the real address on Stellar Expert

1. Open [Stellar Expert Testnet](https://stellar.expert/explorer/testnet).
2. Confirm **Testnet** is selected. Paste the actual complete `C...` address into
   the search field. Do not paste the `G...` deployer address or Wasm hash.
3. Alternatively, open `https://stellar.expert/explorer/testnet/contract/ACTUAL_CONTRACT_ID`,
   replacing `ACTUAL_CONTRACT_ID` with the entire real ID.
4. Check the displayed contract ID matches. Review available creation transaction,
   code details, transactions and events; the explorer's interface and indexing may vary.
5. Open the real creation transaction at
   `https://stellar.expert/explorer/testnet/tx/ACTUAL_TRANSACTION_HASH`.
   Confirm it succeeded and created the intended contract. Treat upload and
   initialization transaction links as separate evidence.
6. Verify the deployed Wasm hash with CLI as above. A recently created contract
   may take time to appear in an index. Check the CLI/RPC and successful transaction
   before assuming an empty explorer result means failure. Testnet resets can erase
   old deployments; an old repository address may no longer resolve.
7. Save each project's contract link and transaction links in a public deployment
   record labelled **synthetic testnet demonstration**, along with observed checks.

## 6. Inspect methods using Stellar Lab

Open [Stellar Lab](https://lab.stellar.org), select **Testnet**, configure its
testnet RPC if requested, and open **Smart Contracts → Contract Explorer**.
Enter the real contract ID and inspect its specification, storage and available
methods. A wallet is needed for invoking methods. Simulate before submitting;
submit a write only when it is part of the approved demonstration scope.

SchoolFees `admin` can be inspected after initialization. EventBadges and
InvoicePay need separately approved synthetic event/invoice flows to generate
meaningful application state. Payment/refund demonstrations also need a known
testnet token and funded synthetic participants; deployment does not set those up.

## Sources and verification limits

- [Official testnet deployment guide](https://developers.stellar.org/docs/build/smart-contracts/getting-started/deploy-to-testnet).
- [Official Lab Contract Explorer guide](https://developers.stellar.org/docs/tools/lab/smart-contracts/contract-explorer).
- [Official block explorer overview](https://developers.stellar.org/docs/tools/developer-tools/block-explorers).
- [Accepted repository address evidence](deployment-evidence.md).

The local command names/options, tool version, Wasm locations and SchoolFees
initializer were inspected. Identity creation, all three deployments, SchoolFees
initialization, code-hash checks and RPC transaction verification were completed.
Explorer links are provided; visual browser review and application business-flow
smoke tests have not been completed. See the linked evidence for exact outcomes.
