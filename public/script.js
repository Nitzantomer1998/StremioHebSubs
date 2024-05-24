document.addEventListener("DOMContentLoaded", () => {
    const currentUrl = new URL(window.location.href);
    const pathSegments = currentUrl.pathname.split("/");
    const encodedUserConfig = pathSegments.length > 2 ? pathSegments[pathSegments.length - 2] : null;

    if (encodedUserConfig) {
        const userConfig = JSON.parse(atob(encodedUserConfig));
        userConfig.forEach(provider => {
            const checkbox = document.querySelector(`input[name="provider"][value="${provider}"]`);
            if (checkbox) checkbox.checked = true;
        });
    }

    const checkboxes = document.querySelectorAll('input[name="provider"]');
    checkboxes.forEach(checkbox => {
        checkbox.addEventListener('change', updateSaveButtonState);
    });

    updateSaveButtonState();
});

const updateSaveButtonState = () => {
    const selectedProviders = document.querySelectorAll('input[name="provider"]:checked');
    const saveButton = document.getElementById('saveButton');
    saveButton.disabled = selectedProviders.length === 0;
};

const saveConfig = () => {
    const selectedProviders = Array.from(document.querySelectorAll('input[name="provider"]:checked')).map(checkbox => checkbox.value);
    const encodedProviders = btoa(JSON.stringify(selectedProviders));
    const stremioLink = `${window.location.host}/${encodedProviders}/manifest.json`;

    window.open(`stremio://${stremioLink}`, "_blank");
}

const redirectToIssuePage = () => { window.open("https://github.com/Nitzantomer1998/UniversalHebrewSubtitles/issues", "_blank"); }
