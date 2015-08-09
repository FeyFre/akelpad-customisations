/**
 *  Zen-coding binding for AkelPad
 *  expand_abbreviation
 */


AkelPad.Include("zen\\zen_editor.js");
AkelPad.Include("zen\\zen_actions.js");

zen_editor.setContext(AkelPad);
zen_editor.EnableRedraw(false);
//! ARGS: editor [syntax] [profile_name]
zen_coding.runAction('expand_abbreviation',zen_editor,zen_editor.GetThisExt());
zen_editor.EnableRedraw(true);
