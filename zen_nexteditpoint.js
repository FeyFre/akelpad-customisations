/**
 *  Zen-coding binding for AkelPad
 *  next_edit_point
 */


AkelPad.Include("zen\\zen_editor.js");
AkelPad.Include("zen\\zen_actions.js");

zen_editor.setContext(AkelPad);
zen_editor.EnableRedraw(false);
zen_coding.runAction('next_edit_point',zen_editor,zen_editor.GetThisExt());
zen_editor.EnableRedraw(true);
