/**
 * @fileOverview Particles Controller definition.
 */

define(function(require) {
	'use strict';

    var $ = require('jquery');
    var Particles = require('lib/Particles');

	/**
     * Particles controller class
     *
     * @class ParticlesController
     * @constructor
     */
	var ParticlesController = function($element) {
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

        // TODO: docblocs needed
        this.activeBtnSelector = 'btn_active';
        this.particleTypeAttr = 'data-particle-type';
        this.particleQtyAttr = 'data-quantity';

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
	ParticlesController.prototype.init = function() {
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
     * @returns {ParticlesController}
     * @private
     */
    ParticlesController.prototype.setupHandlers = function() {
        this.onClickToggleHandler = this.onClickToggle.bind(this);

        return this;
    };

    /**
     * Create any child objects or references to DOM elements.
     * Should only be run on initialization of the view.
     *
     * @method createChildren
     * @returns {ParticlesController}
     * @private
     */
    ParticlesController.prototype.createChildren = function() {
        this.$btnCntrls = $('#js-particleCtrls', this.$element);
        this.$btns = $('.btn', this.$btnCntrls);
        this.$firstBtn = this.$btns.filter(':first-child');

        return this;
    };

    /**
	 * handles layout of DOM elements
     *
     * @method layout
     * @returns {ParticlesController}
     * @private
     */
    ParticlesController.prototype.layout = function() {
        this.$firstBtn.addClass(this.activeBtnSelector);

        return this;
    };

    /**
     * Remove any child objects or references to DOM elements.
     *
     * @method removeChildren
     * @returns {ParticlesController}
     * @public
     */
    ParticlesController.prototype.removeChildren = function() {
        this.$btnCntrls = null;
        this.$btns = null;
        this.$firstBtn = null;

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
    ParticlesController.prototype.enable = function() {
        this.$btnCntrls.on('click', '.btn', this.onClickToggleHandler);
        var particleType = this.$btns.filter('.' + this.activeBtnSelector).attr(this.particleTypeAttr);
        var particleQty = this.$btns.filter('.' + this.activeBtnSelector).attr(this.particleQtyAttr);
        this.particles = new Particles($('#js-particles'), {
            particleType: particleType,
            quantity: particleQty,
            fps: 60
        });
    };

    /**
     * Disables the component.
     * Exits early if it is already disabled.
     *
     * @method disable
     * @public
     */
    ParticlesController.prototype.disable = function() {
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
     * @returns {ParticlesController}
     * @public
     */
    ParticlesController.prototype.destroy = function() {
        this.disable()
            .removeChildren();

        return this;
    };

    //////////////////////////////////////////////////////////////////////////////////
    // HELPER METHODS
    //////////////////////////////////////////////////////////////////////////////////

    /**
     * Set the current state of the toggle buttons
     *
     * @method updateStackBtnState
     * @public
     */
    ParticlesController.prototype.updateStackBtnState = function(particleType) {
        switch (particleType) {
            case 'mist':
                var $activeBtn = this.$btns.filter('[data-particle-type="mist"]');
                this.$btns.removeClass(this.activeBtnSelector);
                $activeBtn.addClass(this.activeBtnSelector);
                break;
            case 'smoke':
                var $activeBtn = this.$btns.filter('[data-particle-type="smoke"]');
                this.$btns.removeClass(this.activeBtnSelector);
                $activeBtn.addClass(this.activeBtnSelector);
                break;
            case 'scatter':
                var $activeBtn = this.$btns.filter('[data-particle-type="scatter"]');
                this.$btns.removeClass(this.activeBtnSelector);
                $activeBtn.addClass(this.activeBtnSelector);
                break;
            default:
                var $activeBtn = this.$btns.filter('[data-particle-type="mist"]');
                this.$btns.removeClass(this.activeBtnSelector);
                $activeBtn.addClass(this.activeBtnSelector);
        }
    };


    //////////////////////////////////////////////////////////////////////////////////
    // EVENT HANDLERS
    //////////////////////////////////////////////////////////////////////////////////

    /**
     * Toggle button click event handler
     *
     * @method onClickToggle
     * @param e {Event} JavaScript event object.
     * @public
     */
    ParticlesController.prototype.onClickToggle = function(e) {
        e.preventDefault();
        var $targetEl = $(e.currentTarget);
        var particleType = $targetEl.attr('data-particle-type');
        var particleQty = $targetEl.attr('data-quantity');
        this.updateStackBtnState(particleType);
        this.particles.destroy();
        this.particles = new Particles($('#js-particles'), {
            particleType: particleType,
            quantity: particleQty,
            fps: 60
        });
    };


	return ParticlesController;

});