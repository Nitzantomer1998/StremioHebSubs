document.addEventListener("DOMContentLoaded", () => {
    const currentUrl = new URL(window.location.href);
    const pathSegments = currentUrl.pathname.split("/");
    const encodedUserConfig = pathSegments.length > 2 ? pathSegments[pathSegments.length - 2] : null;

    if (encodedUserConfig) {
        const userConfig = JSON.parse(atob(encodedUserConfig));
        userConfig.forEach(provider => document.querySelector(`input[name="provider"][value="${provider}"]`).checked = true);
    }
    else {
        document.querySelector("input[name='provider'][value='Wizdom']").checked = true;
    }

    const checkboxes = document.querySelectorAll("input[name='provider']");
    checkboxes.forEach(checkbox => { checkbox.addEventListener("change", updateButtonsState); });

    updateButtonsState();
});

const updateButtonsState = () => {
    const selectedProviders = document.querySelectorAll("input[name='provider']:checked");
    const saveButton = document.getElementById("saveButton");
    const copyButton = document.getElementById("copyButton");

    saveButton.disabled = selectedProviders.length === 0;
    copyButton.disabled = selectedProviders.length === 0;
};

const saveConfig = () => {
    const selectedProviders = Array.from(document.querySelectorAll("input[name='provider']:checked")).map(checkbox => checkbox.value);
    const encodedProviders = btoa(JSON.stringify(selectedProviders));
    const stremioLink = `${window.location.host}/${encodedProviders}/manifest.json`;

    window.open(`stremio://${stremioLink}`, "_blank");
};

const copyConfig = async () => {
    const selectedProviders = Array.from(document.querySelectorAll("input[name='provider']:checked")).map(checkbox => checkbox.value);
    const encodedProviders = btoa(JSON.stringify(selectedProviders));
    const stremioLink = `${window.location.host}/${encodedProviders}/manifest.json`;

    const link = `${window.location.protocol}//${stremioLink}`;
    await navigator?.clipboard?.writeText(link);

    window.alert("Add-on link copied to clipboard!");
};


window.saveConfig = saveConfig;
window.copyConfig = copyConfig;