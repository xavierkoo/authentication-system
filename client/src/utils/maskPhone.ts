export const maskPhone = (phoneNumber: string) => {
	// takes in a phoneNumber as a string and return only the last 4 digits and replace the rest with *

	// Check if the phoneNumber is null or empty
	if (!phoneNumber) {
		return phoneNumber;
	}

	// Check if the phoneNumber is less than 4 digits
	if (phoneNumber.length < 4) {
		return phoneNumber;
	}

	// Check if the phoneNumber is greater than 4 digits
	if (phoneNumber.length > 4) {
		// Get the last 4 digits of the phoneNumber
		const lastFourDigits = phoneNumber.substr(phoneNumber.length - 4);

		// Replace the phoneNumber with * except the last 4 digits
		phoneNumber = phoneNumber.replace(/./g, "*");

		// Add the last 4 digits to the phoneNumber
		phoneNumber = phoneNumber.substr(0, phoneNumber.length - 4) + lastFourDigits;

		// convert it back to string
		phoneNumber = phoneNumber.toString();
	}

	// Return the phoneNumber
	return phoneNumber;
};
