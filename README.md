# Dollar-Cost Averaging (DCA) bot with Paraswap and Pocket Network

**DCA**: _It is an investment strategy in which the user divides up the total amount to be invested across periodic purchases of a target asset in an effort to reduce the impact of volatility on the overall purchase._

### This bot allows the user to automatically purchase 100 USDC worth of ETH repeatedly at a 7 days interval.

## Prerequisites

1. Install required dependencies  
```yarn install```

2. Create `.env` file. Fill up the variables from `.env.sample` to it.  
```
PRIVATE_KEY=
USER_ADDRESS=
POKT_KEY=
```

! Make sure that the `PRIVATE_KEY` corresponds to the `USER_ADDRESS`.\
! To get `POKT_KEY`, head over to [Pocket Portal](https://bit.ly/PocketPortal_SignUp)

3. Fill up the `USER_ADDRESS` address with `USDC` and some `ETH` to pay for the gas.

## Starting the Bot

1. Simply run `yarn start`

You should get a similiar output in terminal:
![](https://i.imgur.com/YtiVevu.png)
