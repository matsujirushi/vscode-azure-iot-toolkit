'use strict';
import * as vscode from 'vscode';
import { MessageExplorer } from './messageExplorer';
import { DeviceExplorer } from './deviceExplorer';
import { AppInsightsClient } from './appInsightsClient';

export class AzureIoTExplorer {
    private _messageExplorer: MessageExplorer;
    private _deviceExplorer: DeviceExplorer;

    constructor() {
        let outputChannel = vscode.window.createOutputChannel('Azure IoT Toolkit');
        let appInsightsClient = new AppInsightsClient();
        this._messageExplorer = new MessageExplorer(outputChannel, appInsightsClient);
        this._deviceExplorer = new DeviceExplorer(outputChannel, appInsightsClient);
    }

    public sendD2CMessage(): void {
        this._messageExplorer.sendD2CMessage();
    }

    public startMonitoringMessage(): void {
        this._messageExplorer.startMonitoringMessage();
    }

    public stopMonitoringMessage(): void {
        this._messageExplorer.stopMonitoringMessage();
    }

    public listDevice(): void {
        this._deviceExplorer.listDevice();
    }

    public createDevice(): void {
        this._deviceExplorer.createDevice();
    }

    public deleteDevice(): void {
        this._deviceExplorer.deleteDevice();
    }
}