var iterator = (function () {
    "use strict";

    var getChildren = function (element) {
        var children = [];

        if (element.children && element.children.length) {
            children = element.children;
        } else if (element.apiName === 'Ti.UI.TableView') {
            if (element.sections && element.sections.length) {
                children = element.sections;
            }
        } else if (element.apiName === 'Ti.UI.TableViewSection') {
            children = element.rows;
        }

        return children;
    };

    var getParents = function (element) {
        var parents = [];

        if (element.parent) {
            parents.push(element.parent);
        }

        return parents;
    };

    var getSiblings = function (element) {
        var siblings = [],
            parent = getParents(element);

        if (parent.length) {
            siblings = getChildren(parent[0]);
        }

        return siblings.filter(function (siblingElement) {
            return siblingElement !== element;
        });
    };

    var createWalkFunction = function (baseFunction, iterative) {
        var self = function (root, func) {
            var elements = baseFunction(root),
                element, i;

            for (i = 0; i < elements.length; i++) {
                element = elements[i];

                if (func(element) === false) {
                    return;
                }

                if (iterative) {
                    self(element, func);
                }
            }
        };

        return self;
    };

    return {
        walkParents: createWalkFunction(getParents, true),
        walkChildren: createWalkFunction(getChildren, true),
        walkSiblings: createWalkFunction(getSiblings, false)
    };
}());

module.exports = iterator;
