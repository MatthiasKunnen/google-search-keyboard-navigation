import {asyncWrapper} from '../util/async';
import {navigation, Options} from '../util/navigation';

function displaySaveSuccess() {
    document.getElementById('save-success').style.marginTop = '0px';
    setTimeout(() => {
        document.getElementById('save-success').style.marginTop = '-100px';
    }, 5000);
}

const checkboxes = [
    'activateSearch',
    'autoselectFirst',
    'navigateWithArrows',
    'navigateWithJK',
    'navigateWithTabs',
    'selectTextInSearchbox',
] as const;

let inputs: Map<string, HTMLInputElement> | undefined;

function loadInputs() {
    if (inputs === undefined) {
        inputs = new Map<string, HTMLInputElement>();
        checkboxes.forEach(checkbox => {
            inputs.set(checkbox, document.getElementById(checkbox) as HTMLInputElement);
        });
    }

    return inputs;
}

function loadFormOptions(options: Options) {
    loadInputs().forEach((input, key) => {
        input.checked = options[key];
    });
}

async function saveOptions() {
    const options: Partial<Options> = {};

    loadInputs().forEach((input, key) => {
        options[key] = input.checked;
    });

    await persistOptions(options as Options);
}

async function restoreDefaults() {
    await persistOptions(navigation.getDefaultOptions());
}

async function persistOptions(options: Options) {
    await navigation.saveOptions(options);
    displaySaveSuccess();
}

(async () => {
    const options = await navigation.loadOptions();
    loadFormOptions(options);

    document.getElementById('save').addEventListener('click', asyncWrapper(saveOptions));
    document.getElementById('restore').addEventListener('click', asyncWrapper(restoreDefaults));
})().catch(console.error);
