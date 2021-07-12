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

    const config = await configHandler.loadConfig();

    window.addEventListener('keydown', (e) => {
        if (e.isComposing) {
            return;
        }

        const isInputOrModifierActive = eventTargetsInput(e) || eventHasModifierKey(e);
        const shouldNavigateNext =
            (config.navigateWithArrows && e.key === 'ArrowDown' && !isInputOrModifierActive)
                || (config.navigateWithTabs && e.key === 'Tab' && !e.shiftKey)
                || (config.navigateWithJK && e.key === 'j' && !isInputOrModifierActive);

        const shouldNavigateBack =
            (config.navigateWithArrows && e.key === 'ArrowUp' && !isInputOrModifierActive)
                || (config.navigateWithTabs && e.key === 'Tab' && e.shiftKey)
                || (config.navigateWithJK && e.key === 'k' && !isInputOrModifierActive);

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
