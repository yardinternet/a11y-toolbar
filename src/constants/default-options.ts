export const DEFAULTS = {
	showReadSpeakerButton: true,
	showTextSizeButton: true,
	showContrastButton: true,
	showPrintButton: true,
	showLanguageButton: true,
	showDeepLButton: false,
	customButton: null,
	toggleIcon: 'fa-regular fa-universal-access',
	readSpeakerButton: {
		customerID: '9999',
		contentID: 'readspeakers',
		disable:
			'settings,clicklisten,voicesettings,readhover,enlarge,textmode,pagemask,download,help,dictionary,translation',
		icon: 'fa-light fa-volume',
		textAfter: '',
		label: 'Laat de tekst voorlezen met ReadSpeaker webReader',
	},
	textSizeButton: {
		icon: 'fa-light fa-text-height',
		textAfter: '',
		increaseLabel: 'Vergroot schermtekst',
		decreaseLabel: 'Verklein schermtekst',
	},
	contrastButton: {
		icon: 'fa-light fa-adjust',
		textAfter: '',
		increaseLabel: 'Vergroot schermcontrast',
		decreaseLabel: 'Verklein schermcontrast',
	},
	printButton: {
		icon: 'fa-light fa-print',
		textAfter: '',
		label: 'Print pagina',
	},
	translateButton: {
		icon: '<svg xmlns="http://www.w3.org/2000/svg" fill="none" aria-hidden="true" class="a11y-toolbar__flag" viewBox="0 0 20 15"> <mask id="mask0" width="20" height="15" x="0" y="0" mask-type="alpha" maskUnits="userSpaceOnUse"> <path fill="#fff" d="M0 0h20v15H0z"/> </mask> <g mask="url(#mask0)"> <path fill="#F7FCFF" fill-rule="evenodd" d="M0 0v15h20V0H0Z" clip-rule="evenodd"/> <mask id="mask1" width="20" height="15" x="0" y="0" mask-type="alpha" maskUnits="userSpaceOnUse"> <path fill="#fff" fill-rule="evenodd" d="M0 0v15h20V0H0Z" clip-rule="evenodd"/> </mask> <g fill-rule="evenodd" clip-rule="evenodd" mask="url(#mask1)"> <path fill="#E31D1C" d="M0 0v5h20V0H0Z"/> <path fill="#3D58DB" d="M0 10v5h20v-5H0Z"/> </g> </g> </svg>',
		textAfter: 'Translate',
		label: 'Translate',
		disclaimer: '',
		includedLanguages: 'en',
	},
};
