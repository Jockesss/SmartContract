import { Address, toNano, getRandomNonce } from "locklift";
import { FactorySource } from "../build/factorySource";

async function main() {
  const signer = (await locklift.keystore.getSigner("0"))!;
  const tokenRootAddress = new Address("0:0000000000000000000000000000000000000000000000000000000000000001");
  const collectionAddress = new Address("0:0000000000000000000000000000000000000000000000000000000000000002");

  // Разворачиваем коллекцию
  const collectionDeployment = await locklift.deployments.deploy({
    deployConfig: {
      contract: "Collection",
      publicKey: signer.publicKey,
      initParams: {
        // Параметры инициализации коллекции, если есть
      },
      constructorParams: {
        owner: signer.publicKey,
      },
      value: toNano(2).toString(),
    },
    deploymentName: "Collection",
  });

  console.log("Collection развернута по адресу:", collectionDeployment.contract.address.toString());

  // Разворачиваем Market контракт
  const marketDeployment = await locklift.deployments.deploy({
    deployConfig: {
      contract: "Market",
      publicKey: signer.publicKey,
      initParams: {
        _nonce: getRandomNonce(),
      },
      constructorParams: {
        _tokenRoot: tokenRootAddress.toString(),
        _collection: collectionDeployment.contract.address.toString(),
        _nftPrice: toNano(10).toString(),
      },
      value: toNano(2).toString(),
    },
    deploymentName: "Market",
  });

  console.log("Market развернут по адресу:", marketDeployment.contract.address.toString());

  const marketAddress = marketDeployment.contract.address;

  // Передаем владение коллекцией контракту Market
  await locklift.transactions.waitFinalized(
    collectionDeployment.contract.methods.transferOwnership({
      newOwner: marketAddress.toString(),
    }).sendExternal({ publicKey: signer.publicKey })
  );

  console.log("Владение коллекцией передано контракту Market");

  // Подождем получения адреса кошелька
  const marketContract = locklift.factory.getDeployedContract("Market", marketAddress);

  // Ждем callback из onWalletDeployed
  await new Promise((resolve) => setTimeout(resolve, 5000));

  const tokenWalletAddress = await marketContract.methods.tokenWallet().call();

  console.log("Token Wallet адрес сохранен:", tokenWalletAddress.toString());
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
