(function(factory) {
    if (typeof define === 'function' && define.amd) {
        define(['jquery', 'knockout'], factory);
    } else {
        factory(jQuery, ko);
    }
}(function($, ko) {
    if (ko !== undefined && ko.bindingHandlers !== undefined) {
        ko.bindingHandlers.autosize = {
            init: function(element) {
                element.addEventListener("focus", function() {
                    autosize($(element));
                });
            },
            update: function(element) {
                autosize.update($(element));
            }
        };
    }
}));