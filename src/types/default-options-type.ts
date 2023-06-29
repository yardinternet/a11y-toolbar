export interface DefaultOptionsType {
	showReadSpeakerButton?: boolean;
	showTextSizeButton?: boolean;
	showContrastButton?: boolean;
	showPrintButton?: boolean;
	showLanguageButton?: boolean;
	readSpeakerCustomerID?: string;
	readSpeakerContentID?: string;
	iconOptions?: {
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
}
