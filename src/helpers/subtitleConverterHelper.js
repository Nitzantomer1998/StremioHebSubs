const convertVTT = (subtitleContent) => {
    const srtLines = [];
    let eventCount = 0;

    const lines = subtitleContent.split("\n");
    const dialoguePattern = /^(\d+:\d+:\d+\.\d+)\s*-->\s*(\d+:\d+:\d+\.\d+)\s*(.*)/;

    lines.forEach((line) => {
        const match = dialoguePattern.exec(line);
        if (match === false) return;

        eventCount++;
        const startTime = match[1].replace(".", ",");
        const endTime = match[2].replace(".", ",");
        const dialogueText = match[3];

        srtLines.push(`${eventCount}\n${startTime} --> ${endTime}\n${dialogueText}\n`);
    });

    return srtLines.join("\n").trim();
};

const convertASS = (subtitleContent) => {
    const srtLines = [];
    let eventCount = 0;

    const lines = subtitleContent.split("\n");
    const dialoguePattern = /^Dialogue:\s*\d+,(\d+:\d+:\d+\.\d+),(\d+:\d+:\d+\.\d+),.*,,(.*)/;

    lines.forEach((line) => {
        const match = dialoguePattern.exec(line);
        if (match === false) return;

        eventCount++;
        const startTime = match[1].replace(".", ",");
        const endTime = match[2].replace(".", ",");
        const dialogueText = match[3].replace(/\\N/g, "\n");

        srtLines.push(`${eventCount}\n${startTime} --> ${endTime}\n${dialogueText}\n`);
    });

    return srtLines.join("\n").trim();
};

const subtitleConverterHelper = {
    convertVTT,
    convertASS,
};


export default subtitleConverterHelper;