const config = require("./constants/index");
const helper = require("./utils/helper");
const quickswapSdk = require("quickswap-default-token-list");
const coins = require("./constants/coins");

async function getSupportedTokens(chain, dex) {
  if (!config.supportedChains.includes(chain)) {
    return { error: config.errorMessages.INVALID_CHAIN };
  }
  
  if (dex === "oneInch") {
    const { tokens } = await getTokensOneInch(chain);
    return { tokens };
  }

  if (dex === "uniswap") {
    const { tokens } = await getTokensUniswap(chain);
    return { tokens };
  }

  if (dex === "quickswap") {
    const { tokens } = await getTokensQuickswap(chain);
    return { tokens };
  }

  if (dex === "pancakeswap") {
    const { tokens } = await getTokensPancakeswap(chain);
    return { tokens };
  }
}

async function getTokensOneInch(chain) {
  if (chain === "ethereum") {
    url = `${config.oneInchBaseURL}/1`;
  } else if (chain === "polygon") {
    url = `${config.oneInchBaseURL}/137`;
  } else if (chain === "bsc") {
    url = `${config.oneInchBaseURL}/56`;
  } else {
    return { error: config.errorMessages.INVALID_CHAIN };
  }
  const { response, error } = await helper.getRequest({ url: `${url}/tokens`, headers: {Authorization: `Bearer ${config.oneinchAuthToken}` }});
  if (error) {
    return error;
  }
  let tokens = Object.values(response.tokens);
  tokens.forEach(function (obj) {
    delete obj.tags;
  });
  return { tokens };
}

async function getTokensPancakeswap(chain) {
  if (chain === "bsc") {
    url = `${config.pancakeBaseURL}`;
  } else {
    return { error: config.errorMessages.INVALID_CHAIN };
  }
  const { response, error } = await helper.getRequest({ url });
  if (error) {
    return error;
  }
  let tokens = response.tokens;
  tokens.forEach(function (obj) {
    delete obj.chainId;
  });

  tokens.push(coins[chain]);

  return { tokens };
}

async function getTokensQuickswap(chain) {
  if (chain !== "polygon") {
    return { error: config.errorMessages.INVALID_CHAIN };
  }
  let tokens = quickswapSdk.tokens;
  tokens.forEach(function (obj) {
    delete obj.chainId;
  });
  tokens.push(coins[chain]);

  return { tokens };
}

async function getTokensUniswap(chain) {
  if (chain === "ethereum" || chain === "polygon") {
    url = `${config.uniswapBaseURL}`;
  } else {
    return { error: config.errorMessages.INVALID_CHAIN };
  }
  const { response, error } = await helper.getRequest({ url });
  if (error) {
    return error;
  }
  let tokens = response.tokens;

  if (chain === "polygon") {
    tokens = tokens.filter((obj) => obj.chainId === 137);

    tokens.forEach(function (obj) {
      delete obj.chainId;
      delete obj.extensions;
    });
  } else {
    tokens = tokens.filter((obj) => obj.chainId === 1);
    tokens.forEach(function (obj) {
      delete obj.chainId;
      delete obj.extensions;
    });
  }
  tokens.push(coins[chain]);

  return { tokens };
}

module.exports = {
  getSupportedTokens,
  getTokensOneInch,
  getTokensPancakeswap,
  getTokensQuickswap,
  getTokensUniswap,
};
