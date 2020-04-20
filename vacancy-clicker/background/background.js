import test from '../test';
console.warn(test);

const {runtime, tabs, storage: {sync}} = chrome;

const createTab = (url) => {
    tabs.create({url}, (tab) => {
        sync.set({'activeTabId': tab.id})
    });
};

runtime.onMessage.addListener(({action, params = {}}) => {
    if (action === 'navigate') {
        if (params.url) {
            tabs.getSelected(({id}) => {
                if (params.prevActiveTab) {
                    setTimeout(() => {
                        tabs.remove(id);
                    }, 500)
                } else {
                    sync.set({'prevActiveTabId': id})
                }
                createTab(params.url);
            });
        }
    }
    if (action === 'removeActiveTab') {
        sync.get(['activeTabId', 'prevActiveTabId'], ({activeTabId, prevActiveTabId}) => {
            if (activeTabId) {
                tabs.remove(activeTabId);
                sync.remove(['activeTabId']);
                tabs.sendMessage(prevActiveTabId, {action: 'tabRemoved'});
            }
        })
    }
});

