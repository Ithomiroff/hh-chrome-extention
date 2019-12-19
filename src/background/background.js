const {tabs, runtime, notifications, storage} = chrome;
const iconUrl = 'https://img.icons8.com/material/4ac144/256/user-male.png';
const notificationsId = {
    error: 'errorNots',
    success: 'successNots',
};
const showMessage = (status) => {
    const getMessage = (doneClicks, maxClicks) => {
        if (status === 'finish') {
            return `Процесс завершен. Совершено ${doneClicks} кликов из ${maxClicks}`;
        }
        if (status === 'start') {
            return `Процесс запущен. Цель совершить: ${maxClicks} кликов`;
        }
    };
    storage.sync.get(['doneClicks', 'maxClicks'], ({doneClicks, maxClicks}) => {
        notifications.clear(notificationsId.success);
        notifications.create(notificationsId.success, {
            type: 'basic',
            title: 'Кликарь HH',
            message: getMessage(doneClicks, maxClicks),
            iconUrl
        }, () => {});
    });
};


storage.onChanged.addListener((changes, namespace) => {
    const { status } = changes;
    const { newValue } = status || {};
    if (newValue === 'finish') {
        showMessage(newValue);
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




    if (action === 'log') {
        console.warn('log');
        console.log(params);
        console.warn('log\n');
    }

});
// setTimeout(() => {
//     notifications.clear(notificationsId.success);
//     notifications.create(notificationsId.success, successNots(25, 25));
// }, 2000);
