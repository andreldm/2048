extends Node2D

const DEBUG: bool = false
const block_scene = preload("res://scenes/block.tscn")
var blocks = []
var moving_count: int = 0
var direction: Direction

enum Direction { UP, DOWN, LEFT, RIGHT }

func _ready() -> void:
	if DEBUG:
		create_block(1, 1, 4)
		create_block(2, 1, 2)
		create_block(3, 1, 2)
	else:
		add_block()
		add_block()

func _process(delta):
	if Input.is_action_just_pressed("Up"):
		handle_movement(Direction.UP)
	if Input.is_action_just_pressed("Down"):
		handle_movement(Direction.DOWN)
	if Input.is_action_just_pressed("Left"):
		handle_movement(Direction.LEFT)
	if Input.is_action_just_pressed("Right"):
		handle_movement(Direction.RIGHT)
	if Input.is_key_pressed(KEY_ESCAPE):
		get_tree().quit()

func handle_movement(dir):
	# ignore further key presses until all blocks finished moving
	if moving_count != 0:
		return

	direction = dir
	sort(direction)

	for b in blocks:
		try_to_move(b)

func try_to_move(block):
	var newx = block.posx
	var newy = block.posy

	for i in range(3):
		var pos = get_next_position(newx, newy, block)
		if pos.is_empty():
			break
		newx = pos[0]
		newy = pos[1]

	# if the position doesn't change, i.e. because reached the edge of grid, then do nothing
	if newx == block.posx && newy == block.posy:
		return

	block.move_to_position(newx, newy, move_finished)
	moving_count += 1

func get_next_position(x: int, y: int, block) -> Array:
	var newx = x
	var newy = y
	if direction == Direction.LEFT: newx -= 1
	if direction == Direction.RIGHT: newx += 1
	if direction == Direction.UP: newy -= 1
	if direction == Direction.DOWN: newy += 1

	if newx < 0 || newx > 3 || newy < 0 || newy > 3:
		return []

	# check if the new position is not occupied by a block
	#
	# if other block's value is the same and it's not merged or going to merge
	# the move can proceed and we mark both blocks as "going to merge"
	#
	# if the value is different or the block is merged/going to merge
	# then the move should be stopped
	var other = get_at(newx, newy, func(b): return true)
	if other != null:
		if other.value == block.value && !other.merged && !other.goingToMerge:
			block.goingToMerge = true
			other.goingToMerge = true
		else:
			return []

	return [newx, newy]

func move_finished(block: Node2D):
	moving_count -= 1

	# check if under another block
	# if so it's because they have the same value and should be merged
	# otherwise try to continue moving
	var other = get_at(block.posx, block.posy, func(b): return b != block)
	if other != null:
		other.merge()
		block.visible = false
		blocks.erase(block)
		remove_child(block)
		block.queue_free()
	else:
		sort(direction)
		try_to_move(block)

	# if all blocks finished moving we can add a new one
	if moving_count == 0:
		add_block()
		# we should also to unmark all blocks as merged
		for b in blocks:
			b.merged = false
			b.goingToMerge = false

func add_block():
	# find an empty cell to place the new block randomly
	var positions = []
	for x in range(4):
		for y in range(4):
			if get_at(x, y, func(b): return true) != null: continue
			positions.push_front([x, y])

	var position = positions[randi_range(0, len(positions) - 1)]
	if (position && !DEBUG):
		create_block(position[0], position[1])

func get_at(x: int, y: int, comparator: Callable):
	for b in blocks:
		if b.posx == x && b.posy == y && comparator.call(b):
			return b

	return null

# sorting is important because, for example, if the user pressed left then
# the blocks on the left side should be processed first
func sort(direction: Direction):
	blocks.sort_custom(func (a, b):
		if direction == Direction.UP: return a.posy < b.posy
		if direction == Direction.DOWN: return a.posy > b.posy
		if direction == Direction.LEFT: return a.posx < b.posx
		if direction == Direction.RIGHT: return a.posx > b.posx
		return false
	)

func create_block(x, y, value = null):
	var block = block_scene.instantiate() as Node2D
	block.set_posxy(x, y)
	add_child(block)
	if DEBUG:
		block.set_value(value)
	blocks.push_front(block)
