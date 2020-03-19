import * as vs from 'vscode';
import cleancss = require('clean-css');
import CleanCSS = require('clean-css');

const kDefaultFormatOptions = {

    breaks: {
        // Controls if a line break comes after an at-rule, e.g. `@charset`, defaults to `false`
        afterAtRule: false,

        // Controls if a line break comes after a block begins, e.g. `@media`, defaults to `false`
        afterBlockBegins: false,

        // Controls if a line break comes after a block ends, defaults to `false`
        afterBlockEnds: false,

        // Controls if a line break comes after a comment, defaults to `false`
        afterComment: true,

        // Controls if a line break comes after a property, defaults to `false`
        afterProperty: false,

        // Controls if a line break comes after a rule begins, defaults to `false`
        afterRuleBegins: false,

        // Controls if a line break comes after a rule ends, defaults to `false`
        afterRuleEnds: true,

        // Controls if a line break comes before a block ends, defaults to `false`
        beforeBlockEnds: false,

        // Controls if a line break comes between selectors, defaults to `false`
        betweenSelectors: false,

    },

    // Controls where to insert spaces
    spaces: {

        // Controls if spaces come around selector relations, e.g. `div > a`, defaults to `false`
        aroundSelectorRelation: false,

        // Controls if a space comes before a block begins, e.g. `.block {`, defaults to `false`
        beforeBlockBegins: false,

        // Controls if a space comes before a value, e.g. `width: 1rem`, defaults to `false`
        beforeValue: false,
    },

    // Controls the new line character, can be `'\r\n'` or `'\n'`(aliased as `'windows'` and `'unix'`
    breakWith: "",

    // Controls number of characters to indent with, defaults to `0`
    indentBy: 1,
    // Controls maximum line length, defaults to `false`
    wrapAt: 0,

    indentWith: undefined,

    semicolonAfterLastProperty: true,
};

function presetPretty() {
    return {
        breaks: {
            afterAtRule: true,
            afterBlockBegins: true,
            afterBlockEnds: true,
            afterComment: true,
            afterProperty: true,
            afterRuleBegins: true,
            afterRuleEnds: true,
            beforeBlockEnds: false,
            betweenSelectors: true,
        },
        spaces: {
            aroundSelectorRelation: true,
            beforeValue: true
        },
        indentBy: 4,
        semicolonAfterLastProperty: true,
    };
}
function presetSimple() {
    return {
        breaks: {
            afterComment: true,
            afterRuleEnds: true,
        },
        spaces: {
            aroundSelectorRelation: true,
            beforeBlockBegins: false,
            beforeValue: true
        },
        indentBy: 1,
        wrapAt: 0,
        semicolonAfterLastProperty: true,
    };
}


function getUserFormatOptions() {
    const simplyCss = vs.workspace.getConfiguration('simplyCss');
    let options: any = { breaks: {}, spaces: {} };
    console.log(simplyCss.get('configs'));
    switch (simplyCss.get('configs')) {
        case "simple":
            options = presetSimple();
            break;

        case "pretty":
            options = presetPretty();
            break;

        case "custom":// custom options
            options.breaks.afterAtRule = simplyCss.get('format.newLine.afterAtRule');
            options.breaks.afterBlockBegins = simplyCss.get('format.newLine.afterBlockBegins')!;
            options.breaks.afterBlockEnds = simplyCss.get('format.newLine.afterBlockEnds');
            options.breaks.afterComment = simplyCss.get('format.newLine.afterComment');
            options.breaks.afterProperty = simplyCss.get('format.newLine.afterProperty');
            options.breaks.afterRuleBegins = simplyCss.get('format.newLine.afterRuleBegins');
            options.breaks.afterRuleEnds = simplyCss.get('format.newLine.afterRuleEnds');
            options.breaks.beforeBlockEnds = simplyCss.get('format.newLine.beforeBlockEnds');
            options.breaks.betweenSelectors = simplyCss.get('format.newLine.betweenSelectors');
            options.spaces.aroundSelectorRelation = simplyCss.get('format.spaces.aroundSelectorRelation');
            options.spaces.beforeBlockBegins = simplyCss.get('format.spaces.beforeBlockBegins');
            options.spaces.beforeValue = simplyCss.get('format.spaces.beforeValue');
            options.breakWith = simplyCss.get('format.general.breakWith');
            options.indentBy = simplyCss.get('format.general.indentBy');
            options.wrapAt = simplyCss.get('format.general.wrapAt');
            options.indentWith = simplyCss.get('format.general.indentWith');
            options.semicolonAfterLastProperty = simplyCss.get('format.general.semicolonAfterLastProperty');
            break;
    }

    return options;
}

// Get Range of the entire document
function entireDocumentRange(document: vs.TextDocument): vs.Range {
    const start = new vs.Position(0, 0);
    const end = new vs.Position(document.lineCount - 1, document.lineAt(document.lineCount - 1).text.length);
    return new vs.Range(start, end);
}

// returns a clean css formatted TextEdit
export function formatCSS(document: vs.TextDocument, range: vs.Range, options: vs.FormattingOptions) {
    const result: vs.TextEdit[] = [];
    const userOptions = getUserFormatOptions();
    const formatted = new cleancss({ format: userOptions }).minify(document.getText(range));

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
            return formatCSS(document, range, options);
        }
    }));
}

// called when your extension is deactivated
export function deactivate() { }
