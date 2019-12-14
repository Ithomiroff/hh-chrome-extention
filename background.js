const {tabs} = chrome;

const inviteScript = () => {
    return `
    const btn = document.querySelector('.HH-Form-SubmitButton');
    btn.click();
    `
};

tabs.onCreated.addListener((tab) => {
    const {id} = tab;
    tabs.get(id, (tabInfo) => {
        const { openerTabId } = tabInfo;
        tabs.executeScript({code: inviteScript()}, () => {
            tabs.sendMessage(openerTabId, {done: true });
        });
    });

});

// chrome.tabs.onActiveChanged.addListener((id, selectInfo) => console.warn(selectInfo));

