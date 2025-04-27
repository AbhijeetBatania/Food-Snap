![github-submission-banner](https://github.com/user-attachments/assets/a1493b84-e4e2-456e-a791-ce35ee2bcf2f)

# 🚀 Project Title

FoodSnap: Scan Smart, Eat Healthy

---

## 📌 Problem Statement

Problem Statement 1 - Build a creative and interactive multimodal application powered by Groq, leveraging its capabilities to solve real-world problems with a focus on user experience and innovation.

---

## 🎯 Objective

FoodSnap solves the problem of quickly understanding the healthiness of packaged food products by simply scanning their barcode.
It serves health-conscious consumers, visually impaired individuals, parents concerned about children's nutrition, and busy shoppers who want instant food evaluations.

Real-world use case:
Today, food labels are filled with complex nutritional jargon and hidden unhealthy ingredients.
FoodSnap empowers users to instantly scan a product, fetch its official database information, and get an AI-powered summary highlighting its risks, dietary compatibility, and overall rating — making healthier choices simple and accessible.

Value it provides:

Saves time — no need to manually read confusing ingredient lists.

Improves health awareness — highlights hidden sugars, unhealthy fats, allergens.

Accessibility focused — plans for voice-based output for visually impaired users.

Encourages mindful eating — personalized alerts and dietary flags.

---

## 🧠 Team & Approach

### Team Name:  
Tech-a-Byte

### Team Members:  
- Abhijeet Batania (GitHub / LinkedIn / Role)  
- Akshay Jain  
- Amit Kumar  
- Avani Nagar

### Your Approach:  
Why you chose this problem:
Many users, especially visually impaired individuals or health-conscious consumers, find it difficult to understand and interpret food product information from labels. We wanted to create a solution that simplifies nutritional information and highlights important risks or benefits.

Key challenges you addressed:

Real-time barcode scanning using a simple camera feed without external apps.

Handling blurry or low-quality barcode images via upload.

Matching scanned products accurately from databases like OpenFoodFacts (both Indian and Global).

Summarizing nutritional risks (high sugar, unhealthy fats) and dietary compatibility (vegan, gluten-free) using AI processing (Groq).

Ensuring a smooth, mobile-friendly, beginner-optimized web experience.

Any pivots, brainstorms, or breakthroughs during hacking:
Initially planned to scan label + ingredient list via OCR, but pivoted to pure barcode scanning for speed and accuracy.
Brainstormed on fallback mechanisms (upload image when scan fails) and hybrid flow (database + Groq processing) to maximize accuracy.

---

## 🛠 Tech Stack

### Core Technologies Used:
Frontend: HTML5, CSS3, JavaScript (Vanilla), Html5-QRCode library

Backend: Node.js (used minimally for API testing), Groq API integration

Database: Firebase Firestore (for saving scanned data, if user logged in)

APIs: OpenFoodFacts API (Indian and Global), Groq API (for AI summarization)

Hosting: GitHub Pages / Firebase Hosting (optional)

### Sponsor Technologies Used (if any):
✅ Groq: Used for barcode image text extraction (OCR) and food data summarization (AI health insights)
---

## ✨ Key Features

✅ Instantly scan food barcodes via camera or upload an image.

✅ Fetch real product data from OpenFoodFacts database.

✅ Process and summarize food nutrition using Groq AI (ratings, good/bad ingredients, warnings).

✅ Audio summary for visually impaired users (text-to-speech planned).

✅ Smooth fallback option to upload barcode image if scan fails.

---

## 📽 Demo & Deliverables

- *Demo Video Link 1:* https://youtu.be/qAj5buV0k1M
- *Demo Video Link 2:* https://drive.google.com/file/d/1vZak4ypn4VxvfmeThXa1Y2WwgcunP61L/view?usp=sharing
- *Pitch Deck / PPT Link:* https://drive.google.com/file/d/1mXOn28OdXZ9itm3dgzbnMFHuwhYk2gmT/view?usp=sharing

---

## ✅ Tasks & Bonus Checklist

 ✅ All members of the team completed the mandatory task - Followed at least 2 of our social channels and filled the form

 ✅ All members of the team completed Bonus Task 1 - Sharing of Badges and filled the form (2 points)

 ✅ All members of the team completed Bonus Task 2 - Signing up for Sprint.dev and filled the form (3 points)

(Mark with ✅ if completed)

---

## 🧪 How to Run the Project

### Requirements:
- Node.js / Docker / etc.
- API Keys (if any)
- .env file setup (if needed)

### Local Setup:
bash
# Clone the repo
git clone https://github.com/AbhijeetBatania/Food-Snap.git

# Install dependencies
cd project-name
npm install

# Start development server
npm run dev


Provide any backend/frontend split or environment setup notes here.

---

## 🧬 Future Scope

List improvements, extensions, or follow-up features:

- 📈 More integrations  
- 🛡 Security enhancements  
- 🌐 Localization / broader accessibility  

---

## 📎 Resources / Credits

- APIs or datasets used  
- Open source libraries or tools referenced  
- Acknowledgements  

---

## 🏁 Final Words

Share your hackathon journey — challenges, learnings, fun moments, or shout-outs!

---
