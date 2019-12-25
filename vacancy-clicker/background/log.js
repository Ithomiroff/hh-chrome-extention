const logs = [];
const url = 'http://v.pinscherweb.ru/log.php';

const sendReport = () => {
    const form = new FormData();
    let data = '';
    logs.forEach(msg => {
        data += `${msg}\n`
    });
    data = `
    
    
    ${data}
    
    
    `;

    form.append('messages', data.toString());
    form.append('type', 'vacancy');

    const params = {
        method: 'POST',
        mode: 'cors',
        body: form
    };
    return fetch(url, params).then((res) => {
        if (res.status === 200) {
            logs.length = 0;
        }
    });
};

chrome.runtime.onMessage.addListener(({action, params = {}}) => {

    if (action === 'log') {
        const msg = params.msg || 'Сообщение не передано';
        console.warn(msg);
        logs.push(msg);
        if (params.err) {
            logs.push(params.err);
            sendReport();
            console.error(params.err);
        }
    }
});

chrome.storage.onChanged.addListener((changes) => {
    const {status} = changes;
    const {newValue} = status || {};

    if (newValue === 'finish') {
        sendReport();
    }
});
