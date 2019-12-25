
const { storage: { sync }, runtime } = chrome;

(() => {
    sync.get(['status', 'activeId', 'tabId'], ({status, activeId, tabId}) => {
        if (status === 'start' && activeId && !!tabId) {
            setTimeout(() => {
                runtime.sendMessage({action: 'navigate', params: {id: tabId}});
            }, 1000);
        }
    });
})();
