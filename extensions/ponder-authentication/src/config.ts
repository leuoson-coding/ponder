/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

export interface IPonderConfig {
	// The client ID of the Ponder OAuth app
	clientId: string;
	// The server address for Ponder authentication
	serverAddress: string;
	// Default scopes for Ponder authentication
	scopes: string[];
}

export const PonderConfig: IPonderConfig = {
	clientId: 'ponder-client',
	serverAddress: 'http://localhost:3000',
	scopes: ['read', 'write', 'user:email']
};
