"use client";
import { useEffect } from "react";

export const useCloseDropdownOnModalClose = (handler: () => void) => {
	useEffect(() => {
		const handleCloseModal = () => {
			handler();
		};

		document.addEventListener("modalClosed", handleCloseModal);

		return () => {
			document.removeEventListener("modalClosed", handleCloseModal);
		};
	}, [handler]);
};
