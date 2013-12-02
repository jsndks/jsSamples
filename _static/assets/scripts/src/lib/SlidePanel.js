/**
 * @fileOverview SlidePanel module definition.
 */

define(function(require) {
	'use strict';

    var $ = require('jquery');

	/**
     * Chart lib class
     *
     * @class Chart
     * @constructor
     */
	var SlidePanel = function($element) {
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
         * Tracks whether component is enabled.
         *
         * @default false
         * @property isEnabled
         * @type {bool}
         * @public
         */
        this.isEnabled = false;

        this.hiddenPanelSelector = 'description_isHidden';

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
	SlidePanel.prototype.init = function() {
		this.setupHandlers()
			.createChildren()
			.layout()
			.enable();
	};

	/**
     * Binds the scope of any handler functions.
     * Should only be run on initialization of the view.
     *
     * @method setupHandlers
     * @returns {SlidePanel}
     * @private
     */
    SlidePanel.prototype.setupHandlers = function() {
        this.onClickSlidePanelBtnHandler = this.onClickSlidePanelBtn.bind(this);

        return this;
    };

    /**
     * Create any child objects or references to DOM elements.
     * Should only be run on initialization of the view.
     *
     * @method createChildren
     * @returns {SlidePanel}
     * @private
     */
    SlidePanel.prototype.createChildren = function() {
        this.$description = $('.js-slidePanel-description', this.$element);
        this.$panelBtn = $('.js-slidePanel-btn', this.$element);

        return this;
    };

    /**
	 handles layout of DOM elements
     *
     * @method layout
     * @returns {SlidePanel}
     * @private
     */
    SlidePanel.prototype.layout = function() {
        var descHeight = this.$description.outerHeight();
        this.$description.attr('data-desc-height', descHeight);

        this.collapsePanel();

        return this;
    };

    /**
     * Remove any child objects or references to DOM elements.
     *
     * @method removeChildren
     * @returns {SlidePanel}
     * @public
     */
    SlidePanel.prototype.removeChildren = function() {

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
    SlidePanel.prototype.enable = function() {
        this.$panelBtn.on('click', this.onClickSlidePanelBtnHandler);
    };

    /**
     * Disables the component.
     * Exits early if it is already disabled.
     *
     * @method disable
     * @public
     */
    SlidePanel.prototype.disable = function() {
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
     * @returns {SlidePanel}
     * @public
     */
    SlidePanel.prototype.destroy = function() {
        this.disable()
            .removeChildren();

        return this;
    };

    //////////////////////////////////////////////////////////////////////////////////
    // HELPER METHODS
    //////////////////////////////////////////////////////////////////////////////////

    /**
     * Collapse the slide panel
     *
     * @method collapsePanel
     * @public
     */
    SlidePanel.prototype.collapsePanel = function() {
        this.$description.addClass(this.hiddenPanelSelector);
        this.$description.animate({
            height: '0px'
        });
    };

    /**
     * Expand the slide panel
     *
     * @method expandPanel
     * @public
     */
    SlidePanel.prototype.expandPanel = function() {
        var descHeight = this.$description.attr('data-desc-height');
        this.$description.removeClass(this.hiddenPanelSelector);
        this.$description.animate({
            height: descHeight + 'px'
        });
    };


    //////////////////////////////////////////////////////////////////////////////////
    // EVENT HANDLERS
    //////////////////////////////////////////////////////////////////////////////////

    /**
     * Slide panel click event handler
     *
     * @method onClickSlidePanelBtn
     * @param e {Event} JavaScript event object.
     * @public
     */
    SlidePanel.prototype.onClickSlidePanelBtn = function(e) {
        e.preventDefault();

        if (this.$description.hasClass(this.hiddenPanelSelector)) {
            this.expandPanel();
        } else {
            this.collapsePanel();
        }
    };


	return SlidePanel;

});


