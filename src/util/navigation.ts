export interface Options {

    /**
     * Activate search box. Boolean (activate when any printable key is pressed) or keyCode
     */
    activateSearch: boolean;

    /**
     * Automatically select the first search reult.
     */
    autoselectFirst: boolean;

    /**
     * Next = Down; Previous = Up
     */
    navigateWithArrows: boolean;

    /**
     * Next = J; Previous = K [WARNING: Conflicts with activateSearch. This takes precedence.]
     */
    navigateWithJK: boolean;

    /**
     * Navigate between results using:
     * Next = Tab; Previous = Shift + TAB
     */
    navigateWithTabs: boolean;

    /**
     * Esc = select all text in searchbox
     */
    selectTextInSearchbox: boolean;

    /**
     * Style selected search result.
     */
    styleSelectedSimple: boolean;

    styleSelectedFancy: boolean;
}


export class Navigation {
    focusIndex = -1;

    inputElementIds = ['cwtltblr'];
    inputElementTypes = ['text', 'number', 'textarea', 'T'];

    visibleResultsQuerySelector = 'h3 a, #search a[data-ved][ping]';
    resultContainerQuerySelector = 'div.gs_r, div.g, li, td';
    navigationContainerQuerySelector = 'div[role="navigation"] table';
    navigationLinksAndSuggestedSearchesQuerySelector = 'div[role="navigation"] table a, #botstuff a';

    async saveOptions(options: Options) {
        return browser.storage.sync.set(options);
    }

    async loadOptions(): Promise<Options> {
        return browser.storage.sync.get(this.getDefaultOptions()) as Promise<Options>;
    }

    getDefaultOptions(): Options {
        return {
            activateSearch: true,
            autoselectFirst: false,
            navigateWithArrows: true,
            navigateWithJK: false,
            navigateWithTabs: true,
            selectTextInSearchbox: false,
            styleSelectedFancy: false,
            styleSelectedSimple: true,
        };
    }

    isElementVisible(element) {
        return element && (element.offsetWidth > 0 || element.offsetHeight > 0) && window.getComputedStyle(element, null).getPropertyValue('visibility') != 'hidden';
    }

    getVisibleResults() {
        var containers = [];
        return [
            // Main items
            ...Array.from(document.querySelectorAll(this.visibleResultsQuerySelector)).map(element => ({
                container: this.findContainer(element, containers),
                focusElement: element,
            })),
            // Suggested searches in footer and footer links
            ...Array.from(document.querySelectorAll(this.navigationLinksAndSuggestedSearchesQuerySelector)).map(element => ({
                container: element,
                focusElement: element,
            })),
        ].filter(target => target.container !== null && this.isElementVisible(target.focusElement));
    }

    hasModifierKey(e) {
        return e.shiftKey || e.altKey || e.ctrlKey || e.metaKey;
    }

    /**
     * Determine if an input element is focused
     */
    isInputActive() {
        var activeElement = document.activeElement;
        return activeElement != null && (activeElement.nodeName == 'INPUT' || this.inputElementTypes.includes(activeElement.type) || this.inputElementIds.includes(activeElement.id));
    }

    // -- Highlight the active result
    // Results without valid containers will be removed.
    findContainer(link, containers) {
        var container = link.closest(this.resultContainerQuerySelector);

        // Only return valid, unused containers
        if (container != null && containers.indexOf(container) < 0) {
            containers.push(container);
            return container;
        }

        return null;
    }

    // Add custom styling for the selected result (does not apply to footer navigation links)
    addResultHighlight(target) {
        // Don't proceed if the result is already highlighted or if we're dealing with footer navigation links
        if (target.container.classList.contains('activeSearchResultContainer') || target.focusElement.closest(this.navigationContainerQuerySelector) != null) {
            return;
        }

        target.container.classList.add('activeSearchResultContainer');
        target.focusElement.classList.add('activeSearchResult');

        const removeResultHighlight = () => {
            target.container.classList.remove('activeSearchResultContainer');
            target.focusElement.classList.remove('activeSearchResult');
            target.focusElement.removeEventListener('blur', removeResultHighlight);
        };

        target.focusElement.addEventListener('blur', removeResultHighlight);
    }

    focusResult(offset) {
        var results = this.getVisibleResults();

        if (results.length <= 0) {
            console.warn('No results found. Extension may need to be updated.');
            return;
        }

        // Shift focusIndex and perform boundary checks
        this.focusIndex += offset;
        this.focusIndex = Math.min(this.focusIndex, results.length - 1);
        this.focusIndex = Math.max(this.focusIndex, 0);

        var target = results[this.focusIndex];

        // Scroll the entire result container into view if it's not already.
        var rect = target.container.getBoundingClientRect();
        var offsetY = rect.bottom - window.innerHeight;
        if (offsetY > 0) {
            window.scrollBy(0, offsetY);
        }

        target.focusElement.focus();
        this.addResultHighlight(target);
    }
}

export const navigation = new Navigation();
