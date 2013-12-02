/**
 * @fileOverview Modal List module definition.  Used to toggle the display of inline podals within a blocks list
 */

define(function(require) {
    'use strict';

    var $ = require('jquery');
    var EqualHeight = require('lib/EqualHeight');
    var Handlebars = require('handlebars');
    var inlineModalTemplate = require('text!../../../templates/inlineModalContainer.html');

    /**
     * ModalList lib class
     *
     * @class ModalList
     * @constructor
     */
    var ModalList = function($element) {
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

        /**
         * Sets the number of columns in the current list
         *
         * @default 3
         * @property colCount
         * @type {number}
         * @public
         */
        this.colCount = 3;

        // TODO: docblocs needed
        this.fullDescSelector = 'js-fullDescription';
        this.contentHiddenSelector = 'modal-content-item_isHidden';
        this.contentIsVisibleSelector = 'modal-content-item_isInvisible';
        this.modalContentSelector = 'js-modalContentItem';
        this.modalHiddenSelector = 'mix-modal_isHidden';
        this.modalCollapsedSelector = 'mix-modal_isCollapsed';
        this.caratSelector = 'modal-carat';
        this.gridColSelector = 'layoutSection-contain-bd';
        this.modalSelector = 'js-modal';
        this.modalCloseSelector = 'js-modalClose';
        this.closeHiddenSelector = 'modal-close_isHidden';
        this.boxItemSelector = 'box';
        this.itemActiveSelector = 'box_isActive';

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
    ModalList.prototype.init = function() {
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
     * @returns {ModalList}
     * @private
     */
    ModalList.prototype.setupHandlers = function() {
        this.onClickListItemHandler = this.onClickListItem.bind(this);
        this.onClickModalCollapseHandler = this.onClickModalCollapse.bind(this);
        return this;
    };

    /**
     * Create any child objects or references to DOM elements.
     * Should only be run on initialization of the view.
     *
     * @method createChildren
     * @returns {ModalList}
     * @private
     */
    ModalList.prototype.createChildren = function() {
        this.colCount = parseInt(this.$element.attr('data-col-count'), 10);
        this.$listItems = $('> li', this.$element);
        this.$lastColItem = this.$listItems.filter(':nth-child(' + this.colCount + 'n+' + this.colCount + ')');
        this.$startItem = $('[data-start-item="true"]', this.$element);
        this.$boxItems = $('.' + this.boxItemSelector, this.$listItems);

        return this;
    };

    /**
     * Create any child objects or references to DOM elements
     * after page initialization.
     *
     * @method cacheSelectors
     * @private
     */
    ModalList.prototype.cacheSelectors = function() {
        this.$modals = $('.js-modal', this.$element);
        this.$modalContent = $('.js-modalContentItem', this.$element);
        this.$closeModalBtn = $('.' + this.modalCloseSelector);
    };

    /**
     * Remove any child objects or references to DOM elements.
     *
     * @method removeChildren
     * @returns {ModalList}
     * @public
     */
    ModalList.prototype.removeChildren = function() {
        this.colCount = null;
        this.$listItems = null;
        this.$lastColItem = null;
        this.$startItem = null;
        this.$boxItems = null;
        this.$modals = null;
        this.$modalContent = null;
        this.$closeModalBtn = null;

        return this;
    };

    /**
     * Performs measurements and applys any positioning style logic.
     * Should be run anytime the parent layout changes.
     *
     * @method layout
     * @returns {ModalList}
     * @private
     */
    ModalList.prototype.layout = function() {

        //pseudo code
        //Hide full descriptions;
        //For each group of three
            //create array
            //for each item push html into array
                //set the item and modal index
            //template data using array and append at end of row
        //make first description visible

        $('.' + this.fullDescSelector, this.$listItems).hide();
        var template = Handlebars.compile(inlineModalTemplate);
        var modalIndex = 0;
        var j = 0;
        var listLength = this.$listItems.length;
        for (; j < listLength; j += this.colCount) {
            modalIndex++;
            var $row = this.$listItems.slice(j, j + this.colCount);
            var $lastItem = $row.last();
            var p = 0;
            var l = $row.length;
            var descriptionArr = [];

            this.equalHeight = new EqualHeight($row);

            for (; p < l; p++) {
                var $item = $row.filter(':eq(' + p + ')');
                var $longDesc = $('.' + this.fullDescSelector, $item);

                if ($longDesc.length) {
                    descriptionArr.push($longDesc.html());
                }

                $item.attr('data-item-index', p);
                $item.attr('data-modal-index', modalIndex);
            }

            var templateData = {
                colCount: this.colCount,
                modalIndex: modalIndex,
                longDescs: descriptionArr
            };

            var modalItem =  template(templateData);
            $lastItem.after(modalItem);
        }

        this.cacheSelectors();
        this.attachDescriptionHeights();
        this.$modals.addClass(this.modalHiddenSelector);

        //hide all content items by default
        this.$modalContent.addClass(this.contentHiddenSelector);

        return this;
    };

    /**
     * Loop through the descriptions and run
     * the height calculation method on it.
     *
     * @method attachDescriptionHeights
     * @public
     */
    ModalList.prototype.attachDescriptionHeights = function() {
        var i = 0;
        var $modalContent = $('.' + this.modalContentSelector, this.$element);
        var l = $modalContent.length;

        for (; i < l; i++) {
            var item = $modalContent[i];
            this.getDescriptionHeight($(item));
        }
    };

    /**
     * Enables the component.
     * Performs any event binding to handlers.
     * Exits early if it is already enabled.
     *
     * @method enable
     * @public
     */
    ModalList.prototype.enable = function() {
        if (this.isEnabled) {
            return this;
        }
        this.isEnabled = true;

        this.$element.on('click', '> li', this.onClickListItemHandler);
        this.$closeModalBtn.on('click', this.onClickModalCollapseHandler);
    };

    /**
     * Disables the component.
     * Exits early if it is already disabled.
     *
     * @method disable
     * @public
     */
    ModalList.prototype.disable = function() {
        if (!this.isEnabled) {
            return this;
        }
        this.isEnabled = false;

        this.$element.off('click', '> li', this.onClickListItemHandler);
        this.$closeModalBtn.off('click', this.onClickModalCollapseHandler);

        return this;
    };

    /**
     * Destroys the component.
     * Tears down any events, handlers, elements.
     * Should be called when the object should be left unused.
     *
     * @method destroy
     * @returns {ModalList}
     * @public
     */
    ModalList.prototype.destroy = function() {
        this.$modals.parent().remove();
        this.disable()
            .removeChildren();

        return this;
    };

    //////////////////////////////////////////////////////////////////////////////////
    // HELPER METHODS
    //////////////////////////////////////////////////////////////////////////////////

    /**
     * Collapse the view of a specified modal
     *
     * @method collapseModal
     * @param $modal {object} modal element jQuery object
     * @public
     */
    ModalList.prototype.collapseModal = function($modal, callback) {
        var self = this;
        var $groupDescs = $modal.find('.' + this.modalContentSelector);
        var $targetClose = $('.' + this.modalCloseSelector, $modal);

        //Strip the inline height style by setting to an empty string
        $modal.css('height', '');
        $modal.addClass(this.modalCollapsedSelector);
        $groupDescs.addClass(this.contentHiddenSelector);

        // Fade the close btn
        $targetClose.addClass(this.closeHiddenSelector);

        setTimeout(function() {
            $modal.addClass(self.modalHiddenSelector);
            if (callback) {
                callback();
            }
        }, 500);
    };

    /**
     * Expand the view of a specified modal
     *
     * @method expandModal
     * @param $modal {object} modal element jQuery object
     * @public
     */
    ModalList.prototype.expandModal = function($modal, modalHeight, callback) {
        var self = this;
        var $targetClose = $('.' + this.modalCloseSelector, $modal);

        //collapse modal
        $modal.addClass(this.modalCollapsedSelector);

        //show modal
        $modal.removeClass(this.modalHiddenSelector);

        // Fade the close btn
        $targetClose.removeClass(this.closeHiddenSelector);

        setTimeout(function() {
            $modal.removeClass(self.modalCollapsedSelector);
            $modal.css('height', modalHeight + 'px');
            if (callback) {
                callback();
            }
        }, 1);
    };

    /**
     * Calculate the height of the description block
     * and assign it as a data attribute.
     *
     * @method getDescriptionHeight
     * @param $description {object} jQuery description block object
     * @public
     */
    ModalList.prototype.getDescriptionHeight = function($description) {
        var itemHeight = $description.outerHeight();
        $description.attr('data-height', itemHeight);
    };

    /**
     * Adjusts the position of the modal carat
     *
     * @method positionCarat
     * @public
     */
    ModalList.prototype.positionCarat = function($targetEl, itemIndex, $targetModal) {
        itemIndex = parseInt(itemIndex, 10);
        var $modalCarat = $('.' + this.caratSelector, $targetModal);

        //TODO: position the first and last items differently to account for percentage blocks-item margins
        var itemWidth = ($targetEl.is(':last-child')) ? $targetEl.width() : $targetEl.outerWidth(true);
        // var itemWidth = $targetEl.outerWidth(true);

        var columnWidth = $targetModal.parents('.' + this.gridColSelector).outerWidth();
        var caratePos = (itemIndex + 1) / this.colCount;

        caratePos = Math.ceil((caratePos * columnWidth) - (itemWidth * 0.5) - 13);

        $modalCarat.css({
            'left': caratePos + 'px'
        });
    };

    /**
     * Reinitialize modals, resizing them dynamically
     *
     * @method reinit
     * @public
     */
    ModalList.prototype.reinit = function() {
        this.destroy();
        this.init();
    };

    //////////////////////////////////////////////////////////////////////////////////
    // EVENT HANDLERS
    //////////////////////////////////////////////////////////////////////////////////

    /**
     * Listing Item click handler
     *
     * @method onClickListItem
     * @param e {Event} JavaScript event object.
     * @public
     */
    ModalList.prototype.onClickListItem = function(e) {

        var self = this;
        var $targetEl = $(e.currentTarget);
        var itemIndex = $targetEl.attr('data-item-index');
        var modalIndex = $targetEl.attr('data-modal-index');
        var $targetModal = this.$modals.filter('[data-modal="' + modalIndex + '"]');
        var $groupDescs = $targetModal.find('.' + this.modalContentSelector);
        var $targetDesc = $groupDescs.eq(itemIndex);
        var descHeight = $targetDesc.attr('data-height');
        var $otherListModals = this.$modals.not($targetModal);
        var $clickedEl = $(e.target); //records what child element was clicked

        if($clickedEl.hasClass('galleryDwnldBtn')) {
            return;
        } else {
            e.preventDefault();
        }

        // if already visible, collapse
        if (!$targetDesc.hasClass(this.contentHiddenSelector)) {
            this.collapseModal($targetModal, this.deSelectItem.bind(this));
            $targetDesc.addClass(this.contentHiddenSelector);
            return;
        }

        // collapse any other open modals
        var i = 0;
        var l = $otherListModals.length;
        for (; i < l; i++) {
            var $otherModal = $otherListModals.eq(i);
            this.collapseModal($otherModal);
        }

        // hide all descs & show target desc
        $groupDescs.addClass(this.contentHiddenSelector);
        $targetDesc.removeClass(this.contentHiddenSelector);

        setTimeout(function() {
            $groupDescs.addClass(self.contentIsVisibleSelector);
            $targetDesc.removeClass(self.contentIsVisibleSelector);
        }, 1);

        //record modal height
        var modalHeight = parseInt(descHeight, 10) + 78;

        this.expandModal($targetModal, modalHeight, this.selectItem.bind(this, $targetEl));
        this.positionCarat($targetEl, itemIndex, $targetModal);
    };

    /**
     * Apply proper active class to items
     *
     * @method selectItem
     * @param {object} $targetEl jQuery element to activate
     * @public
     */
    ModalList.prototype.selectItem = function($targetEl) {
        this.$boxItems.removeClass(this.itemActiveSelector);
        $('.' + this.boxItemSelector, $targetEl).addClass(this.itemActiveSelector);
    };

    /**
     * Apply prper active class to items
     *
     * @method deSelectItem
     * @public
     */
    ModalList.prototype.deSelectItem = function() {
        this.$boxItems.removeClass(this.itemActiveSelector);
    };

    /**
     * Collapse the inline modal
     *
     * @method onClickModalClose
     * @param e {Event} JavaScript event object.
     * @public
     */
    ModalList.prototype.onClickModalCollapse = function(e) {
        e.preventDefault();
        var $targetEl = $(e.currentTarget);
        var $targetModal = $targetEl.parent('.' + this.modalSelector);
        this.collapseModal($targetModal);
    };

    return ModalList;
});