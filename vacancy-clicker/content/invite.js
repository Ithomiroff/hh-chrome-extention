(() => {
    try {
        chrome.runtime.sendMessage({
            action: 'log',
            params: {
                msg: `Кликаю на кнопку 'Изменить статус и отправить сообщение'`
            }
        });
        const eBtn = document.querySelector('.HH-ChangeTopicForm-Submit');
        setTimeout(() => {
            if (eBtn) {
                eBtn.click();
            }
        }, 2500);
    } catch (err) {
        chrome.runtime.sendMessage({
            action: 'log',
            params: {
                msg: `ОШИБКА В КОДЕ! Ошибка на странице приглашения`,
                err: 'Ошибка ' + err.name + ":" + err.message + "\n" + err.stack
            }
        });
    }
})();
