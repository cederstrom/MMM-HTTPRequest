# MMM-HTTPRequest
This an extension for the [MagicMirror²](https://github.com/MichMich/MagicMirror).

It can send GET HTTP requests when a notification is received. It does not take up any space on the mirror and can be configured to show an alert message when the request is done (HTTP 200 OK).

I use it with the [Buttons module](https://github.com/Jopyth/MMM-Buttons). See my example in the [Usage section](README.md#Usage).

This plugin was inspired and initially cloned from [MMM-HTTPRequestDisplay](https://github.com/Eunanibus/MMM-HTTPRequestDisplay).

## Installation
1. Navigate into your MagicMirror's `modules` folder and execute `git clone https://github.com/cederstrom/MMM-HTTPRequest.git`. A new folder will appear.
2. Add it to the modules array in the `config/config.js`:
````javascript
modules: [
    {
        module: 'MMM-HTTPRequest',
        config: {
            // See 'Configuration options' for more information.
        }
    },
]
````

## Configuration options
The following properties can be configured:

| Option             | Description
| ------------------ | -----------
| `showAlertOnError` | Should an alert be displayed if the request did not result in a HTTP 200 OK.<br><br> **Possible values:** `true` or `false` <br><b>Default value:</b> `true` |
| `requests`         | An object holding each requests configuration in a named object. See [Requests Configuration](README.md#Requests-Configuration) below. Default is `{}`. |

### Requests Configuration

Each request configuration is an object with the following properties:

| Property    | Description   |
| ----------- | ------------- |
| `url`       | URL to call. |
| `onSuccess` | An object which describes a notification to send when the request finishes with HTTP 200 OK.<br><br>This property is not mandatory. If not present or set to `undefined` nothing will happen when the request is done.<br><br>For more information, see the section about `sendNotificatio` in the [MagicMirror² Module Development Documentation](https://github.com/MichMich/MagicMirror/tree/master/modules). |

## Configuration example

````javascript
modules: [
    {
        module: "MMM-HTTPRequest",
        config: {
            requests: {
                OPEN_GARAGE_DOOR: {
                    url: "https://home-automation-server/garage-door/open",
                    onSuccess: {
                        notification: "SHOW_ALERT",
                        payload: {
                            title: "Opening garage door",
                            imageFA: "car",
                            timer: 3000,
                        }
                    }
                },
                PAUSE_SONOS_KITCHEN: {
                    url: "http://home-automation-server/Kitchen/pause",
                    onSuccess: {
                        notification: "SHOW_ALERT",
                        payload: {
                            title: "Stopping Sonos: Kitchen",
                            imageFA: "volume-off",
                            timer: 3000,
                        }
                    }
                },
            }
        }
    },
]
````

## Usage
To trigger an URL you need to send a notification with the notification string `HTTP_REQUEST`. The payload is just an object with a `key` matching a key in the list of `requests` in this modules configuration. E.g. `OPEN_GARAGE_DOOR` form the [Configuration options](README.md#Configuration-options).

Example of usage in code:
````javascript
this.sendNotification("HTTP_REQUEST", {key: OPEN_GARAGE_DOOR});
````

Example of usage with the [Buttons module](https://github.com/Jopyth/MMM-Buttons):
````javascript
modules: [
    {
        module: "MMM-Buttons",
        config: {
            minLongPressTime: 3000,
            buttons: [
            {
                pin: 16,
                name: "garage_door_opener",
                shortPress: {
                    notification: "HTTP_REQUEST",
                    payload: {
                        request: "OPEN_GARAGE_DOOR"
                    }
                }
            },
            {
                pin: 20,
                name: "pause_sonos_kitchen",
                shortPress: {
                    notification: "HTTP_REQUEST",
                    payload: {
                        request: "PAUSE_SONOS_KITCHEN"
                    }
                }
            }
            ]
        }
    },
]
````

## Dependencies
- none

The MIT License (MIT)
=====================

Copyright © 2017 Andreas Cederström

Permission is hereby granted, free of charge, to any person
obtaining a copy of this software and associated documentation
files (the “Software”), to deal in the Software without
restriction, including without limitation the rights to use,
copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the
Software is furnished to do so, subject to the following
conditions:

The above copyright notice and this permission notice shall be
included in all copies or substantial portions of the Software.

**The software is provided “as is”, without warranty of any kind, express or implied, including but not limited to the warranties of merchantability, fitness for a particular purpose and noninfringement. In no event shall the authors or copyright holders be liable for any claim, damages or other liability, whether in an action of contract, tort or otherwise, arising from, out of or in connection with the software or the use or other dealings in the software.**
