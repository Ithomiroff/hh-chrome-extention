
const classes = {
    wrapper: '.HH-VacancyCardActions-Wrapper',
    checkbox: '.HH-Employer-VacancyResponse-BatchActions-ItemCheckbox',
    changeStatus: '.HH-VacancyCardActions-Button',
    pressedPage: '.bloko-button_pressed',
    navMainPage: '[data-qa=responses-tabs__item_phone_interview] a',
    wrapperTopic: '[data-topic-id]',
    totalMsg: '[data-total-messages]',
};

const maxMessagesCount = 5;

const COLLECTIONS = {
    phone: 'phone_interview',
    response: 'response',
};

const definePage = () => {
    const urlParams = new URLSearchParams(window.location.search);
    const collection = urlParams.get('collection');
    if (!collection || collection === COLLECTIONS.response) {
        return COLLECTIONS.response;
    }
    if (collection === COLLECTIONS.phone) {
        return COLLECTIONS.phone;
    }
};

const getUrlChangeStatus = () => {
    const prefix = '/employer/negotiations/change_topic?';
    const urlParams = new URLSearchParams(window.location.search);
    const vacancyId = urlParams.get('vacancyId');
    return `${prefix}vacancyId=${vacancyId}`;
};

const openSiblingTab = (url, additionalData = {}) => {
    try {
        const params = {
            url: window.location.origin + url,
            ...additionalData
        };
        chrome.runtime.sendMessage({action: 'navigate', params});
    } catch (err) {
        chrome.runtime.sendMessage({
            action: 'log',
            params: {
                msg: `ОШИБКА В КОДЕ! Ошибка при открытии нового таба`,
                err: 'Ошибка ' + err.name + ":" + err.message + "\n" + err.stack
            }
        });
    }
};

const navigate = () => {
    try {
        const ePage = document.querySelector(classes.pressedPage);
        if (ePage) {
            if (ePage.nextSibling) {
                const href = ePage.nextSibling.querySelector('a');
                const num = href.textContent;
                const urlParams = new URLSearchParams(window.location.search);
                if (urlParams.has('page')) {
                    urlParams.set('page', Number(num) - 1);
                } else {
                    urlParams.append('page', Number(num) - 1);
                }
                const url = window.location.pathname + '?' + urlParams;
                setTimeout(openSiblingTab, 1000, url, {prevActiveTab: true});
                chrome.runtime.sendMessage({
                    action: 'log',
                    params: {
                        msg: `Переход на следующую страницу номер: ${Number(num) - 1}`,
                    }
                });
            } else {
                chrome.runtime.sendMessage({
                    action: 'log',
                    params: {
                        msg: `Завершение работы`,
                    }
                });
                chrome.storage.sync.set({'status': 'finish'});
                console.warn('FINISH WORK')
            }
        } else {
            throw 'No paginator button';
        }
    } catch (err) {
        chrome.runtime.sendMessage({
            action: 'log',
            params: {
                msg: `ОШИБКА В КОДЕ! Ошибка при переходе на следующую страницу`,
                err: 'Ошибка ' + err.name + ":" + err.message + "\n" + err.stack
            }
        });
    }
};

const scanResumes = () => {
    chrome.runtime.sendMessage({
        action: 'log',
        params: {
            msg: `Сканирование всех резюме на странице...`
        }
    });

    const eTopics = document.querySelectorAll(classes.wrapperTopic) || [];

    const vacFormated = [];
    [...eTopics].forEach(topic => {
        const messages = topic.querySelector(classes.totalMsg);
        if (messages && messages.textContent < maxMessagesCount) {
            vacFormated.push({
                id: topic.getAttribute('data-topic-id'),
                box: topic.querySelector(classes.checkbox)
            });
        }
    });

    console.warn({vacFormated});

    if (vacFormated.length < 1) {
        return navigate();
    }

    chrome.runtime.sendMessage({
        action: 'log',
        params: {
            msg: `Найдено ${vacFormated.length} резюме`
        }
    });

    let url = getUrlChangeStatus();

    vacFormated.forEach(vac => {
        url += `&t=${vac.id}`;
        if (vac.box) {
            vac.box.click();
        }
    });

    chrome.runtime.sendMessage({
        action: 'log',
        params: {
            msg: `Открытие вкладки приглашение на собеседование`,
        }
    });
    setTimeout(openSiblingTab, 1000, (url));
};



const runApp = () => {

    const page = definePage();

    if (page === COLLECTIONS.response) {
        chrome.storage.sync.get(['status'], ({status}) => {
            if (status !== 'start') {
                return;
            }
            chrome.runtime.sendMessage({
                action: 'log',
                params: {
                    msg: `Открытие странице response`,
                }
            });
            setTimeout(() => {
                chrome.runtime.sendMessage({action: 'removeActiveTab'});
            }, 1000);
        });
    }

    if (page === COLLECTIONS.phone) {
        chrome.storage.sync.get(['status'], ({status}) => {
            if (status !== 'start') {
                return;
            }
            chrome.runtime.sendMessage({
                action: 'log',
                params: {
                    msg: `Автоматический запуск программы на странице. Статус - start`,
                }
            });
            scanResumes();
        });
    }
};


(() => {
    runApp();
})();

chrome.storage.onChanged.addListener((changes) => {

    const {status, activeTabId} = changes;
    const {newValue} = status || {};

    if (newValue === 'start') {
        chrome.runtime.sendMessage({
            action: 'log',
            params: {
                msg: `Запуск программы!`,
            }
        });
        try {
            scanResumes();
        } catch (err) {
            chrome.runtime.sendMessage({
                action: 'log',
                params: {
                    msg: `ОШИБКА В КОДЕ! Ошибка при сканировании резюме`,
                    err: 'Ошибка ' + err.name + ":" + err.message + "\n" + err.stack
                }
            });
        }
    }
});

chrome.runtime.onMessage.addListener(({action, params = {}}) => {
    console.warn({action});
    if (action === 'tabRemoved') {
        navigate();
    }
});
