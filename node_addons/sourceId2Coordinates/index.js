const sourceId2Coordinates
    = require('./build/Release/sourceId2Coordinates.node').sourceId2Coordinates;

/**
 * Returns the coordinates of a desktop using the passed desktop sharing source
 * id.
 *
 * @param {string} sourceId - The desktop sharing source id.
 * @returns {Object.<string, number>|undefined} - The x and y coordinates of the
 * top left corner of the desktop. Currently works only for windows. Returns
 * undefined for Mac OS, Linux.
 */
module.exports = function(sourceID) {
    // On windows the source id will have the following format "0:desktop_id".
    // we need the "desktop_id" only to get the coordinates.
    const idArr = sourceID.split(":");
    const id = Number(idArr.length > 1 ? idArr[1] : sourceID);
    if(id) {
        return sourceId2Coordinates(id);
    }
    return undefined;
};
