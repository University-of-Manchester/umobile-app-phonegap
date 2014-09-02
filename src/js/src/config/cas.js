// Configuration object.
var config = {};

// BASE SERVER URL
// HTML5 testing url: http://localhost:5000
// Android: http://10.0.2.2:8080
// iOS: http://localhost:8080
//config.uMobileServerUrl = 'https://my.manchester.ac.uk';
config.uMobileServerUrl = 'https://uat.portal.manchester.ac.uk';


// UMOBILE SERVER CONTEXT PATH
config.uMobileServerContext = '/uPortal';

// AUTHENTICATION
// mockLogin, localLogin or casLogin.
config.loginFn = 'casLogin';
config.encryptionKey = 'umobile';
config.casServerUrl = 'https://beta.login.manchester.ac.uk';

// LOCAL STORAGE.
config.storageFn = 'local';

// SESSION TIMEOUT.
// 600000 millseconds = 10 minutes.
config.sessionTimeout = '600000';

// LOCALLY HOSTED ICONS
// For uMobile modules. Keyed by module fname.
config.nativeIcons = {
        timetable: 'calendar.png',
        'library-search': 'library.png',
        'find-pc': 'computer_lab.png',
        'my-organisations': 'courses.png'
};

//config.moduleList = [];
config.moduleList = [
    'contacts', 'timetable', 'man-portlet-calendar', 'my-news',
    'hot-topic', 'job-vacancies', 'careers-events', 'library-summary','library-search', 'find-pc',
    'open-days', 'man-portlet-todo', 'my-organisations'
];
    


// SUPPORTED MODULES
config.nativeModules = {
	//news: 'modules/news.html',
	//map: 'modules/map.html',
	//calendar: 'modules/calendar.html',
	//courses: 'modules/courses.html'
        'find-pc': 'modules/findpc.html',
//        'contacts': 'modules/contacts.html'
};