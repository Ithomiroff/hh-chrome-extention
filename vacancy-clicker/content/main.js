
const classes = {
    wrapper: '.HH-VacancyCardActions-Wrapper',
    checkbox: '.HH-Employer-VacancyResponse-BatchActions-ItemCheckbox',
    changeStatus: '.HH-VacancyCardActions-Button',
    pressedPage: '.bloko-button_pressed',
    navMainPage: '[data-qa=responses-tabs__item_phone_interview] a',
    wrapperTopic: '[data-topic-id]',
    totalMsg: '[data-total-messages]',
};

const maxMessagesCount = 3;

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

const openSiblingTab = (url) => {
    const params = {
        url: window.location.origin + url,
    };
    chrome.runtime.sendMessage({action: 'navigate', params});
};

const navigate = () => {
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
            setTimeout(openSiblingTab, 1000, window.location.pathname + '?' + urlParams);
        }
    }

};

const scanResumes = () => {
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
    console.warn('SCAN')
    console.warn({vacFormated});

    if (vacFormated.length < 1) {
        return navigate();
    }

    let url = getUrlChangeStatus();

    vacFormated.forEach(vac => {
        url += `&t=${vac.id}`;
        if (vac.box) {
            vac.box.click();
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
        scanResumes();
    }
});

