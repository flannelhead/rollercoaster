CLOSURE = closure
CLOSURE_FLAGS = --warning_level VERBOSE --compilation_level ADVANCED_OPTIMIZATIONS --summary_detail_level 3
YUI = yuicompressor

all: rollercoaster.min.js rollercoaster.min.css

rollercoaster.min.js: main.js vector2.js bezier2.js beziereditor.js ode-rk4.js canvashelper.js rcengine.js
	$(CLOSURE) $(CLOSURE_FLAGS) --js main.js vector2.js bezier2.js beziereditor.js ode-rk4.js canvashelper.js rcengine.js --js_output_file rollercoaster.min.js

rollercoaster.min.css: rollercoaster.css
	$(YUI) rollercoaster.css > rollercoaster.min.css

clean:
	rm rollercoaster.min.js rollercoaster.min.css

