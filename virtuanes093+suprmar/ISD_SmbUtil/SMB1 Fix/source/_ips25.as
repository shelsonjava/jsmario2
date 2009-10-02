;###############################################################################
; IPS�֘A���߃��W���[��
	#module "IPS"
;###############################################################################

	#deffunc ipsp val,val
	mref p1,24		;IPS�t�@�C����
	mref p2,25		;�Ώۃt�@�C����
	mref p0,64 : p0=0	;stat
	if p1="":p0=1:return
	if p2="":p0=1:return

	mode=0
	gosub *p_fload		;�t�@�C���Ǎ���
	if p0!0:return
	gosub *p_patch		;�p�b�`���O
	if p0=1:return
	mode=1
	gosub *p_getname	;refstr�ɍ�����������
	return

;----------------------------------------
;	�t�@�C���Ǎ���
;----------------------------------------
*p_fload
	;IPS�t�@�C��
	exist p1 : if strsize<1 : p0=1 : return
	if strsize>$40 : alloc p1b,strsize
	bload p1,p1b : p1s=strsize
	gosub *chk_ips			;IPS�ȈՃ`�F�b�N
	;�Ώۃt�@�C��
	exist p2 : if strsize<1 : p0=1 : return
	if strsize>$40 : alloc outb,strsize
	bload p2,outb : outs=strsize
	return

;----------------------------------------
;	�p�b�`���O���[�`��
;----------------------------------------
*p_patch
	p1a=5 : outa=0
	int ipl : ipl=0
	repeat
	  if p1a>=p1s : break					;�t�@�C���I��
	  if outa>=outs : break					;�t�@�C���I��
	  peek code,p1b,p1a : p1a++ : outa=code
	  peek code,p1b,p1a : p1a++ : outa=outa<<8+code
	  peek code,p1b,p1a : p1a++ : outa=outa<<8+code
	  if outa=$454F46 : break				;EOF�͏I��
	  peek code,p1b,p1a : p1a++ : ipl=code
	  peek code,p1b,p1a : p1a++ : ipl=ipl<<8+code
	  if ipl : gosub *p_sub1 : else : gosub *p_sub2		;RLE���k(ipl=0)�̗L��
	loop
	return
*p_sub1		;�p�b�`�T�u
	if outa+ipl>=outs : ipl=outs-outa
	repeat ipl
	  peek code,p1b,p1a : p1a++
	  poke outb,outa,code : outa++
	loop
	return
*p_sub2		;�p�b�`�T�u(RLE���k)
	peek code,p1b,p1a : p1a++ : ipl=code
	peek code,p1b,p1a : p1a++ : ipl=ipl<<8+code
	peek code,p1b,p1a : p1a++
	if outa+ipl>=outs : ipl=outs-outa
	repeat ipl
	  poke outb,outa,code : outa++
	loop
	return

;###############################################################################

	#deffunc ipsm val,val
	mref p1, 24		;�ύX�O�t�@�C����
	mref p2, 25		;�ύX��t�@�C����
	mref p0,64 : p0=0	;stat
	if p1="":p0=1:return
	if p2="":p0=1:return

	mode=0
	gosub *m_fload		;�t�@�C���Ǎ���
	if p0!0:return
	gosub *m_patch		;�p�b�`���O
	if p0=1:return
	mode=1
	gosub *m_getname	;refstr�ɍ�����������
	return

;----------------------------------------
;	�t�@�C���Ǎ���
;----------------------------------------
*m_fload
	;�ύX�O�t�@�C����
	exist p1 : if strsize<1 : p0=1 : return
	if strsize>$40 : alloc p1b,strsize+4
	bload p1,p1b : p1s=strsize
	;�ύX��t�@�C����
	exist p2 : if strsize<1 : p0=1 : return
	if strsize>$40 : alloc p2b,strsize+4
	bload p2,p2b : p2s=strsize
	;��r����t�@�C���̃T�C�Y�`�F�b�N��IPS�t�@�C���o�b�t�@�擾
	if p1s>p2s : outs=p2s : else : 	outs=p1s
	if outs>=$40 : alloc outb,outs+$0100
	return

;----------------------------------------
;	�p�b�`�쐬���[�`��
;----------------------------------------
*m_patch
	poke outb,$0000,"PATCH" : outa=5
	int ipl  : ipl=0
	int code : code=0
	repeat
	  code=p1a>>2
	  if p1a>=outs : break
	  if p1b.code = p2b.code : p1a+4 : else : gosub *m_sub1	;����̗L��
	loop
	poke outb,outa,"EOF" : outa+3
	outs=outa
	return
*m_sub1
	peek temp1,p1b,p1a : peek temp2,p2b,p1a
	if temp1=temp2 : p1a++ : return			;�ʒu�m�F
	rle1=temp2

	poke outb,outa  ,p1a>>16
	poke outb,outa+1,p1a>>8
	poke outb,outa+2,p1a
	rle2=0						;RLE�`�F�b�N�p
	repeat
	  if p1a>=outs : ipl=cnt : break
	  peek temp1,p1b,p1a : peek temp2,p2b,p1a
	  if temp1=temp2 : ipl=cnt : break		;������
	  if temp2=rle1 : rle2++			;RLE�`�F�b�N
	  poke outb,outa+5+cnt,temp2
	  p1a++
	loop
	if ipl=rle2 : if ipl>2 : goto *m_sub2		;RLE���k����
	poke outb,outa+3,ipl>>8
	poke outb,outa+4,ipl
	outa+5+ipl
	return
*m_sub2		;RLE���k����
	poke outb,outa+3,$00
	poke outb,outa+4,$00
	poke outb,outa+5,ipl>>8
	poke outb,outa+6,ipl
	poke outb,outa+7,rle1
	outa+8
	return

;###############################################################################

	#deffunc ipsc val
	mref p1,24		;IPS�t�@�C����
	mref p0,64 : p0=0	;stat
	if p1="":p0=1:return

	;IPS�t�@�C����Ǎ���
	exist p1 : if strsize<1 : p0=1 : return
	if strsize>$40 : alloc p1b,strsize
	bload p1,p1b : p1s=strsize
	gosub *chk_ips			;IPS�ȈՃ`�F�b�N
	if p0!0:return

	gosub *c_patch			;�`�F�b�N���[�`��
	if p0!0:return
	return

;----------------------------------------
;	�`�F�b�N���[�`��
;----------------------------------------
*c_patch
	p1a=5 : int ipl : ipl=0
	repeat
	  if p1a>=p1s : break					;�t�@�C���I��
	  peek code,p1b,p1a : p1a++ : outa=code
	  peek code,p1b,p1a : p1a++ : outa=outa<<8+code
	  peek code,p1b,p1a : p1a++ : outa=outa<<8+code
	  if outa=$454F46 : break				;EOF�͏I��
	  peek code,p1b,p1a : p1a++ : ipl=code
	  peek code,p1b,p1a : p1a++ : ipl=ipl<<8+code
	  if ipl : p1a+ipl : else : p1a+3			;RLE���k(ipl=0)�̗L��
	loop
	return

;###############################################################################

	#deffunc ipss val
	mref p1,32		;�t�@�C����
	mref p0,64 : p0=0	;stat
	if p1="":p0=1:return
	if mode=0:p0=1:return	;���s���Ă��鎞
	bsave p1,outb,outs
	return

;###############################################################################

*chk_ips	;IPS�ȈՃ`�F�b�N���[�`��
	str temp : temp=""
	strmid temp,p1b,0,5		;PATCH
	if temp!"PATCH" : p0=1 : return
	strmid temp,p1b,p1s-3,3		;EOF
	if temp!"EOF"   : p0=1 : return
	return

*p_getname	;�����o�͖�"IPS�t�@�C����.�Ώۊg���q"
	sdim p9,64 : p9=""
	mref s0,65 : s0=""	;refstr
	strlen ipl,p1 : ipl--
	repeat ipl
	  peek code,p1,ipl-cnt
	  if code=$2E  : strmid s0,p1,0,ipl-cnt : break
	  if code=$5C  : strmid s0,p1,0,ipl     : break
	  if cnt+1=ipl : strmid s0,p1,0,ipl     : break
	loop
	strlen ipl,p2 : ipl--
	repeat ipl
	  peek code,p2,ipl-cnt
	  if code=$2E  : strmid p9,p2,-1,cnt	: break
	  if code=$5C  : p9=""			: break
	  if cnt=ipl   : p9=""			: break
	loop
	s0+"."+p9
	instr code,s0,":" : if code=-1 : s0=curdir+"\\"+s0	;���΃p�X�ł̃t�@�C���w��
	return

*m_getname	;�����o�͖�"�ύX��̃t�@�C����.ips"
	mref s0,65 : s0=""	;refstr
	strlen ipl,p2 : ipl--
	repeat ipl
	  peek code,p2,ipl-cnt
	  if code=$2E  : strmid s0,p2,0,ipl-cnt : break
	  if code=$5C  : strmid s0,p2,0,ipl     : break
	  if cnt+1=ipl : strmid s0,p2,0,ipl     : break
	loop
	s0+".ips"
	instr code,s0,":" : if code=-1 : s0=curdir+"\\"+s0	;���΃p�X�ł̃t�@�C���w��
	return

;###############################################################################
	#global
;###############################################################################

