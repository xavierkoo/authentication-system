/**
 * The `formatDate` function takes a string representing a date in the format "yyyy-mm-dd" and returns
 * a string representing the same date in the format "dd/mm/yyyy".
 * @param {string} inputDate - The inputDate parameter is a string representing a date in the format
 * "yyyy-mm-dd".
 * @returns the formatted date string in the format "dd/mm/yyyy".
 */
export const formatDate = (inputDate: string) => {
	var parts = inputDate.split("-");

	// Check if the input date has the correct format
	if (parts.length !== 3) {
		return "Invalid Date Format";
	}

	// Reorder the parts to the desired format
	var day = parts[2];
	var month = parts[1];
	var year = parts[0];

	// Create the output date string in dd/mm/yyyy format
	var outputDate = day + "/" + month + "/" + year;

	return outputDate;
};
