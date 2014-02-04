/*global window:true, _:true, Backbone:true, jQuery:true, umobile:true, config:true, console:true, Handlebars:true */
(function ($, _, Backbone, umobile, config) {
	'use strict';

	/**
	Manages the loaded Module view.

	@class ModuleView
	@submodule view
	@namespace view
	@constructor
	**/
	umobile.view.ModuleView = umobile.view.LoadedView.extend({
		/**
		Property houses the name of the loaded view.

		@property name
		@type String
		@override LoadedView
		**/
		name: 'module',

		/**
		Property houses DOM selectors.

		@property selectors
		@type Object
		@override Base
		**/
		selectors: {
			template: '#views-partials-moduleview',
			notifier: '#notifier',
			frame: '#moduleFrame'
		},

		/**
		Method empties root containers.

		@method cleanContainers
		**/
		cleanContainers: function () {
			var notifier = this.loc('notifier'),
				frame = this.loc('frame');

			notifier.empty().hide();
			frame.hide();
		},

		/**
		Method renders the notifier.

		@method renderNotifier
		**/
		renderNotifier: function () {
			// Define.
			var notifier, notifierModel, notifierView;

			// Initialize.
			notifier = this.loc('notifier');
			notifierModel = new umobile.model.Notifier();
			notifierView = new umobile.view.Notifier({model: notifierModel.toJSON()});
			notifier.append(notifierView.render().el).show();
		},

		/**
		Method renders the frame container.

		@method renderFrame
		**/
		renderFrame: function () {
			var frame = this.loc('frame').show();
                        
                        // START OF FRAME SIZING LOGIC
                        // frame size == full screen... minus header and footer.
                        // IS THIS A NASTY HACK ? -- I think this should be implemented somewhere else .
                        function resizeElement(toSize, parentSize) {
                            var toHeight = parentSize - Math.max($(toSize).outerHeight(true) - $(toSize).innerHeight(), 0);
                            $(toSize).siblings().filter(':visible').filter(function() {return $(this).css('position') !== 'fixed';}).each(
                                function () {
                                    toHeight -= $(this).outerHeight(true);
                                }
                            );
                            $(toSize).height(toHeight);
                        }
                        var resizeAction = null;
                        $(window).on({
                            'resize':function () {
                                
                                window.clearTimeout(resizeAction);
                                resizeAction = window.setTimeout(function() {
                                    var $parents = $(frame).parents();
                                    var parentSize = $(window).height();
                                    $parents.each(function() {
                                        resizeElement($(this), parentSize);
                                        parentSize = $(this).innerHeight();
                                    });
                                    resizeElement($(frame), parentSize);
                                    console.log('Parent Height: '+parentSize);
                                }, 500);

                            }
                        });

                    $(window).trigger('resize');
                   // END OF FRAME SIZING LOGIC


		},

		/**
		Method overrides the LoadedView class. This method
		provides custom content for the Module view.

		@method renderError
		@override LoadedView
		**/
		renderError: function () {
			this.cleanContainers();
			this.renderNotifier();
		},

		/**
		Method overrides the LoadedView class. This method
		provides custom content for the Module view.

		@method renderContent
		@param {Object} collection Reference to the ModuleCollection.
		@override LoadedView
		**/
		renderContent: function (collection) {
			this.cleanContainers();
			this.renderFrame();
		}
	});

})(jQuery, _, Backbone, umobile, config);