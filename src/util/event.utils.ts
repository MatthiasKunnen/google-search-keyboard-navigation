export function eventTargetsInput(event: KeyboardEvent): boolean {
    const target = event.target;

    return target instanceof HTMLElement
        ? ['input', 'textarea'].includes(target.nodeName.toLowerCase())
        : false;
}

export function eventHasModifierKey(e: KeyboardEvent): boolean {
    return e.shiftKey || e.altKey || e.ctrlKey || e.metaKey;
}
