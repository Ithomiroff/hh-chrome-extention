const classes = {
    resumeWrapper: '[data-resume-id]',
    resumeDate: 'resume-search-item__state_phone_interview',
    button: '.bloko-link_dimmed',
};

runApp();

function runApp () {
    getResumes();
}


function getResumes() {
    const resumeBlocks = document.querySelectorAll(classes.resumeWrapper);
    resumeBlocks.forEach((block, i) => {
        if (!block.querySelector(classes.resumeDate)) {
            let button = block.querySelector(classes.button);
            // if (i === 1) {
            //     button.click();
            // }
        }
    });
    console.log(chrome);
    // chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
    //     console.warn(tabs);
    //   });
}