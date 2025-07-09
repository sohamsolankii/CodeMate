# CodeMate APIs

## authRouter
- POST /signup
- POST /login
- POST /logout

## profileRouter
- GET /profile/view
- PATCH /profile/edit
- PATCH /profile/password // Forgot password API

## connectionRequestRouter
- POST /request/send/:status/:userId 	// ignored, interested
- POST /request/review/:status/:requestId	// accepted, rejected

## userRouter
- GET /user/requests/received
- GET /user/connections
- GET /user/feed - Gets you the profiles of other users on platform


Status: ignored, interested, accepeted, rejected

NOTES:

/feed?page=1&limit=10 => 1-10 => .skip(0) & .limit(10)

/feed?page=2&limit=10 => 11-20 => .skip(10) & .limit(10)

/feed?page=3&limit=10 => 21-30 => .skip(20) & .limit(10)

/feed?page=4&limit=10 => 31-40 => .skip(30) & .limit(10)

skip = (page-1)*limit;



{
    "message": "User Added successfully!",
    "data": {
        "firstName": "Soham",
        "lastName": "Solanki",
        "emailId": "soham@gmail.com",
        "password": "$2b$10$3gey32qv8t4acCyDYeja6eMrMFtM71P0WO2KCy2JEStJQ0dfY3hse",
        "isPremium": false,
        "photoUrl": "https://geographyandyou.com/images/user-profile.png",
        "about": "This is a default about of the user!",
        "skills": [],
        "_id": "686e2cec7388dd0f7557cdcd",
        "createdAt": "2025-07-09T08:48:44.605Z",
        "updatedAt": "2025-07-09T08:48:44.605Z",
        "__v": 0
    }
}