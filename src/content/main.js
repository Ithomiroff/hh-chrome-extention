
const classes = {
    resumeWrapper: '[data-resume-id]',
    resumeDate: '.resume-search-item__state_phone_interview',
    button: '.bloko-link_dimmed',
    buttonStart: '#ext-hh-start',
    paginatorWrapper: '.bloko-button-group',
    activePage: '.bloko-button_pressed'
};

const randomInteger = (max) => {
    let rand = 3 - 0.5 + Math.random() * (max - 3 + 1);
    return Math.round(rand);
};

let RESUMES_ON_PAGE = [];

(() => {

    // chrome.storage.sync.clear();
    RESUMES_ON_PAGE = getFormatData();

    console.warn(RESUMES_ON_PAGE);

    chrome.storage.sync.get(['status'], ({status}) => {
        if (status === 'start') {
            setTimeout(() => {
                goToNextCandidate();
            }, 1000);
        }
    });

})();


function runApp () {
    console.warn('RUUUUN');

    goToNextCandidate();
}

function navigate() {
    const ePaginator = document.querySelector(classes.paginatorWrapper);
    const eActivePage = ePaginator.querySelector(classes.activePage);
    const eNext = eActivePage.nextSibling;

    if (eNext.firstElementChild) {
        eNext.firstElementChild.click();
    } else {
        chrome.storage.sync.set({'error': 'Следующая страница недоступна'});
    }
}


function goToNextCandidate() {

    chrome.storage.sync.get(['maxDate', 'maxClicks', 'doneClicks'], ({maxDate, maxClicks, doneClicks}) => {
        if (Number(maxClicks) === Number(doneClicks)) {
            chrome.storage.sync.set({'status': 'finish'});
        } else {
            if (RESUMES_ON_PAGE.length > 0) {
                inviteCandidate(RESUMES_ON_PAGE[0]);
            } else {
                navigate();
            }
        }
    });
}

function inviteCandidate(resume) {

    const performClick = () => {
        const btn = resume.ref.querySelector(classes.button);
        btn.setAttribute('target', '_blank');
        btn.click();
    };

    chrome.storage.sync.set({'activeId': resume.id});

    chrome.storage.sync.get(['interval'], ({interval}) => {
        if (interval !== 3) {
            console.warn({interval: randomInteger(interval)});
            setTimeout(performClick, randomInteger(interval) * 1000);
        } else {
            performClick();
        }
    });

}

function getFormatData() {
    const resumeBlocks = document.querySelectorAll(classes.resumeWrapper);
    const resumeBlocksArray = [...resumeBlocks];
    const res = [];
    for (let i = 0; i < resumeBlocksArray.length; i++) {
        const prevInviteDate = resumeBlocksArray[i].querySelector(classes.resumeDate);
        const text = prevInviteDate ? prevInviteDate.textContent : null;
        if (text) {
            needDoInvite(text, (result) => {
                if (result) {
                    res.push({
                        ref: resumeBlocksArray[i],
                        id: resumeBlocksArray[i].getAttribute('data-resume-id'),
                    });
                }
            });
        } else {
            res.push({
                ref: resumeBlocksArray[i],
                id: resumeBlocksArray[i].getAttribute('data-resume-id')
            })
        }

    }
    return res;
}

function needDoInvite(text, callback) {
    chrome.storage.sync.get(['maxDate'], ({maxDate}) => {
        const date = text.match(/\d+/g);
        const newDate = `${date[1]}.${date[0]}.${date[2]}`;

        const diff = (new Date()).getTime() - new Date(newDate).getTime();

        const diffDays = diff / (1000 * 3600 * 24);

        callback(diffDays >  maxDate);
    });

}


chrome.storage.onChanged.addListener((changes, namespace) => {
    const { status, maxDate, maxClicks } = changes;
    const {newValue} = status || {};

    if (newValue === 'start' && maxClicks && maxDate) {
        runApp();
    }
});

chrome.runtime.onMessage.addListener(({action, params = {}}) => {
    if (action === 'invited') {
        console.warn('INVITED');
        chrome.storage.sync.get(['activeId', 'doneClicks'], ({activeId, doneClicks}) => {
            chrome.storage.sync.set({doneClicks: doneClicks + 1});
            RESUMES_ON_PAGE = RESUMES_ON_PAGE.filter(res => res.id !== activeId);
            goToNextCandidate();
        });
    }
});
