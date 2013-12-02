/**
 * @fileOverview Particles module definition.
 */

define(function(require) {
	'use strict';

    var $ = require('jquery');
    require('snap');

	/**
     * Particles lib class
     *
     * @class Particles
     * @constructor
     */
	var Particles = function($element, options) {
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
         * A reference to the passed in options
         *
         * @default null
         * @property {object} options
         * @public
         */
        this.options = options;

        /**
         * Tracks whether component is enabled.
         *
         * @default false
         * @property isEnabled
         * @type {bool}
         * @public
         */
        this.isEnabled = false;

        /**
         * Number of particles to be emited.
         *
         * @default 2000
         * @property numParticles
         * @type {number}
         * @public
         */
        this.numParticles = options.quantity;

        /**
         * Initial timestamp use to for baseline of animation loop
         *
         * @default null
         * @property lastTimeStamp
         * @type {number}
         * @public
         */
        this.lastTimeStamp = null;

        /**
         * array representing particles
         *
         * @default empty array
         * @property lastTimeStamp
         * @type {array}
         * @public
         */
        this.particles = [];

        /**
         * The bounce
         *
         * @default -1
         * @property bounce
         * @type {number}
         * @public
         */
        this.bounce = -1;

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
	Particles.prototype.init = function() {
		this.createChildren()
            .layout()
			.enable();
	};

    /**
     * Create any child objects or references to DOM elements.
     * Should only be run on initialization of the view.
     *
     * @method createChildren
     * @returns {Particles}
     * @private
     */
    Particles.prototype.createChildren = function() {
        this.canvas = this.$element[0];
        this.context = this.canvas.getContext('2d');
        this.canvasWidth = this.canvas.width;
        this.canvasHeight = this.canvas.height;
        this.lastTimeStamp = new Date().getTime();

        this.$smokeImg = $('#smokeImg');

        return this;
    };

    /**
     * handles layout of DOM elements
     *
     * @method layout
     * @returns {ParticlesController}
     * @private
     */
    Particles.prototype.layout = function() {
        window.requestAnimFrame = (function() {
            return  window.requestAnimationFrame       ||
            window.webkitRequestAnimationFrame         ||
            window.mozRequestAnimationFrame
        })();

        return this;
    };

    /**
     * Remove any child objects or references to DOM elements.
     *
     * @method removeChildren
     * @returns {Particles}
     * @public
     */
    Particles.prototype.removeChildren = function() {
        this.context = null;
        this.canvasWidth = null;
        this.canvasHeight = null;
        this.lastTimeStamp = null;

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
    Particles.prototype.enable = function() {
        this.createParticleData();
        this.renderLoop();
    };

    /**
     * Disables the component.
     * Exits early if it is already disabled.
     *
     * @method disable
     * @public
     */
    Particles.prototype.disable = function() {
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
     * @returns {Particles}
     * @public
     */
    Particles.prototype.destroy = function() {
        this.disable()
            .removeChildren();

        return this;
    };

    //////////////////////////////////////////////////////////////////////////////////
    // HELPER METHODS
    //////////////////////////////////////////////////////////////////////////////////

    /**
     * Creates particle data objects
     *
     * @method createParticleData
     * @private
     */
    Particles.prototype.createParticleData = function() {
        var i = 0;
        var l = this.numParticles;

        for(; i < l; i++) {
            this.particles[i] = {};
            this.setParticleData(this.particles[i]);
        }
    };

    /**
     * Sets the base particle data
     *
     * @method setParticleData
     * @private
     */
    Particles.prototype.setParticleData = function(particle) {
        switch (this.options.particleType) {
            case 'mist':
                particle.x = Math.random() * this.canvasWidth;
                particle.y = 0 - (Math.random() * (this.canvasHeight * 0.15));
                particle.vx = Math.random() * 2 - 1;
                particle.vy = Math.random() * 2;
                particle.life = function() {
                    return this.vy * 2000;
                };
                particle.elapsed = 0;
                particle.alpha = 1;
                particle.radius = 1;
                break;
            case 'smoke':
                particle.x = Math.random() * this.canvasWidth;
                particle.y = this.canvasHeight + ((this.canvasHeight * 0.15) * Math.random());
                particle.vx = (Math.random() * 4) - 4;
                particle.vy = Math.random() * 4;
                particle.life = function() {
                    return this.vy * 2000;
                };
                particle.elapsed = 0;
                particle.alpha = 1;
                particle.width = 100 + (100 * Math.random());
                particle.height = 46 + (46 * Math.random());
                particle.rotation = (Math.PI / 180) * (Math.random() * 10);
                break;
            case 'scatter':
                particle.x = Math.random() * this.canvasWidth;
                particle.y = Math.random() * this.canvasHeight;
                particle.vx = (Math.random()) - 0.5;
                particle.vy = (Math.random()) - 0.5;
                break;
            default:
        }
    };

    /**
     * Updates the particle data object
     *
     * @method update
     * @private
     */
    Particles.prototype.update = function() {
        var i = 0;

        switch (this.options.particleType) {
            case 'mist':
                for (; i < this.numParticles; i++) {
                    var particle = this.particles[i];
                    particle.x += particle.vx;
                    particle.y += particle.vy;
                    particle.alpha -= particle.elapsed / particle.life();
                    particle.elapsed += 10;
                    particle.radius -= 0.01;

                    if (particle.alpha <= 0) {
                        this.setParticleData(particle);
                    }
                }
                break;
            case 'smoke':
                for (; i < this.numParticles; i++) {
                    var particle = this.particles[i];
                    particle.x += particle.vx;
                    particle.y -= particle.vy;
                    particle.alpha -= particle.elapsed / particle.life();
                    particle.elapsed += 1;
                    particle.width += 3;
                    particle.height += 3;

                    if (particle.alpha < 0) {
                        this.setParticleData(particle);
                    }
                }
                break;
            case 'scatter':
                for (; i < this.numParticles; i++) {
                    var particle = this.particles[i];

                    particle.x += particle.vx;
                    particle.y += particle.vy;

                    if (particle.x > this.canvasWidth) {
                        particle.x = this.canvasWidth;
                        particle.vx *= this.bounce;
                    } else if (particle.x < 0) {
                        particle.x = 0;
                        particle.vx *= this.bounce;
                    }

                    if (particle.y > this.canvasHeight) {
                        particle.y = this.canvasHeight;
                        particle.vy *= this.bounce;
                    } else if (particle.y < 0) {
                        particle.y = 0;
                        particle.vy *= this.bounce;
                    }
                }
                break;
            default:
        }
    };

    /**
     * Renders the particle on the canvas
     *
     * @method draw
     * @private
     */
    Particles.prototype.draw = function() {
        var i = 0;

        if (!this.context) {
            return;
        }

        this.context.clearRect(0, 0, this.canvasWidth, this.canvasHeight);

        switch (this.options.particleType) {
            case 'mist':
                for (; i < this.numParticles; i++) {
                    var particle = this.particles[i];
                    this.context.fillStyle = 'rgba(255,89,81,' + particle.alpha + ')';
                    this.context.save();
                    this.context.beginPath();
                    this.context.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
                    this.context.fill();
                    this.context.restore();
                }
                break;
            case 'smoke':
                var imgObj = this.$smokeImg[0];

                for (; i < this.numParticles; i++) {
                    var particle = this.particles[i];
                    this.context.save();
                    this.context.rotate(particle.rotation);
                    this.context.globalAlpha = particle.alpha;
                    this.context.drawImage(imgObj, particle.x, particle.y, particle.width, particle.height);
                    this.context.restore();
                }

                break;
            case 'scatter':
                this.context.strokeStyle = 'rgba(255,89,81,1)';
                for(; i < this.numParticles; i++) {
                    var particle = this.particles[i];
                    this.context.save();
                    this.context.beginPath();
                    this.context.arc(particle.x, particle.y, 2, 0, Math.PI * 2);
                    this.context.stroke();
                    this.context.restore();
                }
                break;
            default:
        }
    };

    /**
     * Creates the animation loop
     *
     * @method renderLoop
     * @private
     */
    Particles.prototype.renderLoop = function() {
        requestAnimationFrame(this.renderLoop.bind(this));
        this.update();
        this.draw();
    };

	return Particles;

});