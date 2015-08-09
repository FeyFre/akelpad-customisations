/**
 * Zen Coding file i/o interface. Plugin developers should implement this 
 * interface in order to make some actions to work
 * 
 * @author Sergey Chikuyonok (serge.che@gmail.com)
 * @link http://chikuyonok.ru
 * @version 0.65
 */
var zen_file = (function(){
	return {
		/**
		 * Read file content and return it
		 * @param {String} path File's relative or absolute path
		 * @return {String}
		 */
		read: function(path) {
			var filename = AkelPad.MemAlloc((path.length+1)*_TSIZE);
			AkelPad.MemCopy(filename, path, _TSTR);
			var hFile = AkelPad.SystemFunction().Call("kernel32::CreateFile"+_TCHAR,
				filename,
				0x080000000, /*GENERIC_READ*/
				1,/*FILE_SHARE_READ*/
				0,/*LPSECURITY_ATTRIBUTES*/
				3,/*OPEN_EXISTING*/
				0x00000080,/*FILE_ATTRIBUTE_NORMAL*/
				0);
			if(hFile == -1/*INVALID_HANDLE_VALUE*/)
			{
				AkelPad.MemFree(filename);
				return;
			}
			AkelPad.MemFree(filename);
			var size = AkelPad.SystemFunction().Call("kernel32::GetFileSize", hFile, 0);
			var mem = AkelPad.MemAlloc(size);
			var lpread = AkelPad.MemAlloc(4/*DWORD*/);
			AkelPad.MemCopy(lpread, 0, 3 /*DT_DWORD*/);
			var res = AkelPad.SystemFunction().Call("kernel32::ReadFile",
				hFile, mem, size, lpread,0);
			var result = [];
			if(res)
			{
				size = AkelPad.MemRead(lpread, 3 /*DT_DWORD*/);
				var i = 0;
				for(;i<size;i++)
				{
					var data = AkelPad.MemRead(mem + i, 5 /*DT_BYTE*/);
					result.push(String.fromCharCode(data));
				}
			}
			AkelPad.SystemFunction().Call("kernel32::CloseHandle",hFile);
			AkelPad.MemFree(mem);
			return result.join('');
		},
		/**
		 * Locate <code>file_name</code> file that relates to <code>editor_file</code>.
		 * File name may be absolute or relative path
		 * 
		 * <b>Dealing with absolute path.</b>
		 * Many modern editors have a "project" support as information unit, but you
		 * should not rely on project path to find file with absolute path. First,
		 * it requires user to create a project before using this method (and this 
		 * is not acutually Zen). Second, project path doesn't always points to
		 * to website's document root folder: it may point, for example, to an 
		 * upper folder which contains server-side scripts.
		 * 
		 * For better result, you should use the following algorithm in locating
		 * absolute resources:
		 * 1) Get parent folder for <code>editor_file</code> as a start point
		 * 2) Append required <code>file_name</code> to start point and test if
		 * file exists
		 * 3) If it doesn't exists, move start point one level up (to parent folder)
		 * and repeat step 2.
		 * 
		 * @param {String} editor_file
		 * @param {String} file_name
		 * @return {String|null} Returns null if <code>file_name</code> cannot be located
		 */
		locateFile: function(editor_file, file_name) {
			var fso = new ActiveXObject("Scripting.FileSystemObject");
			var comps = editor_file.split("\\");
				comps.pop();
			while(true)
			{
				if(fso.FileExists(comps.join("\\")+"\\"+file_name))
					return comps.join("\\")+"\\"+file_name;
				comps.pop();
				if(pop.length == 0)
				{
					var temp = editor_file.split("\\");
					temp.pop();
					temp.push(file_name);
					return temp.joint("\\");
				}
			}
			return editor_file;
		},
		/**
		 * Creates absolute path by concatenating <code>parent</code> and <code>file_name</code>.
		 * If <code>parent</code> points to file, its parent directory is used
		 * @param {String} parent
		 * @param {String} file_name
		 * @return {String}
		 */
		createPath: function(parent, file_name) {
			var fso = new ActiveXObject("Scripting.FileSystemObject");
			if(fso.FileExists(parent))
			{
				var len = parent.length;
				var t = parent.lastIndexOf("\\");
				var str = parent.substr(0, t);
				return str + "\\"+file_name;
			}
			if(parent.lastIndexOf("\\") == parent.length-1)
				return parent + file_name;
			return parent+"\\"+file_name;
			
		},
		
		/**
		 * Saves <code>content</code> as <code>file</code>
		 * @param {String} file File's asolute path
		 * @param {String} content File content
		 */
		save: function(file, content) {
			var len = content.length;
			var mem = AkelPad.MemAlloc(len);
			var i =0;
			for(;i<len;i++)
			{
				AkelPad.MemCopy(mem +i, content.charCodeAt(i), 5 /*DT_BYTE*/);
			}
			var filename = AkelPad.MemAlloc((file.length+1)*_TSIZE);
			AkelPad.MemCopy(filename, file, _TSTR);
			var hFile = AkelPad.SystemFunction().Call("kernel32::CreateFile"+_TCHAR,
				filename,
				0x0C0000000, /*GENERIC_READ|GENERIC_WRITE*/
				0,/*no sharing*/
				0,/*LPSECURITY_ATTRIBUTES*/
				2,/*CREATE_ALWAYS*/
				0x00000080,/*FILE_ATTRIBUTE_NORMAL*/
				0);
			if(hFile == -1/*INVALID_HANDLE_VALUE*/)
			{
				AkelPad.MemFree(filename);
				AkelPad.MemFree(mem);
				return;
			}
			AkelPad.MemFree(filename);
			var lpwrote = AkelPad.MemAlloc(4/*sizeof(DWORD)*/);
			AkelPad.MemCopy(lpwrote, 0, 3 /*DT_DWORD*/);
			var towrite = len;
			var wrote = 0;
			while(wrote < len)
			{
				var res = AkelPad.SystemFunction().Call("kernel32::WriteFile",
					hFile,
					mem + wrote,
					towrite,
					lpwrote,
					0);
				if(res)
				{
					wrote += AkelPad.MemRead(lpwrote, 3 /*DT_DWORD*/);
					towrite -= AkelPad.MemRead(lpwrote, 3 /*DT_DWORD*/);
				}
				else break;
			}
			AkelPad.MemFree(lpwrote);
			AkelPad.MemFree(mem);
			AkelPad.SystemFunction().Call("kernel32::CloseHandle", hFile);
		},
		/**
		 * Returns file extention in lower case
		 * @param {String} file
		 * @return {String}
		 */
		getExt: function(file) {
			var m = (file || '').match(/\.([\w\-]+)$/);
			return m ? m[1].toLowerCase() : '';
		}
	};
})();