/**
 * @fileOverview Percentage lib definition.
 */

define(function(require) {
    'use strict';

    var $ = require('jquery');
    require('snap');

    /**
     * Percentage lib class
     *
     * @class Percentage
     * @constructor
     */
    var Percentage = function($element, options) {
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

        this.options = options;

        this.canvasSize = 200;
        this.canvasCenter = this.canvasSize / 2;
        this.radius = this.canvasSize * 0.8 / 2;
        this.startY = this.canvasCenter - this.radius;

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
    Percentage.prototype.init = function() {
        this.createChildren()
            .layout()
            .enable();
    };

    /**
     * Create any child objects or references to DOM elements.
     * Should only be run on initialization of the view.
     *
     * @method createChildren
     * @returns {Percentage}
     * @private
     */
    Percentage.prototype.createChildren = function() {
        this.$percentNum = $('.percentage-num', this.$element);
        this.svgEl = $('.percentage-arc', this.$element).get(0);

        return this;
    };

    /**
     handles layout of DOM elements
     *
     * @method layout
     * @returns {Percentage}
     * @private
     */
    Percentage.prototype.layout = function() {
        this.s = Snap(this.svgEl);
        this.path = '';
        this.arc = this.s.path(this.path);
        var callback = this.options.callback ? this.options.callback : null;

        // this.run(this.options.endpoint / 100, callback);

        return this;
    };

    /**
     * Remove any child objects or references to DOM elements.
     *
     * @method removeChildren
     * @returns {Percentage}
     * @public
     */
    Percentage.prototype.removeChildren = function() {

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
    Percentage.prototype.enable = function() {

    };

    /**
     * Disables the component.
     * Exits early if it is already disabled.
     *
     * @method disable
     * @public
     */
    Percentage.prototype.disable = function() {
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
     * @returns {Percentage}
     * @public
     */
    Percentage.prototype.destroy = function() {
        this.disable()
            .removeChildren();

        return this;
    };

    //////////////////////////////////////////////////////////////////////////////////
    // HELPER METHODS
    //////////////////////////////////////////////////////////////////////////////////

    /**
     * Runs the snap.js animation
     *
     * @method run
     * @public
     */
    Percentage.prototype.run = function(percent, callback) {
        var endpoint = percent * 360;
        Snap.animate(0, endpoint, this.update.bind(this), this.options.duration, this.options.ease, callback);
    };

    Percentage.prototype.update = function(val) {
        this.arc.remove();

        var d = val;
        var dr = d - 90;
        var radians = Math.PI * (dr) / 180;
        var endX = this.canvasCenter + this.radius * Math.cos(radians);
        var endY = this.canvasCenter + this.radius * Math.sin(radians);
        var largeArc = d > 180 ? 1 : 0;
        var path = 'M' + this.canvasCenter + ',' + this.startY + ' A' + this.radius + ',' + this.radius + ' 0 ' + largeArc + ',1 ' + endX + ',' + endY;
        this.arc = this.s.path(path);
        this.arc.attr({
            stroke: 'rgba(255,89,81,1)',
            fill: 'none',
            strokeWidth: 12
        });

        var percentStr = Math.round(val / 360 * 100) + '%';

        this.$percentNum.text(percentStr);
    };

    return Percentage;

});












