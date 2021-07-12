import {navigation} from '../util/navigation';

(async () => {
    // Enforce that the script is only run on search result pages (Google Search or Google Scholar)
    const isResultsPage = document.querySelector(
        'html[itemtype="http://schema.org/SearchResultsPage"], .gs_r',
    );
    if (isResultsPage === null) {
        return;
    }

    // Globals
    const KEYS = {UP: 38, DOWN: 40, TAB: 9, J: 74, K: 75, SLASH: 191, ESC: 27};

    // Load options
    const options = await navigation.loadOptions();

    const searchbox = document.querySelector(
        'form[role="search"] input[type="text"]:nth-of-type(1)',
    );

    if (!(searchbox instanceof HTMLInputElement)) {
        console.error('Search input not found!');
        return;
    }

    window.addEventListener('keydown', (e) => {
        const isInputOrModifierActive = navigation.isInputActive() || navigation.hasModifierKey(e);
        const shouldNavigateNext =
            (options.navigateWithArrows && e.keyCode === KEYS.DOWN && !isInputOrModifierActive)
                || (options.navigateWithTabs && e.keyCode === KEYS.TAB && !e.shiftKey)
                || (options.navigateWithJK && e.keyCode === KEYS.J && !isInputOrModifierActive);

        const shouldNavigateBack =
            (options.navigateWithArrows && e.keyCode === KEYS.UP && !isInputOrModifierActive)
                || (options.navigateWithTabs && e.keyCode === KEYS.TAB && e.shiftKey)
                || (options.navigateWithJK && e.keyCode === KEYS.K && !isInputOrModifierActive);

        const shouldActivateSearchAndHighlightText = !isInputOrModifierActive
            && options.selectTextInSearchbox
            && e.keyCode === KEYS.ESC;

        if (shouldNavigateNext || shouldNavigateBack) {
            e.preventDefault();
            e.stopPropagation();
            navigation.focusResult(shouldNavigateNext ? 1 : -1);
        } else if (shouldActivateSearchAndHighlightText) {
            window.scrollTo(0, 0);
            searchbox.select();
            searchbox.focus();
        }
    });

    // Auto select the first search result
    if (options.autoselectFirst) {
        navigation.focusResult(1);
    }
})().catch(console.error);
