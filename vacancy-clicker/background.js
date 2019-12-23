const {runtime,tabs} = chrome;

const createTab = (url) => {
    tabs.create({url});
};

runtime.onMessage.addListener(({action, params = {}}) => {
    if (action === 'navigate') {
        if (params.href) {
            createTab(params.href);
        }
        // tabs.getSelected(({id}) => {
        //     tabs.update(params.id, {highlighted: true});
        //     tabs.remove(id);
        //     tabs.sendMessage(params.id, {action: 'invited'});
        // });
    }
});
