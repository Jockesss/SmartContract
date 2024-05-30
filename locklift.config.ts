import { LockliftConfig } from "locklift";
import { FactorySource } from "./build/factorySource";
import "@broxus/locklift-deploy";
import { Deployments } from "@broxus/locklift-deploy";
import * as dotenv from "dotenv";

dotenv.config();

declare global {
  const locklift: import("locklift").Locklift<FactorySource>;
}

declare module "locklift" {
  // @ts-ignore
  export interface Locklift {
    deployments: Deployments<FactorySource>;
  }
}

const config: LockliftConfig = {
  compiler: {
    version: "0.62.0",
    externalContractsArtifacts: {
      "node_modules/@broxus/tip3/build": ["TokenRoot", "TokenWallet"],
      "node_modules/@broxus/tip4/build": ["Collection"]
    },
  },
  linker: {
    version: "0.15.48",
  },
  networks: {
    locklift: {
      giver: {
        address: '0:ece57bcc6c530283becbbd8a3b24d3c5987cdddc3c8b7b33be6e4a6312490415',
        key: '172af540e43a524763dd53b26a066d472a97c4de37d5498170564510608250c3',
      },
      connection: {
        id: 1001,
        type: "proxy",
        // @ts-ignore
        data: {}
      },
      keys: {
        phrase: 'action inject penalty envelope rabbit element slim tornado dinner pizza off blood',
        amount: 20,
      },
    },
    local: {
      deploy: ['deploy'],
      connection: {
        id: 1,
        group: "localnet",
        type: "graphql",
        data: {
          endpoints: [process.env.NETWORK_ENDPOINT || "http://localhost/graphql"],
          latencyDetectionInterval: 1000,
          local: true,
        },
      },
      giver: {
        address: "0:ece57bcc6c530283becbbd8a3b24d3c5987cdddc3c8b7b33be6e4a6312490415",
        key: "172af540e43a524763dd53b26a066d472a97c4de37d5498170564510608250c3",
      },
      keys: {
        phrase: 'action inject penalty envelope rabbit element slim tornado dinner pizza off blood',
        amount: 20,
      },
    },
    venom_testnet: {
      connection: {
        id: 1000,
        type: "jrpc",
        group: "dev",
        data: {
          endpoint: process.env.VENOM_TESTNET_ENDPOINT || "https://jrpc-devnet.venom.foundation/",
        },
      },
      giver: {
        address: "0:0000000000000000000000000000000000000000000000000000000000000000",
        phrase: "phrase",
        accountId: 0,
      },
      keys: {
        phrase: 'action inject penalty envelope rabbit element slim tornado dinner pizza off blood',
        amount: 20,
      },
    },
    main: {
      connection: "mainnetJrpc",
      giver: {
        address: "0:0000000000000000000000000000000000000000000000000000000000000000",
        key: "secret key",
      },
      keys: {
        phrase: 'action inject penalty envelope rabbit element slim tornado dinner pizza off blood',
        amount: 20,
      },
    },
  },
  mocha: {
    timeout: 2000000,
  },
};

export default config;
