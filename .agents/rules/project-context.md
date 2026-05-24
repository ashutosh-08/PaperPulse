---
description: PaperPulse backend architecture rules and context
---

# PaperPulse Backend - Project Context

## Project Overview
PaperPulse is a MERN-stack Software as a Service (SaaS) platform tailored for Indian retailers. Its primary objective is to manage statutory compliance such as Goods and Services Tax (GST), Food Safety and Standards Authority of India (FSSAI), and Ministry of Corporate Affairs (MCA) filings.

## Architecture & Constraints
1. **Tech Stack**:
   - Runtime: Node.js
   - Framework: Express.js
   - Database: MongoDB (using Mongoose ODM)
2. **Scope**:
   - The primary focus is completely on **Backend logic and API architecture**. No frontend code or assets belong in this repository.
3. **Coding Standards**:
   - Use ESLint and Prettier for code formatting.
   - Authentication must use JWTs explicitly stored in `HttpOnly` cookies.
4. **Documentation**:
   - As this is a final year submission project, high-quality documentation is critical.
   - All modules, controllers, and utility functions must include comprehensive JSDoc-style comments explaining their logic, parameters, and return types.
5. **External Services**:
   - Indian Government APIs (GST, FSSAI, MCA) are simulated using mock utility functions returning sample JSON. Live integration is not required at this stage.
