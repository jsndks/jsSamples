/**
 * @fileOverview ModalList Controller definition.
 */

define(function(require) {
	'use strict';

    var $ = require('jquery');
    var ModalList = require('lib/ModalList');

	/**
     * ModalList controller class
     *
     * @class ModalListController
     * @constructor
     */
	var ModalListController = function($element) {
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

        this.displayContainer = [];

        // TODO: docblocs needed
        this.colCountAttr = 'data-col-count';
        this.stackAttr = 'data-stack-option';
        this.twoUpSelector = 'blocks_2up';
        this.threeUpSelector = 'blocks_3up';
        this.fourUpSelector = 'blocks_4up';
        this.activeBtnSelector = 'btn_active';

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
	ModalListController.prototype.init = function() {
		this.setupHandlers()
			.createChildren()
			.enable();
	};

	/**
     * Binds the scope of any handler functions.
     * Should only be run on initialization of the view.
     *
     * @method setupHandlers
     * @returns {ModalListController}
     * @private
     */
    ModalListController.prototype.setupHandlers = function() {
        this.onClickStackToggleItemHandler = this.onClickStackToggleItem.bind(this);

        return this;
    };

    /**
     * Create any child objects or references to DOM elements.
     * Should only be run on initialization of the view.
     *
     * @method createChildren
     * @returns {ModalListController}
     * @private
     */
    ModalListController.prototype.createChildren = function() {
        this.$stackToggle = $('#js-stackToggle', this.$element);
        this.$modalList = $('.js-modalList', this.$element);

        return this;
    };

    /**
     * Remove any child objects or references to DOM elements.
     *
     * @method removeChildren
     * @returns {ModalListController}
     * @public
     */
    ModalListController.prototype.removeChildren = function() {
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
    ModalListController.prototype.enable = function() {
        this.$stackToggle.on('click', '> *', this.onClickStackToggleItemHandler);
        this.initializeModalLists();
    };

    /**
     * Disables the component.
     * Exits early if it is already disabled.
     *
     * @method disable
     * @public
     */
    ModalListController.prototype.disable = function() {
        if (!this.isEnabled) {
            return this;
        }
        this.isEnabled = false;

        this.$stackToggle.off('click', '> *', this.onClickStackToggleItemHandler);
    };

    /**
     * Destroys the component.
     * Tears down any events, handlers, elements.
     * Should be called when the object should be left unused.
     *
     * @method destroy
     * @returns {ModalListController}
     * @public
     */
    ModalListController.prototype.destroy = function() {
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
     * @method initializeModalLists
     * @public
     */
    ModalListController.prototype.initializeModalLists = function() {
        var i = 0;
        var l = this.$modalList.length;

        for (; i < l; i++) {
            var $list = this.$modalList.eq(i);
            var modalList = new ModalList($list);
        }

        this.displayContainer.push(modalList);
        this.updateStackBtnState();
    };

    /**
     * Set the current state of the stack toggle buttons
     *
     * @method updateStackBtnState
     * @public
     */
    ModalListController.prototype.updateStackBtnState = function() {
        var colCount = this.$modalList.attr(this.colCountAttr);
        var $btns = this.$stackToggle.find('.btn');

        switch (colCount) {
            case '2':
                var $activeBtn = this.$stackToggle.find('[data-stack-option="2"]');
                $btns.removeClass(this.activeBtnSelector);
                $activeBtn.addClass(this.activeBtnSelector);
                break;
            case '3':
                var $activeBtn = this.$stackToggle.find('[data-stack-option="3"]');
                $btns.removeClass(this.activeBtnSelector);
                $activeBtn.addClass(this.activeBtnSelector);
                break;
            case '4':
                var $activeBtn = this.$stackToggle.find('[data-stack-option="4"]');
                $btns.removeClass(this.activeBtnSelector);
                $activeBtn.addClass(this.activeBtnSelector);
                break;
            default:
                var $activeBtn = this.$stackToggle.find('[data-stack-option="4"]');
                $btns.removeClass(this.activeBtnSelector);
                $activeBtn.addClass(this.activeBtnSelector);
        }
    };

    //////////////////////////////////////////////////////////////////////////////////
    // EVENT HANDLERS
    //////////////////////////////////////////////////////////////////////////////////

    /**
     * Toggle between available stacking options
     *
     * @method onClickStackToggleItem
     * @param e {Event} JavaScript event object.
     * @public
     */
    ModalListController.prototype.onClickStackToggleItem = function(e) {
        e.preventDefault();
        var i = 0;
        var l = this.displayContainer.length;
        var $targetEl = $(e.currentTarget);
        var stackOption = parseInt($targetEl.attr(this.stackAttr), 10);

        switch (stackOption) {
            case 2:
                if (this.$modalList.hasClass(this.twoUpSelector)) { return; }

                this.$modalList.removeClass(this.threeUpSelector);
                this.$modalList.removeClass(this.fourUpSelector);
                this.$modalList.addClass(this.twoUpSelector);
                this.$modalList.attr(this.colCountAttr, '2');

                break;
            case 3:
                if (this.$modalList.hasClass(this.threeUpSelector)) { return; }

                this.$modalList.removeClass(this.twoUpSelector);
                this.$modalList.removeClass(this.fourUpSelector);
                this.$modalList.addClass(this.threeUpSelector);
                this.$modalList.attr(this.colCountAttr, '3');

                break;
            case 4:
                if (this.$modalList.hasClass(this.fourUpSelector)) { return; }

                this.$modalList.removeClass(this.twoUpSelector);
                this.$modalList.removeClass(this.threeUpSelector);
                this.$modalList.addClass(this.fourUpSelector);
                this.$modalList.attr(this.colCountAttr, '4');

                break;
            default:
                this.$modalList.removeClass(this.twoUpSelector);
                this.$modalList.removeClass(this.threeUpSelector);
                this.$modalList.addClass(this.fourUpSelector);
                this.$modalList.attr(this.colCountAttr, '4');
        }

        this.updateStackBtnState();

        for (; i < l; i++) {
            var modalList = this.displayContainer[i];
            modalList.reinit();
        }
    };

	return ModalListController;

});