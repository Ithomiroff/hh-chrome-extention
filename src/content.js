const STATUSES = {
    start: '1',
    pause: '2',
    finish: '3',
};

const keys = {
    id: '__hhActiveID',
    status: '__hhStatus',
    maxDaysCount: '__hhMaxDaysCount',
    maxClicksCount: '__hhMaxClicksCountt',
    doneClicks: '__hhDoneClicks',
}

const classes = {
    resumeWrapper: '[data-resume-id]',
    resumeDate: '.resume-search-item__state_phone_interview',
    button: '.bloko-link_dimmed',
    buttonStart: '#ext-hh-start',
    paginatorWrapper: '.bloko-button-group',
    activePage: '.bloko-button_pressed'
};

let RESUMES_ON_PAGE = [];

(() => {

    RESUMES_ON_PAGE = getFormatData();
    const status = localStorage.getItem(keys.status);

    if (status && STATUSES.start) {
        console.warn('allowed resumes on page', RESUMES_ON_PAGE);
        setTimeout(() => {
            goToNextCandidate();
        }, 3000);
    }

})();


function runApp ({clicks = 10, date = 30}) {

    localStorage.setItem(keys.maxDaysCount , date);
    localStorage.setItem(keys.maxClicksCount , clicks);
    localStorage.setItem(keys.status , STATUSES.start);
    localStorage.setItem(keys.doneClicks , 0);

    goToNextCandidate();
}

function navigate() {
    const ePaginator = document.querySelector(classes.paginatorWrapper);
    const eActivePage = ePaginator.querySelector(classes.activePage);
    const eNext = eActivePage.nextSibling;

    if (eNext.firstElementChild) {
        eNext.firstElementChild.click();
    }
}


function goToNextCandidate() {

    const maxClicksCount = localStorage.getItem(keys.maxClicksCount);
    const clicks = localStorage.getItem(keys.doneClicks);

    if (Number(maxClicksCount) === Number(clicks)) {
        localStorage.setItem(keys.status, STATUSES.finish);
    } else {
        if (RESUMES_ON_PAGE.length > 0) {
            inviteCandidate(RESUMES_ON_PAGE[0]);
        } else {
            navigate();
        }
    } 
}

function inviteCandidate(resume) {
    localStorage.setItem(keys.id , resume.id);

    const btn = resume.ref.querySelector(classes.button);
    btn.setAttribute('target', '_blank');
    btn.click();
}

function getFormatData() {
    const resumeBlocks = document.querySelectorAll(classes.resumeWrapper);
    const resumeBlocksArray = [...resumeBlocks];
    const res = [];
    for (let i = 0; i < resumeBlocksArray.length; i++) {
        const prevInviteDate = resumeBlocksArray[i].querySelector(classes.resumeDate);
        const text = prevInviteDate ? prevInviteDate.textContent : null;
        if (text) {
            if (needDoInvite(text)) {
                res.push({
                    ref: resumeBlocksArray[i],
                    id: resumeBlocksArray[i].getAttribute('data-resume-id'),
                });
            }
        } else {
            res.push({
                ref: resumeBlocksArray[i],
                id: resumeBlocksArray[i].getAttribute('data-resume-id')
            })
        }

    }
    return res;
}

function needDoInvite(text) {
    const date = text.match(/\d+/g);
    const newDate = `${date[1]}.${date[0]}.${date[2]}`

    const diff = (new Date()).getTime() - new Date(newDate).getTime();

    const diffDays = diff / (1000 * 3600 * 24);

    return diffDays >  localStorage.getItem(keys.maxDaysCount);
}


chrome.runtime.onMessage.addListener((msg) => {
    switch (msg.action) {
        case "start": {
            console.log('START');
            runApp(msg.body);
            break;
        }
        case "invited": {
                       
            const clicks = localStorage.getItem(keys.doneClicks);
            localStorage.setItem(keys.doneClicks, Number(clicks) + 1);

            RESUMES_ON_PAGE = RESUMES_ON_PAGE.filter(res => res.id !== localStorage.getItem(keys.id));
            
            console.log(RESUMES_ON_PAGE);
            console.log('INVITED');
            goToNextCandidate();
            break;
        }
        default:
            break;
    }
})

