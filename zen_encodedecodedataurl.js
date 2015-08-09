/**
 *  Zen-coding binding for AkelPad
 *  encode_decode_data_url
 */


AkelPad.Include("zen\\zen_editor.js");
AkelPad.Include("zen\\zen_actions.js");

zen_editor.setContext(AkelPad);
zen_editor.EnableRedraw(false);
zen_coding.runAction('encode_decode_data_url',zen_editor,zen_editor.GetThisExt());
zen_editor.EnableRedraw(true);