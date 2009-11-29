#NoEnv  ; Recommended for performance and compatibility with future AutoHotkey releases.
SendMode Input  ; Recommended for new scripts due to its superior speed and reliability.
SetWorkingDir %A_ScriptDir%  ; Ensures a consistent starting directory.

output := ""
Loop, %A_ScriptDir%\*.gif, , 1
{
	FileGetSize, tamanio, %A_LoopFileFullPath%
	datos = ["%A_LoopFileFullPath%", %tamanio%],`n
	output .= datos
}

FileAppend %output%, output.txt