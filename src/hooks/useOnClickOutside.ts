"use client";
import { useEffect, MutableRefObject } from "react";

/**
 *
 * Read more info about this hook and it's usage
 * https://usehooks.com/useOnClickOutside/
 */

export const useOnClickOutside = (
	ref: MutableRefObject<HTMLElement | null>,
	handler: () => void,
	closeInModal = false
) => {
	useEffect(() => {
		const listener = (event: Event) => {
			// Do nothing if clicking ref's element or descendent elements
			if (!ref.current || ref.current.contains(event.target as HTMLElement)) {
				return;
			}

			// Check if the clicked/touched element is a child of the modal element with class "modal" or "modal-overlay"
			const modal = document.querySelector(".modal");
			const modalOverlay = document.querySelector(".modal-overlay");
			if (
				!closeInModal &&
				((modal && modal.contains(event.target as HTMLElement)) ||
					(modalOverlay && modalOverlay.contains(event.target as HTMLElement)))
			) {
				return;
			}

			handler();
		};

		document.addEventListener("mousedown", listener);
		document.addEventListener("touchstart", listener);

		return () => {
			document.removeEventListener("mousedown", listener);
			document.removeEventListener("touchstart", listener);
		};

		// Add ref and handler to effect dependencies
		// It's worth noting that because passed in handler is a new ...
		// ... function on every render that will cause this effect ...
		// ... callback/cleanup to run every render. It's not a big deal ...
		// ... but to optimize you can wrap handler in useCallback before ...
		// ... passing it into this hook.
	}, [ref, handler, closeInModal]);
};
