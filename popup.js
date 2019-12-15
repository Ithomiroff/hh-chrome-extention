

const {tabs} = chrome;


document.addEventListener(('DOMContentLoaded'), () => {
    const btn = document.getElementById('start');
    const clicks = document.getElementById('clicks');
    const date = document.getElementById('date');

    btn.addEventListener('click', (e) => {
        e.stopPropagation();
        if (clicks && clicks.value && date && date.value) {
            tabs.getSelected(({id}) => tabs.sendMessage(id, {
                action: 'start',
                body: {
                    clicks: clicks.value,
                    date: date.value,
                }
            }));
        }
    });

});


document.addEventListener('click', () => {
    // tabs.getSelected(({id}) => tabs.sendMessage(id, {action: 'start'}));
});
