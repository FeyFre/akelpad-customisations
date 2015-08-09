/**
 * High-level editor interface that communicates with underlying editor (like
 * TinyMCE, CKEditor, etc.) or browser.
 * Basically, you should call <code>zen_editor.setContext(obj)</code> method to
 * set up undelying editor context before using any other method.
 *
 * This interface is used by <i>zen_actions.js</i> for performing different
 * actions like <b>Expand abbreviation</b>
 *
 * @example
 * var textarea = document.getElemenetsByTagName('textarea')[0];
 * zen_editor.setContext(textarea);
 * //now you are ready to use editor object
 * zen_editor.getSelectionRange();
 *
 * @author Sergey Chikuyonok (serge.che@gmail.com)
 * @link http://chikuyonok.ru
 */

var zen_editor = (function(){
	var context = null;
	//! Based on Instructor's selCompleteLine
	var getCompleteLine = function(nMinSel, nMaxSel)
	{
		var nMinLine;
		var nMaxLine;
		var nMinLineIndex = 0;
		var nMaxLineIndex;
		var nMaxLineLength;
		if (nMinSel <= nMaxSel)
		{
			var hWndEdit = context.GetEditWnd();
			nMinLine = context.SendMessage(hWndEdit, 1078 /*EM_EXLINEFROMCHAR*/, 0, nMinSel);
			nMaxLine = context.SendMessage(hWndEdit, 1078 /*EM_EXLINEFROMCHAR*/, 0, nMaxSel);
			nMinLineIndex = context.SendMessage(hWndEdit, 187 /*EM_LINEINDEX*/, nMinLine, 0);
			nMaxLineIndex = context.SendMessage(hWndEdit, 187 /*EM_LINEINDEX*/, nMaxLine, 0);
			nMaxLineLength = context.SendMessage(hWndEdit, 193 /*EM_LINELENGTH*/, nMaxSel, 0);
			if (nMaxLineIndex == nMaxSel & nMinSel != nMaxSel) --nMaxLine;
			else if (nMaxLineLength) nMaxSel = nMaxLineIndex + nMaxLineLength + 1;
			nMinSel = nMinLineIndex;
			if (nMinSel != nMaxSel) nMaxSel = nMaxSel - 1;
			return {
					start: nMinSel,
					end: nMaxSel
					};
		}
		return {
				start: 0,
				end: 0
				};
	}
	return {
		EnableRedraw: function(bRedraw) {
			var hWnd = AkelPad.GetEditWnd();
			AkelPad.SendMessage(hWnd, 11 /*WM_SETREDRAW*/, bRedraw, 0);
			if(!bRedraw)
				return;
			AkelPad.SystemFunction().Call("user32::InvalidateRect",hWnd,0,true);
		},
		GetThisExt: function()
		{
			var file = AkelPad.GetEditFile(0);
			var ext = "html";
			if(file.length>0)
			{
				var arr = file.split("\\");
				var fname = arr[arr.length-1];
				if(fname.match(/\./))
				{
					arr = fname.split('.');
					return arr[arr.length-1];
				}
				else return "";
			}
			return ext;
		},
		/**
		 * Setup underlying editor context. You should call this method
		 * <code>before</code> using any Zen Coding action.
		 * @param {Object} context
		 */
		setContext: function(acontext) {
			context = acontext;
		},

		/**
		 * Returns character indexes of selected text: object with <code>start</code>
		 * and <code>end</code> properties. If there's no selection, should return
		 * object with <code>start</code> and <code>end</code> properties referring
		 * to current caret position
		 * @return {Object}
		 * @example
		 * var selection = zen_editor.getSelectionRange();
		 * alert(selection.start + ', ' + selection.end);
		 */
		getSelectionRange: function() {
			return {
				start: context.GetSelStart(),
				end: context.GetSelEnd()
			};
		},

		/**
		 * Creates selection from <code>start</code> to <code>end</code> character
		 * indexes. If <code>end</code> is ommited, this method should place caret
		 * and <code>start</code> index
		 * @param {Number} start
		 * @param {Number} [end]
		 * @example
		 * zen_editor.createSelection(10, 40);
		 *
		 * //move caret to 15th character
		 * zen_editor.createSelection(15);
		 */
		createSelection: function(start, end) {
			context.SetSel(start, end);
		},

		/**
		 * Returns current line's start and end indexes as object with <code>start</code>
		 * and <code>end</code> properties
		 * @return {Object}
		 * @example
		 * var range = zen_editor.getCurrentLineRange();
		 * alert(range.start + ', ' + range.end);
		 */
		getCurrentLineRange: function() {
			var r = getCompleteLine(context.GetSelStart(),context.GetSelEnd());
			return r;
		},

		/**
		 * Returns current caret position
		 * @return {Number|null}
		 */
		getCaretPos: function(){
			return context.GetSelEnd();
		},

		/**
		 * Set new caret position
		 * @param {Number} pos Caret position
		 */
		setCaretPos: function(pos){
			context.SetSel(pos, pos);
		},

		/**
		 * Returns content of current line
		 * @return {String}
		 */
		getCurrentLine: function() {
			var r = this.getSelectionRange();
			var range = getCompleteLine(r.start, r.end);
			context.SetSel(range.start, range.end);
			var t = context.GetSelText();
			context.SetSel(r.start, r.stop);
			return t;
		},

		/**
		 * Replace editor's content or it's part (from <code>start</code> to
		 * <code>end</code> index). If <code>value</code> contains
		 * <code>caret_placeholder</code>, the editor will put caret into
		 * this position. If you skip <code>start</code> and <code>end</code>
		 * arguments, the whole target's content will be replaced with
		 * <code>value</code>.
		 *
		 * If you pass <code>start</code> argument only,
		 * the <code>value</code> will be placed at <code>start</code> string
		 * index of current content.
		 *
		 * If you pass <code>start</code> and <code>end</code> arguments,
		 * the corresponding substring of current target's content will be
		 * replaced with <code>value</code>.
		 * @param {String} value Content you want to paste
		 * @param {Number} [start] Start index of editor's content
		 * @param {Number} [end] End index of editor's content
		 */
		replaceContent: function(value, start, end, no_indent) {
			var caret_marker = zen_coding.getCaretPlaceholder();
			var caretpos = this.getCaretPos();
			var newpos = value.indexOf(caret_marker);
			if(start == undefined && end == undefined)
			{
				start = 0;
				end = -1;
			}
			else if(end == undefined)
			{
				end = start
			}
			if(newpos != -1)
			{
				caretpos = start + newpos;
				value = value.split(caret_marker).join("");
			}
			context.SetSel(start, end);
			context.ReplaceSel(value);
			this.setCaretPos(caretpos);
		},

		/**
		 * Returns editor's content
		 * @return {String}
		 */
		getContent: function(){
			return context.GetTextRange(0, -1);
		},

		/**
		 * Returns current editor's syntax mode
		 * @return {String}
		 */
		getSyntax: function(){
			return 'html';
		},

		/**
		 * Returns current output profile name (@see zen_coding#setupProfile)
		 * @return {String}
		 */
		getProfileName: function() {
			return 'xhtml';
		},

		/**
		 * Ask user to enter something
		 * @param {String} title Dialog title
		 * @return {String} Entered data
		 * @since 0.65
		 */
		prompt: function(title) {
			return context.InputBox(context.GetEditWnd(), "Zen-Coding", title, "");
		},

		/**
		 * Returns current selection
		 * @return {String}
		 * @since 0.65
		 */
		getSelection: function() {
			return context.GetSelText();
		},

		/**
		 * Returns current editor's file path
		 * @return {String}
		 * @since 0.65
		 */
		getFilePath: function() {
			return context.GetEditFile(0);
		}
	};
})();
