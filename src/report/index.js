const { storage: {sync}, tabs, extension } = chrome;


const insertReport = ({doneClicks, timeStart, timeEnd, maxClicks}) => {
    const eLogs = document.getElementById('logs');
    if (eLogs) {
        eLogs.insertAdjacentHTML('afterbegin', (() => {
            return `
            <div class="log">
                <span class="log__label">Сделано кликов: </span>
                <span class="log__text">${doneClicks}</span>
            </div>
            <div class="log">
                <span class="log__label">Нужно было сделать кликов: </span>
                <span class="log__text">${maxClicks}</span>
            </div>
            <div class="log">
                <span class="log__label">Время старта: </span>
                <span class="log__text">${timeStart}</span>
            </div>
            <div class="log">
                <span class="log__label">Время окончания: </span>
                <span class="log__text">${timeEnd}</span>
            </div>
            `
        })());
    }
};

const handleReport = ({doneClicks, timeStart, timeEnd, maxClicks, email}) => {
    const rep = document.getElementById('reportStatus');
    rep.innerText = 'Отчет отправляется...';
    const form = new FormData();
    form.append('email', email);
    form.append('doneClicks', doneClicks);
    form.append('timeStart', timeStart);
    form.append('timeEnd', timeEnd);
    form.append('maxClicks', maxClicks);

    sendFile(form).then(res => {
        if (res.status === 200) {
            rep.innerText = 'Отчет доставлен успешно';
        } else {
            rep.innerText = 'Ошибка отправки отчета!';
        }
    });

    function sendFile(body) {
        const url = `http://v.pinscherweb.ru/index.php`;
        const params = {
            method: 'POST',
            mode: 'cors',
            body
        };
        return fetch(url, params);
    }
};

const gotDOM = () => {
    const handleStore = ({status, maxClicks, doneClicks, timeStart, timeEnd, email}) => {
        if (status === 'finish') {
            insertReport({doneClicks, timeStart, timeEnd, maxClicks});
            handleReport({doneClicks, timeStart, timeEnd, maxClicks, email});
        } else {
            tabs.getSelected(({id}) => {
                tabs.remove(id);
            })
        }

    };

    sync.get([
        'status',
        'maxClicks',
        'doneClicks',
        'timeStart',
        'timeEnd',
        'email'
    ], handleStore);
};

document.addEventListener('DOMContentLoaded', gotDOM);

