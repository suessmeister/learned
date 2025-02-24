#![allow(clippy::result_large_err)]

use anchor_lang::prelude::*;
pub mod instructions;
use crate::instructions::*;

declare_id!("6mYCAmpBBr8Xm6w1WhbVJKEeLKNbwUPxBftfbxGsnahh");

#[program]
pub mod learned {
    use super::*;

    pub fn init_teacher(ctx: Context<InitTeacher>, name: String, quality: u64) -> Result<()> 
    {
        instructions::init_teacher(ctx, name, quality);
        Ok(())
    }

    pub fn delete_teacher(ctx: Context<DeleteTeacher>, name: String) -> Result<()>
    {
        instructions::delete_teacher(ctx, name);
        Ok(())
    }
  }
