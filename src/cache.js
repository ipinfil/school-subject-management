const NodeCache = require( "node-cache" );

var myCache;

module.exports = {
    initCache: function () {
        myCache =  new NodeCache();
    },
    getCache: function () {
        return myCache;
    }
}