const convertVTT = (subtitleContent) => {
    const srtLines = [];
    let eventCount = 0;

    const dialoguePattern = /(\d+:\d+:\d+\.\d+)\s*-->\s*(\d+:\d+:\d+\.\d+)\s*(.*)/g;
    const dialogueLines = subtitleContent.match(dialoguePattern);

    dialogueLines.forEach((line) => {
        const match = dialoguePattern.exec(line);
        if (match === null) return;

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

    const dialoguePattern = /Dialogue:\s*\d+,(\d+:\d+:\d+\.\d+),(\d+:\d+:\d+\.\d+),.*,,(.*)/g;
    const dialogueLines = subtitleContent.match(dialoguePattern);

    dialogueLines.forEach((line) => {
        const match = dialoguePattern.exec(line);
        if (match === null) return;

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