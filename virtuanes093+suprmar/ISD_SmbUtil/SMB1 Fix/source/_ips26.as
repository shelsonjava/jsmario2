;#######################################
; IPS�֘A���߃��W���[�� for HSP v2.6
	#module "IPS"
;#######################################

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
	if strsize>$40 : alloc otb,strsize
	bload p2,otb : ots=strsize
	return

;----------------------------------------
;	�p�b�`���O���[�`��
;----------------------------------------
*p_patch
	p1a=5 : ota=0 : len=0
	repeat
	  if p1a>=p1s : break					;IPS�t�@�C���I��
	  if ota>=ots : break					;�Ώۃt�@�C���I��
	  peek code,p1b,p1a : p1a++ : ota=code
	  peek code,p1b,p1a : p1a++ : ota=ota<<8+code
	  peek code,p1b,p1a : p1a++ : ota=ota<<8+code
	  if ota=$454F46 : break				;EOF�͏I��
	  peek code,p1b,p1a : p1a++ : len=code
	  peek code,p1b,p1a : p1a++ : len=len<<8+code
	  if len : gosub *p_sub1 : else : gosub *p_sub2		;RLE���k(len=0)�̗L��
	loop
	return

*p_sub1		;(�W��)�p�b�`
	if ota+len>=ots : len=ots-ota
	memcpy otb,p1b,len,ota,p1a : p1a+len
	return

*p_sub2		;(���k)�p�b�`
	peek code,p1b,p1a : p1a++ : len=code
	peek code,p1b,p1a : p1a++ : len=len<<8+code
	peek code,p1b,p1a : p1a++
	if ota+len>=ots : len=ots-ota
	memset otb,code,len,ota
	return

;#######################################

	#deffunc ipsm val,val
	mref p1,24		;�ύX�O�t�@�C����
	mref p2,25		;�ύX��t�@�C����
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
	if p1s>p2s : ots=p2s : else : ots=p1s
	if ots>=$40 : alloc otb,ots+$1000
	return

;----------------------------------------
;	�p�b�`�쐬���[�`��
;----------------------------------------
*m_patch
	poke otb,$0000,"PATCH" : ota=5
	code=0 : len=0 : p2a=0
	repeat
	  code=p1a>>2
	  if p1a>=ots : break					;���������̃t�@�C���̏I��
	  if p1b.code = p2b.code : p1a+4 : else : gosub *m_sub1	;����̗L��
	loop
	poke otb,ota,"EOF" : ota+3
	ots=ota
	return

*m_sub1		;����𔭌�
	peek temp1,p1b,p1a : peek temp2,p2b,p1a
	if temp1=temp2 : p1a++ : return			;�ʒu�m�F
	rle1=temp2

	;�A�h���X���L�^
	poke otb,ota  ,p1a>>16
	poke otb,ota+1,p1a>>8
	poke otb,ota+2,p1a
	p2a=p1a

	rle2=0						;RLE�`�F�b�N�p
	repeat
	  if p1a>=ots : len=cnt : break
	  peek temp1,p1b,p1a : peek temp2,p2b,p1a
	  if temp1=temp2 : len=cnt : break
	  if temp2=rle1 : rle2++			;RLE�`�F�b�N
;	  poke otb,ota+5+cnt,temp2
	  p1a++
	loop
	if len=rle2 : if len>2 : goto *m_sub2		;RLE���k�̏���
	poke otb,ota+3,len>>8
	poke otb,ota+4,len
	memcpy otb,p2b,len,ota+5,p2a
	ota+5+len
	return

*m_sub2
	;RLE���k�ŋL�^
	poke otb,ota+3,$00
	poke otb,ota+4,$00
	poke otb,ota+5,len>>8
	poke otb,ota+6,len
	poke otb,ota+7,rle1
	ota+8
	return

;#######################################

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
	p1a=5 : len=0
	repeat
	  if p1a>=p1s : break					;�t�@�C���I��
	  peek code,p1b,p1a : p1a++ : ota=code
	  peek code,p1b,p1a : p1a++ : ota=ota<<8+code
	  peek code,p1b,p1a : p1a++ : ota=ota<<8+code
	  if ota=$454F46 : break				;EOF�͏I��
	  peek code,p1b,p1a : p1a++ : len=code
	  peek code,p1b,p1a : p1a++ : len=len<<8+code
	  if len : p1a+len : else : p1a+3			;RLE���k(len=0)�̗L��
	loop
	return

;#######################################

	#deffunc ipss val
	mref p1,32		;�t�@�C����
	mref p0,64 : p0=0	;stat
	if p1="" :p0=1:return
	if mode=0:p0=1:return	;���s���Ă��鎞
	bsave p1,otb,ots
	return

;#######################################

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
	strlen len,p1 : len--
	repeat len
	  peek code,p1,len-cnt
	  if code=$2E  : strmid s0,p1,0,len-cnt : break
	  if code=$5C  : strmid s0,p1,0,len     : break
	  if cnt+1=len : strmid s0,p1,0,len     : break
	loop
	strlen len,p2 : len--
	repeat len
	  peek code,p2,len-cnt
	  if code=$2E  : strmid p9,p2,-1,cnt	: break
	  if code=$5C  : p9=""			: break
	  if cnt=len   : p9=""			: break
	loop
	s0+"."+p9
	instr code,s0,":" : if code=-1 : s0=curdir+"\\"+s0	;���΃p�X�ł̃t�@�C���w��
	return

*m_getname	;�����o�͖�"�ύX��̃t�@�C����.ips"
	mref s0,65 : s0=""	;refstr
	strlen len,p2 : len--
	repeat len
	  peek code,p2,len-cnt
	  if code=$2E  : strmid s0,p2,0,len-cnt : break
	  if code=$5C  : strmid s0,p2,0,len     : break
	  if cnt+1=len : strmid s0,p2,0,len     : break
	loop
	s0+".ips"
	instr code,s0,":" : if code=-1 : s0=curdir+"\\"+s0	;���΃p�X�ł̃t�@�C���w��
	return

;#######################################
	#global
;#######################################
