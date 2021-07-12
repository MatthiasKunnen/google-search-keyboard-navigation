/**
 * Executes the given function and logs an error if the returned promise errors.
 * @param fn A function returning a promise.
 */
export function asyncWrapper(fn: () => Promise<any>): () => void {
    return () => {
        fn().catch(console.error);
    };
}
