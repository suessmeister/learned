import * as anchor from '@coral-xyz/anchor'
import {Program} from '@coral-xyz/anchor'
import {Keypair, PublicKey} from '@solana/web3.js'
import {Learned} from '../target/types/learned'

describe('learned', () => {
  // Configure the client to use the local cluster.
  const provider = anchor.AnchorProvider.env()
  anchor.setProvider(provider)
  const wallet = provider.wallet as anchor.Wallet
  const program = anchor.workspace.Learned as Program<Learned>

  it('init teacher', async () => {
    const initTeacherInstruction = await program.methods.initTeacher(
      "joseph teach",
      new anchor.BN(100),
    ).instruction();

    // Derive the PDA for the teacher account
    const [teacherPDA, bump] = PublicKey.findProgramAddressSync(
      [Buffer.from("teacher"), wallet.publicKey.toBuffer()], //match seeds
      program.programId
    );

    // PDA for this teacher
    console.log("Derived Teacher PDA:", teacherPDA.toBase58());

    // Note, we have a PDA address, but it is currently empty!!!
    const accountInfo = await provider.connection.getAccountInfo(teacherPDA);

    // uncomment these lines and you'll see accountInfo is empty :) 
    // if (accountInfo === null) {
    //   throw new Error("you fucked up!");
    // }

    const blockhashWithContext = await provider.connection.getLatestBlockhash();
    const tx = new anchor.web3.Transaction(
      {
        feePayer: wallet.publicKey,
        blockhash: blockhashWithContext.blockhash,
        lastValidBlockHeight: blockhashWithContext.lastValidBlockHeight,
      }
    )
      .add(initTeacherInstruction);
    const signature = await anchor.web3.sendAndConfirmTransaction(provider.connection, tx, [wallet.payer]);

    const updatedInfo = await provider.connection.getAccountInfo(teacherPDA);
    if (updatedInfo === null) {
      throw new Error("FUCKEEEEDDDDD"); //should never reach here! 
    }


    // so, now we know that the account is garaunteed to exist! 
    // please use fetch. otherwise you have to decode a raw binary -- gross! 
    const teacherData = await program.account.teacher.fetch(teacherPDA)
    console.log("\ninit test----------------------------------------------")
    console.log("teacher name is: ", teacherData.name.toString());
    console.log("teacher quality is: ", teacherData.quality.toNumber())
    console.log("init test----------------------------------------------\n")


  });


})
