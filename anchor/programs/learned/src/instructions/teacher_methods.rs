use anchor_lang::{context, prelude::*};



pub fn init_teacher(ctx: Context<InitTeacher>, name: String, quality: u64) -> Result<()> 
{
   let teacher_info = ctx.accounts.teacher.to_account_info();
   require!(!teacher_info.data_is_empty(), CustomError::AccountExists);

   // otherwise, actually initializes the teacher from the context
    let teacher = &mut ctx.accounts.teacher;
    teacher.name = name;
    teacher.quality = quality;
    Ok(())
}

pub fn delete_teacher(ctx: Context<DeleteTeacher>, name: String) -> Result<()> 
{
   let teacher = &mut ctx.accounts.teacher;
   require!(teacher.name == name, CustomError::TeacherNotFound);

   let payer = &mut ctx.accounts.payer;
   let teacher_money = **teacher.to_account_info().lamports.borrow();
   **teacher.to_account_info().lamports.borrow_mut() = 0;
   **payer.to_account_info().lamports.borrow_mut() += teacher_money;

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

#[derive(Accounts)]
pub struct DeleteTeacher<'info>
{
   #[account(mut)]
   pub payer: Signer<'info>,

   #[account(
      mut,
      close = payer,
      seeds = [b"teacher", payer.key().as_ref()],
      bump,
   )]
   pub teacher: Account<'info, Teacher>
}


#[account]
#[derive(InitSpace)]
pub struct Teacher {
   #[max_len(50)]
   pub name: String,

   pub quality: u64,
}


#[error_code]
pub enum CustomError
{
   #[msg("Teacher name does not exist or you are not priveleged to do this.")]
   TeacherNotFound,

   #[msg("This Teacher account is already initialized.")]
   AccountExists
}