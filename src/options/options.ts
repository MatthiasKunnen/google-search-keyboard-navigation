import {asyncWrapper} from '../util/async';
import {Config, configHandler} from '../util/config';

function displaySaveSuccess() {
    const successNotification = document.getElementById('save-success');
    successNotification!.style.marginTop = '0px';
    setTimeout(() => {
        successNotification!.style.marginTop = '-100px';
    }, 5000);
}

const checkboxes = [
    'autoselectFirst',
    'navigateWithArrows',
    'navigateWithJK',
    'navigateWithTabs',
] as const;

let inputs: Map<string, HTMLInputElement> | undefined;

function loadInputs() {
    if (inputs === undefined) {
        inputs = new Map<string, HTMLInputElement>();
        checkboxes.forEach(checkbox => {
            inputs!.set(checkbox, document.getElementById(checkbox) as HTMLInputElement);
        });
    }

    return inputs;
}

function loadForm(config: Config) {
    loadInputs().forEach((input, key) => {
        input.checked = config[key];
    });
}

async function persistForm() {
    const config: Partial<Config> = {};

    loadInputs().forEach((input, key) => {
        config[key] = input.checked;
    });

    await configHandler.saveConfig(config as Config);
    displaySaveSuccess();
}

async function restoreDefaults() {
    loadForm(configHandler.getDefaultConfig());
}

(async () => {
    const config = await configHandler.loadConfig();
    loadForm(config);

    document.getElementById('save')!.addEventListener('click', asyncWrapper(persistForm));
    document.getElementById('restore')!.addEventListener('click', asyncWrapper(restoreDefaults));
})().catch(console.error);
