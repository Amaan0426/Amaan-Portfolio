# Amaan F. Khatib — Portfolio Website

A premium full-stack developer & AI/ML engineer portfolio built with React (Vite) and Tailwind CSS, featuring smooth GSAP and WebGL (Three.js) neural-net background effects under the "Pirate Voyage" design language.

---

## Getting Started

### Prerequisites
Make sure you have Node.js (version 18 or above) installed.

### Setup Instructions

1. **Clone the Repository** and open the project directory.
2. **Install Dependencies**:
   ```bash
   npm install
   ```
3. **Environment Settings**:
   - Copy the `.env.example` file and rename it to `.env`:
     ```bash
     cp .env.example .env
     ```
   - Complete the keys inside `.env` to configure Formspree (see the section below).
4. **Place Your Resume**:
   - Place your PDF resume file named `Amaan_Khatib_Resume.pdf` in the `/public` directory so it resolves to `/Amaan_Khatib_Resume.pdf`.
5. **Run Locally**:
   ```bash
   npm run dev
   ```
6. **Compile Build Bundle**:
   ```bash
   npm run build
   ```

---

## Setting Up Formspree (For Contact Form)

To make the contact form functional, follow these steps to register for a free Formspree account:

1. **Create an Account**:
   - Go to [Formspree](https://formspree.io) and register for a free account.
2. **Create a New Form**:
   - In the Formspree dashboard, click **New Form**.
   - Enter a name for your form (e.g., "Contact Form").
   - Set the recipient email to `amaanfkhatib@gmail.com` where you want to receive form responses.
   - Click **Create Form**.
3. **Retrieve Your Form ID**:
   - Once created, go to the **Integration** or **Settings** tab.
   - Look at the Target Endpoint URL, which looks like: `https://formspree.io/f/your_form_id`
   - Copy the last 8-character segment (your Form ID, e.g. `maqgnnvk`).
4. **Configure Your Environment**:
   - Open your `.env` file in the root of the project.
   - Set `VITE_FORMSPREE_FORM_ID` to your copied Form ID:
     ```env
     VITE_FORMSPREE_FORM_ID=your_form_id_here
     ```
5. **Restart Server**:
   - Restart your local Vite development server to load the new environment variables.
