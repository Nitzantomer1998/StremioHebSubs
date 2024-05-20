document.addEventListener("DOMContentLoaded", () => {
    const currentUrl = new URL(window.location.href);
    const pathSegments = currentUrl.pathname.split("/");
    const encodedUserConfig = pathSegments.length > 2 ? pathSegments[pathSegments.length - 2] : null;

    if (encodedUserConfig) {
        const userConfig = JSON.parse(atob(encodedUserConfig));
        userConfig.forEach(source => {
            const checkbox = document.querySelector(`input[name="source"][value="${source}"]`);
            if (checkbox) checkbox.checked = true;
        });
    }
});

const saveConfig = () => {
    const selectedSources = Array.from(document.querySelectorAll('input[name="source"]:checked')).map(checkbox => checkbox.value);
    const encodedSources = btoa(JSON.stringify(selectedSources));
    const stremioLink = `${window.location.host}/${encodedSources}/manifest.json`;

    window.open(`stremio://${stremioLink}`, "_blank");
}

const toggleFeedback = () => {
    const feedbackElement = document.getElementById('feedback');
    if (feedbackElement.style.display === 'none' || feedbackElement.style.display === '') {
        feedbackElement.style.display = 'block';
    } else {
        feedbackElement.style.display = 'none';
    }
}