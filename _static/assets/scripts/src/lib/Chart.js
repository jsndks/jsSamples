/**
 * @fileOverview Chart module definition.
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
	var Chart = function($element) {
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

        this.scopePadding =  0.2;
        this.axisDivisionX = 5;
        this.axisDivisionY = 6;

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
	Chart.prototype.init = function() {
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
     * @returns {Chart}
     * @private
     */
    Chart.prototype.setupHandlers = function() {
        return this;
    };

    /**
     * Create any child objects or references to DOM elements.
     * Should only be run on initialization of the view.
     *
     * @method createChildren
     * @returns {Chart}
     * @private
     */
    Chart.prototype.createChildren = function() {
        this.ctx =  this.$element.getContext('2d');
        this.canvasWidth =  this.$element.width;
        this.canvasHeight =  this.$element.height;

        return this;
    };

    /**
	 handles layout of DOM elements
     *
     * @method layout
     * @returns {Chart}
     * @private
     */
    Chart.prototype.layout = function() {
        return this;
    };

    /**
     * Remove any child objects or references to DOM elements.
     *
     * @method removeChildren
     * @returns {Chart}
     * @public
     */
    Chart.prototype.removeChildren = function() {

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
    Chart.prototype.enable = function() {
        this.renderChart();
    };

    /**
     * Disables the component.
     * Exits early if it is already disabled.
     *
     * @method disable
     * @public
     */
    Chart.prototype.disable = function() {
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
     * @returns {Chart}
     * @public
     */
    Chart.prototype.destroy = function() {
        this.disable()
            .removeChildren();

        return this;
    };

    //////////////////////////////////////////////////////////////////////////////////
    // HELPER METHODS
    //////////////////////////////////////////////////////////////////////////////////

    /**
     * Render the chart
     *
     * @method renderChart
     * @public
     */
    Chart.prototype.renderChart = function() {
        var sinceTimeStamp = '';
        var axisGroups = {
            axis1: [
                'page_fans',
                'page_impressions_unique',
                'page_impressions_viral_unique',
                'page_impressions_paid_unique',
                'page_impressions_organic_unique'
            ],

            axis2: [
                'page_storytellers',
                'page_fan_adds_unique'
            ]
        };

        // for (var p in axisGroups) {
        //     var chartAxis = new ChartAxis(this.canvas, axisGroups[p], sinceTimeStamp);
        // }

        this.ctx.fillStyle = '#434343';
        this.ctx.fillRect(0, 0, this.canvasWidth, this.canvasHeight);

        var i = 0;
        var k = 0;
        var j = 0;
        var xDevision = 5;
        var yDevision = 6;
        var totalDays = 10;
        var valMin = 1000;
        var totalRange = 20000;
        var xIncrement = totalDays / xDevision;
        var yIncrement = totalRange / yDevision;
        var dataPoints = [
            { coordX: 0, coordY: this.canvasHeight - 0 },
            { coordX: 10, coordY: this.canvasHeight - 10 },
            { coordX: 40, coordY: this.canvasHeight - 20 },
            { coordX: 80, coordY: this.canvasHeight - 30 },
            { coordX: 140, coordY: this.canvasHeight - 40 },
            { coordX: 250, coordY: this.canvasHeight - 50 }
        ];

        //X axis
        for (; i <= xDevision; i++) {
            var curVal = xIncrement * i;
            var coordX = this.canvasWidth * (curVal / totalDays);

            this.ctx.fillStyle = '#ffffff';
            this.ctx.font = "8px Arial";
            this.ctx.textAlign = 'left';
            this.ctx.fillText('test', coordX, this.canvasHeight);
        }

        //Y axis
        for (; k <= yDevision; k++) {
            var curVal = yIncrement * k;
            var coordY = this.canvasHeight * (curVal / totalRange);

            this.ctx.fillStyle = '#ffffff';
            this.ctx.font = "8px Arial";
            this.ctx.textAlign = 'left';
            this.ctx.fillText('test', 0, coordY);
        }

        this.ctx.fillStyle = 'rgba(157,157,157,0.5)';
        this.ctx.strokeStyle = 'rgba(142,142,142,0.8)';
        this.ctx.lineWidth = 3;
        this.ctx.lineJoin = 'round';
        this.ctx.beginPath();
        for(; j < dataPoints.length; j++) {
            var point = dataPoints[j];
            this.ctx.lineTo(point.coordX, point.coordY);

            var lastPoint = point;
        }
        this.ctx.lineTo(this.canvasWidth, lastPoint.coordY);
        this.ctx.lineTo(this.canvasWidth, this.canvasHeight);
        this.ctx.closePath();
        this.ctx.stroke();
        this.ctx.fill();

    };

    //////////////////////////////////////////////////////////////////////////////////
    // EVENT HANDLERS
    //////////////////////////////////////////////////////////////////////////////////



	return Chart;

});






































