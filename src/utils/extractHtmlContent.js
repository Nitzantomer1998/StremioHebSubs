const single = (html, regex) => {
    const match = html.match(regex);

    return match ? match : [];
};

const many = (html, regex) => {
    const matches = [...html.matchAll(regex)];

    return matches ? matches.map((match) => match[1]) : [];
};

const extractHtmlContent = {
    single,
    many,
};


export default extractHtmlContent;