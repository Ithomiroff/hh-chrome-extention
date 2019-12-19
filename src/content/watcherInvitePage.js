const { storage: {sync} } = chrome;

const runScript = () => {
    try {
        const btn = document.querySelector('.HH-Form-SubmitButton');
        setTimeout(() => {
            btn.click();
        }, 2000);
    } catch (err) {
        chrome.runtime.sendMessage({
            action: 'log',
            params: {
                msg: `ОШИБКА В КОДЕ! Ошибка получения кнопки пригласить на странице приглашения кандидата`,
                err
            }
        });
    }
};

const isInviting = () => {
    sync.get(['status', 'activeId'], ({status, activeId}) => {
        if (status === 'start' && activeId) {
            runScript();
            chrome.runtime.sendMessage({
                action: 'log',
                params: {
                    msg: `Кликаю пригласить кандидата на странице 'приглашения'`
                }
            });
        }
    })
};

(() => {
    isInviting();
})();
