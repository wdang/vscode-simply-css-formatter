import * as vs from 'vscode';
import cleancss = require('clean-css');


const kDefaultCleanOptions = {

    // Optimization levels
    level: {
        1: {
            // controls removing empty rules and nested blocks; defaults to `true`,
            removeEmpty: true,
            specialComments: 'all',
        }
    },

    // New line insertion and spacing options
    format: {

        breaks: {
            // line break after an at-rule? e.g. `@charset`; defaults to `false`
            //afterAtRule: false,

            // line break after a block begins? e.g. `@media`; defaults to `false`
            //afterBlockBegins: false,

            // line break after a block ends? defaults to `false`
            //afterBlockEnds: false,

            // line break after a comment? defaults to `false`
            afterComment: true,

            // line break after a property? defaults to `false`
            //afterProperty: false,

             // line break after a rule begins? defaults to `false`
            //afterRuleBegins: false,

            // line break after a rule ends? defaults to `false`
            afterRuleEnds: true,
            // line break comes before a block ends? defaults to `false`
            //beforeBlockEnds: false,

            // line break comes between selectors? defaults to `false`
            betweenSelectors: false
        },

        //controls the new line character,
        //can be `'\r\n'` or `'\n'`
        //(aliased as `'windows'` and `'unix'` or `'crlf'` and `'lf'`);
        //defaults to system one, so former on Windows and latter on Unix
        //breakWith: '\n',

        // controls number of characters to indent with; defaults to `0`
        indentBy: 2,
        // controls a character to indent with, can be `'space'` or `'tab'`; defaults to `'space'`
        //indentWith: 'space',

        // controls where to insert spaces
        //spaces: {
            // controls if spaces come around selector relations; e.g. `div > a`; defaults to `false`
            //aroundSelectorRelation: false,

            // controls if a space comes before a block begins; e.g. `.block {`; defaults to `false`
            //beforeBlockBegins: false,

            // controls if a space comes before a value; e.g. `width: 1rem`; defaults to `false`
            //beforeValue: false
        //},

        // controls maximum line length; defaults to `false`
        wrapAt: 120,

        // controls removing trailing semicolons in rule; defaults to `false` - means remove
        //semicolonAfterLastProperty: false
    }
};

const kDefaultOptions = {
    level: {
        1: {
            // controls removing empty rules and nested blocks; defaults to `true`,
            removeEmpty: true,
            specialComments: 'all',
        }
    },

    format: {
        // controls maximum line length; defaults to `false`
        wrapAt: false,
        // controls removing trailing semicolons in rule; defaults to `false` - means remove
        semicolonAfterLastProperty: false,
        // new line character, can be `'\r\n'` or `'\n'`
        // (aliased as `'windows'` and `'unix'` or `'crlf'` and `'lf'`);
        // defaults to system one, so former on Windows and latter on Unix
        breakWith: '\n',
        // number of characters to indent with; defaults to `0`
        indentBy: 1,
        // character to indent with, can be `'space'` or `'tab'`; defaults to `'space'`
        indentWith: 'space',
        // Line break inserting options
        breaks: {
            // inserts a line break after an at-rule; e.g. `@charset`; defaults to `false`
            afterAtRule: false,
            // inserts a line break after a block begins; e.g. `@media`; defaults to `false`
            afterBlockBegins: false,
            // inserts a line break after a block ends, defaults to `false`
            afterBlockEnds: false,
            // inserts a line break after a comment; defaults to `false`
            afterComment: true,
            // inserts a line break after a property; defaults to `false`
            afterProperty: false,
            // inserts a line break after a rule begins; defaults to `false`
            afterRuleBegins: false,
            // inserts a line break after a rule ends; defaults to `false`
            afterRuleEnds: true,
            // inserts a line break before a block ends; defaults to `false`
            beforeBlockEnds: false,
            // inserts a line break between selectors; defaults to `false`
            betweenSelectors: false
        },
        // white space inserting options
        spaces: {
            // spaces come around selector relations; e.g. `div > a`; defaults to `false`
            aroundSelectorRelation: false,
            // inserts a space comes before a block begins; e.g. `.block {`; defaults to `false`
            beforeBlockBegins: false,
            // inserts a space comes before a value; e.g. `width: 1rem`; defaults to `false`
            beforeValue: false
        },

    }
};

// Range of the entire document
function entireDocumentRange(document: vs.TextDocument): vs.Range {
    const start = new vs.Position(0, 0);
    const end = new vs.Position(document.lineCount - 1, document.lineAt(document.lineCount - 1).text.length);
    return new vs.Range(start, end);
}

// returns a clean css formatted TextEdit
export function formatCSS(document: vs.TextDocument, range: vs.Range, options: vs.FormattingOptions) {
    const result: vs.TextEdit[] = [];
    const formatted = new cleancss(kDefaultCleanOptions).minify(document.getText(range));
    if (formatted) {
        result.push(new vs.TextEdit(range, formatted.styles));
    }
    return result;
}

// Called when your extension is activated
// (extension is activated the very first time the command is executed)
export function activate(context: vs.ExtensionContext) {
    context.subscriptions.push(vs.languages.registerDocumentFormattingEditProvider('css', {
        provideDocumentFormattingEdits: (document, options, token) => {
            return formatCSS(document, entireDocumentRange(document), options);
        }
    }));
    context.subscriptions.push(vs.languages.registerDocumentRangeFormattingEditProvider('css', {
        provideDocumentRangeFormattingEdits: (document, range, options, token) => {
            return formatCSS(document, entireDocumentRange(document), options);
        }
    }));
}

// called when your extension is deactivated
export function deactivate() { }
