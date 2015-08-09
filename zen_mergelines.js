/**
 *  Zen-coding binding for AkelPad
 *  merge_lines
 */


AkelPad.Include("zen\\zen_editor.js");
AkelPad.Include("zen\\zen_actions.js");

zen_editor.setContext(AkelPad);
zen_editor.EnableRedraw(false);
zen_coding.runAction('merge_lines',zen_editor,zen_editor.GetThisExt());
zen_editor.EnableRedraw(true);