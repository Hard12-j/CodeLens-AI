import type { SVGProps } from "react";

export default function DevPilotIcon(props: SVGProps<SVGSVGElement>) {
	return (
		<svg
			role="img"
			aria-label="CodeLens AI"
			viewBox="0 0 24 24"
			fill="none"
			xmlns="http://www.w3.org/2000/svg"
			{...props}
		>
			<path
				d="M15.5 15.5 21 21"
				stroke="currentColor"
				strokeWidth="1.8"
				strokeLinecap="round"
			/>
			<path
				d="M17 10a7 7 0 1 1-14 0 7 7 0 0 1 14 0Z"
				stroke="currentColor"
				strokeWidth="1.8"
				strokeLinejoin="round"
			/>
			<path
				d="m8.5 7.5-2.5 2.5 2.5 2.5m3-5 2.5 2.5-2.5 2.5"
				stroke="currentColor"
				strokeWidth="1.5"
				strokeLinecap="round"
				strokeLinejoin="round"
			/>
		</svg>
	);
}
