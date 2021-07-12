import {asyncWrapper} from '../util/async';
import {Config, configHandler} from '../util/config';

function displaySaveSuccess() {
    const successNotification = document.getElementById('save-success')!;
    successNotification.classList.remove('fade-out');
    successNotification.classList.add('fade-in');

    setTimeout(() => {
        successNotification.classList.remove('fade-in');
        successNotification.classList.add('fade-out');
    }, 4000);
}

const checkboxes = [
    'autoSelectFirst',
    'navigateWithArrows',
    'navigateWithJK',
    'navigateWithTabs',
] as const;

type Inputs = typeof checkboxes[number];

let inputs: Map<Inputs, HTMLInputElement> | undefined;

function loadInputs() {
    if (inputs === undefined) {
        inputs = new Map<Inputs, HTMLInputElement>();
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

(async () => {
    const config = await configHandler.loadConfig();
    loadForm(config);

    document.getElementById('save')!.addEventListener('click', asyncWrapper(persistForm));
})().catch(console.error);
