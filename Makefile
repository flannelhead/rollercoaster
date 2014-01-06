all: rollercoaster.min.js rollercoaster.min.css

rollercoaster.min.js: main.js vector2.js bezier2.js bezeditor.js ode-rk4.js
	closure --warning_level VERBOSE --compilation_level ADVANCED_OPTIMIZATIONS --js main.js vector2.js bezier2.js bezeditor.js ode-rk4.js --js_output_file rollercoaster.min.js

rollercoaster.min.css: rollercoaster.css
	yuicompressor rollercoaster.css > rollercoaster.min.css

clean:
	rm rollercoaster.min.js rollercoaster.min.css

