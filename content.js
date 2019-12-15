const classes = {
    resumeWrapper: '[data-resume-id]',
    resumeDate: '.resume-search-item__state_phone_interview',
    button: '.bloko-link_dimmed',
    buttonStart: '#ext-hh-start',
    paginatorWrapper: '.bloko-button-group',
    activePage: '.bloko-button_pressed'
};

let state = {
    clicks: 0,
    today: new Date(),
    maxDaysCount: 30,
    maxClicksCount: 30,
    resumes: [],
    activeId: null,
    maxResumesInFilter: null
};

let test = 2;
function runApp ({clicks = 10, date = 30}) {
    const eHeader = document.querySelector('h1.header');
    const digits = eHeader.textContent.match(/\d+/g);
    console.warn(digits)
    const resumes = getFormatData();
    state = {
        ...state,
        maxDaysCount: date,
        maxClicksCount: clicks,
        resumes,
        maxResumesInFilter: digits[0] || 0
    };

    console.warn(state);

    // inviteCandidate(resumes[0]);
    // inviteCandidate(resumes[0]);
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
    if (state.maxClicksCount > state.clicks) {
        inviteCandidate(state.resumes[0]);
    }
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

function inviteCandidate(resume) {
    state = {
        ...state,
        activeId: resume.id
    };

    const btn = resume.ref.querySelector(classes.button);
    btn.setAttribute('target', '_blank');
    btn.click();
}


function needDoInvite(text) {
    const date = text.match(/\d+/g);
    const newDate = `${date[1]}.${date[0]}.${date[2]}`

    const diff = state.today.getTime() - new Date(newDate).getTime();

    const diffDays = diff / (1000 * 3600 * 24);

    return diffDays > state.maxDaysCount;
}

chrome.runtime.onMessage.addListener((msg) => {
    switch (msg.action) {
        case "start": {
            console.log('start');
            runApp(msg.body);
            break;
        }
        case "invited": {
            state = {
                ...state,
                resumes: state.resumes.filter(res => res.id !== state.activeId),
                clicks: state.clicks + 1
            };

            console.log('invited');
            goToNextCandidate();
            break;
        }
        default:
            break;
    }
});


