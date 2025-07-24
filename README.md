
![Logo](/frontend/public/logo.png)

# About the project

LeafMiles is a modern web application designed to help users discover and review sustainable restaurants. With features like top sustainable restaurant recommendations, a search interface, detailed reviews with categorized sustainability tags (e.g., Sourcing, Menu, Waste, Energy), and image uploads, LeafMiles empowers sustainability-conscious consumers to make informed dining choices.

Beyond reviews, LeafMiles introduces a unique reward system: you can collect points through various sustainability-related activities and use them to water a virtual tree. Once your tree is fully grown, you’ll receive a real farm product delivered to your door, turning your sustainable actions into meaningful rewards.

**LeafMiles — from action to leaf.**


## Features

- **Top Sustainable Restaurant Recommendations**  
  Discover highly rated eco-conscious restaurants curated for sustainability.

- **Search Interface**  
  Easily find restaurants based on name.

- **Detailed Reviews with Sustainability Tags**  
  Tag reviews by categories such as *Sourcing*, *Menu*, *Waste*, and *Energy* for structured sustainability insights.

- **Image Uploads**  
  Share photos of dishes, restaurant ambiance, and sustainability practices in the review.

- **Points-Based Reward System**  
  Earn points by writing reviews, daily check in, and engaging in sustainable actions.

- **Virtual Tree Growth**  
  Use earned points to water a virtual tree and track your progress.

- **Farm Product Delivery**  
  Receive a real farm product at your doorstep once your virtual tree fully grows.

- **Leaderboard**  
  See how others are nurturing their trees — track progress daily, weekly, and all-time.

- **Adorable Predefined Avatars**  
  Personalize your profile with a charming selection of cute, ready-to-use avatars.

- **User Authentication**  
  Secure user accounts to personalize experiences and track contributions.



## Tech Stack

**Client:**  
- **Next.js** – React framework for server-side rendering and routing  
- **React** – UI library for building interactive user interfaces  
- **Tailwind CSS** – CSS framework for UI development  
- **Shadcn/UI** – Accessible and customizable component library built on Radix UI and Tailwind  

**Server:**  
- **FastAPI** – Modern web framework for building APIs with Python  
- **PostgreSQL** – Relational database used to store structured data such as users, reviews, and restaurant information
- **Supabase Storage** – Scalable object storage for handling user-uploaded content (e.g., review images)




## Environment Variables

To run this project, you will need to set up the following environment variables.


### Frontend: `frontend/.env.local`

| Variable | Description |
|----------|-------------|
| `NEXT_PUBLIC_API_BASE_URL` | The base URL of the backend API used by the frontend (e.g. `http://localhost:8000`) |


### Backend: `backend/.env`

| Variable | Description |
|----------|-------------|
| `DATABASE_URL` | Full connection string for the PostgreSQL database.Must use the `postgresql+asyncpg` dialect (e.g. `postgresql+asyncpg://user:password@host:port/database`)|
| `SECRET_KEY` | Secret key used to sign JWT tokens|
| `ALGORITHM` | JWT signing algorithm (e.g. `HS256`) |
| `ACCESS_TOKEN_EXPIRE_MINUTES` | Duration in minutes before access tokens expire (e.g. `30`) |
| `FRONTEND_URL` | The URL of your frontend application (used for CORS and redirects) |
| `SUPABASE_URL` | Supabase project URL used for image storage |
| `SUPABASE_KEY` | Supabase service key or anon key |



## Run Locally

You can run the project locally in two ways: **standard (manual)** or **Docker-based**.

---

### Option 1: Run Locally (Manual Setup)

#### 1. Clone the Repository

```bash
git clone https://github.com/projects-in-RS-SS25/Team-A2.git
cd Team-A2
```

#### 2. Set Up Environment Variables
Create the following files and add the required environment variables
(see Environment Variables):
- frontend/.env.local
- backend/.env

#### 3. Start the Backend
```bash
cd backend
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

pip install -r requirements.txt
python run.py
```
#### 4. Start the Frontend
```bash
cd ../frontend
npm install
npm run dev
```

#### Access the App
Frontend: http://localhost:3000

Backend: http://localhost:8000/docs

---

### Option 2: Run with Docker
Make sure Docker is installed and running on your system.

#### 1. Clone the Repository
See option 1
#### 2. Set Up Environment Variables
See option 1

#### 3. Build and Run Backend

```bash
cd backend

docker build -t leafmiles-backend .

docker run -p 8000:8000 --env-file .env leafmiles-backend
```
This exposes the backend on http://localhost:8000

#### 4. Build and Run Frontend
```bash
cd ../frontend

docker build -t leafmiles-frontend .

docker run -p 3000:3000 --env-file .env.local leafmiles-frontend
```
This exposes the frontend on http://localhost:3000