# Connectsy

## Problem

Finding a reliable coding partner for hackathons, coding competitions, or open-source projects can be time-consuming and challenging. Searching for the right person and managing communication can often lead to disjointed and ineffective collaboration.

## Solution

Connectsy is a full-stack web application that designed to help programmers to find and connect with the perfect coding partners.
Whether you're looking to team up for a hackathon, coding competition, or open-source project, Connectsy makes collaboration easy with a intuitive left and right swipe interface. Once matched, they can engage in real-time chat, share and discuss code via a collaborative canvas and streamline their development workflow—all in one place.


## Features

### Client-Side (Frontend)

- **User Authentication and Authorization**: Secure authentication and authorization mechanisms to ensure privacy and access control.
- **Real-Time Messaging**: Instant communication through live updates and notifications powered by `Socket.io-client`.
- **Adaptable Interface**: Intuitive design that allows users to swipe left or right to connect with other members.
- **Collaborative Canvas**: A real-time workspace for discussing ideas, sharing notes, and collaborating on code.
- **Responsive UI**: Built with `Tailwind CSS` and `DaisyUI` for an optimal experience across different devices.
- **Premium Membership**: Access to additional features like viewing other users' email IDs and a verified blue tick.
- **State Management**: Effective state management using `Redux` for a smooth and consistent user experience.

### Server-Side (Backend)

- **Database Connection**: Connects to MongoDB using `Mongoose` for secure and scalable data management.
- **API Endpoints**: RESTful API for handling users, profiles, chats, and other data.
- **Real-Time Communication**: Powered by `Socket.io` for real-time messaging.
- **Secure Payment Integration**: Seamless payment integration through the `Razorpay` payment gateway for secure transactions.
- **Scheduled Notifications**: Cron jobs for sending daily alerts and regular notifications.
- **Custom Page Display**: Implements pagination to display custom data pages from the database for enhanced performance and user experience.

## Tech Stack

- **Frontend**: `React`, `JavaScript`, `Vite`, `Redux`, `Tailwind CSS`, `DaisyUI`, `Socket.io-client`
- **Backend**: `Node.js`, `Express`, `Mongoose`, `Socket.io`
- **Database**: `MongoDB`

## Contributing

Contributions are welcome🤝! Please open an issue or submit a pull request.
