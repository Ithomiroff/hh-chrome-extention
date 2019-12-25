const id = '09ce1029cef09a3149814f295e168b1c';

const {tabs, storage: {sync}, notifications, runtime} = chrome;
const URL = 'http://v.pinscherweb.ru/security.php';


const gotDom = () => {
    const btn = document.getElementById('start');
    const clicks = document.getElementById('clicks');
    const date = document.getElementById('date');
    const email = document.getElementById('email');
    const interval = document.getElementById('interval');
    const newRequestForm = document.getElementById('form-new');
    const newRequestButton = document.getElementById('newRequest');
    const dropProcessButton = document.getElementById('dropProcess');
    const dropProcessWrapper = document.getElementById('dropProcessWrapper');

    const form = document.getElementById('form');
    const bar = document.getElementById('progress');
    const done = document.getElementById('done');
    const goal = document.getElementById('goal');

    btn.addEventListener('click', (e) => {
        e.stopPropagation();
        chrome.runtime.sendMessage({
            action: 'log',
            params: {
                msg: `
                Клик в popup на кнопку старт
                Значения ${clicks.value} ${date.value} ${interval.value} ${email.value}
                
                `,
            }
        });
        if (clicks && clicks.value && date && date.value && interval.value >= 3 && email.value) {
            tabs.getSelected(({id}) => {
                sync.set({
                    'status': 'start',
                    'error': null,
                    'maxClicks': clicks.value,
                    'maxDate': date.value,
                    'interval': interval.value,
                    'doneClicks': 0,
                    'tabId': id,
                    'email': email.value,
                });
            });
        }
    });

    const dropProcess = () => {
        sync.remove([
            'status',
            'maxClicks',
            'maxDate',
            'doneClicks',
            'tabId',
            'interval',
            'timeStart',
            'timeEnd'
        ]);
        form.style.display = 'block';
        bar.style.display = 'none';
        newRequestButton.style.display = 'none';
    };

    dropProcessButton.addEventListener('click', () => dropProcess());
    newRequestButton.addEventListener('click', () => dropProcess());

    sync.get(['status', 'maxClicks', 'doneClicks'], ({status, maxClicks, doneClicks}) => {
        if (status === 'start') {
            form.style.display = 'none';
            bar.style.display = 'block';
        }
        if (Object.keys(status || {}).length < 1) {
            form.style.display = 'block';
            bar.style.display = 'none';
        }

        if (status === 'finish') {
            bar.style.display = 'block';
            form.style.display = 'none';
            dropProcessWrapper.style.display = 'none';
            newRequestForm.style.display = 'block';
        }

        done.innerText = doneClicks === undefined ? '' : doneClicks;
        goal.innerText = maxClicks === undefined ? '' : maxClicks;
    });

};

const checkAccess = () => {
    const requestAuth = () => {
        const form = new FormData();
        form.append('id', id);
        const params = {
            method: 'POST',
            mode: 'cors',
            body: form
        };
        return fetch(URL, params).then((res) => res.text());
    };
    return requestAuth();
};

try {
    checkAccess().then((res) => {
        if (res && res === 'true') {
            sync.set({'isAuth': true});
            const wrapper = document.getElementById('wrapper');
            const auth = document.getElementById('auth');
            wrapper.style.display = 'block';
            auth.style.display = 'none';
            gotDom();
        } else {
            const authH = document.getElementById('auth-h');
            authH.innerText = 'Доступ не получен. Уточните информацию у руководителя.'
        }
    });
} catch (err) {
    chrome.runtime.sendMessage({
        action: 'log',
        params: {
            msg: `ОШИБКА В КОДЕ! Ошибка на странице popup`,
            err
        }
    });
}

