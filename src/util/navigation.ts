interface SearchResult {
    container: HTMLElement;
    focusElement: HTMLElement;
}

export class Navigation {
    private focusIndex = -1;
    private focusedResult?: SearchResult;

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

        this.scrollIntoView(target);

        if (this.focusedResult !== undefined) {
            this.focusedResult.container.classList.remove('activeSearchResultContainer');
            this.focusedResult.focusElement.classList.remove('activeSearchResult');
        }

        target.focusElement.focus({
            preventScroll: true,
        });

        this.focusedResult = target;
        target.container.classList.add('activeSearchResultContainer');
        target.focusElement.classList.add('activeSearchResult');
    }

    private getVisibleResults(): Array<SearchResult> {
        const items = [
            // Main items
            ...Array.from(document.querySelectorAll(`
                #search div.wHYlTd[data-hveid],
                #search div.eKjLze [data-hveid],
                #search div.BYM4Nd > table > tbody > tr > td
            `)).map(element => ({
                container: element,
                focusElement: element.querySelector('a'),
            })),
            ...Array.from(document.querySelectorAll(`
                #search div.wHYlTd:not([data-hveid]) > [data-hveid]
            `)).map(element => ({
                container: element.closest('.g'),
                focusElement: element.querySelector('a'),
            })),
            // Carousel
            ...Array.from(document.querySelectorAll('#search .wHYlTd div[data-ved].mR2gOd'))
                .map(element => ({
                    container: element.closest('.wHYlTd'),
                    focusElement: element.closest('g-section-with-header')?.querySelector('a'),
                })),
            // Carousel
            ...Array.from(document.querySelectorAll('#search .mnr-c g-scrolling-carousel'))
                .map(element => ({
                    container: element.closest('.mnr-c'),
                    focusElement: element.querySelector('a'),
                })),
            // Advertisements
            ...Array.from(document.querySelectorAll('.Krnil')).map(element => ({
                container: element.closest('.cUezCb'),
                focusElement: element.closest('a'),
            })),
            // Suggested searches in footer
            ...Array.from(document.querySelectorAll('.EIaa9b .qR29te a')).map(element => ({
                container: element,
                focusElement: element,
            })),
            // Next page
            ...Array.from(document.querySelectorAll(`
                #botstuff [role=navigation] a
            `)).map(element => ({
                container: element,
                focusElement: element,
            })),
        ];

        return items
            .filter((target): target is SearchResult => {
                return target.container !== null
                    && target.focusElement != null
                    && this.isElementVisible(target.focusElement);
            })
            .sort((a, b) => this.documentOrderComparator(a.focusElement, b.focusElement));
    }

    private isElementVisible(element: Element | null): element is HTMLElement {
        if (!(element instanceof HTMLElement)) {
            return false;
        }

        const hasOffset = element.offsetWidth > 0 || element.offsetHeight > 0;
        const visibility = window.getComputedStyle(element, null).getPropertyValue('visibility');
        return hasOffset && visibility !== 'hidden';
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

    /**
     * Scroll the entire result container into view if it's not already.
     */
    private scrollIntoView(result: SearchResult) {
        const rect = result.container.getBoundingClientRect();
        const offsetY = rect.bottom - window.innerHeight;

        if (offsetY > 0 || rect.top < 0) {
            result.focusElement.scrollIntoView({behavior: 'smooth'});
        }
    }
}

export const navigation = new Navigation();
