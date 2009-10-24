// las propiedades estan en ingles, los valores no necesariamente

var mapa = {
	settings: {
		order: ["level_1", "level_2"],
		lifes: 3, // Cantidad de vidas
		score: 0,
		money: 0
	},
	level_1: {
		displayName: "1-1",
		settings: {
			background: "#5C94FC",
			spawns: [[1,1,8]],
			gravity: 1 // normal
		},
		warpers: [
			[ // Warper 1
				[
					{
						type: "objeto:cubo",
						skin: "dia",
						top: 10
					},
					{
						type: "objeto:signo",
						skin: "dia",
						top: 8,
						settings: {
							drop: "hongo",
							visible: true,
							
						}
					}
				],
				[],[],[],[],[],[],[],[],[],[],[]
			],
			[
				[],[
					{
						type: "objeto:cubo",
						skin: "dia",
						top: 10
					}
				],[],[],[],[],[],[],[],[],[],[]
			]
		]
	},
	level_2: {
		displayName: "1-2",
		settings: {
			background: "#000000",
			spawns: [[1,1,0]],
			gravity: 1 // normal
		},
		warpers: [
			[ // Warper 1
				[
					{
						type: "objeto:cubo",
						skin: "dia",
						top: 10
					}
				], 
				[],[],[],[],[],[],[],[],[],[],[]
			]
		]
	}
}