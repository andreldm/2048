## Impressions

+ In general I feel the language is more familiar than TypeScript
    + Much less occurences of "this."
    + No nonsense public/private, interfaces/classes and modules
    + No nonsense getter/setter
    + Porting the code from TS felt like simplifying it
    - No biggie, but arrays miss forEach and find functions
+ The experience in VS Code is surprisingly pretty good, only debug that isn't working for me
* Out of the box the change-compile-check loop is slower than with Phaser/TypeScript/Vite
  * This can be much improved with: `haxe -v --wait 8000` and `watchexec -w src/ w res/ haxe --connect 8000 build.dev.hxml`
  * Hot reload is also very helpful
- The community/ecosystem is still alive, but I perceive its heyday has already passed
    - It's not even close to Godot's size or TypeScript when considering only the language/tooling
- Tricky to make the tweening library (actuate) to make smooth animations
