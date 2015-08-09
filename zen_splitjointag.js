/**
 *  Zen-coding binding for AkelPad
 *  split_join_tag
 */


AkelPad.Include("zen\\zen_editor.js");
AkelPad.Include("zen\\zen_actions.js");

zen_editor.setContext(AkelPad);
zen_editor.EnableRedraw(false);
//! ARGS: editor [profile_name]
zen_coding.runAction('split_join_tag',zen_editor,zen_editor.GetThisExt());
zen_editor.EnableRedraw(true);
