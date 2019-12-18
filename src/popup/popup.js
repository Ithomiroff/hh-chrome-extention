

const {tabs, storage: {sync}} = chrome;


document.addEventListener(('DOMContentLoaded'), () => {
    const btn = document.getElementById('start');
    const clicks = document.getElementById('clicks');
    const date = document.getElementById('date');
    const newRequestForm = document.getElementById('form-new');
    const newRequestButton = document.getElementById('newRequest');

    const form = document.getElementById('form');
    const bar = document.getElementById('progress');
    const done = document.getElementById('done');
    const goal = document.getElementById('goal');

    btn.addEventListener('click', (e) => {
        e.stopPropagation();
        if (clicks && clicks.value && date && date.value) {
            tabs.getSelected(({id}) => {
                sync.set({
                    'status': 'start',
                    'maxClicks': clicks.value,
                    'maxDate': date.value,
                    'doneClicks': 0,
                    'tabId': id,
                });
            });
        }
    });


    newRequestButton.addEventListener('click', () => {
        sync.remove(['status', 'maxClicks', 'maxDate', 'doneClicks', 'tabId']);
        form.style.display = 'block';
        bar.style.display = 'none';
        newRequestButton.style.display = 'none';
    });

    sync.get(['status', 'maxClicks', 'doneClicks'], ({status, maxClicks, doneClicks}) => {
        console.warn(status);
        if (status === 'start') {
            form.style.display = 'none';
            bar.style.display = 'block';
        }
        if (Object.keys(status || {}).length < 1) {
            form.style.display = 'block';
            bar.style.display = 'none';
        }

        if (status === 'finish') {
            bar.style.display = 'block';
            form.style.display = 'none';
            newRequestForm.style.display = 'block';
        }

        chrome.runtime.sendMessage({action: 'log', params: {status}});

        done.innerText = doneClicks === undefined ? '' : doneClicks;
        goal.innerText = maxClicks === undefined ? '' : maxClicks;
    });

});

