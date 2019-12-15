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
            setTimeout(() => tabs.remove(id), 5000);
            setTimeout(() => tabs.sendMessage(openerTabId, {action: 'invited'}), 6000);
        });
    });

});

// setTimeout(() => {
//     tabs.executeScript({code: inviteScript()}, () => {
//         tabs.remove(id);
//         setTimeout(() => {
//             tabs.sendMessage(openerTabId, {action: 'invited'});
//         }, 500)
//     });
// }, 5000)



