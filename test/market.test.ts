import { expect } from "chai";
import { Address, toNano, zeroAddress, getRandomNonce } from "locklift";
import { FactorySource } from "../build/factorySource";
import { beginCell } from "ton";

describe("Market Contract Test", async function () {
  let signer: any;
  let marketAddress: Address;
  let tokenRootAddress: Address;
  let collectionAddress: Address;
  let tokenWalletAddress: Address;

  before(async () => {
    signer = (await locklift.keystore.getSigner("0"))!;
    tokenRootAddress = new Address("0:0000000000000000000000000000000000000000000000000000000000000001");
    collectionAddress = new Address("0:00000000000000000000000000000000000000000000000000000002");
    marketAddress = new Address("0:56d6756e66678effb4d3d15a6948b2367231ba71da2c117fb46238fb6c7fff5f");
  });


  it("Deploy Collection contract", async function () {
    const codeNft = beginCell().endCell(); // Пример кода, замените на реальный TvmCell
    const codeIndex = beginCell().endCell(); // Пример кода, замените на реальный TvmCell
    const codeIndexBasis = beginCell().endCell(); // Пример кода, замените на реальный TvmCell

    const collectionDeployment = await locklift.deployments.deploy({
      deployConfig: {
        contract: "Collection",
        publicKey: signer.publicKey,
        initParams: {
          nonce_: getRandomNonce().toString, // Добавим значение для статического поля nonce_
        },
        constructorParams: {
          codeNft: codeNft.toBoc().toString("base64"), // Пример кода, замените на реальный
          codeIndex: codeIndex.toBoc().toString("base64"), // Пример кода, замените на реальный
          codeIndexBasis: codeIndexBasis.toBoc().toString("base64"), // Пример кода, замените на реальный
          owner: signer, // Используем publicKey в качестве владельца
          remainOnNft: toNano(0.1).toString(), // Количество токенов, остающихся на NFT
          json: "{}" // JSON метаданные коллекции
        },
        value: toNano(2).toString(),
      },
      deploymentName: "Collection",
    });

    collectionAddress = collectionDeployment.contract.address;
    console.log("Collection развернута по адресу:", collectionAddress.toString());
  });

  it("Deploy Market contract", async function () {
    const marketDeployment = await locklift.deployments.deploy({
      deployConfig: {
        contract: "Market",
        publicKey: signer.publicKey,
        initParams: {
          _nonce: getRandomNonce(),
        },
        constructorParams: {
          _tokenRoot: tokenRootAddress.toString(),
          _collection: collectionAddress.toString(),
          _nftPrice: toNano(10).toString(),
        },
        value: toNano(2).toString(),
      },
      deploymentName: "Market",
    });

    marketAddress = marketDeployment.contract.address;
    expect(marketAddress).to.not.be.null;
    console.log("Market развернут по адресу:", marketAddress.toString());
  });

  it("Transfer collection ownership to Market", async function () {
    const collectionContract = locklift.factory.getDeployedContract("Collection", collectionAddress);

    await locklift.transactions.waitFinalized(
      collectionContract.methods.transferOwnership({
        newOwner: marketAddress,
      }).sendExternal({ publicKey: signer.publicKey })
    );

    console.log("Владение коллекцией передано контракту Market");
  });

  it("Wait for Token Wallet address", async function () {
    const marketContract = locklift.factory.getDeployedContract("Market", marketAddress);

    // Ждем callback из onWalletDeployed
    await new Promise((resolve) => setTimeout(resolve, 5000));

    const { tokenWallet } = await marketContract.methods.tokenWallet().call();
    tokenWalletAddress = new Address(tokenWallet.toString());
    console.log("Token Wallet адрес сохранен:", tokenWalletAddress.toString());
  });

  // it("Accept tokens and mint NFTs", async function () {
  //   const marketContract = locklift.factory.getDeployedContract("Market", marketAddress);
  //
  //   console.log("Отправка токенов с параметрами:");
  //   console.log("tokenWalletAddress:", tokenWalletAddress.toString());
  //   console.log("amount:", toNano(25).toString());
  //
  //   try {
  //     await locklift.transactions.waitFinalized(
  //       marketContract.methods.onAcceptTokensTransfer({
  //         value0: tokenWalletAddress,
  //         amount: toNano(25),
  //         sender: signer.address,
  //         value3: tokenWalletAddress,
  //         value4: signer.address,
  //         value5: beginCell().endCell().toBoc().toString("base64"),
  //       }).sendExternal({ publicKey: signer.publicKey })
  //     );
  //   } catch (error) {
  //     console.error("Ошибка при отправке токенов и чеканке NFT:", error);
  //     throw error;
  //   }
  // });
  //
  // it("Fail on insufficient tokens", async function () {
  //   const marketContract = locklift.factory.getDeployedContract("Market", marketAddress);
  //
  //   console.log("Отправка недостаточного количества токенов с параметрами:");
  //   console.log("tokenWalletAddress:", tokenWalletAddress.toString());
  //   console.log("amount:", toNano(5).toString());
  //
  //   try {
  //     await locklift.transactions.waitFinalized(
  //       marketContract.methods.onAcceptTokensTransfer({
  //         value0: tokenWalletAddress,
  //         amount: toNano(5),
  //         sender: signer.address,
  //         value3: tokenWalletAddress,
  //         value4: signer.address,
  //         value5: beginCell().endCell().toBoc().toString("base64"),
  //       }).sendExternal({ publicKey: signer.publicKey })
  //     );
  //     expect.fail("Транзакция должна была завершиться неудачей из-за недостаточного количества токенов");
  //   } catch (error) {
  //     console.log("Транзакция завершилась неудачей, как и ожидалось, из-за недостаточного количества токенов:", error);
  //   }
  // });
});
