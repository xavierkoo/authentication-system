import '../../styles/_variable.scss';


// create Type "Email" to take in a string with a default value of an empty string
type MFAsetup = {
    email: string;
    logoURL: string;
    stateChanger: (value: number) => void;
}

// Create component to setup MFA with some text and a button and takes in a email prop
const MFASetupPrompt = ({ stateChanger, email, logoURL }: MFAsetup) => {
    // if email is provided, use that, otherwise use "No email provided"
    const emailData = email || 'x*********@gmail.com';

    // if logoURL is provided, use that, otherwise use "../src/assets/logo.png"
    const logoData = logoURL || '../src/assets/posb.svg';

    return (
        <>
            <div className="container text-start " style={{
                backgroundColor: 'white',
            }}>
                <div className="row">
                    <div className="col-md-1"></div>
                    <div className="col mx-2 my-2">
                        <img src={logoData} style={{ width: '150px' }} alt="Logo" />
                        <h3>{emailData}</h3 >

                        <div className='my-5'>
                            <h1 className=''>More Information is required</h1>
                            <p>Your organization needs more information to keep your account secure</p>
                            <p>Click the button below to setup MFA for your account.</p>
                            <button className="btn defaultBtn" onClick={() => stateChanger(2)}>Setup MFA</button>
                        </div>
                    </div>
                    <div className="col-md-1"></div>
                </div>
            </div >
        </>
    );
};


export default MFASetupPrompt;
