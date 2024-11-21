export function cloneCopy(to: any, from: any, firstCleanTo: any, shallow: any): any;

/**
 * 
 * @param pathSearch - The search query containing wildcards: account.**.name any that starts with account and ends with name.
 * @param flagString - The flag strings to add to regex: i (case insensitive), g (global), m (multiline), s (dot matches all), u (unicode), y (sticky).
 * @param separator - The separator characted used in pathSearch to separate different words. account.name -> .
 * @param matchFromStart - If true, the regex will match from the start of the string.
 * @param matchToEnd - If true, the regex will match to the end of the string.
 * @returns The regex equivalent to pathSearch.
 */
export function wildcardToRegExp(pathSearch: string, flagsString: string, separator?: string, matchFromStart?: boolean, matchToEnd?: boolean): RegExp;
export function promiseAll(obj: any): any;
//# sourceMappingURL=lodashExt.d.ts.map