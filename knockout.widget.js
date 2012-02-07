/*! 
 * Widget base for knockout JS
 * Copyright 2012 Michał Poręba
 * 
 * early experimental version 0.1 
 */
 
 // binding that stops to default binding hierarchy
 // usage: <div data-bind="widget: true"><div data-bind="someWidgetBinding: params"></div></div>
 // 
 // currently two divs have to be used to I hope to improve on that and change it to
 // <div data-bind="widget: someWidgetBinding"></div>
ko.bindingHandlers.widget = (function () {
    return {
        init: function (element, valueAccessor, allBindingsAccessor, viewModel) {
            //apply bindings to descendants but only the first time to allow secure nesting of widgets
            if (element.name && viewModel && !viewModel[element.name]) {
                ko.applyBindingsToDescendants(viewModel, element);
                viewModel[element.name] = true;
            }
            //breaks the default binding hierarchy
            return {
                controlsDescendantBindings: true 
            };
        }
    };
} ());

// goes after all the widget bindings on the page and applies their bindings
ko.applyWidgetBindings = function () {
    var elements = document.querySelectorAll('[data-bind]'),
                attributes = [];
    //find and init widgets
    for (var e in elements) {
        attributes = elements[e].attributes;
        if (attributes) {
            attributes = [].filter.call(attributes, function (attr) { return /^data-bind/.test(attr.name) && ko.utils.stringStartsWith(attr.value, "widget:") });
            if (attributes.length > 0) {
                //add unique name for nested widgets on single view model
                ko.applyBindingsToNode(elements[e], { uniqueName: true }, {});
                ko.applyBindings({}, elements[e]);
            }
        }
    }
};