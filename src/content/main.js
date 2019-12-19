const classes = {
    resumeWrapper: '[data-resume-id]',
    resumeDate: '.resume-search-item__state_phone_interview',
    button: '.bloko-link_dimmed',
    buttonStart: '#ext-hh-start',
    paginatorWrapper: '.bloko-button-group',
    activePage: '.bloko-button_pressed'
};

const randomInteger = (max) => {
    let rand = 3 - 0.5 + Math.random() * (max - 3 + 1);
    return Math.round(rand);
};

let RESUMES_ON_PAGE = [];


(() => {
    chrome.storage.sync.get(['status', 'maxDate'], ({status, maxDate}) => {

        RESUMES_ON_PAGE = getFormatData(maxDate);
        console.log(RESUMES_ON_PAGE);
        if (status === 'start') {
            setTimeout(() => {
                goToNextCandidate();
            }, 1000);
        }
    });
})();


function runApp() {
    const timeStart = `${new Date().getHours()}: ${new Date().getMinutes()}: ${new Date().getSeconds()}`;
    console.log('%cЗапуск ' + timeStart, 'background: #222; color:yellow;font-size: 18px');
    chrome.storage.sync.set({timeStart});

    chrome.storage.sync.get(['maxDate'], ({maxDate}) => {
        RESUMES_ON_PAGE = getFormatData(maxDate);
        console.log(RESUMES_ON_PAGE);
        goToNextCandidate();
    });

    chrome.runtime.sendMessage({
        action: 'log',
        params: {
            msg: `Старт процесса. Время - ${timeStart}`
        }
    });
}

function finishApp() {
    try {
        const timeEnd = `${new Date().getHours()}: ${new Date().getMinutes()}: ${new Date().getSeconds()}`;
        console.log('%cФиниш:    ' + timeEnd, 'background: #222; color:yellow; font-size: 18px');
        chrome.storage.sync.set({timeEnd});
        chrome.storage.sync.set({'status': 'finish'});


        chrome.storage.sync.get(['doneClicks', 'maxClicks'], ({doneClicks, maxClicks}) => {
            chrome.runtime.sendMessage({
                action: 'log',
                params: {
                    msg: `Завершение процесса. 
                    Время - ${timeEnd}. 
                    Сделано кликов ${doneClicks}. 
                    Нужно было сделать ${maxClicks}.
                    `
                }
            });
        });
    } catch (err) {
        console.warn(err);
        chrome.runtime.sendMessage({
            action: 'log',
            params: {
                msg: `ОШИБКА В КОДЕ!`,
                err
            }
        });
    }
}

function navigate() {
    try {
        const ePaginator = document.querySelector(classes.paginatorWrapper);
        const eActivePage = ePaginator.querySelector(classes.activePage);
        const eNext = eActivePage.nextSibling;

        if (eNext && eNext.firstElementChild) {
            eNext.firstElementChild.click();
            chrome.runtime.sendMessage({
                action: 'log',
                params: {
                    msg: `Переход на следующую страницу. Номер - ${eNext.firstElementChild.textContent}`
                }
            });
        } else {
            finishApp();
        }
    } catch (err) {
        chrome.runtime.sendMessage({
            action: 'log',
            params: {
                msg: `ОШИБКА В КОДЕ! Ошибка получения элементов пагинации`,
                err
            }
        });
    }
}


function goToNextCandidate() {
    chrome.runtime.sendMessage({
        action: 'log',
        params: {
            msg: `Поиск следующего резюме`
        }
    });
    chrome.storage.sync.get(['maxDate', 'maxClicks', 'doneClicks'], ({maxDate, maxClicks, doneClicks}) => {
        if (Number(maxClicks) === Number(doneClicks)) {
            finishApp();
        } else {
            if (RESUMES_ON_PAGE.length > 0) {
                inviteCandidate(RESUMES_ON_PAGE[0]);
            } else {
                navigate();
            }
        }
    });
}

function inviteCandidate(resume) {

    chrome.runtime.sendMessage({
        action: 'log',
        params: {
            msg: `Приглашаю кандидата с резюме ${resume.id}`
        }
    });

    const performClick = () => {
        try {
            const btn = resume.ref.querySelector(classes.button);
            btn.setAttribute('target', '_blank');
            btn.click();
        } catch (err) {
            chrome.runtime.sendMessage({
                action: 'log',
                params: {
                    msg: `ОШИБКА В КОДЕ! Ошибка получения кнопки пригласить в резюме`,
                    err
                }
            });
        }
    };

    chrome.storage.sync.set({'activeId': resume.id});

    chrome.storage.sync.get(['interval'], ({interval}) => {
        if (interval !== 3) {
            console.log('%cИнтервал ' + randomInteger(interval), 'background: #222; color:yellow;font-size: 18px');
            chrome.runtime.sendMessage({
                action: 'log',
                params: {
                    msg: `Кликаю с интервалом ${randomInteger(interval)} секунды`
                }
            });
            setTimeout(performClick, randomInteger(interval) * 1000);
        } else {
            performClick();
        }
    });

}

function getFormatData(maxDate) {
    try {
        const resumeBlocks = document.querySelectorAll(classes.resumeWrapper);
        const resumeBlocksArray = [...resumeBlocks];
        const res = [];


        for (let i = 0; i < resumeBlocksArray.length; i++) {
            const prevInviteDate = resumeBlocksArray[i].querySelector(classes.resumeDate);
            const text = prevInviteDate ? prevInviteDate.textContent : null;
            if (text) {
                if (needDoInvite(text, maxDate)) {
                    res.push({
                        ref: resumeBlocksArray[i],
                        id: resumeBlocksArray[i].getAttribute('data-resume-id'),
                    });
                }
            } else {
                res.push({
                    ref: resumeBlocksArray[i],
                    id: resumeBlocksArray[i].getAttribute('data-resume-id')
                })
            }

        }
        return res;
    } catch (err) {
        chrome.runtime.sendMessage({
            action: 'log',
            params: {
                msg: `ОШИБКА В КОДЕ! Ошибка получения элементов резюме`,
                err
            }
        });
    }
}

function needDoInvite(text, maxDate) {
    const date = text.match(/\d+/g);
    const newDate = `${date[1]}.${date[0]}.${date[2]}`;

    const diff = (new Date()).getTime() - new Date(newDate).getTime();

    const diffDays = diff / (1000 * 3600 * 24);

    return Math.ceil(diffDays) > Number(maxDate);
}


chrome.storage.onChanged.addListener((changes, namespace) => {
    const {status, maxDate, maxClicks} = changes;
    const {newValue} = status || {};

    if (newValue === 'start' && maxClicks && maxDate) {
        runApp();
    }
});

chrome.runtime.onMessage.addListener(({action, params = {}}) => {
    if (action === 'invited') {
        console.log('%cПриглашен ', 'background: #222; color:yellow;font-size: 18px');
        chrome.storage.sync.get(['activeId', 'doneClicks'], ({activeId, doneClicks}) => {
            chrome.runtime.sendMessage({
                action: 'log',
                params: {
                    msg: `Приглашен кандидат с резюме ${activeId}`
                }
            });
            chrome.storage.sync.set({doneClicks: doneClicks + 1});
            RESUMES_ON_PAGE = RESUMES_ON_PAGE.filter(res => res.id !== activeId);
            goToNextCandidate();
        });
    }
});
