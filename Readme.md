
## Run the following commands to create the database and table
download xampp
start xampp
start mysql
start apache
open xampp/phpmyadmin

```
CREATE DATABASE blog_app;

USE blog_app;

CREATE TABLE blogs (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    author VARCHAR(255) NOT NULL,
    content LONGTEXT NOT NULL,
    image_url VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

## Backend setup
Go to the htdocs folder in xampp
Move the backend folder in the current directory ie. blog_CapMinds to the folder inside the htdocs.

## Frontend setup
```
cd frontend
npm install
npm run dev
```

Now you are ready to go to http://localhost:5173 and start creating blogs.
