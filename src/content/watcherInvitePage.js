const { storage: {sync} } = chrome;

const runScript = () => {
    const btn = document.querySelector('.HH-Form-SubmitButton');
    setTimeout(() => {
        btn.click();
    }, 2000);
};

const isInviting = () => {
    sync.get(['status', 'activeId'], ({status, activeId}) => {
        if (status === 'start' && activeId) {
            runScript();
        }
    })
};

(() => {
    isInviting();
})();
