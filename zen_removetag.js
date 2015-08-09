/**
 *  Zen-coding binding for AkelPad
 *  remove_tag
 */


AkelPad.Include("zen\\zen_editor.js");
AkelPad.Include("zen\\zen_actions.js");

zen_editor.setContext(AkelPad);
zen_editor.EnableRedraw(false);
zen_coding.runAction('remove_tag',zen_editor,zen_editor.GetThisExt());
zen_editor.EnableRedraw(true);
