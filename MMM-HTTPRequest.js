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
    
            this.sendSocketNotification("HTTP_REQUEST_INIT", {
                config: this.config
            });
        },
    
        logInfo: function(message) {
            Log.info(this.name + ": " + message);
        },
    
        logError: function(message) {
            Log.error(this.name + ": " + message);
        },
    
        notificationReceived: function(notification, payload, sender) {
            if (notification === "HTTP_REQUEST") {
                this.logInfo("Got " + notification + "with payload.request: " + payload.request);
                this.sendSocketNotification("HTTP_REQUEST_SEND", {
                    id: payload.request
                });
            }
        },

        socketNotificationReceived: function(notification, payload) {
            if (notification === "HTTP_REQUEST_CALLBACK") {
                this.sendNotification(payload.notification, payload.payload);
            }
        }
    
    });
    