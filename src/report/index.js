const { storage: {sync}, tabs } = chrome;


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
        if (doneClicks < maxClicks) {
            eLogs.insertAdjacentElement('beforeend', `
                <div class="log">
                    <span class="log__label">Предупреждение:</span>
                    <span class="log__text">Нет доступных страниц для кликкинга</span>
                </div>
            `)
        }
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

