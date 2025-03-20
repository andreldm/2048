extends Node2D

const BG_COLOR = Color("#cdc0b4");
const FG_COLOR = Color("#bbada0");
const SIZE = 130;

func _draw():
	draw_rect(Rect2(0.0, 0.0, 600.0, 600.0), BG_COLOR)
	for i in range(5):
		# 16px for the border
		# 8px because we want to draw the line aligned to its middle
		# 16px for each line that was already drawn
		var pos = (i * SIZE) + 16 + 8 + ((i - 1) * 16);
		draw_line(Vector2(pos, 0.0), Vector2(pos, 600.0), FG_COLOR, 16.0) # vertical
		draw_line(Vector2(0.0, pos), Vector2(600.0, pos), FG_COLOR, 16.0) # horizontal
