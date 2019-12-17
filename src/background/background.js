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
        setTimeout(() => {
            tabs.executeScript({code: inviteScript()}, () => {
                setTimeout(() => tabs.remove(id), 5000);
                setTimeout(() => tabs.sendMessage(openerTabId, {action: 'invited'}), 5700);
            });
        }, 3000);
    });
});


