/**
 * The function `validateEmailFormat` checks if an email address has a valid format.
 * @param {string} email - The `email` parameter is a string that represents an email address.
 * @returns a boolean value. It returns true if the email format is valid (contains exactly one "@"
 * symbol and has non-empty strings before and after the "@" symbol), and false otherwise.
 */
export const validateEmailFormat = (email: string) => {
	const emailCheck = email.split("@");
	return (
		emailCheck.length === 2 &&
		emailCheck[0].length > 0 &&
		emailCheck[1].length > 0
	);
};

/**
 * The function `validatePasswordFormat` checks if a password has a minimum length of 8 characters.
 * @param {string} password - A string representing the password that needs to be validated.
 * @returns a boolean value indicating whether the length of the password is greater than or equal to
 * 8.
 */

export const validatePasswordFormat = (password: string) => {
	return password.length >= 8;
};

/**
 * The function `validateDateFormat` checks if a given date string is in the format "dd/mm/yyyy" and is
 * not empty, today's date, or a future date.
 * @param {string} date - The `date` parameter is a string representing a date in the format
 * "dd/mm/yyyy".
 * @returns The function `validateDateFormat` returns a boolean value. It returns `true` if the input
 * `date` is in the format "dd/mm/yyyy" and is a valid date that is not today or greater than today. It
 * returns `false` otherwise.
 */
export const validateDateFormat = (date: string) => {
	const dateCheck = date.split("/");

	//validate that it is not empty
	if (dateCheck.length === 1 && dateCheck[0].length === 0) {
		return false;
	}

	//validate that it is not today or greater than today
	const today = new Date();
	const todayDate = today.getDate();
	const todayMonth = today.getMonth() + 1;
	const todayYear = today.getFullYear();

	if (
		dateCheck.length === 3 &&
		dateCheck[0] === todayDate.toString() &&
		dateCheck[1] === todayMonth.toString() &&
		dateCheck[2] === todayYear.toString()
	) {
		return false;
	}

	if (dateCheck.length === 3 && dateCheck[2] > todayYear.toString()) {
		return false;
	}

	if (
		dateCheck.length === 3 &&
		dateCheck[2] === todayYear.toString() &&
		dateCheck[1] > todayMonth.toString()
	) {
		return false;
	}

	if (
		dateCheck.length === 3 &&
		dateCheck[2] === todayYear.toString() &&
		dateCheck[1] === todayMonth.toString() &&
		dateCheck[0] > todayDate.toString()
	) {
		return false;
	}

	// validate that the date is not before 01/01/1900
	if (dateCheck.length === 3 && dateCheck[2] < "1900") {
		return false;
	}

	return (
		dateCheck.length === 3 &&
		dateCheck[0].length === 2 &&
		dateCheck[1].length === 2 &&
		dateCheck[2].length === 4
	);
};
