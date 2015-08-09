///
/// Panych Y.W. aka FeyFre 2010-2014
/// This files are distributed under BSD-license
/// 
//! ����� �� AkelDLL.h
DKS_LEFT	=1
DKS_RIGHT	=2
DKS_TOP	=3
DKS_BOTTOM	=4

//Dock flags
DKF_OWNTHREAD		=0x00000001
DKF_FIXEDSIZE		=0x00000002
DKF_DRAGDROP		=0x00000004
DKF_HIDDEN			=0x00000008
DKF_NODROPLEFT		=0x00000010
DKF_NODROPRIGHT		=0x00000020
DKF_NODROPTOP		=0x00000040
DKF_NODROPBOTTOM	=0x00000080

//Dock action
DK_ADD		=0x00000001
DK_DELETE		=0x00000002
DK_SUBCLASS	=0x00000004
DK_UNSUBCLASS	=0x00000008
DK_SETLEFT		=0x00000010
DK_SETRIGHT	=0x00000020
DK_SETTOP		=0x00000040
DK_SETBOTTOM	=0x00000080
DK_HIDE		=0x00000100
DK_SHOW		=0x00000200
DK_FINDDOCK	=0x00000400
DK_FINDCHILD	=0x00000800

BIF_BITMAP		=0x001; //Bitmap handle is used in BUTTONDRAW.hImage.
BIF_ICON		=0x002; //Icon handle is used in BUTTONDRAW.hImage.
BIF_CROSS		=0x004; //Draw small cross 8x7. BUTTONDRAW.hImage is ignored.
BIF_DOWNARROW	=0x008; //Draw small down arrow 7x4. BUTTONDRAW.hImage is ignored.
BIF_ETCHED		=0x100; //Draw edge around button.
BIF_ENABLEFOCUS	=0x200; //Draw focus rectangle when button receive focus.

AKD_RESIZE			= WM_USER + 253;
AKD_DOCK			= WM_USER + 254;
AKD_SETBUTTONDRAW	= WM_USER + 255;
AKDN_MAIN_ONFINISH	= WM_USER + 6;
