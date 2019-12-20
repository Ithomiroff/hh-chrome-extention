runtime.onMessage.addListener(({action, params = {}}) => {

    if (action === 'log') {
        const msg = params.msg || 'Сообщение не передано';
        console.warn(msg);
        if (params.err) {
            console.error(params.err);
        }
    }

});