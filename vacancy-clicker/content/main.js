
const {storage: {sync}} = chrome;

let isMainPage = false;

const VACANCIES = [];

const classes = {
    wrapper: '.HH-VacancyCardActions-Wrapper',
    checkbox: '.HH-Employer-VacancyResponse-BatchActions-ItemCheckbox',
    changeStatus: '.HH-VacancyCardActions-Button',
    pressedPage: '.bloko-button_pressed',
    navMainPage: '[data-qa=responses-tabs__item_phone_interview] a'
};

const navigate = () => {
    const ePage = document.querySelector(classes.pressedPage);
    if (ePage) {
        if (ePage.nextSibling) {
            const eNext = ePage.nextSibling;
            const link = eNext.querySelector('a');
            const href = link.getAttribute('href');
        }
    }

};

const scanResumes = () => {
    const eBoxes = document.querySelectorAll(classes.checkbox);
    if (eBoxes && eBoxes.length > 0) {
        eBoxes.forEach(box => {
            box.click();
        });
        // navigate();
        setTimeout(() => {
            const eStatusBtn = document.querySelector(classes.changeStatus);
            if (eStatusBtn) {
                eStatusBtn.click();
            }
        }, 800);
    }
};

const navigateMainPage = () => {
    const eNav = document.querySelector(classes.navMainPage);
    if (eNav) {
        eNav.click();
    }
};

const runApp = () => {
    // const urlParams = new URLSearchParams(window.location.search);
    // const collection = urlParams.get('collection');
    //
    // isMainPage = !!collection;
    //
    // sync.get(['status'], ({status}) => {
    //     if (status !== 'start') {
    //         return;
    //     }
    //     if (isMainPage) {
    //         scanResumes();
    //     } else {
    //         navigateMainPage();
    //     }
    // });

    // navigateMainPage();
};



(() => {
    runApp();
})();

chrome.storage.onChanged.addListener((changes) => {

    const {status} = changes;
    const {newValue} = status || {};

    if (newValue === 'start') {
        scanResumes();
    }
});

