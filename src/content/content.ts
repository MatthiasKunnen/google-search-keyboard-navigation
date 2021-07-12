import {configHandler} from '../util/config';
import {eventHasModifierKey, eventTargetsInput} from '../util/event.utils';
import {navigation} from '../util/navigation';

(async () => {
    // Enforce that the script is only run on search result pages (Google Search or Google Scholar)
    const isResultsPage = document.querySelector(
        'html[itemtype="http://schema.org/SearchResultsPage"], .gs_r',
    );
    if (isResultsPage === null) {
        return;
    }

    const KEYS = {UP: 38, DOWN: 40, TAB: 9, J: 74, K: 75, SLASH: 191, ESC: 27};
    const config = await configHandler.loadConfig();

    window.addEventListener('keydown', (e) => {
        const isInputOrModifierActive = eventTargetsInput(e) || eventHasModifierKey(e);
        const shouldNavigateNext =
            (config.navigateWithArrows && e.keyCode === KEYS.DOWN && !isInputOrModifierActive)
                || (config.navigateWithTabs && e.keyCode === KEYS.TAB && !e.shiftKey)
                || (config.navigateWithJK && e.keyCode === KEYS.J && !isInputOrModifierActive);

        const shouldNavigateBack =
            (config.navigateWithArrows && e.keyCode === KEYS.UP && !isInputOrModifierActive)
                || (config.navigateWithTabs && e.keyCode === KEYS.TAB && e.shiftKey)
                || (config.navigateWithJK && e.keyCode === KEYS.K && !isInputOrModifierActive);

        if (shouldNavigateNext || shouldNavigateBack) {
            e.preventDefault();
            e.stopPropagation();
            navigation.focusResult(shouldNavigateNext ? 1 : -1);
        }
    });

    if (config.autoSelectFirst) {
        navigation.focusResult(1);
    }
})().catch(console.error);
