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

const handleReport = () => {
    const form = new FormData();
    const fileUrl = extension.getURL("report/index.html");
    fetch(fileUrl)
        .then(res => res.text())
        .then(file => {
            console.warn(file)
            form.append('report', file);
            form.append('email', 'ithomiroff@gmail.com');

            sendFile(form).then(res => console.warn(res));
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
    const handleStore = ({status, maxClicks, doneClicks, timeStart, timeEnd}) => {
        if (status === 'finish') {
            insertReport({doneClicks, timeStart, timeEnd, maxClicks});
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
        'timeEnd'
    ], handleStore);
};

document.addEventListener('DOMContentLoaded', gotDOM);

