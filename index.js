require("dotenv").config();
const {ParaSwap} = require("paraswap")
const HDWalletProvider = require("@truffle/hdwallet-provider");
const Web3 = require("web3");
const { BN } = require("web3-utils");

const provider = `https://eth-mainnet.gateway.pokt.network/v1/lb/${process.env.POKT_KEY}`
const paraSwap = new ParaSwap().setWeb3Provider(provider);
const web3 = new Web3(new HDWalletProvider(
  process.env.PRIVATE_KEY,
  provider
));
const userAddress = process.env.USER_ADDRESS

const USDC = "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48"
const ETH = "0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee"
const usdcToSellPerInterval = 100
const usdcToSellInWeiBNPerInterval = new BN(usdcToSellPerInterval.toString()).mul(new BN("1000000"))

const intervalInDays = 7;
const intervalInMilliSeconds = intervalInDays * 24 * 60 * 60 * 1000;

const MAX_UINT256 = "115792089237316195423570985008687907853269984665640564039457584007913129639935"

const main = async () => {
  console.log("Investing 100 USDC to ETH ⏰ ....");

  // check allowance first
  const allowance = (await paraSwap.getAllowance(userAddress, USDC)).allowance;
  if(new BN(allowance).lt(usdcToSellInWeiBNPerInterval)) {
    // if low allowance, then set it to infinite
    const txHash = await paraSwap.approveToken(MAX_UINT256, userAddress, USDC);
    console.log(`USDC Approved. Txn: ${txHash}`)
  }

  // Execute USDC -> ETH swap
  const priceRoute = await paraSwap.getRate(
    USDC,
    ETH,
    usdcToSellInWeiBNPerInterval.toString(),
  );
  const txParams = await paraSwap.buildTx(
    USDC,
    ETH,
    usdcToSellInWeiBNPerInterval.toString(),
    new BN(priceRoute.destAmount).mul(new BN("99")).div(new BN("100")).toString(), // set 1% slippage for destAmount
    priceRoute,
    userAddress,
    "dca",
    userAddress,
  );
  web3.eth.sendTransaction(
    txParams,
    async (err, transactionHash) => {
      if (err) {
        console.log(err)
        console.log("Retrying :(");
        // retry instantly in this case
        main();
      }
      
      console.log('Txn: ', transactionHash);
      console.log("Swap successful ✅");
      
      // schedule a repeat
      setTimeout(main, intervalInMilliSeconds);
    },
  );
}

console.log("Bot Started!");
main();