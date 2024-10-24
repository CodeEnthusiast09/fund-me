import React from "react";

export interface TextAreaProps
	extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
	label?: string;
	placeholder?: string;
	onChange?: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
	error?: {
		message?: string;
	};
	disabled?: boolean;
	className?: string;
	ariaLabel?: string;
	labelClassName?: string;
	leftIcon?: React.ReactNode;
	readOnly?: boolean;
	value?: string | number;
	showRequiredAsterik?: boolean;
	triggerSubmitOnPressEnter?: boolean;
}
