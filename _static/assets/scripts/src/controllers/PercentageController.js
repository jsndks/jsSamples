/**
 * @fileOverview Percentage Controller definition.
 */

define(function(require) {
	'use strict';

    var $ = require('jquery');
    var Percentage = require('lib/Percentage');

	/**
     * Percentage controller class
     *
     * @class PercentageController
     * @constructor
     */
	var PercentageController = function($element, options) {
        // if element doesnt exist in the DOM return early
        if ($element.length == 0) { return; }

        /**
         * A reference to the containing DOM element.
         *
         * @default null
         * @property {jQuery} $element
         * @public
         */
        this.$element = $element;

        /**
         * Option properties to be applied to the instance
         *
         * @default null
         * @property {Object} options
         * @public
         */
        this.options = options;

        /**
         * A continer to hold percentage instance objects
         *
         * @default []
         * @property {Array} displayContainer
         * @public
         */
        this.displayContainer = [];

        this.init();
	};

	/**
     * Initializes the class.
     * Runs a single setupHandlers call, followed by createChildren and layout.
     * Exits early if it is already initialized.
     *
     * @method init
     * @private
     */
	PercentageController.prototype.init = function() {
		this.setupHandlers()
			.createChildren()
			.enable();
	};

	/**
     * Binds the scope of any handler functions.
     * Should only be run on initialization of the view.
     *
     * @method setupHandlers
     * @returns {PercentageController}
     * @private
     */
    PercentageController.prototype.setupHandlers = function() {
        this.onClickRunHandler = this.onClickRun.bind(this);

        return this;
    };

    /**
     * Create any child objects or references to DOM elements.
     * Should only be run on initialization of the view.
     *
     * @method createChildren
     * @returns {PercentageController}
     * @private
     */
    PercentageController.prototype.createChildren = function() {
        this.$btnRun = $('#js-btn-run', this.$element);
        this.$percentEl = $('.js-percentage');
        this.$progressionPercentages = $('.js-percentage-progression');

        return this;
    };

    /**
     * Remove any child objects or references to DOM elements.
     *
     * @method removeChildren
     * @returns {PercentageController}
     * @public
     */
    PercentageController.prototype.removeChildren = function() {
        this.$btnRun = null;
        this.$percentEl = null;

        return this;
    };

    /**
     * Enables the component.
     * Performs any event binding to handlers.
     * Exits early if it is already enabled.
     *
     * @method enable
     * @public
     */
    PercentageController.prototype.enable = function() {
        this.$btnRun.on('click', this.onClickRunHandler);
        this.setupAnimations();
    };

    /**
     * Disables the component.
     * Exits early if it is already disabled.
     *
     * @method disable
     * @public
     */
    PercentageController.prototype.disable = function() {
        if (!this.isEnabled) {
            return this;
        }
        this.isEnabled = false;
    };

    /**
     * Destroys the component.
     * Tears down any events, handlers, elements.
     * Should be called when the object should be left unused.
     *
     * @method destroy
     * @returns {PercentageController}
     * @public
     */
    PercentageController.prototype.destroy = function() {
        this.disable()
            .removeChildren();

        return this;
    };

    //////////////////////////////////////////////////////////////////////////////////
    // HELPER METHODS
    //////////////////////////////////////////////////////////////////////////////////

    /**
     * Loops over display items and instantiates each
     *
     * @method setupAnimations
     * @public
     */
    PercentageController.prototype.setupAnimations = function() {
        var i = 0;
        var progressionConfig = [
            {
                duration: 1000,
                endpoint: 25,
                ease: mina.bounce
            },
            {
                duration: 1000,
                endpoint: 50,
                ease: mina.bounce
            },
            {
                duration: 1000,
                endpoint: 75,
                ease: mina.bounce
            },
            {
                duration: 1000,
                endpoint: 99,
                ease: mina.bounce
            }
        ];
        var l = progressionConfig.length;

        for (; i < l; i++) {
            var percentage = new Percentage(this.$progressionPercentages[i], progressionConfig[i]);
            this.displayContainer.push(percentage);
        }

        this.runAnimations();
    };

    /**
     * Run the animations in sequential order
     *
     * @method runAnimations
     * @public
     */
    PercentageController.prototype.runAnimations = function() {
        var displayFirst = this.displayContainer[0];
        var displaySecond = this.displayContainer[1];
        var displayThird = this.displayContainer[2];
        var displayFourth = this.displayContainer[3];

        this.resetAnimations();

        displayFirst.run(displayFirst.options.endpoint / 100, function() {
            displaySecond.run(displaySecond.options.endpoint / 100, function() {
                displayThird.run(displayThird.options.endpoint / 100, function() {
                    displayFourth.run(displayFourth.options.endpoint / 100);
                });
            });
        });
    };

    /**
     * Reset the animations back to 0 starting point
     *
     * @method resetAnimations
     * @public
     */
    PercentageController.prototype.resetAnimations = function() {
        var i = 0;
        var l = this.displayContainer.length;
        for (; i < l; i++) {
            var percent = this.displayContainer[i];
            percent.run(0);
        }

    };

    //////////////////////////////////////////////////////////////////////////////////
    // EVENT HANDLERS
    //////////////////////////////////////////////////////////////////////////////////

    /**
     * Run button click event handler
     *
     * @method onClickRun
     * @param e {Event} JavaScript event object.
     * @public
     */
    PercentageController.prototype.onClickRun = function(e) {
        e.preventDefault();
        // var i = 0;
        // var l = this.displayContainer.length;

        // for (; i < l; i++) {
        //     var display = this.displayContainer[i];
        //     display.run(display.options.endpoint / 100);
        // }

        this.runAnimations();
    };

	return PercentageController;

});