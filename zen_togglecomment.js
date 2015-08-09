/**
 *  Zen-coding binding for AkelPad
 *  toggle_comment
 */


AkelPad.Include("zen\\zen_editor.js");
AkelPad.Include("zen\\zen_actions.js");
zen_editor.setContext(AkelPad);
zen_editor.EnableRedraw(false);
zen_coding.runAction('toggle_comment',zen_editor,zen_editor.GetThisExt());
zen_editor.EnableRedraw(true);
