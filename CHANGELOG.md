# Changelog
All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased](https://gitlab.com/eidoo_io/hybrid-exchange-sdk/compare/v2.2.0...HEAD)

Release date: 2019-06-XX.

## [v2.2.0](https://gitlab.com/eidoo_io/hybrid-exchange-sdk/compare/v2.1.0...v2.2.0)

Release date: 2019-06-28.

### Added
- [Add Trade service](https://github.com/eidoo/hybrid-exchange-sdk/issues/92)

### Changed
- [Change OrderService constructor](https://github.com/eidoo/hybrid-exchange-sdk/issues/87)
- [Update NodeJS and project packages due to security warnings](https://github.com/eidoo/hybrid-exchange-sdk/issues/91)

## [v2.1.0](https://gitlab.com/eidoo_io/hybrid-exchange-sdk/compare/v2.0.0...v2.1.0)

Release date: 2019-03-12.

### Changed
- [Keystore in withdraw command](https://github.com/eidoo/hybrid-exchange-sdk/issues/67) Update `withdraw` command using keystore instead of private key
- [Keystore in deposit token command](https://github.com/eidoo/hybrid-exchange-sdk/issues/66) Update `deposit-token` command using keystore instead of private key
- [Keystore in create wallet command](https://github.com/eidoo/hybrid-exchange-sdk/issues/65) Update `create-wallet` command using keystore instead of private key
- [Keystore in order sign command](https://github.com/eidoo/hybrid-exchange-sdk/issues/63) Update `sign` command using keystore instead of private key
- [Keystore in create order command](https://github.com/eidoo/hybrid-exchange-sdk/issues/62) Update `create order` command using keystore instead of private key
- [Keystore in cancel order command](https://github.com/eidoo/hybrid-exchange-sdk/issues/61) Update `order cancel` command using keystore instead of private key
- [Keystore in approve command](https://github.com/eidoo/hybrid-exchange-sdk/issues/64) Update `approve` command using keystore instead of private key
- [CLI get allowance command](https://github.com/eidoo/hybrid-exchange-sdk/issues/59) Remove `privateKeyValidator` and `privateKeyService` dependencies from `GetAllowanceCommand`
- [CLI get balance command](https://github.com/eidoo/hybrid-exchange-sdk/issues/58) Remove `privateKeyValidator` and `privateKeyService` dependencies from `GetBalanceCommand`
- [CLI get address command](https://github.com/eidoo/hybrid-exchange-sdk/issues/47) Remove `privateKeyValidator` and `privateKeyService` dependencies from `GetAddressCommand`
- [Keystore in deposit ETH command](https://github.com/eidoo/hybrid-exchange-sdk/issues/45) Update `deposit-eth` command using keystore instead of private key


## [v2.0.0](https://gitlab.com/eidoo_io/hybrid-exchange-sdk/compare/v1.1.0...v2.0.0)

Release date: 2019-03-06.

### Added
- [CredentialBaseCommand](https://github.com/eidoo/hybrid-exchange-sdk/issues/60) Add `CredentialBaseCommand` to separate private key and keystore object utilities from `ABaseCommand`
- [CLI generate keystore command](https://github.com/eidoo/hybrid-exchange-sdk/issues/50)
- [CLI create order command](https://github.com/eidoo/hybrid-exchange-sdk/issues/46)
- [Command factories](https://github.com/eidoo/hybrid-exchange-sdk/issues/40)
- [CLI deposit token command](https://github.com/eidoo/hybrid-exchange-sdk/issues/19)
- [Circle CI](https://github.com/eidoo/hybrid-exchange-sdk/issues/36)
- [CLI cancel order command](https://github.com/eidoo/hybrid-exchange-sdk/issues/26)
- [CLI get allowance command](https://github.com/eidoo/hybrid-exchange-sdk/issues/24)
- [CLI get trading wallet asset balance command](https://github.com/eidoo/hybrid-exchange-sdk/issues/20)
- [CLI deposit ETH command](https://github.com/eidoo/hybrid-exchange-sdk/issues/15)
- [CLI approve command](https://github.com/eidoo/hybrid-exchange-sdk/issues/18)
- [CLI withdraw command](https://github.com/eidoo/hybrid-exchange-sdk/issues/13)
- [Deposit Token with approve](https://github.com/eidoo/hybrid-exchange-sdk/issues/11)
- [Allowance](https://github.com/eidoo/hybrid-exchange-sdk/issues/7)
- [Private key from mnemonic](https://github.com/eidoo/hybrid-exchange-sdk/issues/5)
- [Pair fee](https://github.com/eidoo/hybrid-exchange-sdk/issues/1)
- [Pair last price](https://github.com/eidoo/hybrid-exchange-sdk/issues/3)

### Changed
- [Approve command](https://github.com/eidoo/hybrid-exchange-sdk/issues/43)

### Fixed
- [Config](https://github.com/eidoo/hybrid-exchange-sdk/issues/56)

## [v1.1.0](https://gitlab.com/eidoo_io/hybrid-exchange-sdk/compare/fa85a7...v1.1.0)

Release date: 2019-02-12.

- Initial release.
