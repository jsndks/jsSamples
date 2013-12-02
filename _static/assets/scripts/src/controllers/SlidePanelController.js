/**
 * @fileOverview Slide Panel Controller definition.
 */

define(function(require) {
	'use strict';

    var $ = require('jquery');
    var SlidePanel = require('lib/SlidePanel');

	/**
     * ModalList controller class
     *
     * @class SlidePanelController
     * @constructor
     */
	var SlidePanelController = function($element) {
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
	SlidePanelController.prototype.init = function() {
		this.createChildren()
            .layout()
			.enable();
	};

    /**
     * Create any child objects or references to DOM elements.
     * Should only be run on initialization of the view.
     *
     * @method createChildren
     * @returns {SlidePanelController}
     * @private
     */
    SlidePanelController.prototype.createChildren = function() {

        return this;
    };

    /**
     handles layout of DOM elements
     *
     * @method layout
     * @returns {SlidePanelController}
     * @private
     */
    SlidePanelController.prototype.layout = function() {
        var i = 0;
        var l = this.$element.length;

        for (; i < l; i++) {
            var $slidePanel = this.$element.eq(i);
            var slidePanel = new SlidePanel($slidePanel);
        }

        return this;
    };

    /**
     * Remove any child objects or references to DOM elements.
     *
     * @method removeChildren
     * @returns {SlidePanelController}
     * @public
     */
    SlidePanelController.prototype.removeChildren = function() {
        this.$stackToggle = null;
        this.$modalList = null;

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
    SlidePanelController.prototype.enable = function() {

    };

	return SlidePanelController;

});