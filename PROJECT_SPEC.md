# PaperPulse Backend Specification

PaperPulse is a MERN-stack Software as a Service (SaaS) platform built for Indian retailers, aiming to simplify their regulatory and statutory compliance obligations.

## 1. Goal
Provide a secure, robust, and scalable backend API to manage and automate the regulatory requirements—namely GST (Goods and Services Tax), FSSAI (Food Safety and Standards Authority of India), and MCA (Ministry of Corporate Affairs) compliance.

## 2. Tech Stack Setup
- **Node.js**: Asynchronous JavaScript runtime.
- **Express.js**: Fast, unopinionated, minimalist web framework for Node.js.
- **MongoDB & Mongoose**: NoSQL document database and elegant object modeling.
- **Authentication**: JWT (JSON Web Tokens) explicitly stored securely in `HttpOnly` cookies to mitigate XSS attacks.
- **Code Standards**: Managed centrally via ESLint and Prettier for maintaining consistent code styles and formatting.

## 3. Core Constraints & Academic Requirements
For this final-year academic submission:
- **Clean Architecture**: Adherence to standard Express/Node MVC-ish patterns, segregating concerns (Routes, Controllers, Services, Utilities).
- **Descriptive Documentation**: Robust and continuous JSDoc annotations exist above module functions to explain the inner logic, parameters, and intent of the developers.
- **No Direct Third-Party Integrations**: Live governmental APIs are abstracted. Mock utility modules currently supply synthetic responses mimicking real Indian Government API structural data formats.

## 4. Key Features
1. **Retailer Authentication & Identity Management**: Secure lifecycle management with JWT/Cookies.
2. **Dashboard Data Generation**: Compiling mocked data across GST, FSSAI, and MCA modules seamlessly.
3. **Mock Government APIs**:
   - `MockGST`: Returns synthetic filing data, active statuses, and liability tracking.
   - `MockFSSAI`: Exposes random vendor registration statuses, inspection dates, and license validity periods.
   - `MockMCA`: Provides pseudo company lifecycle data (incorporation specifics, director forms).
