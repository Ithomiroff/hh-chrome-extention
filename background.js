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

// https://kostroma.hh.ru/search/resume?area=237&exp_company_size=any&exp_industry=any&exp_period=all_time&logic=normal&order_by=publication_time&pos=position&specialization=6.254&text=NOT+%D0%BC%D0%B0%D1%80%D0%BA%D0%B5%D1%82%D0%BE%D0%BB%D0%BE%D0%B3&mark=main_page_last_search_1
// https://kostroma.hh.ru/search/resume?L_is_autosearch=false&area=237&clusters=true&exp_company_size=any&exp_industry=any&exp_period=all_time&logic=normal&no_magic=false&order_by=publication_time&pos=position&specialization=6.254&text=NOT+%D0%BC%D0%B0%D1%80%D0%BA%D0%B5%D1%82%D0%BE%D0%BB%D0%BE%D0%B3&page=2


