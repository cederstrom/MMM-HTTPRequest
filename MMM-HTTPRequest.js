/* global Module */

/* Magic Mirror
 * Module: MMM-HTTPRequest
 *
 * By Andreas Cederström andreas.cederstrom@gmail.com
 * MIT Licensed.
 */

Module.register("MMM-HTTPRequest",{

    requiresVersion: "2.1.0",

    // Default module config
    defaults: {
        showAlertOnError: true,
        requests: {}
    },

    start: function() {
        this.logInfo("Starting module");

        for (var request in this.config.requests) {
            if (this.config.requests.hasOwnProperty(request)) {
                var requestConfig = this.config.requests[request];
                if (!requestConfig.url) {
                    this.logError("Request " + request + " does not have the mandatory attribute 'url'");
                }
            }
        }
    },

    logInfo: function(message) {
        Log.info(this.name + ": " + message);
    },

    logError: function(message) {
        Log.error(this.name + ": " + message);
    },

    notificationReceived: function (notification, payload, sender) {
        if (notification === "HTTP_REQUEST") {
            this.logInfo("Got " + notification + "with payload.request: " + payload.request);
            this.sendRequest(payload.request);
        }
    },

    sendRequest: function(id) {
        var self = this;

        var requestConfig = this.config.requests[id];
        if (!requestConfig) {
            this.logError("Could not find request config for " + id);
            return;
        }

        var request = new XMLHttpRequest();
        request.open("GET" , requestConfig.url, true);
        request.onreadystatechange = function() {
            if (this.readyState === XMLHttpRequest.DONE) {
                if (this.status === 200) {
                    self.sendNotification(requestConfig.onSuccess.notification, requestConfig.onSuccess.payload);
                }
                else {
                    self.logError("Could not perform request " + id + ". HTTP status: " + this.status);
                    if (self.config.showAlertOnError) {
                        self.sendNotification("SHOW_ALERT", {
                            title: "HTTP Status: " + this.status,
                            message: "Something went wrong during the request",
                            timer: 3000
                        });
                    }
                }
            }
        };
        request.send();
    },

});
