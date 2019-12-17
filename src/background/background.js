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
                console.warn('SCRIPT');
                setTimeout(() => {
                    console.warn('REMOVE');
                    tabs.remove(id);
                }, 5000);
                setTimeout(() => {
                    tabs.sendMessage(openerTabId, {action: 'invited'})
                    console.warn('INVITED')
                }, 5700);
            });
        }, 4000);
    });
});


