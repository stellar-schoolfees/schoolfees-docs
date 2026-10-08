# Verified testnet demonstrations

Verified at `2026-10-08T18:52:08.061Z` through Stellar testnet RPC and Stellar CLI 28.1.0.
The maintainer authorized these synthetic demonstrations. No real pilot, audit,
browser-wallet flow or production readiness is claimed.

| Project | Actual contract ID | Explorer | Creation transaction |
|---|---|---|---|
| schoolfees | `CBRSL5YIUN3ANQVEJB4YWQAXBN6KMZR55OWBDZS7ZLHCRKLDOOYWAXLR` | [Stellar Expert](https://stellar.expert/explorer/testnet/contract/CBRSL5YIUN3ANQVEJB4YWQAXBN6KMZR55OWBDZS7ZLHCRKLDOOYWAXLR) · [Stellar Lab](https://lab.stellar.org/r/testnet/contract/CBRSL5YIUN3ANQVEJB4YWQAXBN6KMZR55OWBDZS7ZLHCRKLDOOYWAXLR) | [SUCCESS](https://stellar.expert/explorer/testnet/tx/bacbfdb35ec09b3500d9c094232c0351ac83c75de7037535071c5722041f03cd) |
| eventbadges | `CAHAB7ABUENVP7SZW37V3VRSAAASB6SV7FOBNWS2JYGUU7W6GHYY6JWR` | [Stellar Expert](https://stellar.expert/explorer/testnet/contract/CAHAB7ABUENVP7SZW37V3VRSAAASB6SV7FOBNWS2JYGUU7W6GHYY6JWR) · [Stellar Lab](https://lab.stellar.org/r/testnet/contract/CAHAB7ABUENVP7SZW37V3VRSAAASB6SV7FOBNWS2JYGUU7W6GHYY6JWR) | [SUCCESS](https://stellar.expert/explorer/testnet/tx/9c769b49e9d26e4a3895dac51402f546b46f6ae86529e512ff3e831f7f67deb5) |
| invoicepay | `CCJ652VR7Y7H5KE5FUDT4FSTTN3FJECY44RJYHBW4J2BPSXVETJLTJKU` | [Stellar Expert](https://stellar.expert/explorer/testnet/contract/CCJ652VR7Y7H5KE5FUDT4FSTTN3FJECY44RJYHBW4J2BPSXVETJLTJKU) · [Stellar Lab](https://lab.stellar.org/r/testnet/contract/CCJ652VR7Y7H5KE5FUDT4FSTTN3FJECY44RJYHBW4J2BPSXVETJLTJKU) | [SUCCESS](https://stellar.expert/explorer/testnet/tx/ab1b0d5718a824d718996c6d9497ac56d93770897769ff19435af37b3618eb2e) |

All three deployed Wasm hashes match their rebuilt local artifacts. All listed
upload and creation transactions were `SUCCESS`; SchoolFees initialization was
also `SUCCESS`, and its simulated admin read matched the public demonstration account.
See [machine-readable evidence](testnet-deployments.json) for hashes, ledgers and source revisions.

## How to check the addresses

1. Click the Stellar Expert link for the project you want to inspect.
2. Check the explorer network says **Testnet** and the full `C...` address matches this table.
3. Click its creation transaction link and confirm success. Upload and initialization are separate transactions.
4. Use the Stellar Lab link to inspect the deployed method specification; choose Testnet if prompted.
5. An explorer may index slowly. CLI/RPC code-hash and transaction checks are the recorded verification.
6. For CLI commands and initialization details, use the [full guide](testnet-deployment-and-explorer.md).

The app and docs repositories for one project use that project's contract ID.
Keep secret keys and recovery phrases out of public records. Testnet resets can
erase deployments; an address that worked today may need redeployment after a reset.
