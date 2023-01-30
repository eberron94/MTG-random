import { useEffect, useState } from 'react';

export const useFile = (fileName, type) => {
    const [text, setText] = useState();
    useEffect(() => {
        fetch(fileName)
            .then((response) => response.text())
            .then((textContent) => {
                setText(parseFile(textContent, type));
            });
    }, [fileName, type]);

    return [text];
};

const parseFile = (txt, type) => {
    txt = txt.replace(/\r/g, '');

    const parseRawrgx = /([\S ]+)\n\(\d+\)\n[^\n]+\n/g;
    const replaceRawRGX = '\n===\n\n# $1\n\n';

    const arr = txt
        .replace(parseRawrgx, replaceRawRGX)

        .split('===')
        .filter((block) => block)
        .map((block) => block.split('\n').filter((line) => line))
        .filter((blockArr) => blockArr.length > 2);

    return arr.map(parseBlockArr(type)).map(parseDeckType);
};

const parseBlockArr =
    (type) =>
    ([title, ...cards]) => {
        return {
            title: title.replaceAll('#', '').replaceAll('_', '').trim(),
            cards,
            type,
        };
    };

const parseDeckType = ({ title, type, cards }) => {
    // eslint-disable-next-line default-case
    switch (type) {
        case 'pauper':
            return {
                title,
                type: cards.length > 8 ? type : 'pauper-guild',
                cards,
            };
    }

    return { title, type, cards };
};
