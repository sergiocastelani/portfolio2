// Hash tools: runs commands from links such as #exec-<name>-<encodeURIComponent(JSON.stringify(array))>.
// Every tool lives in this file. Bad links change nothing on the page and only log a [hash-tools] warning.
(() => {
  const LOG_PREFIX = '[hash-tools]';
  const EXEC_PREFIX = '#exec-';                 // compared case-insensitively
  const PARAMS_SEPARATOR = '-';                 // the first one after the name splits name from params
  const COMMAND_NAME_PATTERN = /^[a-z0-9]+$/i;  // ASCII letters and digits only

  function warn(...args) {
    console.warn(LOG_PREFIX, ...args);
  }

  // Lowercase command name -> function (params: string[]): void. No prototype, so names like
  // "constructor" or "tostring" are never found by accident.
  const commands = Object.create(null);

  // Commands
  // Register each command here as: commands.<name> = function (params) { ... };
  // Also describe each command for AI agents in <div id="agent-instructions"> at the top of index.html.

  // highlight: marks the tech chips matching any term and scrolls to the first one.
  // Link: #exec-highlight-<encodeURIComponent(JSON.stringify(["C++", "Qt"]))>
  const CHIP_SELECTOR = '.skill-chip';
  const CHIP_HIGHLIGHT_CLASS = 'skill-chip-highlight';  // look and navbar offset live in index.css /* Hash tools */
  const MIN_PARTIAL_TERM_LENGTH = 3;                     // shorter terms ("Qt", "C#") must equal the whole label

  /** term and label are already trimmed and lowercased. */
  function chipLabelMatches(label, term) {
    return term.length >= MIN_PARTIAL_TERM_LENGTH ? label.includes(term) : label === term;
  }

  commands.highlight = function (params) {
    const terms = params.map((param) => param.trim().toLowerCase());
    const termMatched = terms.map(() => false);
    let firstMatch = null;

    document.querySelectorAll(CHIP_SELECTOR).forEach((chip) => {
      const label = chip.textContent.trim().toLowerCase();
      let isMatch = false;
      // No early break: a term that only matches chips an earlier term matched must still count as matched.
      terms.forEach((term, i) => {
        if (chipLabelMatches(label, term)) {
          termMatched[i] = true;
          isMatch = true;
        }
      });
      chip.classList.toggle(CHIP_HIGHLIGHT_CLASS, isMatch);  // also clears highlights from a previous call
      if (isMatch && firstMatch === null) firstMatch = chip;
    });

    if (params.length === 0) {
      warn('highlight: no terms given, highlight cleared');
      return;
    }

    termMatched.forEach((matched, i) => {
      if (!matched) warn(`highlight: no chip matches "${params[i]}"`);
    });

    // No behavior option: the reduced-motion html rule in index.css decides smooth or instant.
    // Wait for webfonts: a late icon-font load shrinks the sections above the chip, and a smooth
    // scroll already under way keeps its old target, leaving the chip under the navbar.
    if (firstMatch !== null) document.fonts.ready.then(() => firstMatch.scrollIntoView({ block: 'start' }));
  };

  // Router

  /** @returns {{ name: string, rawParams: string | null } | null} null when the hash is not an exec hash. */
  function splitExecHash(hash) {
    if (hash.slice(0, EXEC_PREFIX.length).toLowerCase() !== EXEC_PREFIX) return null;

    const rest = hash.slice(EXEC_PREFIX.length);
    const separatorIndex = rest.indexOf(PARAMS_SEPARATOR);
    if (separatorIndex === -1) return { name: rest, rawParams: null };

    // Only the first separator splits: the params keep any further '-'.
    return { name: rest.slice(0, separatorIndex), rawParams: rest.slice(separatorIndex + 1) };
  }

  /** @returns {string[]} @throws {URIError | SyntaxError | TypeError} */
  function parseParams(rawParams) {
    if (rawParams === null) return [];

    const value = JSON.parse(decodeURIComponent(rawParams));
    if (!Array.isArray(value)) throw new TypeError('params must be a JSON array');

    return value.map((element) => String(element));
  }

  // Never throws: each failure logs one warning and stops.
  function runHash(hash) {
    const parts = splitExecHash(hash);
    if (parts === null) return; // not an exec hash: leave anchors alone

    if (!COMMAND_NAME_PATTERN.test(parts.name)) {
      warn(`invalid command name "${parts.name}" in`, hash);
      return;
    }
    const name = parts.name.toLowerCase();

    let params;
    try {
      params = parseParams(parts.rawParams);
    } catch (error) {
      warn(`cannot parse params for "${name}":`, error.message);
      return;
    }

    const command = commands[name];
    if (typeof command !== 'function') {
      warn(`unknown command "${name}"`);
      return;
    }

    try {
      command(params);
    } catch (error) {
      warn(`command "${name}" failed:`, error);
    }
  }

  runHash(window.location.hash);
  window.addEventListener('hashchange', () => runHash(window.location.hash));
})();
