const config = require("./constants/index");
const helper = require("./utils/helper");
const quickswapSdk = require("quickswap-default-token-list");

async function getSupportedTokens(chain) {
  if (!config.supportedChains.includes(chain)) {
    return { error: config.errorMessages.INVALID_CHAIN };
  }
  const { tokens: oneInchTokens } = await getTokensOneInch(chain);

  const { tokens: uniswapTokens } = await getTokensUniswap(chain);

  const { tokens: quickswapTokens } = await getTokensQuickswap(chain);

  const { tokens: pancakeswapTokens } = await getTokensPancakeswap(chain);

  let tokens = [];

  if (oneInchTokens) {
    tokens.push(...oneInchTokens);
  }

  if (uniswapTokens) {
    tokens.push(...uniswapTokens);
  }

  if (quickswapTokens) {
    tokens.push(...quickswapTokens);
  }

  if (pancakeswapTokens) {
    tokens.push(...pancakeswapTokens);
  }

  tokens = tokens.filter(
    (value, index, self) =>
      index ===
      self.findIndex(
        (t) => t.address.toLowerCase() === value.address.toLowerCase()
      )
  );
  console.log(tokens);
  return { tokens };
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
  const { response, error } = await helper.getRequest({ url: `${url}/tokens` });
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
  return { tokens };
}

module.exports = {
  getSupportedTokens,
  getTokensOneInch,
  getTokensPancakeswap,
  getTokensQuickswap,
  getTokensUniswap
};
