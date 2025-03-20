extends Node2D

@onready var sprite: ColorRect = $Sprite
@onready var label: Label = $Sprite/Label

@export var value: int
@export var posx: int # from 0 to 3
@export var posy: int # from 0 to 3
@export var merged: bool = false # to guarantee a block merges only once per move
@export var goingToMerge: bool = false # to guarantee a block merges only once per move

const SIZE: int = 130
const PAD: int = 16
const COLORS = {
	2: Color("#efe5da"), 4: Color("#ece0c6"), 8: Color("#f1b179"), 16: Color("#f69564"), 32: Color("#f77c5f"), 64: Color("#f55e3a"),
	128: Color("#edce72") ,256: Color("#eccb60"), 512: Color("#eec851"), 1024: Color("#ecc53e"), 2048: Color("#ecc22f"),
	4096: Color("#9201cf"), 8192: Color("#59007f") ,16384: Color("#35004d"), 32768: Color("#000000")
}

func _ready() -> void:
	value = 2 if randi_range(0, 9) < 9 else 4
	update_looks()
	sprite.scale = Vector2(0, 0)
	var tween = get_tree().create_tween()
	tween.tween_property(sprite, "scale", Vector2(1, 1), 0.1)

func set_posxy(x, y):
	posx = x
	posy = y
	position.x = (PAD * posx) + (SIZE * posx)
	position.y = (PAD * posy) + (SIZE * posy)

func merge():
	value *= 2
	merged = true
	update_looks()

	var tween = get_tree().create_tween()
	tween.tween_property(sprite, "scale", Vector2(1.05, 1.05), 0.1)
	tween.tween_property(sprite, "scale", Vector2(1, 1), 0.1)

func update_looks():
	label.text = str(value)
	sprite.color = COLORS[value]
	if value > 4:
		label.remove_theme_color_override("font_color")
		label.add_theme_color_override("font_color", Color("#f7f3f4"))
	if value > 512:
		label.remove_theme_font_size_override("font_size")
		label.add_theme_font_size_override("font_size", 64)

func move_to_position(x, y, callback: Callable):
	posx = x
	posy = y

	var tween = get_tree().create_tween()
	tween.tween_property(self, "position", Vector2((PAD * posx) + (SIZE * posx), (PAD * posy) + (SIZE * posy)), 0.1)
	tween.tween_callback(func(): callback.call(self))
