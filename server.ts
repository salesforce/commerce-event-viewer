/*
 * Copyright (c) 2020, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: BSD-3-Clause
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */

import express from "express";
import nforce from "nforce";
import faye from 'faye';
import cors from 'cors';
import http from 'http';
import socketio from 'socket.io';
import testConnection from './testConnection.js';

const app = express();
let server = new http.Server(app);
let io = socketio(server);

import path from 'path';
const __dirname = path.resolve();

let PORT = process.env.PORT || 5000;

app.use(cors());
app.use('/', express.static(__dirname + '/www'));

let bayeux = new faye.NodeAdapter({ mount: '/faye', timeout: 45 });
bayeux.attach(server);
bayeux.on('disconnect', function(clientId) {
    console.log('Server disconnect');
});

server.listen(PORT, () => console.log(`Express server listening on ${PORT}`));



// Connect to Salesforce
let SF_CLIENT_ID = process.env.SF_CLIENT_ID;
let SF_CLIENT_SECRET = process.env.SF_CLIENT_SECRET;
let SF_USER_NAME = process.env.SF_USER_NAME;
let SF_USER_PASSWORD = process.env.SF_USER_PASSWORD;
let SF_LOGIN_SRV = process.env.SF_LOGIN_SRV ?? "login.salesforce.com";
let REDIRECT_URL = process.env.REDIRECT_URL ?? (process.env.HEROKU_APP_NAME + ".herokuapp.com/oauth/_callback");

let org = SF_LOGIN_SRV === 'TEST' ? new testConnection() : nforce.createConnection({
    clientId: SF_CLIENT_ID,
    clientSecret: SF_CLIENT_SECRET,
    environment: "production",
    redirectUri: REDIRECT_URL,
    authEndpoint: 'https://' + SF_LOGIN_SRV + '/services/oauth2/authorize',
    loginUri: 'https://' + SF_LOGIN_SRV + '/services/oauth2/token',
    mode: 'single',
    autoRefresh: true
});

// Subscribe to Platform Events for a given eventName
let subscribeToPlatformEvents = (eventName: string) => {
    var client = new faye.Client(org.oauth.instance_url + '/cometd/48.0/');
    client.setHeader('Authorization', 'OAuth ' + org.oauth.access_token);
    let eventFullName = '/event/' + eventName;
    console.log("Subscribing to event: " + eventName);
    client.subscribe(eventFullName, function(message) {
        console.log("Received message: " + message);
        // Send message to all connected Socket.io clients
        io.of('/').emit('eventReceived', {
            eventName: eventName,
            eventPayload: message
        });
    });

};

const wait = (delay: number, ...args) => new Promise(resolve => setTimeout(resolve, delay, ...args));

let retry = async (fn: Function, retryDelay = 30000, numRetries = 100) => {
    for (let i = 1; i < numRetries + 1; i++) {
        try {
            console.log("Attempt " + i + " of " + numRetries);
            return await fn();
        } catch (e) {
            console.log("Retry failed: " + e);
            if (i === numRetries) throw e;
            await wait(retryDelay);
        }
    }
}


retry(() => org.authenticate({ username: SF_USER_NAME, password: SF_USER_PASSWORD }))
    .then(result => ['CommerceDiagnosticEvent'].forEach(x => subscribeToPlatformEvents(x)))
    .catch(e => process.exit(1));
