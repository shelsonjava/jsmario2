var teclas = {
	_bs: 		[8,  false], // backspace
	_tab: 		[9,  false],
	_enter: 	[13, false],
	_shift: 	[16, false],
	_ctrl: 		[17, false],
	_alt: 		[18, false],
	_pause: 	[19, false], // pause
	_caps: 		[20, false], // caps looks
	_escape: 	[27, false],
	_page_up: 	[33, false],
	_page_down: [34, false],
	_end: 		[35, false],
	_home: 		[36, false],
	_left: 		[37, false],
	_up: 		[38, false],
	_right: 	[39, false],
	_down: 		[40, false],
	_insert: 	[45, false],
	_delete: 	[46, false],

	_0: [48, false],
	_1: [49, false],
	_2: [50, false],
	_3: [51, false],
	_4: [52, false],
	_5: [53, false],
	_6: [54, false],
	_7: [55, false],
	_8: [56, false],
	_9: [57, false],
	_a: [65, false],
	_b: [66, false],
	_c: [67, false],
	_d: [68, false],
	_e: [69, false],
	_f: [70, false],
	_g: [71, false],
	_h: [72, false],
	_i: [73, false],
	_j: [74, false],
	_k: [75, false],
	_l: [76, false],
	_m: [77, false],
	_n: [78, false],
	_o: [79, false],
	_p: [80, false],
	_q: [81, false],
	_r: [82, false],
	_s: [83, false],
	_t: [84, false],
	_u: [85, false],
	_v: [86, false],
	_w: [87, false],
	_x: [88, false],
	_y: [89, false],
	_z: [90, false],

	_left_super: 	[91,  false], // window izquierdo
	_super: 	[91,  false], // window
	_right_super: 	[92,  false], // window derecho
	_select: 	[93,  false],

	_N0: 		[96,  false], // Numpad
	_N1: 		[97,  false],
	_N2: 		[98,  false],
	_N3: 		[99,  false],
	_N4: 		[100, false],
	_N5: 		[101, false],
	_N6: 		[102, false],
	_N7: 		[103, false],
	_N8: 		[104, false],
	_N9: 		[105, false],
	_multiply: 	[106, false],
	_add: 		[107, false],
	_subtract: 	[109, false],
	_decimal: 	[110, false],
	_divide: 	[111, false],

	_f1: [112, false],
	_f2: [113, false],
	_f3: [114, false],
	_f4: [115, false],
	_f5: [116, false],
	_f6: [117, false],
	_f7: [118, false],
	_f8: [119, false],
	_f9: [120, false],
	_f10: [121, false],
	_f11: [122, false],
	_f12: [123, false],

	_num_look: 		[144, false],
	_scroll_lock: 	[145, false],
	_semicolon: 	[186, false],
	_equal: 		[187, false],
	_comma: 		[188, false],
	_dash: 			[189, false],
	_period: 		[190, false],
	_forward_slash: [191, false],
	_grave_accent: 	[192, false],
	_open_bracket: 	[219, false],
	_back_slash: 	[220, false],
	_close_braket: 	[221, false],
	_single_quote: 	[222, false]
}

_teclas = [];

for( var n = 0; n <= 222; n++ ){
	_teclas[n] = "";
}

for( var t in teclas ){
	var tecla = teclas[t];
	_teclas[tecla[0]] = t.replace("_","");
}

console.log(_teclas);