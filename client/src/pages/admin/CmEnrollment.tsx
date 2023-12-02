import {DragEvent, useState, useContext, useEffect} from 'react';
import * as XLSX from 'xlsx';
import {AccountContext} from '../admin/../../services/Account';
import UserLogoutPopup from '../../components/UserLogout';
import {useNavigate} from 'react-router-dom';
import AdminNavBar from '../../components/navigation/AdminNavBar';

const CmEnrollment = () => {
	const [dragIsOver, setDragIsOver] = useState<boolean>(false);
	const [filename, setFilename] = useState<string>('');
	const [fileSet, setFileSet] = useState<boolean>(false);
	const [selectedFile, setSelectedFile] = useState<File>();
	const [token, setToken] = useState<string>('');
	const [role, setRole] = useState<string>('');
	const [userName, setUserName] = useState<string>('');
	const [isLocked, setIsLocked] = useState<boolean>(true);
	const [bankName, setBankName] = useState<string>('');

	const accountContext = useContext(AccountContext);
	const navigate = useNavigate();

	useEffect(() => {
		if (accountContext) {
			// Now you can use accountContext.getSession
			accountContext
				.getSession()
				.then((session) => {
					if (session['custom:role'] !== 'super_admin') {
						navigate('/cm-dashboard');
					}
					setToken(session.accessToken.jwtToken);
					setRole(session['custom:role']);
					setBankName(session['custom:bank_name']);
					setUserName(session.given_name + ' ' + session.family_name);
				})
				.catch((error) => {
					console.error(error); // Handle error
				});
		}
	}, [accountContext]);

	const handleDragOver = (event: DragEvent<HTMLDivElement>) => {
		event.preventDefault();
		setDragIsOver(true);
	};

	const handleDragLeave = (event: DragEvent<HTMLDivElement>) => {
		event.preventDefault();
		setDragIsOver(false);
	};

	const handleDrop = (event: DragEvent<HTMLDivElement>) => {
		event.preventDefault();
		setDragIsOver(false);
		const files = event.dataTransfer.files;
		const file = files[0];
		if (file) {
			const reader = new FileReader();
			reader.onload = () => {
				const previewContainer =
					document.getElementById('previewContainer');
				if (previewContainer) {
					if (
						file.type ===
						'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
					) {
						const data = new Uint8Array(
							reader.result as ArrayBuffer
						);
						const workbook = XLSX.read(data, {type: 'array'});
						const sheet = workbook.Sheets[workbook.SheetNames[0]];
						const jsonResult = XLSX.utils.sheet_to_json(sheet);
						const preview = document.createElement('pre');
						preview.textContent = JSON.stringify(
							jsonResult,
							null,
							2
						);
						previewContainer.innerHTML = '';
						previewContainer.appendChild(preview);
						reader.readAsArrayBuffer(file);
						setFileSet(true);
					} else if (file.type === 'text/csv') {
						// Handle CSV file
						const data = reader.result as string;
						const preview = document.createElement('pre');
						preview.textContent = data;
						previewContainer.innerHTML = '';
						previewContainer.appendChild(preview);
						setFilename(file.name);
						reader.readAsText(file);
						setFileSet(true);
					}
				}
			};
			if (
				file.type ===
				'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
			) {
				reader.readAsArrayBuffer(file);
			} else if (file.type === 'text/csv') {
				reader.readAsText(file);
			}
			setFilename(file.name);
			setFileSet(true);
			setSelectedFile(file);
		}
	};

	const handleDivClick = () => {
		const fileInput = document.getElementById('fileInput');
		if (fileInput) {
			fileInput.click();
		}
	};

	const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		const file = event.target.files?.[0];

		if (file) {
			const reader = new FileReader();
			reader.onload = () => {
				const previewContainer =
					document.getElementById('previewContainer');
				if (previewContainer) {
					if (
						file.type ===
						'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
					) {
						const data = new Uint8Array(
							reader.result as ArrayBuffer
						);
						const workbook = XLSX.read(data, {type: 'array'});
						const sheet = workbook.Sheets[workbook.SheetNames[0]];
						const jsonResult = XLSX.utils.sheet_to_json(sheet);
						const preview = document.createElement('pre');
						preview.textContent = JSON.stringify(
							jsonResult,
							null,
							2
						);
						previewContainer.innerHTML = '';
						previewContainer.appendChild(preview);
						reader.readAsArrayBuffer(file);

						setFileSet(true);
					} else if (file.type === 'text/csv') {
						// Handle CSV file
						const data = reader.result as string;
						const preview = document.createElement('pre');
						preview.textContent = data;
						previewContainer.innerHTML = '';
						previewContainer.appendChild(preview);
						setFilename(file.name);
						reader.readAsText(file);
						setFileSet(true);
					}
				}
			};
			if (
				file.type ===
				'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
			) {
				reader.readAsArrayBuffer(file);
			} else if (file.type === 'text/csv') {
				reader.readAsText(file);
			}
			setFilename(file.name);
			setSelectedFile(file);
			setFileSet(true);
		}
	};

	const arrayBufferToBase64 = (buffer: ArrayBuffer): string => {
		let binary = '';
		const bytes = new Uint8Array(buffer);
		const len = bytes.byteLength;
		for (let i = 0; i < len; i++) {
			binary += String.fromCharCode(bytes[i]);
		}
		return btoa(binary);
	};

	const handleUpload = async () => {
		if (!selectedFile) return;

		const fileContent = await selectedFile.arrayBuffer();
		const base64File = arrayBufferToBase64(fileContent);

		const payload = {
			accessToken: token,
			role: role,
			bank: bankName,
			file: base64File,
			filename: selectedFile.name,
		};

		const LAMBDA_ENDPOINT =
			'https://xr6gnon0x3.execute-api.ap-southeast-1.amazonaws.com/dev/store-csv';
		try {
			const response = await fetch(LAMBDA_ENDPOINT, {
				method: 'POST',
				body: JSON.stringify(payload),
				headers: {
					'Content-Type': 'application/json',
				},
			});
			if (!response.ok) {
				alert('File upload failed!: Forbidden');
				throw new Error(`HTTP error! status: ${response.status}`);
			} else {
				alert('File uploaded successfully!');
			}
		} catch (error) {
			console.error('Error uploading the file:', error);
		}
	};

	return (
		<>
			<UserLogoutPopup />
			<AdminNavBar adminType={role} userName={userName} />
			<div>
				{/* Start of Enrollment section */}

				<div className="container bg-light shadow-sm mt-4 p-4">
					<div className="row p-3">
						<div className="col-8">
							<h2>Enrollment of New Users</h2>
						</div>

						<div className="col-4 d-flex justify-content-end">
							{isLocked ? (
								<button
									className="defaultBtn"
									style={{width: 'auto'}}
									onClick={() => {
										setIsLocked(!isLocked);
									}}
								>
									Lock
								</button>
							) : (
								<button
									className="defaultBtn"
									style={{width: 'auto'}}
									onClick={() => {
										setIsLocked(!isLocked);
									}}
								>
									Unlock
								</button>
							)}
						</div>
					</div>
					<div className="row px-3">
						<div className="pb-3">
							<div>
								Drag the users file into the box below or click
								to select the file to upload
							</div>
						</div>
					</div>
				</div>

				<div className="container bg-light shadow-sm mt-4 p-4">
					{isLocked ? (
						<div className="">
							File upload is locked. Please click unlock!
						</div>
					) : (
						<div className="row p-4">
							<h2 className="pb-3">Upload the user file</h2>
							<div
								className={
									!isLocked
										? 'drag-drop-wrapper text-center p-5 d-flex justify-content-center align-items-center'
										: 'drag-drop-disabled text-center p-5 d-flex justify-content-center align-items-center'
								}
								onDrop={handleDrop}
								onDragLeave={handleDragLeave}
								onDragOver={handleDragOver}
								onClick={handleDivClick}
								style={{
									backgroundColor: dragIsOver
										? 'lightgray'
										: 'white',
								}}
							>
								<div
									className={
										!isLocked ? '' : 'drag-drop-disabled'
									}
								>
									Drag & drop files <br /> or <br />
									Click here{' '}
								</div>
								<label htmlFor="fileInput">
									<input
										type="file"
										id="fileInput"
										style={{display: 'none'}}
										onChange={handleFileChange}
										accept=".xlsx, .csv"
										disabled={isLocked}
									/>
								</label>
							</div>
						</div>
					)}
				</div>

				{fileSet && (
					<div className="container bg-light shadow-sm mt-4 p-4">
						<div className="row p-4">
							<div className="col-7">{filename}</div>
							<div className="col-5  d-flex justify-content-end">
								<button
									className="defaultBtn"
									onClick={handleUpload}
								>
									Upload
								</button>
							</div>
						</div>

						<div
							className="container"
							id="previewContainer"
							style={{
								width: '100%',
								height: '400px',
								overflowY: 'scroll', // Add this to enable scrolling if needed
							}}
						></div>
					</div>
				)}
			</div>
		</>
	);
};

export default CmEnrollment;
