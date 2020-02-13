/*
 * Copyright (c) 2020, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: BSD-3-Clause
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */

export default class testConnection {
    oauth = {
        instance_url: 'http://localhost:5555',
        access_token: ''
    }

    authenticate() {
        return true;
    }
}
