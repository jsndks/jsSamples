/**
 * @fileOverview App module definition
 */

define(function(require) {
    'use strict';

    // List all scripts that need to be loaded before everything else. Suitable for browser polyfills, etc.
    require('polyfills/function.bind');

    var $ = require('jquery');
    var ParticlesController = require('controllers/ParticlesController');
    var PercentageController = require('controllers/PercentageController');
    var ModalListController = require('controllers/ModalListController');
    var SlidePanelController = require('controllers/SlidePanelController');
    var Chart = require('lib/Chart');


    /**
     * Initial application setup. Runs once upon every page load.
     *
     * @class App
     * @constructor
     */
    var App = function() {

    };

    /**
     * Initializes the application and kicks off loading of prerequisites.
     *
     * @method init
     * @private
     */
    App.prototype.init = function() {
        this.chart = new Chart($('#js-chart')[0]);
        this.slidePanelController = new SlidePanelController($('.js-slidePanel'));
        this.particlesController = new ParticlesController($('#particles'));
        this.modalListController = new ModalListController($('#modalList'));
        this.percentageController = new PercentageController($('#percentage'), {
            endpoints: [25, 50, 75, 99]
        });
    };

    return App;
});