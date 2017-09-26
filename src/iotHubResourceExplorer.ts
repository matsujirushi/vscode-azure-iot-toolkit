"use strict";
import { SubscriptionClient, SubscriptionModels } from "azure-arm-resource";
import * as vscode from "vscode";
import { AzureAccount, AzureLoginStatus, AzureResourceFilter, AzureSession } from "./azure-account.api";
import { BaseExplorer } from "./baseExplorer";
import { Constants } from "./constants";
import { TelemetryClient } from "./telemetryClient";
import { Utility } from "./utility";

export class IoTHubResourceExplorer extends BaseExplorer {
    private readonly accountApi: AzureAccount;

    constructor(outputChannel: vscode.OutputChannel) {
        super(outputChannel);
        this.accountApi = vscode.extensions.getExtension<AzureAccount>("ms-vscode.azure-account")!.exports;
    }

    public async selectIoTHub() {
        if (!(await this.accountApi.waitForLogin())) {
            return vscode.commands.executeCommand("azure-account.askForLogin");
        }
        const subscriptionItems = this.loadSubscriptionItems(this.accountApi);
        const result = await vscode.window.showQuickPick(subscriptionItems, { placeHolder: "Select a Subscription" });
        vscode.window.showInformationMessage(result.label);
    }

    private async loadSubscriptionItems(api: AzureAccount) {
        const subscriptionItems: ISubscriptionItem[] = [];
        for (const session of api.sessions) {
            const credentials = session.credentials;
            const subscriptionClient = new SubscriptionClient(credentials);
            const subscriptions = await this.listAll(subscriptionClient.subscriptions, subscriptionClient.subscriptions.list());
            subscriptionItems.push(...subscriptions.map((subscription) => ({
                label: subscription.displayName || "",
                description: subscription.subscriptionId || "",
                session,
                subscription,
            })));
        }
        subscriptionItems.sort((a, b) => a.label.localeCompare(b.label));
        return subscriptionItems;
    }

    private async listAll<T>(client: { listNext(nextPageLink: string): Promise<IPartialList<T>>; }, first: Promise<IPartialList<T>>): Promise<T[]> {
        const all: T[] = [];
        for (let list = await first; list.length || list.nextLink; list = list.nextLink ? await client.listNext(list.nextLink) : []) {
            all.push(...list);
        }
        return all;
    }
}

interface ISubscriptionItem {
    label: string;
    description: string;
    session: AzureSession;
    subscription: SubscriptionModels.Subscription;
}

interface IPartialList<T> extends Array<T> {
    nextLink?: string;
}