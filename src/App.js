import './App.css';

import { sampleSize } from 'lodash';
import { useEffect, useState } from 'react';
import edh_1v1_file from './decks/js-edh-1v1.txt';
import pauper_file from './decks/js-pauper.txt';
import { useFile } from './util/hook';

const App = () => {
    const [mode, setMode] = useState('edh');

    let modeElem = <ModeEDH />;

    if (mode.includes('pauper')) {
        modeElem = <ModePauper mode={mode} />;
    }

    return (
        <div className='App'>
            <select value={mode} onChange={(e) => setMode(e.target.value)}>
                <option value='edh'>1v1 Jumpstart EDH</option>
                <option value='pauper-auto'>
                    Pauper Jumpstart (Auto-guild)
                </option>
                <option value='pauper-rand'>
                    Pauper Jumpstart (Random guild)
                </option>
            </select>
            {modeElem}
        </div>
    );
};

const ModeEDH = () => {
    const [edh] = useFile(edh_1v1_file, 'edh1v1');
    const [deckList, setList] = useState([]);

    useEffect(() => {
        setList(sampleSize(edh, 3));
    }, [edh]);

    const handleRandom = () => {
        const edhSample = sampleSize(edh, 3);

        setList(edhSample);
    };

    return (
        <div>
            <h1>
                <a href={'https://cubecobra.com/cube/overview/1v1edh'}>
                    1v1 Jumpstart EDH
                </a>
            </h1>
            <button onClick={handleRandom}>Random</button>
            <Sample list={deckList} />
        </div>
    );
};

const ModePauper = ({ mode }) => {
    const [pauper] = useFile(pauper_file, 'pauper') || [];
    const pauperPacks = pauper?.filter((e) => e.type === 'pauper') || [];
    const guildPacks = pauper?.filter((e) => e.type !== 'pauper') || [];
    const [counter, setCounter] = useState(0);

    const [deckList, setList] = useState([]);
    // const [guildList, setGuilds] = useState([]);

    useEffect(() => {
        const pauperSelect = sampleSize(pauperPacks, 2);
        if (mode.includes('rand')) {
            setList(pauperSelect.concat(sampleSize(guildPacks, 1)));
        } else {
            // setGuilds(guildPacks);

            setList(pauperSelect);
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [pauper, mode, counter]);

    return (
        <div>
            <h1>
                <a href={'https://cubecobra.com/cube/overview/1v1edh'}>
                    Pauper Jumpstart
                </a>
            </h1>
            <p>Take 2 booster packs and 1 guild pack. Cut 8 cards.</p>
            <button onClick={() => setCounter(counter + 1)}>Random</button>
            <Sample list={deckList} />
            <Sample list={guildPacks} />
        </div>
    );
};

const Sample = ({ list }) => {
    const titles = list.map((c) => c.title);
    const cardList = list.map((c) => c.cards);

    return (
        <div className='sample'>
            <div className='row head'>
                {titles.map((t) => (
                    <h2>{t}</h2>
                ))}
            </div>
            <div className='row'>
                {cardList.map((c) => (
                    <pre>{c.join('\n')}</pre>
                ))}
            </div>
        </div>
    );
};

// const smartGuild = (deckList, guildPacks) => {
//     const titleArr = deckList.map((t) => t.title);
//     const red = checkTitle(titleArr, 'red');
//     const blue = checkTitle(titleArr, 'blue');
//     const green = checkTitle(titleArr, 'green');
//     const white = checkTitle(titleArr, 'white');
//     const black = checkTitle(titleArr, 'black');

//     if (red && blue) return '';
// };

// const checkTitle = (titleArr, includesStr) => {
//     return titleArr.some((t) =>
//         t.toLowercase().includes(includesStr.toLowercase())
//     );
// };

export default App;
