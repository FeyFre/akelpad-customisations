// http://akelpad.sourceforge.net/forum/viewtopic.php?p=9326#9326
// http://outstanding.hmarka.net/akelpad/scripts/autotag.js
//
// Version: 1.4 (2013.05.20) (by VladSh)
//		Исправлено неверное определение тэга при указании нескольких слов текста после открывающего тэга
// Version: 1.3 (2012.10.20) (by VladSh)
//		Исправлено:
//		- неправильное срабатывание после уже установленного закрывающего символа;
//		- раздвоение закрывающего символа в некоторых случаях
//		+ Оптимизация кода
// Version: 1.2 (2011.06.24) (by Poma)
//		Now correctly closes tags with attributes
// Version: 1.1 (2010.09.27) (by VladSh)
//		Added handling BBCode-style tags
// Version: 1.0 (2010.09.26) (by FeyFre)
//		Initial release
//
// Examples:
//	Call("Scripts::Main", 1, "AutoTag.js", `"<" ">"`) or without arguments		;for HTML	(Ctrl+.)
//	Call("Scripts::Main", 1, "AutoTag.js", `"[" "]"`)		;for BBCode (Ctlr+])
// Usage:
//	For smooth integration into AkelPad you can assign hotkey for this Script, which equal keystroke correspondent closing tag style you using (i.e ] for BBCode and Shift+. for XML/HTML/SGML derived markups)

var hWndEdit = AkelPad.GetEditWnd();
if (hWndEdit)
{
var qStart = "<";
var qEnd = ">";
if (WScript.Arguments.length >= 1) {
	qStart = WScript.Arguments(0) || qStart;
	if (WScript.Arguments.length >= 2) {
		qEnd = WScript.Arguments(1) || qEnd;
	}
}

var lEnd = qEnd.length;
var nCaret = AkelPad.GetSelStart();
var worker = nCaret - lEnd;
var text = "";
var tag = new Array();
var ntag;
while (worker >= 0)		// берём по одному символу от каретки до открывающего символа
{
	ntag = worker + lEnd;	// текущая позиция
	text = AkelPad.GetTextRange(worker, ntag);
	if (text.match(/[^<(){}\[\]\\\/]/i)) {		// собираем тэг
		if (text != " " && text != ">")
			tag.push(text);
		else
			tag = new Array();
	}
	else if (text == qStart) {		// получаем тэг и добавляем
		tag = tag.reverse().join("");
		text = qStart + "/" + tag;

		ntag += tag.length;	// текущая позиция + длина тэга
		if (AkelPad.GetTextRange(ntag, ntag + lEnd) != qEnd &&		// закрывающий символ тэга перед значением
			AkelPad.GetTextRange(nCaret - lEnd, nCaret) != qEnd) {	// закрывающий символ тэга, когда нет текста
			text = qEnd + text;
			nCaret += lEnd;
		}
		if (tag.substr(tag.length - lEnd) != qEnd)
			text += qEnd;		// закрывающий символ закрывающего тэга

		AkelPad.ReplaceSel(text);
		AkelPad.SetSel(nCaret, nCaret);

		WScript.Quit();
	}
	else break;
	worker --;
}

AkelPad.ReplaceSel(qEnd);
}