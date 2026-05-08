export interface DefaultOptionsType {
	showReadSpeakerButton?: boolean;
	showTextSizeButton?: boolean;
	showContrastButton?: boolean;
	showPrintButton?: boolean;
	showLanguageButton?: boolean;
	showDeepLButton?: boolean;
	showTolkieTranslateButton?: boolean;
	customButton?: Function;
	showOpenDyslexicButton?: boolean;
	translateIncludedLanguages?: string;
	readSpeakerCustomerID?: string;
	readSpeakerContentID?: string;
	readSpeakerDisable?: string;
	disclaimerOptions?: {
		languageDisclaimer?: string;
	};
	iconOptions?: {
		toggleIcon?: string;
		readSpeakerIcon?: string;
		textSizeIcon?: string;
		contrastIcon?: string;
		printIcon?: string;
		languageIcon?: string;
		openDyslexicIcon?: string;
		tolkieTranslateIcon?: string;
	};
	textAfterOptions?: {
		readSpeakerTextAfter?: string;
		textSizeTextAfter?: string;
		contrastTextAfter?: string;
		printTextAfter?: string;
		languageTextAfter?: string;
		openDyslexicTextAfter?: string;
		tolkieTranslateTextAfter?: string;
	};
	labelOptions?: {
		readSpeakerLabel?: string;
		textSizeIncreaseLabel?: string;
		textSizeDecreaseLabel?: string;
		contrastIncreaseLabel?: string;
		contrastDecreaseLabel?: string;
		printLabel?: string;
		languageLabel?: string;
		openDyslexicActivateLabel?: string;
		openDyslexicDeactivateLabel?: string;
	};
}
