# ☁️ Vault Cloud: Secure File Sharing Service

![Status: Complete](https://img.shields.io/badge/Status-Complete-green.svg)
[![Tech Stack](https://img.shields.io/badge/AWS-S3-orange.svg)](https://aws.amazon.com/s3/)
[![Tech Stack](https://img.shields.io/badge/Backend-Node.js-green.svg)](https://nodejs.org/en)
[![Tech Stack](https://img.shields.io/badge/Language-JavaScript-yellow.svg)](https://developer.mozilla.org/en-US/docs/Web/JavaScript)

## 1. Project Goal & Problem Statement

This project developed a robust, secure, and easy-to-use cloud-based file sharing and storage platform. The core goal was to implement strong security measures to protect shared data, moving beyond typical link-based sharing by enforcing encryption and access controls.

## 2. Solution and Key Security Features

Vault Cloud is a full-stack solution focusing on data security and controlled access:

* **AWS S3 Integration:** Files are stored securely using **AWS Simple Storage Service (S3)**, leveraging its industry-leading scalability and durability for data persistence.
* **Password-Protected Sharing:** Implemented file-specific, one-time passwords for accessing shared files. Users must enter the correct password before the file download link is generated.
* **Secure Data Encryption:** Utilized JavaScript and Node.js to ensure secure data handling, including encryption-at-rest for sensitive files.
* **Modular Backend API:** Developed an API using **Node.js** to manage file uploads, link generation, and password validation processes.

## 3. Technology Stack

* **Cloud Service:** AWS S3
* **Backend Runtime:** Node.js
* **Programming Language:** JavaScript
* **Dependencies:** (List key NPM packages here, e.g., `express`, `aws-sdk`)

## 4. Setup and Deployment

1.  **AWS Configuration:** Requires setting up an AWS S3 bucket and configuring the appropriate IAM credentials for the Node.js application to access the bucket.
2.  **Clone the Repository:**
    ```bash
    git clone [https://github.com/Harsh24102/Vault_cloud.git](https://github.com/Harsh24102/Vault_cloud.git)
    ```
3.  **Install Dependencies:**
    ```bash
    npm install
    ```
4.  **Run the Server:** Start the Node.js backend server.
    ```bash
    node server.js 
    ```
