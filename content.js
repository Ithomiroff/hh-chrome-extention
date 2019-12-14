const classes = {
    resumeWrapper: '[data-resume-id]',
    resumeDate: '.resume-search-item__state_phone_interview',
    button: '.bloko-link_dimmed',
};

const state = {
    activeIndex: 0,
    today: new Date(),
    maxDaysCount: 30,
};

runApp();

function runApp () {
    const resumes = getFormatData();

    // inviteCandidate(resumes[state.activeIndex]);

    resumes.forEach(res => inviteCandidate(res));
}


function getFormatData() {
    const resumeBlocks = document.querySelectorAll(classes.resumeWrapper);
    const resumeBlocksArray = [...resumeBlocks];
    return resumeBlocksArray.map((ref) => {
       return {
           ref,
           id: ref.getAttribute('data-resume-id'),
           invited: false
       }
    });
    // resumeBlocks.forEach((block, i) => {
    //     if (!block.querySelector(classes.resumeDate)) {
    //         let button = block.querySelector(classes.button);
    //         button.setAttribute('target', '_blank')
    //         if (i === 1) {
    //             // button.click();
    //         }
    //     }
    // });

    // chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
    //     console.warn(tabs);
    //   });
}

function inviteCandidate(resume) {
    const prevInviteDate = resume.ref.querySelector(classes.resumeDate);

    if (prevInviteDate) {
        const text = prevInviteDate.textContent;
        if (text) {
            if (needDoInvite(text)) {
                perfomInvite(resume);
            }
        }
    } else {
        perfomInvite(resume);
    }
}

function perfomInvite(resume) {
    const btn = resume.ref.querySelector(classes.button);
    console.warn(btn);
}


function needDoInvite(text) {
    const date = text.match(/\d+/g).join('.');
    const diff = state.today.getTime() - new Date(date).getTime();
    const diffDays = diff / (1000 * 3600 * 24);
    return diffDays > state.maxDaysCount;
}

chrome.runtime.onMessage.addListener(handleMessage);


function handleMessage(msg) {
    console.warn(msg);
}
