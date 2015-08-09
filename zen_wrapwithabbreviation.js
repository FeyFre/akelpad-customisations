/**
 *  Zen-coding binding for AkelPad
 *  wrap_with_abbreviation
 */


AkelPad.Include("zen\\zen_editor.js");
AkelPad.Include("zen\\zen_actions.js");

zen_editor.setContext(AkelPad);
zen_editor.EnableRedraw(false);
//! ARGS: editor abbr [syntax] [profile_name]
zen_coding.runAction('wrap_with_abbreviation',zen_editor,zen_editor.prompt("Enter abbreviation to wrap by"));
zen_editor.EnableRedraw(true);
tr>td>td>b>i>b