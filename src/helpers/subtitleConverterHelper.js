const convertAssToSrt = (content) => {
    let srtContent = "";
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

            srtContent += `${eventCount}\n${startTime} --> ${endTime}\n${dialogueText}\n\n`;
        }
    });

    return srtContent.trim();
};

const subtitleConverterHelper = {
    convertAssToSrt,
};


export default subtitleConverterHelper;