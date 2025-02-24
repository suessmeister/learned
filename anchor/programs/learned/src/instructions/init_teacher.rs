use anchor_lang::{context, prelude::*};



pub fn init_teacher(ctx: Context<InitTeacher>, name: String, quality: u64) -> Result<()> 
{
    let teacher = &mut ctx.accounts.teacher;
    teacher.name = name;
    teacher.quality = quality;
    Ok(())
}

#[derive(Accounts)]
pub struct InitTeacher<'info> 
{
   #[account(mut)]
   pub payer: Signer<'info>,

   #[account(
      init, 
      payer = payer,
      space = 8 + Teacher::INIT_SPACE,
      seeds = [b"teacher", payer.key().as_ref()],
      bump,
   )]
   pub teacher: Account<'info, Teacher>,

   pub system_program: Program<'info, System>
}


#[account]
#[derive(InitSpace)]
pub struct Teacher {
   #[max_len(50)]
   pub name: String,

   pub quality: u64,
}