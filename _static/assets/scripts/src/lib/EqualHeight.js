/**
 * @fileOverview Equal Height module definition.  Used to force items in a list
 * to be the same height as the tallest member in the row
 */

define(function(require) {
    'use strict';

    var $ = require('jquery');

    var EqualHeight = function($element) {

        if (!$element || !$element.length) { return; }

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
    EqualHeight.prototype.init = function() {
        this.layout()
            .enable();
    };

    /**
     * Performs measurements and applys any positioning style logic.
     * Should be run anytime the parent layout changes.
     *
     * @method layout
     * @returns {EqualHeight}
     * @private
     */
    EqualHeight.prototype.layout = function() {

        // Strip inline styles
        $('> .box', this.$element).attr('style', '');

        var p = 0;
        var l = this.$element.length;
        var itemHeightArr = [];
        var $row = this.$element;
        for (; p < l; p++) {
            var $item = $row.filter(':eq(' + p + ')').children();
            var itemHeight = $item.outerHeight();
            itemHeightArr.push(itemHeight);
        }

        //Set all row items to the height of the tallest item
        var tallestItemHeight = Math.max.apply(null, itemHeightArr);
        var i = 0;
        var rowLength = $row.length;
        for (; i < rowLength; i++) {
            var $rowItem = $row.eq(i);
            $('> .box', $rowItem).outerHeight(tallestItemHeight);
        }

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
    EqualHeight.prototype.enable = function() {
        if (this.isEnabled) {
            return this;
        }
        this.isEnabled = true;
    };

    /**
     * Disables the component.
     * Exits early if it is already disabled.
     *
     * @method disable
     * @public
     */
    EqualHeight.prototype.disable = function() {
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
     * @returns {EqualHeight}
     * @public
     */
    EqualHeight.prototype.destroy = function() {
        this.disable()
            .removeChildren();

        return this;
    };


    return EqualHeight;
});