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
    
    return {
        parents : getParents,
        children : getChildren
    };
}());

module.exports = iterator;