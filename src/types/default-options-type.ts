export interface DefaultOptionsType {

	showReadSpeakerButton?: boolean;
	showTextSizeButton?: boolean;
	showContrastButton?: boolean;
	showPrintButton?: boolean;
	showLanguageButton?: boolean;
	showDeepLButton?: boolean;
	customButton?: Function;
	toggleIcon?: string;
	readSpeakerButton?: {
		customerID?: string;
		contentID?: string;
		disable?: string;
		icon?: string;
		textAfter?: string;
		label?: string;
	}
	textSizeButton?: {
		icon?: string;
		textAfter?: string;
		increaseLabel?: string;
		decreaseLabel?: string;
	},
	contrastButton?: {
		icon?: string;
		textAfter?: string;
		increaseLabel?: string;
		decreaseLabel?: string;
	},
	printButton?: {
		icon?: string;
		textAfter?: string;
		label?: string;
	},
	translateButton?: {
		icon?: string;
		textAfter?: string;
		label?: string;
		disclaimer?: string;
		includedLanguages?: string;
	},
}
