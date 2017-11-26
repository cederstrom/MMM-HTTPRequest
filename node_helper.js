/* Magic Mirror
 * Node Helper: HTTPRequest
 *
 * By Andreas Cederström
 * MIT Licensed.
 */

const NodeHelper = require("node_helper");
const request = require('request');

module.exports = NodeHelper.create({
    // Subclass start method.
    start: function() {
        var self = this;
        console.log("Starting node helper for: " + self.name);
        this.loaded = false;
    },

    // Subclass socketNotificationReceived received.
    socketNotificationReceived: function(notification, payload) {
        if (notification === 'HTTP_REQUEST_INIT') {     
            this.config = payload.config;
        }
        else if (notification === 'HTTP_REQUEST_SEND') {
            this.sendRequest(payload.id);
        }
    },

    sendRequest: function(id) {
        var self = this;

        var requestConfig = this.config.requests[id];
        if (!requestConfig) {
            console.error("Could not find request config for " + id);
            return;
        }

        request({
            url: requestConfig.url,
            method: requestConfig.method || "GET"
        }, function(error, response, body) {
            if (!error && response.statusCode == 200) {
                self.sendSocketNotification("HTTP_REQUEST_CALLBACK", {
                    notification: requestConfig.onSuccess.notification,
                    payload: requestConfig.onSuccess.payload
                });
            }
            else {
                console.error("Could not perform request " + id);
                if (self.config.showAlertOnError) {
                    self.sendSocketNotification("HTTP_REQUEST_CALLBACK", {
                        notification: "SHOW_ALERT", 
                        payload: {
                            title: "HTTP Status: " + response.statusCode,
                            message: this.responseText,
                            timer: 3000
                        }
                    });
                }
            }
        });
    }
});
