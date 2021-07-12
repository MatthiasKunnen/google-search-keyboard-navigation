export interface Config {

    /**
     * Automatically select the first search reult.
     */
    autoselectFirst: boolean;

    /**
     * Next = Down; Previous = Up
     */
    navigateWithArrows: boolean;

    /**
     * Next = J; Previous = K
     */
    navigateWithJK: boolean;

    /**
     * Navigate between results using:
     * Next = Tab; Previous = Shift + TAB
     */
    navigateWithTabs: boolean;
}

export class ConfigHandler {

    getDefaultConfig(): Config {
        return {
            autoselectFirst: false,
            navigateWithArrows: true,
            navigateWithJK: false,
            navigateWithTabs: true,
        };
    }

    async saveConfig(config: Config) {
        return browser.storage.sync.set(config);
    }

    async loadConfig(): Promise<Config> {
        return browser.storage.sync.get(this.getDefaultConfig()) as Promise<Config>;
    }
}

export const configHandler = new ConfigHandler();
