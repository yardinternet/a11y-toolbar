export const DEFAULTS = {
	showReadSpeakerButton: true,
	showTextSizeButton: true,
	showContrastButton: true,
	showPrintButton: true,
	showLanguageButton: true,
	showDeepLButton: false,
	customButton: null,
	translateIncludedLanguages: 'en',
	readSpeakerCustomerID: '9999',
	readSpeakerContentID: 'readspeakers',
	readSpeakerDisable:
		'settings,clicklisten,voicesettings,readhover,enlarge,textmode,pagemask,download,help,dictionary,translation',
	iconOptions: {
		toggleIcon: 'fa-regular fa-universal-access',
		readSpeakerIcon: 'fa-light fa-volume',
		textSizeIcon: 'fa-light fa-text-height',
		contrastIcon: 'fa-light fa-adjust',
		printIcon: 'fa-light fa-print',
		languageIcon:
			'<svg xmlns="http://www.w3.org/2000/svg" fill="none" aria-hidden="true" class="a11y-toolbar__flag" viewBox="0 0 20 15"> <mask id="mask0" width="20" height="15" x="0" y="0" mask-type="alpha" maskUnits="userSpaceOnUse"> <path fill="#fff" d="M0 0h20v15H0z"/> </mask> <g mask="url(#mask0)"> <path fill="#F7FCFF" fill-rule="evenodd" d="M0 0v15h20V0H0Z" clip-rule="evenodd"/> <mask id="mask1" width="20" height="15" x="0" y="0" mask-type="alpha" maskUnits="userSpaceOnUse"> <path fill="#fff" fill-rule="evenodd" d="M0 0v15h20V0H0Z" clip-rule="evenodd"/> </mask> <g fill-rule="evenodd" clip-rule="evenodd" mask="url(#mask1)"> <path fill="#E31D1C" d="M0 0v5h20V0H0Z"/> <path fill="#3D58DB" d="M0 10v5h20v-5H0Z"/> </g> </g> </svg>',
	},
	textAfterOptions: {
		readSpeakerTextAfter: '',
		textSizeTextAfter: '',
		contrastTextAfter: '',
		printTextAfter: '',
		languageTextAfter: 'Translate',
	},
	labelOptions: {
		readSpeakerLabel: 'Laat de tekst voorlezen met ReadSpeaker webReader',
		textSizeIncreaseLabel: 'Vergroot schermtekst',
		textSizeDecreaseLabel: 'Verklein schermtekst',
		contrastIncreaseLabel: 'Vergroot schermcontrast',
		contrastDecreaseLabel: 'Verklein schermcontrast',
		printLabel: 'Print pagina',
		languageLabel: 'Translate',
	},
};
