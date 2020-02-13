/*
 * Copyright (c) 2020, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: BSD-3-Clause
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */

import http from "http";
import net from "net";
import faye from "faye";


function makeMsg(n: number) {
    return {
        "schema": "c8R_v1FV-aEAAP9FZ0zkCg",
        "payload": {
            "EffectiveAccountId": null,
            "EventDate": new Date().toISOString(),
            "CreatedDate": new Date().toISOString(),
            "EventIdentifier": "6a3e749b-7d47-4316-a852-1829d8eddd72",
            "OperationStage": null,
            "RelatedEventIdentifier": null,
            "IsRetry": false,
            "Operation": "CancelCheckout",
            "Count": null, "ContextId2": "2z9RM0000004DR3YAM",
            "OperationTime": 123,
            "ContextMap": "{\"updatedCartState\":\"ACTIVE\",\"integrationType\":null,\"backgroundOperationId\":\"08PRM0000009dP2\",\"checkoutSessionNextState\":\"Confirm Price\",\"checkoutSessionId\":\"2z9RM0000004DR3\",\"cartId\":\"0a6RM0000004Edw\",\"isAutomatedProcess\":\"0\",\"cancelled\":\"0\",\"checkoutSessionState\":\"Inventory\"}", "CreatedById": "005RM000002313TYAQ",
            "Username": null,
            "ServiceName": "Checkout",
            "UserId": "005RM000002313oYAA",
            "OperationStatus": "Success",
            "ContextId": "0a6RM0000004EdwYAE",
            "WebStoreId": "0ZERM00000003Yu4AI",
            "CorrelationId": null,
            "ErrorCode": null,
            "ErrorMessage": null,
            "OperationState": null
        },
        "event": { "replayId": n }
    };
}

var server = http.createServer(),
    bayeux = new faye.NodeAdapter({ mount: '/cometd/48.0/' });

bayeux.attach(server);
server.listen(5555, 'localhost', function() {
    var port = (server.address() as net.AddressInfo).port;
    var uri = 'http://localhost:' + port + '/cometd';
    console.log('listening on: ' + uri);


    var client = bayeux.getClient();


    var i = 0;
    setInterval(function() { client.publish("/event/CommerceDiagnosticEvent", makeMsg(i++)) }, 10000);

});
