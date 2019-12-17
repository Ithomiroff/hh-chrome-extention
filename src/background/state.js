let state = {
    clicks: 0,
    today: new Date(),
    maxDaysCount: 30,
    maxClicksCount: 30,
    resumes: [],
    activeId: null,
    maxResumesInFilter: null,
    page: 0
};



chrome.runtime.onMessage.addListener((message, sender, reply) => {
    switch (message.type) {
        case 'get': {
            reply(state);
            return state;
        }
        case 'set': {
            console.warn(message.data);
            // state = {
            //     ...state,
            //     ...message.data
            // };
            // console.warn(state);
            return;
        }
    }
});
