# Restaurant Blog

## Description
Restaurant Blog is a full-stack web application where users can share their dining experiences, post reviews, and explore restaurants. The platform allows users to create, edit, and delete reviews, manage restaurant listings, and interact with other users' content. It is built with a React frontend and a Node.js/Express backend, using Sequelize for database management.

Here is the host link: https://restuarant-2n3m.onrender.com

## Features
- **User Authentication**: Secure signup, login, and logout functionality.
- **Restaurant Management**: Users can create, edit, and delete restaurant listings.
- **Review System**: Users can post, edit, and delete reviews for restaurants, with a star rating system.
- **Image Uploads**: Add images to restaurants and reviews.
- **Responsive Design**: Optimized for both desktop and mobile devices.

## Technologies Used
### Frontend
- React
- Redux
- Vite
- CSS Modules

### Backend
- Node.js
- Express.js
- Sequelize (PostgreSQL)

### Other Tools
- CSRF Protection
- bcrypt for password hashing
- Redux Thunk for asynchronous state management

## Project Structure
restaurant/ ├── backend/ │ ├── app.js │ ├── routes/ │ │ ├── api/ │ │ │ ├── spots.js │ │ │ ├── reviews.js │ │ │ ├── bookings.js │ ├── db/ │ │ ├── models/ │ │ ├── migrations/ │ │ ├── seeders/ ├── frontend/ │ ├── src/ │ │ ├── components/ │ │ ├── context/ │ │ ├── store/ │ │ ├── App.jsx │ │ ├── main.jsx ├── .gitignore ├── package.json ├── README.md



## Installation
1. Clone the repository:
   ```bash
   git clone https://github.com/your-repo/restaurant-blog.git
   ```

2. Navigate to the project directory:

```bash
   cd restaurant-blog
```

3. Install dependencies for both frontend and backend:
   ```bash
   cd backend && npm install
   cd ../frontend && npm install
   ```

## Setup

1. Run database migrations and seeders:
   ```bash
   cd backend
   npx sequelize-cli db:migrate
   npx sequelize-cli db:seed:all
   ```
2. Start the backend server:
   ```bash
   npm start
   ```
3. Start the frontend development server:
   ```bash
   cd ../frontend
   npm run dev
   ```

## License
This project is licensed under the MIT License.

## Acknowledgments
Inspired by platforms like Yelp and TripAdvisor.
Built with love and passion for food and technology.
