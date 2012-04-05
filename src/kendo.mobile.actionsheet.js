(function($, undefined) {
    var kendo = window.kendo,
        ui = kendo.mobile.ui,
        Shim = ui.Shim,
        Widget = ui.Widget,
        OPEN = "open",
        BUTTONS = "li>a",
        CONTEXT_DATA = "actionsheetContext",
        WRAP = '<div class="km-actionsheet-wrapper" />',
        cancelTemplate = kendo.template('<li class="km-actionsheet-cancel"><a href="\\#">#:cancel#</a></li>');

    /**
     * @name kendo.mobile.ui.ActionSheet.Description
     * @section
     * <p>The mobile ActionSheet widget displays a set of choices related to a task the user initiates.</p>
     * <h3>Getting Started</h3>
     * <p>The Kendo mobile Application will automatically initialize a mobile ActionSheet widget for every <code>ul</code> element with <code>role</code>
     * data attribute set to <code>actionsheet</code> present in the views/layouts markup.
     * Alternatively, it can be initialized using a jQuery selector. The actionsheet element should contain one or more <code>li</code> elements, which should contian an <code>a</code> element.</p>
     *
     * @exampleTitle Define an ActionSheet
     * @example
     * <ul data-role="actionsheet">
     *   <li><a data-action="foo">Foo</a></li>
     *   <li><a data-action="bar">Bar</a></li>
     * </ul>
     *
     * @section
     * <p>On iOS, the ActionSheet is modal, and clicking on the background does not close it. A 'Cancel' action is
     * automatically added to the bottom of the actions.</p>
     * <span style="color:red">TODO: Android</span>
     *
     * <h3>Opening ActionSheet</h3>
     * <p>The widget can be open when any mobile navigational widget (listview, button, tabstrip, etc.) is clicked or touched.
     * To do so, the navigational widget should have <code>data-rel="actionsheet"</code> and <code>href</code> attribute pointing to the ActionSheet's element <code>id</code> set.</p>
     *
     * @exampleTitle mobile Button with associated ActionSheet
     * @example
     * <a data-role="button" data-rel="actionsheet" href="#foo">Foo...</a>
     * <ul data-role="actionsheet" id="foo">
     *   <li><a data-action="foo">Foo</a></li>
     *   <li><a data-action="bar">Bar</a></li>
     * </ul>
     *
     * @section
     * <h3>Executing Actions</h3>
     * <p>Each link from the ActionSheet should have a <code>data-action</code> attribute, specifying the callback method to be executed when the user clicks/touches it.
     * The callback can be either a function, or a method of an object in the global scope.</p>
     *
     * <p>The callback receives a object with two fields: <code>target</code> and (optional) <code>context</code> as a
     * parameter. The <code>target</code> points to the DOM element which has opened the Widget. The <code>context</code> field points
     * to the optional <code>actionsheet-context</code> attribute of the opening element.</p>
     *
     * <p>After the method has been executed, the ActionSheet closes automatically.</p>
     *
     * @exampleTitle Mobile ActionSheet actions
     * @example
     * <a id="myButton" data-role="button" data-actionsheet-context="1" data-rel="actionsheet" href="#foo">Foo...</a>
     * <ul data-role="actionsheet" id="foo">
     *   <li><a data-action="foo">Foo</a></li>
     *   <li><a data-action="bar.baz">Bar</a></li>
     * </ul>
     * <script>
     *      function foo(e) {
     *          e.context; // 1
     *          e.target; // $("#myButton")
     *      }
     *
     *      var bar = {
     *          baz: function(e) {
     *              e.context; // 1
     *              e.target; // $("#myButton")
     *          }
     *      }
     * </script>
     *
     */
    var ActionSheet = Widget.extend(/** @lends kendo.mobile.ui.ActionSheet.prototype */{
        /**
         * @constructs
         * @extends kendo.mobile.ui.Widget
         * @param {DomElement} element DOM element.
         * @param {Object} options Configuration options.
         * @option {String} [cancel] <Cancel> The text of the cancel button. Applicable in iOS only.
         */
        init: function(element, options) {
            var that = this,
                wrapper;

            Widget.fn.init.call(that, element, options);

            element = that.element;

            element
                .addClass("km-actionsheet")
                .wrap(WRAP)
                .on(kendo.support.mouseup, BUTTONS, $.proxy(that._click, that))
                .on("click", BUTTONS, kendo.preventDefault);

            wrapper = element.parent();

            that.wrapper = wrapper;
            that.shim = new Shim(that.wrapper);
        },

        events: [
            /**
             * Fires when the ActionSheet is opened.
             * @name kendo.mobile.ui.ActionSheet#open
             * @event
             * @param {Event} e
             * @param {jQueryObject} e.target The invocation target of the ActionSheet.
             * @param {jQueryObject} e.context The defined ActionSheet context.
             */
            OPEN
        ],

        options: {
            name: "ActionSheet",
            cancel: 'Cancel'
        },

        viewInit: function(view) {
            var that = this,
                os = kendo.support.mobileOS;

            that.shim.setOptions({modal: !(os.android || os.meego)});
            that.element.append(cancelTemplate({cancel: that.options.cancel}));
        },

        /**
         * Open the ActionSheet
         * @param {jQueryObject} target (optional) The target of the ActionSheet, available in the callback methods.
         * @param {Object} context (optional) The context of the ActionSheet, available in the callback methods.
         */
        open: function(target, context) {
            var that = this;
            that.target = $(target);
            that.context = context;
            that.trigger(OPEN, { target: that.target, context: that.context });
            that.shim.show();
        },


        /**
         * Close the ActionSheet
         */
        close: function() {
            this.context = this.target = null;
            this.shim.hide();
        },

        /** @ignore */
        openFor: function(target) {
            var that = this;
            that.target = target;
            that.context = target.data(CONTEXT_DATA);
            that.trigger(OPEN, { target: that.target, context: that.context });
            that.shim.show();
        },

        _click: function(e) {
            if (e.originalEvent && e.originalEvent.defaultPrevented) {
                return;
            }

            var action = $(e.currentTarget).data("action");

            if (action) {
                kendo.getter(action)(window)({
                    target: this.target,
                    context: this.context
                });
            }

            e.preventDefault();
            this.close();
        }
    });

    ui.plugin(ActionSheet);
})(jQuery);
