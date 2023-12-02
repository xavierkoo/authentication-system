// Example custom types
// export interface Diagnosis {
//   code: string;
//   name: string;
//   latin?: string;
// }

// /* eslint-disable */
// export enum Gender {
// 	Male = "male",
// 	Female = "female",
// 	Other = "other",
// }
// /* eslint-enable */

// export interface Patient {
//   id: string;
//   name: string;
//   occupation: string;
//   gender: Gender;
//   ssn?: string;
//   dateOfBirth?: string;
// }

export interface CustomerData {
	id: string;
	email: string;
	name: string;
	userId: string;
	status: string;
	createdAt: string;
	updatedAt: string;
}
export interface BankConfig {
	brandColors: Record<string, string>;
	slogan: string;
	title: string;
}

// export type PatientFormValues = Omit<Patient, "id" | "entries">;
