


const {tabs, runtime, notifications, storage, extension} = chrome;
const iconUrl = 'https://img.icons8.com/material/4ac144/256/user-male.png';
const notificationsId = {
    error: 'errorNots',
    success: 'successNots',
};
let allMessagesCount = 0;

const showResultPage = () => {
    const url = extension.getURL("report/index.html");
    tabs.create({url, selected:true});
};

const getMessage = (status, doneClicks, maxClicks) => {
    if (status === 'finish') {
        return `
            Процесс завершен.Совершено ${doneClicks} кликов из ${maxClicks}.${doneClicks < maxClicks ? 'Нет доступных страниц.' : ''}
        `;
    }
    if (status === 'start') {
        return `Процесс запущен. Цель совершить: ${maxClicks} кликов`;
    }
};

const showMessage = (status) => {
    storage.sync.get(['doneClicks', 'maxClicks'], ({doneClicks, maxClicks}) => {
        notifications.create(`${notificationsId.success}${allMessagesCount}`, {
            type: 'basic',
            title: 'Кликарь HH',
            message: getMessage(status, doneClicks, maxClicks),
            iconUrl
        }, () => allMessagesCount++);
    });
};


storage.onChanged.addListener((changes, namespace) => {
    const { status } = changes;
    const { newValue } = status || {};

    if (newValue === 'finish') {
        showMessage(newValue);
        showResultPage();
    }
    if (newValue === 'start') {
        showMessage(newValue);
    }
});


runtime.onMessage.addListener(({action, params = {}}) => {
    if (action === 'navigate') {
        tabs.getSelected(({id}) => {
            tabs.update(params.id, {highlighted: true});
            tabs.remove(id);
            tabs.sendMessage(params.id, {action: 'invited'});
        });
    }
});

(() => {
    notifications.getAll((nots) => {
        for (let key in nots) {
            notifications.clear(key);
        }
    });
})();
