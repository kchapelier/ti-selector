var iterator = (function() {
    "use strict";

    var getChildren = function(element) {
        var children = [];

        if(element.children) {
            children = element.children;
        } else if(element.apiName === 'Ti.Api.TableViewSection') {
            children = element.rows;
        } else if(element.apiName === 'Ti.Api.TableViewRow') {
            children = element.data;
        }

        return children;
    };

    var getParents = function(element) {
        var parents = [];

        if(element.parent) {
            parents.push(element.parent);
        }

        return parents;
    };

    var createWalkFunction = function(iterativeFunc) {
        var self = function(root, func) {
            var elements = iterativeFunc(root);

            for(var i = 0; i < elements.length; i++) {
                var element = elements[i];

                if(false === func(element)) {
                    return;
                }

                self(element, func);
            }
        };

        return self;
    };

    return {
        walkParents : createWalkFunction(getParents),
        walkChildren : createWalkFunction(getChildren)
    };
}());

module.exports = iterator;