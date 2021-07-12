export interface Options {

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

interface SearchResult {
    container: HTMLElement;
    focusElement: HTMLElement;
}

export class Navigation {
    focusIndex = -1;

    inputElementIds = ['cwtltblr'];
    inputElementTypes = ['text', 'number', 'textarea', 'T'];

    async saveOptions(options: Options) {
        return browser.storage.sync.set(options);
    }

    async loadOptions(): Promise<Options> {
        return browser.storage.sync.get(this.getDefaultOptions()) as Promise<Options>;
    }

    getDefaultOptions(): Options {
        return {
            autoselectFirst: false,
            navigateWithArrows: true,
            navigateWithJK: false,
            navigateWithTabs: true,
        };
    }

    isElementVisible(element: Element | null): element is HTMLElement {
        if (!(element instanceof HTMLElement)) {
            return false;
        }

        const hasOffset = element.offsetWidth > 0 || element.offsetHeight > 0;
        const visibility = window.getComputedStyle(element, null).getPropertyValue('visibility');
        return hasOffset && visibility !== 'hidden';
    }

    getVisibleResults(): Array<SearchResult> {
        const mainItems = document.querySelectorAll(
            '#search .g:not(.mnr-c) div[data-ved] > * > * > a[data-ved]:first-of-type',
        );

        const items = [
            // Main items
            ...Array.from(mainItems).map(element => ({
                container: element.closest('.g'),
                focusElement: element.closest('a'),
            })),
            // Advertisements
            ...Array.from(document.querySelectorAll('.Krnil')).map(element => ({
                container: element.closest('.cUezCb'),
                focusElement: element.closest('a'),
            })),
            // Suggested searches in footer
            ...Array.from(document.querySelectorAll('#botstuff a')).map(element => ({
                container: element,
                focusElement: element,
            })),
        ];

        return items
            .filter((target): target is SearchResult => {
                return target.container !== null && this.isElementVisible(target.focusElement);
            })
            .sort((a, b) => this.documentOrderComparator(a.focusElement, b.focusElement));
    }

    hasModifierKey(e: KeyboardEvent): boolean {
        return e.shiftKey || e.altKey || e.ctrlKey || e.metaKey;
    }

    /**
     * Determine if an input element is focused
     */
    isInputActive() {
        const activeElement = document.activeElement;

        if (!(activeElement instanceof HTMLInputElement)) {
            return false;
        }

        return activeElement.nodeName === 'INPUT'
            || this.inputElementTypes.includes(activeElement.type)
            || this.inputElementIds.includes(activeElement.id);
    }

    focusResult(offset: number) {
        const results = this.getVisibleResults();

        if (results.length <= 0) {
            console.warn('No results found. Extension may need to be updated.');
            return;
        }

        // Shift focusIndex and perform boundary checks
        this.focusIndex += offset;
        this.focusIndex = Math.min(this.focusIndex, results.length - 1);
        this.focusIndex = Math.max(this.focusIndex, 0);

        const target = results[this.focusIndex];

        // Scroll the entire result container into view if it's not already.
        const rect = target.container.getBoundingClientRect();
        const offsetY = rect.bottom - window.innerHeight;
        if (offsetY > 0) {
            window.scrollBy(0, offsetY);
        }

        if (target.container.classList.contains('activeSearchResultContainer')) {
            // Already focused, exit
            return;
        }

        target.focusElement.focus();

        target.container.classList.add('activeSearchResultContainer');
        target.focusElement.classList.add('activeSearchResult');

        const blurHandler = () => {
            target.container.classList.remove('activeSearchResultContainer');
            target.focusElement.classList.remove('activeSearchResult');
            target.focusElement.removeEventListener('blur', blurHandler);
        };

        target.focusElement.addEventListener('blur', blurHandler);
    }

    private documentOrderComparator(a: Element, b: Element) {
        const position = a.compareDocumentPosition(b);

        /* eslint-disable no-bitwise */
        if ((position & Node.DOCUMENT_POSITION_FOLLOWING) > 0) {
            return -1;
        } else if ((position & Node.DOCUMENT_POSITION_PRECEDING) > 0) {
            return 1;
        } else {
            return 0;
        }
        /* eslint-enable no-bitwise */
    }
}

export const navigation = new Navigation();
