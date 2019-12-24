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
    console.warn(data);
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

runtime.onMessage.addListener(({action, params = {}}) => {

    if (action === 'log') {
        const msg = params.msg || 'Сообщение не передано';
        logs.push(msg);
        if (params.err) {
            logs.push(msg);
            sendReport();
            console.error(params.err);
        }
    }
});

storage.onChanged.addListener((changes) => {
    const {status} = changes;
    const {newValue} = status || {};

    if (newValue === 'finish') {
        sendReport();
    }
});
