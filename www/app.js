/*
 * Copyright (c) 2020, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: BSD-3-Clause
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */

var content = document.getElementById("content");

function htmlToElement(html) {
    var template = document.createElement('template');
    html = html.trim();
    template.innerHTML = html;
    return template.content.firstChild;
}

function renderEvent(evt) {
    var payload=evt.eventPayload.payload;
    var id="msg"+evt.eventPayload.event.replayId;
  return `
        <div class="card">
            <a data-toggle="collapse" href="#${id}" aria-expanded="false">
              <div class="card-header d-flex justify-content-between">
                  <div>${payload.Operation} (${payload.OperationStatus})</div>
                  <div>${payload.CreatedDate}</div>
              </div>
            </a>
            <div class="card-body collapse" id="${id}">
                  <pre>${JSON.stringify(evt.eventPayload,null, 2)}</pre>
            </div>
        </div>`;
}

var socket = io.connect();

socket.on("eventReceived", function(newEvent) {
    content.insertBefore(htmlToElement(renderEvent(newEvent)), content.firstChild);
});
