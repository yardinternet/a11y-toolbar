export interface DefaultOptionsType {
	showReadSpeakerButton?: boolean;
	showTextSizeButton?: boolean;
	showContrastButton?: boolean;
	showPrintButton?: boolean;
	showLanguageButton?: boolean;
	showDeepLButton?: boolean;
	customButton?: Function;
	translateIncludedLanguages?: string;
	readSpeakerCustomerID?: string;
	readSpeakerContentID?: string;
	readSpeakerDisable?: string;
	iconOptions?: {
		toggleIcon?: string;
		readSpeakerIcon?: string;
		textSizeIcon?: string;
		contrastIcon?: string;
		printIcon?: string;
		languageIcon?: string;
	};
	textAfterOptions?: {
		readSpeakerTextAfter?: string;
		textSizeTextAfter?: string;
		contrastTextAfter?: string;
		printTextAfter?: string;
		languageTextAfter?: string;
	};
	labelOptions?: {
		readSpeakerLabel?: string;
		textSizeIncreaseLabel?: string;
		textSizeDecreaseLabel?: string;
		contrastIncreaseLabel?: string;
		contrastDecreaseLabel?: string;
		printLabel?: string;
		languageLabel?: string;
	};
}
