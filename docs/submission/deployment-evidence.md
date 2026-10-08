# Published contract-address evidence

Checked 2026-10-08. This is a small, targeted sample drawn from the 20 accepted repositories previously recorded in `accepted-repo-structures.json`, not an audit of all accepted repositories. Published documentation is evidence of an address claim, not independent verification of current on-chain state. The Explorer fetch could not be read through the browser tool.

| Accepted repository | Published address evidence | Network and qualification |
| --- | --- | --- |
| Consulting-Manao/tansu | `CBXKUSLQPVF35FYURR5C42BPYA5UOVDXX2ELKIM2CAJMCI6HXG2BHGZA` | README labels testnet and links directly to Stellar Expert. |
| Consulting-Manao/tansu | `CDXINK2T3P46M4LWK35FVIXXHJ2XHAS4FOVCGVPJ63YV5OVTM24IY5BI` | README labels mainnet and links directly to Stellar Expert. |
| karagozemin/Sub-Rosa | `CCOVGOQQZJKZ2R55GRWBLTJTGBAMSHXZVN3ICPG3WRVMLMM6RHISC5OV` | Deployment guide supplies testnet live-poll configuration. |
| karagozemin/Sub-Rosa | `CDQOFNCJE5Z4ZZL76DU5652FOUKJVEIZWHFGCZVWH63UYBGPSZIPC325` | Guide identifies Core v2 mainnet configuration; distinguishes legacy contract. |
| karagozemin/Sub-Rosa | `CB7VIYY4RQLZG2Y6HLDWB3UKSVOAIDYFZ5TGW5AUBCIPJHTCZV4ZWQFF` | Guide identifies separate non-default v3 testnet deployment. |
| Emmy123222/Stellar-GreenPay | No address in the inspected registry | Both testnet and mainnet `contractId` fields are empty strings. This is an accepted repository without a populated address in that file. |
| kindfi-org/kindfi | No application address in the inspected mainnet guide | Application IDs are placeholders. Its two concrete native XLM SAC addresses are token contracts, not KindFi application deployments. |

Sources:

- [Tansu README](https://github.com/Consulting-Manao/tansu/blob/main/README.md)
- [Sub Rosa deployment guide](https://github.com/karagozemin/Sub-Rosa/blob/main/docs/DEPLOY.md)
- [GreenPay address registry](https://github.com/Emmy123222/Stellar-GreenPay/blob/main/contracts/addresses.json)
- [KindFi mainnet deployment guide](https://github.com/kindfi-org/kindfi/blob/main/apps/contract/DEPLOYMENT_MAINNET.md)
- [Official Stellar testnet deployment instructions](https://developers.stellar.org/docs/build/smart-contracts/getting-started/deploy-to-testnet)

The sample does not establish a universal Drips requirement to publish a contract address. A functioning custom Soroban application needs its own deployed contract instance to perform real on-chain interactions; app/docs repositories for the same project can reference that same instance. A contract address is not needed separately for each repository.

## Local implemented contracts

- SchoolFees: `schoolfees-contracts/src/lib.rs` has a separate `initialize(admin: Address)` entry point. Deployment alone does not initialize it. Inspect its authentication and initialization behavior before deploying.
- EventBadges: no constructor or initialize entry point; `create_event` establishes each event.
- InvoicePay: no constructor or initialize entry point; `create_invoice` establishes each invoice.
- All three READMEs currently state that they have not been deployed. Existing scripts target testnet only. SchoolFees and EventBadges instructions include real-pilot gates; deployment evidence must not be described as proof of a pilot.
- Installed CLI was checked: Stellar 28.1.0. `stellar contract deploy --help` supports `--wasm`, `--source-account`, `--network testnet`, and `--alias`. `stellar contract info hash --id <C_ADDRESS> --network testnet` is the installed command family for obtaining the deployed WASM hash.

No keys generated, secret files read, deployment performed, or network transaction submitted during this research. Existing Wasm artifacts and recorded tests are available, but the deployment owner must confirm signing identity, admin ownership, and smoke-test scope. Full unfinished-project builds were deliberately held pending the user's question.

## Explorer steps after a real deployment

1. Record the actual `C...` address output by a successful deployment and the network. A `G...` value identifies an account, not the application contract; a WASM SHA-256 hash is also not the contract address.
2. For our current testnet phase, open `https://stellar.expert/explorer/testnet/contract/<ACTUAL_C_ADDRESS>`. Replace the entire placeholder, including angle brackets. Mainnet uses `/explorer/public/contract/`, and is outside our current scope.
3. Confirm the address on the page matches exactly. Review available contract code/interface, creation transaction, invoking transactions, and events. Explorer interfaces and indexing may vary; a missing immediate result is not alone proof of failed deployment.
4. Save the successful deployment transaction hash from CLI logs and open `https://stellar.expert/explorer/testnet/tx/<ACTUAL_TRANSACTION_HASH>`. Confirm transaction success and the expected contract-creation operation.
5. Check the deployed WASM hash with Stellar CLI and compare against the artifact actually uploaded. A successful creation transaction does not prove initialization or business flows work; record initialization and bounded smoke-test transaction links separately.
6. Publish public addresses, network, transaction links, and observed smoke outcomes in deployment records. Never publish signing secrets, recovery phrases, or claim a real pilot from an automated smoke test.
