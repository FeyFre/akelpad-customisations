/**
 *  Zen-coding binding for AkelPad
 *  matching_pair
 */


AkelPad.Include("zen\\zen_editor.js");
AkelPad.Include("zen\\zen_actions.js");

zen_editor.setContext(AkelPad);
zen_editor.EnableRedraw(false);
zen_coding.runAction('matching_pair',zen_editor,zen_editor.GetThisExt());
zen_editor.EnableRedraw(true);
