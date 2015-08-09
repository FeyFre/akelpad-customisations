/**
 *  Zen-coding binding for AkelPad
 *  match_pair_inward
 */


AkelPad.Include("zen\\zen_editor.js");
AkelPad.Include("zen\\zen_actions.js");

zen_editor.setContext(AkelPad);
zen_editor.EnableRedraw(false);
zen_coding.runAction('match_pair_inward',zen_editor,zen_editor.GetThisExt());
zen_editor.EnableRedraw(true);
