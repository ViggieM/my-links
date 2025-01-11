export let isError = $state(false);
export const errors: ApplicationError[] = $state([]);

type ApplicationError = {
	code: string;
	message: string;
	redirect?: string;
};

export function setError(code: string, message: string, redirect: string) {
	isError = true;
	const applicationError: ApplicationError = {
		code,
		message,
		redirect
	};
	errors.push(applicationError);
}
