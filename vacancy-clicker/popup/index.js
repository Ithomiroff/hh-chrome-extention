const { storage: {sync} } = chrome;


document.addEventListener('DOMContentLoaded', () => {
    const startBtn = document.querySelector('#startBtn');
    const stopBtn = document.querySelector('#stopBtn');

    const toggleButtons = (status) => {
        if (status === 'start') {
            startBtn.style.display = 'none';
            stopBtn.style.display = 'block';
        }
        if (status === 'finish' || !status) {
            startBtn.style.display = 'block';
            stopBtn.style.display = 'none';
        }
    };

    const statusHandle = ({status}) => {
        toggleButtons(status);

        startBtn.addEventListener('click', () => {
            sync.set({'status': 'start'});
            toggleButtons('start');
        });
        stopBtn.addEventListener('click', () => {
            sync.set({'status': 'finish'});
            toggleButtons('finish');
        });
    };

    sync.get(['status'], statusHandle);
});
