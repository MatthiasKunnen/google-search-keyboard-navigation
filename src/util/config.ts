export interface Config {

    /**
     * Automatically select the first search reult.
     */
    autoSelectFirst: boolean;

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
            autoSelectFirst: true,
            navigateWithArrows: true,
            navigateWithJK: false,
            navigateWithTabs: false,
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
