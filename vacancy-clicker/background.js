const {runtime,tabs, storage: {sync}} = chrome;

const createTab = (url) => {
    tabs.create({url}, (tab) => {
        sync.set({'activeTabId': tab.id})
    });
};

runtime.onMessage.addListener(({action, params = {}}) => {
    if (action === 'navigate') {
        if (params.url) {
            createTab(params.url);
        }
    }
    if (action === 'removeActiveTab') {
        sync.get(['activeTabId'], ({activeTabId}) => {
            if (activeTabId) {
                tabs.remove(activeTabId);
                sync.remove(['activeTabId']);
                runtime.sendMessage({action: 'tabRemoved'});
            }
        })
    }
});
