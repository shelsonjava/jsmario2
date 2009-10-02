	#include "_ips25.as"
	#include "_ex.as"

	;������
	ipsf="smb_fix.ips"				;���퉻�p�b�`
	sdim  romf,$0200  : sdim  fixf,$0200		;�t�@�C����
	alloc romb,$18000

	bgscr 2,1,1,1,-1,-1 : title "SMB-FIX" : gsel 2,1

	;�t�@�C�����J��
	if cmdline="" {
	  dialog "nes",16,"SMB ROM image"
	  if stat!1 : end
	  romf=refstr
	} else {
	  romf=cmdline					;�R�}���h���C�����w�肳��Ă���
	}

	;����������t�@�C���T�C�Y���`�F�b�N
	exist romf : roms=strsize
	if roms<$4010 : goto *error_bad_rom

	;�w�b�_�`�F�b�N
	bload romf,romb,$10
	peek code,romb,$0004				;PRG-ROM��
	if code!2 : goto *error_bad_rom
	peek code,romb,$0005				;CHR-ROM��
	if code!1 : goto *error_bad_rom
	peek code,romb,$0006				;�g���C�i�[
	if code&4 : addr=$0210 : else : addr=$0010

	;�o�b�N�A�b�v�쐬
	fixf=romf
	dex fixf
	pex fixf,"bak"
	bload romf,romb,roms
	bsave fixf,romb,roms

	;�g���C�i�[��r��/�T�C�Y����
	bload fixf,romb,$0010,$0000			;�w�b�_��ۑ�
	bsave romf,romb,$0010
	bload fixf,romb,$A000,addr			;ROM��ۑ�
	bsave romf,romb,$A000,$0010

	;���퉻�p�b�`�𓖂Ă�
	ipsp ipsf,romf
	if stat!0 : dialog "Fix error",,"ERROR" : end
	ipss romf
	if stat!0 : dialog "Output error",,"ERROR" : end
	end

*error_bad_rom
	dialog "The file isn't SMB ROM image.",,"ERROR"
	end
