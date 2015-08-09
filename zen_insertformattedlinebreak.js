/**
 *  Zen-coding binding for AkelPad
 *  insert_formatted_line_break
 */


AkelPad.Include("zen\\zen_editor.js");
AkelPad.Include("zen\\zen_actions.js");

zen_editor.setContext(AkelPad);
zen_editor.EnableRedraw(false);
zen_coding.runAction('insert_formatted_line_break',zen_editor,zen_editor.GetThisExt());
zen_editor.EnableRedraw(true);
