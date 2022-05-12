const ZonuDexFeeReceiver = artifacts.require("ZonuDexFeeReceiver");
const ZonuDexFeeSetter = artifacts.require("ZonuDexFeeSetter");
const ZonuDexDeployer = artifacts.require("ZonuDexDeployer");
const ZonuDexFactory = artifacts.require("ZonuDexFactory");
const ZonuDexERC20 = artifacts.require("ZonuDexERC20");
const WONE = artifacts.require("WONE");


const argValue = (arg, defaultValue) => process.argv.includes(arg) ? process.argv[process.argv.indexOf(arg) + 1] : defaultValue
const network = () => argValue('--network', 'local')
const ZonuDex = "0xd91e528577e1Caf2edb60d86ae2AFaEeF405E3F6";

module.exports = async (deployer) => {

    const BN = web3.utils.toBN;
    const bnWithDecimals = (number, decimals) => BN(number).mul(BN(10).pow(BN(decimals)));
    const senderAccount = (await web3.eth.getAccounts())[0];

    if (network() === "harmony_testnet") {


        console.log();
        console.log(":: Deploying WONE"); 
        // await deployer.deploy(WONE)
        const WONEInstance = await WONE.at('0x7466d7d0c21fa05f32f5a0fa27e12bdc06348ce2'); //WONE ON HARMONY TESTNET
        // const WONEInstance = await WONE.deployed();
        console.log();
        console.log(":: WONE DEPOSIT CALL");
        await WONEInstance.deposit({ from: senderAccount, value: 1 });
        console.log();

        console.log();
        console.log(":: Init ZonuDex Deployer");
        await deployer.deploy(ZonuDexDeployer, ZonuDex, senderAccount, WONEInstance.address, [WONEInstance.address], [ZonuDex], [25]);
        const dexSwapDeployer = await ZonuDexDeployer.deployed();

        console.log();
        console.log(":: Start Sending 1 WEI ...");
        await dexSwapDeployer.send(1, {from: senderAccount}); 


        console.log();
        console.log(":: Sent deployment reimbursement");
        await dexSwapDeployer.deploy({from: senderAccount})
        console.log("Deployed dexSwap");


        console.log();
        console.log(":: Deploying Factory");
        await deployer.deploy(ZonuDexFactory, senderAccount);
        const ZonuDexFactoryInstance = await ZonuDexFactory.deployed();
        
        
        console.log();
        console.log(":: Start Deploying ZonuDex LP");
        await deployer.deploy(ZonuDexERC20);
        const ZonuDexLP = await ZonuDexERC20.deployed();
        

        console.log(":: Start Deploying FeeReceiver");
        await deployer.deploy(ZonuDexFeeReceiver, senderAccount, ZonuDexFactoryInstance.address, WONEInstance.address, ZonuDex, senderAccount);
        const ZonuDexFeeReceiverInstance =  await ZonuDexFeeReceiver.deployed();
        console.log();


        console.log(":: Start Deploying FeeSetter");
        await deployer.deploy(ZonuDexFeeSetter, senderAccount, ZonuDexFactoryInstance.address);
        const ZonuDexFeeSetterInstance = await ZonuDexFeeSetter.deployed();


        console.log();
        console.log(":: Setting Correct FeeSetter in Factory");
        await ZonuDexFactoryInstance.setFeeToSetter(ZonuDexFeeSetterInstance.address);


        console.log();
        console.log(":: Transfer Ownership FeeReceiver");
        await ZonuDexFeeReceiverInstance.transferOwnership(senderAccount);


        console.log();
        console.log(":: Transfer Ownership FeeSetter");
        await ZonuDexFeeSetterInstance.transferOwnership(senderAccount);

        console.log();
        console.log(":: Updating Protocol FeeReceiver");
        await ZonuDexFeeReceiverInstance.changeReceivers(ZonuDex, senderAccount, {from: senderAccount});

        
        console.log();
        console.log("====================================================================");
        console.log(`Deployer Address:`,     dexSwapDeployer.address);
        console.log("====================================================================");

        console.log("====================================================================");
        console.log(`Factory Address:`,      ZonuDexFactoryInstance.address);
        console.log("====================================================================");

        console.log("====================================================================");
        console.log(`ZonuDex LP Address:`,   ZonuDexLP.address);
        console.log("====================================================================");

        console.log("====================================================================");
        console.log(`Fee Setter Address:`,   ZonuDexFeeSetterInstance.address);
        console.log("====================================================================");

        console.log("====================================================================");
        console.log(`Fee Receiver Address:`, ZonuDexFeeReceiverInstance.address);
        console.log("====================================================================");
        

        console.log("=============================================================================");
        console.log(`Code Hash:`, await ZonuDexFactoryInstance.INIT_CODE_PAIR_HASH());
        console.log("=============================================================================");

        console.log("DONE");

    } else if (network() === "harmony") {

        console.log();
        console.log(":: Deploying WONE"); 
        // await deployer.deploy(WONE)
        const WONEInstance = await WONE.at('0xcF664087a5bB0237a0BAd6742852ec6c8d69A27a'); //WONE ON HARMONY MAINNET
        // const WONEInstance = await WONE.deployed();
        console.log();
        console.log(":: WONE DEPOSIT CALL");
        await WONEInstance.deposit({ from: senderAccount, value: 1 });
        console.log();


        console.log();
        console.log(":: Init ZonuDex Deployer");
        await deployer.deploy(ZonuDexDeployer, ZonuDex, senderAccount, WONEInstance.address, [WONEInstance.address], [ZonuDex], [25]);
        const dexSwapDeployer = await ZonuDexDeployer.deployed();

        console.log();
        console.log(":: Start Sending 1 WEI ...");
        await dexSwapDeployer.send(1, {from: senderAccount}); 


        console.log();
        console.log(":: Sent deployment reimbursement");
        await dexSwapDeployer.deploy({from: senderAccount})
        console.log("Deployed dexSwap");


        console.log();
        console.log(":: Deploying Factory");
        await deployer.deploy(ZonuDexFactory, senderAccount);
        const ZonuDexFactoryInstance = await ZonuDexFactory.deployed();
        
        
        console.log();
        console.log(":: Start Deploying ZonuDex LP");
        await deployer.deploy(ZonuDexERC20);
        const ZonuDexLP = await ZonuDexERC20.deployed();
        

        console.log(":: Start Deploying FeeReceiver");
        await deployer.deploy(ZonuDexFeeReceiver, senderAccount, ZonuDexFactoryInstance.address, WONEInstance.address, ZonuDex, senderAccount);
        const ZonuDexFeeReceiverInstance =  await ZonuDexFeeReceiver.deployed();
        console.log();


        console.log(":: Start Deploying FeeSetter");
        await deployer.deploy(ZonuDexFeeSetter, senderAccount, ZonuDexFactoryInstance.address);
        const ZonuDexFeeSetterInstance = await ZonuDexFeeSetter.deployed();


        console.log();
        console.log(":: Setting Correct FeeSetter in Factory");
        await ZonuDexFactoryInstance.setFeeToSetter(ZonuDexFeeSetterInstance.address);


        console.log();
        console.log(":: Transfer Ownership FeeReceiver");
        await ZonuDexFeeReceiverInstance.transferOwnership(senderAccount);


        console.log();
        console.log(":: Transfer Ownership FeeSetter");
        await ZonuDexFeeSetterInstance.transferOwnership(senderAccount);

        console.log();
        console.log(":: Updating Protocol FeeReceiver");
        await ZonuDexFeeReceiverInstance.changeReceivers(ZonuDex, senderAccount, {from: senderAccount});

        
        console.log();
        console.log("====================================================================");
        console.log(`Deployer Address:`,     dexSwapDeployer.address);
        console.log("====================================================================");

        console.log("====================================================================");
        console.log(`Factory Address:`,      ZonuDexFactoryInstance.address);
        console.log("====================================================================");

        console.log("====================================================================");
        console.log(`ZonuDex LP Address:`,   ZonuDexLP.address);
        console.log("====================================================================");

        console.log("====================================================================");
        console.log(`Fee Setter Address:`,   ZonuDexFeeSetterInstance.address);
        console.log("====================================================================");

        console.log("====================================================================");
        console.log(`Fee Receiver Address:`, ZonuDexFeeReceiverInstance.address);
        console.log("====================================================================");

        console.log("=============================================================================");
        console.log(`Code Hash:`, await ZonuDexFactoryInstance.INIT_CODE_PAIR_HASH());
        console.log("=============================================================================");

        console.log("DONE");
    }
};
