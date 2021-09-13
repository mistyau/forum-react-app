// i stole this from stack overflow
// https://stackoverflow.com/questions/3177836/how-to-format-time-since-xxx-e-g-4-minutes-ago-similar-to-stack-exchange-site
export function getDateAgo(date) {
    var seconds = Math.floor((new Date().getTime() - new Date(date).getTime()) / 1000);

    var interval = seconds / 31536000;

    if (interval >= 1) {
        return Math.floor(interval) + " years";
    }
    interval = seconds / 2592000;
    if (interval >= 1) {
        return Math.floor(interval) + " months";
    }
    interval = seconds / 604800;
    if (interval >= 1) {
        return Math.floor(interval) + " weeks";
    }
    interval = seconds / 86400;
    if (interval >= 1) {
        return Math.floor(interval) + " days";
    }
    interval = seconds / 3600;
    if (interval >= 1) {
        return Math.floor(interval) + " hours";
    }
    interval = seconds / 60;
    if (interval >= 1) {
        return Math.floor(interval) + " minutes";
    }
    return Math.floor(seconds) + " seconds";
}