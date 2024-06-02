const redirectToRegularInstall = () => window.open(`stremio://${window.location.host}/manifest.json`, "_blank");
const redirectToConfigInstall = () => window.open("https://ec2-18-196-63-110.eu-central-1.compute.amazonaws.com/configure", "_blank");

const redirectToDailyMetrics = () => window.open("https://nitzantomer1998.grafana.net/public-dashboards/96c725c12b5e49e7be756bd6b04a4b0e", "_blank");
const redirectToMonthlyMetrics = () => window.open("https://nitzantomer1998.grafana.net/public-dashboards/181287d250ad46c4a3b879a67f7773c9", "_blank");
const redirectToYearlyMetrics = () => window.open("https://nitzantomer1998.grafana.net/public-dashboards/6dc2d618addb4d478372042633f91656", "_blank");


window.redirectToRegularInstall = redirectToRegularInstall;
window.redirectToConfigInstall = redirectToConfigInstall;

window.redirectToDailyMetrics = redirectToDailyMetrics;
window.redirectToMonthlyMetrics = redirectToMonthlyMetrics;
window.redirectToYearlyMetrics = redirectToYearlyMetrics;