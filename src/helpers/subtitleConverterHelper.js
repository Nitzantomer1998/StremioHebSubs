const convertAssToSrt = (content) => {
    const srtLines = [];
    let eventCount = 0;

    const lines = content.split("\n");
    const dialoguePattern = /^Dialogue: \d+,(\d+:\d+:\d+\.\d+),(\d+:\d+:\d+\.\d+),.*,,\d+,\d+,\d+,,(.*)/;

    lines.forEach(line => {
        const match = dialoguePattern.exec(line);

        if (match) {
            eventCount++;

            const startTime = match[1].replace(".", ",");
            const endTime = match[2].replace(".", ",");
            const dialogueText = match[3].replace(/\\N/g, "\n");

            srtLines.push(`${eventCount}\n${startTime} --> ${endTime}\n${dialogueText}\n`);
        }
    });

    return srtLines.join("\n").trim();
};

const subtitleConverterHelper = {
    convertAssToSrt,
};


export default subtitleConverterHelper;