import { FormHelperText, Input, InputLabel, Button, FormControl } from '@mui/material';
import '../../styles/_variable.scss';
import { useState } from 'react';


type Setup = {
    requireSetup: boolean;
    stateChanger: (value: number) => void;
    logoURL: string;
}

const Setup: React.FC<Setup> = ({ logoURL, stateChanger }) => {

    const [requestOTP, setRequestOTP] = useState(false);
    const [phoneNumber, setPhoneNumber] = useState('');
    const [verificationCode, setVerificationCode] = useState('');
    const logoData = logoURL || '../src/assets/posb.svg';

    /**
     * The function `handlePhoneNumberChange` is used to update the `phoneNumber` state based on the value
     * of an input field, validate if the input is a valid phone number
     */
    // TODO: limit the length of the phone number to 8 characters
    const handlePhoneNumberChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        // Check if the input is a number and handle validation
        const value = event.target.value;
        if (!isNaN(Number(value))) {
            setPhoneNumber(value);
        }
    };

    /**
     * The function `handleVerificationCodeChange` is used to update the state variable `verificationCode`
     * with the value of the input element.
     */
    const handleVerificationCodeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        // Check if the input is a number and limit the length to 6 characters
        const value = event.target.value;
        if (!isNaN(Number(value)) && value.length <= 6) {
            setVerificationCode(value);
        }
    };

    // TODO: add a function to request OTP from the backend
    const getOTP = () => {
        setRequestOTP(true)
        console.log('getOTP');
    }

    // TODO: add a function to process and check the OTP with the backend
    const verifyOTP = () => {
        console.log('verifyOTP');

        // TODO: if the OTP is correct, change the state to 2
        stateChanger(3);
    }

    return (
        <div className="container text-start" style={{ backgroundColor: 'white' }}>
            <div className="row">
                <div className="col-md-1"></div>
                <div className="col mx-2 my-2 py-5">
                    <img src={logoData} style={{ width: '150px' }} alt="Logo" />
                    <h1>Additional security verification</h1>
                    <p>Secure your account by adding phone verification to your password</p>
                    {requestOTP ? (
                        <div className='my-5'>
                            <h3>Step 2: Enter your verification code from your mobile phone</h3>
                            <p>Enter the verification code displayed on your phone</p>
                            <FormControl>
                                <InputLabel htmlFor="verificationCode">Verification Code</InputLabel>
                                <Input
                                    type="text"
                                    onChange={handleVerificationCodeChange}
                                    id="verificationCode"
                                    aria-describedby="my-helper-text"
                                    value={verificationCode}
                                />
                            </FormControl>
                            <Button className='ms-3' color='primary' onClick={verifyOTP}>Verify</Button>
                        </div>
                    ) : (
                        <div className='my-5'>
                            <h3>Step 1: How should we contact you?</h3>
                            <p>Choose a phone number to receive your verification code</p>
                            <FormControl>
                                <InputLabel htmlFor="phoneNumber">Phone Number</InputLabel>
                                <Input
                                    type="text"
                                    onChange={handlePhoneNumberChange}
                                    id="phoneNumber"
                                    aria-describedby="my-helper-text"
                                    value={phoneNumber}
                                />
                                <FormHelperText id="my-helper-text">We'll never share your Phone Number.</FormHelperText>
                            </FormControl>
                            <Button className='ms-3' color='primary' onClick={getOTP}>Request OTP</Button>
                        </div>
                    )}
                </div>
                <div className="col-md-1"></div>
            </div>
        </div>
    );

};


export default Setup;
