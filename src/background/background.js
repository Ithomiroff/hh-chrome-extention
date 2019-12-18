const {tabs, runtime, browserAction} = chrome;


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


setTimeout(() => {
    browserAction.getPopup({}, (popup) => {
        console.warn(popup)
        // return resolve(popup)
    });
    console.warn('Waaaa')
},9000);
