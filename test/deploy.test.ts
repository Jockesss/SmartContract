// import { expect } from "chai";
// import { Address, toNano, getRandomNonce, zeroAddress } from "locklift";
// import { FactorySource } from "../build/factorySource";
//
// describe("Contract Deployment Test", async function () {
//   let signer: any;
//   let tokenRootAddress: Address;
//   let collectionAddress: Address;
//   let marketAddress: Address;
//
//
//   before(async () => {
//     signer = (await locklift.keystore.getSigner("0"))!;
//     // Используем заранее определенные адреса для initialSupplyTo и remainingGasTo
//     tokenRootAddress = new Address("0:0000000000000000000000000000000000000000000000000000000000000000");
//     collectionAddress = new Address("0:0000000000000000000000000000000000000000000000000000000000000000");
//
//     console.log("Signer publicKey:", signer.publicKey);
//     console.log("Initial Supply To Address:", tokenRootAddress.toString());
//     console.log("Remaining Gas To Address:", collectionAddress.toString());
//   });
//
//   it("Deploy TokenRoot contract", async function () {
//     const tokenRootDeployment = await locklift.deployments.deploy({
//       deployConfig: {
//         contract: "TokenRoot",
//         publicKey: signer.publicKey,
//         initParams: {
//           _randomNonce: getRandomNonce().toString(), // преобразуем в строку
//           _deployer: zeroAddress.toString(), // преобразуем в строку
//         },
//         constructorParams: {
//           initialSupplyTo: tokenRootAddress.toString(), // преобразуем в строку
//           initialSupply: toNano(1000000).toString(),
//           deployWalletValue: toNano(0.1).toString(),
//           mintDisabled: false,
//           burnByRootDisabled: false,
//           burnPaused: false,
//           remainingGasTo: collectionAddress.toString(), // преобразуем в строку
//         },
//         value: toNano(5).toString(),
//       },
//       deploymentName: "TokenRoot",
//     });
//     tokenRootAddress = tokenRootDeployment.contract.address;
//     expect(tokenRootAddress).to.not.be.null;
//     console.log("TokenRoot deployed at:", tokenRootAddress.toString());
//   });
//
//
//   // it("Deploy Market contract", async function () {
//   //   const marketDeployment = await locklift.deployments.deploy({
//   //     deployConfig: {
//   //       contract: "Market",
//   //       publicKey: signer.publicKey,
//   //       initParams: {},
//   //       constructorParams: {
//   //         _tokenRoot: tokenRootAddress.toString(),
//   //         _collection: collectionAddress.toString(),
//   //         _nftPrice: toNano(10).toString(),
//   //       },
//   //       value: toNano(2).toString(),
//   //     },
//   //     deploymentName: "Market",
//   //   });
//   //   marketAddress = marketDeployment.contract.address;
//   //   expect(marketAddress).to.not.be.null;
//   //   console.log("Market deployed at:", marketAddress.toString());
//   // });
// });
//
//
// // it("Deploy TokenRoot contract", async function () {
// //   const tokenRootDeployment = await locklift.deployments.deploy({
// //     deployConfig: {
// //       contract: "TokenRoot",
// //       publicKey: signer?.publicKey as string,
// //       initParams: {} as any,
// //       constructorParams: {
// //         initialSupplyTo: new Address("0:0000000000000000000000000000000000000000000000000000000000000000"), // Placeholder, update accordingly
// //         initialSupply: toNano(1000000).toString(),
// //         deployWalletValue: toNano(0.1).toString(),
// //         mintDisabled: false,
// //         burnByRootDisabled: false,
// //         burnPaused: false,
// //         remainingGasTo: new Address("0:0000000000000000000000000000000000000000000000000000000000000000"), // Placeholder, update accordingly
// //       },
// //       value: toNano(5).toString(),
// //     },
// //     deploymentName: "TokenRoot",
// //   });
// //   tokenRootAddress = tokenRootDeployment.contract.address;
// //   expect(tokenRootAddress).to.not.be.null;
// //   console.log("TokenRoot deployed at:", tokenRootAddress.toString());
// // });
// //
// // it("Deploy TokenWallet contract", async function () {
// //   const tokenWalletDeployment = await locklift.deployments.deploy({
// //     deployConfig: {
// //       contract: "TokenWallet",
// //       publicKey: signer.publicKey,
// //       initParams: {
// //         root_: tokenRootAddress,
// //         owner_: new Address("0:0000000000000000000000000000000000000000000000000000000000000000"), // Placeholder, update accordingly
// //       },
// //       constructorParams: {},
// //       value: toNano(1).toString(),
// //     },
// //     deploymentName: "TokenWallet",
// //   });
// //   tokenWalletAddress = tokenWalletDeployment.contract.address;
// //   expect(tokenWalletAddress).to.not.be.null;
// //   console.log("TokenWallet deployed at:", tokenWalletAddress.toString());
// // });
// //
// // it("Deploy Collection contract", async function () {
// //   const collectionDeployment = await locklift.deployments.deploy({
// //     deployConfig: {
// //       contract: "Collection",
// //       publicKey: signer.publicKey,
// //       initParams: {} as any,
// //       constructorParams: {
// //         owner: new Address("0:0000000000000000000000000000000000000000000000000000000000000000"), // Placeholder, update accordingly
// //       } as any,
// //       value: toNano(5).toString(),
// //     },
// //     deploymentName: "Collection",
// //   });
// //   collectionAddress = collectionDeployment.contract.address;
// //   expect(collectionAddress).to.not.be.null;
// //   console.log("Collection deployed at:", collectionAddress.toString());
// // });