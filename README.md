# Authentication System

Note: Commit history is lost as the original repository was located in a third-party private organization.

This repository presents a highly scalable and secure solution for implementing an authentication system for financial institutions.

## Tech Stack

-   React + TypeScript
-   Sass
-   AWS (S3, Cognito, CloudFront, Lambda, Route 53, WAF, API Gateway)

## Project Setup

### Download project repository to your local directory:

```
git clone <git_repo_link>
```

### Open your terminal in the local project `client folder`, and execute:

```
npm install
```

### Project Environment Variables

This project requires the following environment variables to be set in a `.env` file in order to function properly.

#### VITE_CLIENT_ID

```
VITE_CLIENT_ID=<client_id>
```

#### VITE_CLIENT_SECRET

```
VITE_CLIENT_SECRET=<client_secret>
```

#### VITE_AWS_USER_POOL_ID

```
VITE_AWS_USER_POOL_ID=<region>_<poolID>
```

#### VITE_AWS_CLIENT_ID

```
VITE_AWS_CLIENT_ID=<aws_client_id>
```

#### BANK CONFIG

POSB

```
VITE_BANK_NAME=POSB
VITE_APP_TITLE=POSB digibank online | POSB Singapore
VITE_APP_ICON=/posb-tab-icon.png
```

OCBC

```
VITE_BANK_NAME=OCBC
VITE_APP_TITLE=OCBC Bank Singapore - Personal Banking, Business Banking, Wealth Management
VITE_APP_ICON=/ocbc-tab-icon.png
```

### Run the app in development mode

```
npm run dev
```

Open http://localhost:5173 to view it in your browser.
The page will reload when you make changes.
You may also see any lint errors in the console.

### Login Credentials

To register for a `super_admin` account use `elouh@smu.edu.sg` with the birthdate `11/11/2011`
To register for a `user` account use `vitto.tedja2332@gmail.com` with the birthdate `14/12/2001` or register users by uploading their data in our app.

### Build the app for production

```
npm run build
```

Builds the app for production to the build folder.
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.
Your app is ready to be deployed!

## Lambda Functions

The code used for the AWS Lambda functions can be found in the `lambda` folder

## Solution Architecture

![photo_2023-11-13 15 34 59](https://github.com/cs301-itsa/project-2023-24t1-project-2023-24t1-g2-t4/assets/86020207/1bacb086-a026-468d-856b-64082bd58b84)
![photo_2023-11-13 15 35 02](https://github.com/cs301-itsa/project-2023-24t1-project-2023-24t1-g2-t4/assets/86020207/941e5538-3bc3-4cf3-8a7a-d542ac700b4c)
![photo_2023-11-13 15 35 04](https://github.com/cs301-itsa/project-2023-24t1-project-2023-24t1-g2-t4/assets/86020207/607d1768-7f86-45eb-bc2b-29fb0e81d00b)
![photo_2023-11-13 15 35 07](https://github.com/cs301-itsa/project-2023-24t1-project-2023-24t1-g2-t4/assets/86020207/11d8d59f-1121-4291-9e70-0a7cba2f73e3)
![photo_2023-11-13 15 35 09](https://github.com/cs301-itsa/project-2023-24t1-project-2023-24t1-g2-t4/assets/86020207/a21c77fb-563d-425e-b6eb-201066492db4)

## Screenshots
Disclaimer: Prototype screenshots only, not for commercial use
![Screenshot 2023-12-04 at 12 58 24 AM](https://github.com/xavierkoo/authentication-system/assets/86020207/73b3c4f7-84ee-468a-9405-f220c85a9ad0)
![Screenshot 2023-12-04 at 1 01 39 AM](https://github.com/xavierkoo/authentication-system/assets/86020207/914b63a1-8cc4-4ebf-bc60-72ab23ab5511)
![Screenshot 2023-12-04 at 1 01 54 AM](https://github.com/xavierkoo/authentication-system/assets/86020207/e87c6c82-0d97-46fe-8357-bea43d294f13)
![Screenshot 2023-12-04 at 1 02 40 AM](https://github.com/xavierkoo/authentication-system/assets/86020207/6d3b87aa-e713-4f15-9482-0baa8da9362e)
![Screenshot 2023-12-04 at 1 02 22 AM](https://github.com/xavierkoo/authentication-system/assets/86020207/c3d8a920-86aa-488e-afaa-3ff763c25e4b)

## Contributors
- [Xavier Koo](https://github.com/xavierkoo)
- [Aaron Kwah](https://github.com/A2ron-k)
- [Ray Quek](https://github.com/rayquekCW)
- [Maurice Ho](https://github.com/HZKmaurice)
- [Agrawal Sharad](https://github.com/Sharad-Agrawal)
- [Vitto](https://github.com/vittotedja)
- [Dennis Hardianto](https://github.com/DennisH18)
