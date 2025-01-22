<?php
// Include the database connection
require_once 'index.php';

header("Access-Control-Allow-Origin: http://localhost:5173"); // Frontend origin
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS"); // Allow the methods
header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With"); // Allow these headers

// Handle OPTIONS request (preflight)
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    // Respond with status 200 and allow necessary headers and methods
    http_response_code(200);
    exit;
}

// Determine the request method (GET, POST, PUT, DELETE)
$method = $_SERVER['REQUEST_METHOD'];
$id = isset($_GET['id']) ? $_GET['id'] : null; // Get the ID from URL for GET, PUT, DELETE

switch ($method) {
    case 'GET':
        if ($id) {
            // Get a single blog by ID
            $query = "SELECT * FROM blogs WHERE id = $id";
            $result = mysqli_query($con, $query);
            
            if (mysqli_num_rows($result) > 0) {
                $blog = mysqli_fetch_assoc($result);
                echo json_encode($blog);
            } else {
                echo json_encode(['error' => 'Blog not found']);
            }
        } else {
            // Get all blogs
            $query = "SELECT * FROM blogs";
            $result = mysqli_query($con, $query);
            
            if (mysqli_num_rows($result) > 0) {
                $blogs = mysqli_fetch_all($result, MYSQLI_ASSOC);
                echo json_encode($blogs);
            } else {
                echo json_encode(['error' => 'No blogs found']);
            }
        }
        break;

    case 'POST':
        // Get the POST data
        
        $title = mysqli_real_escape_string($con, isset($_POST['title']) ? $_POST['title'] : '');
        $author = mysqli_real_escape_string($con, isset($_POST['author']) ? $_POST['author'] : '');
        $content = mysqli_real_escape_string($con, isset($_POST['content']) ? $_POST['content'] : '');        
        $image = isset($_FILES['image']) ? $_FILES['image'] : null;

        // Check if the required data is present
        if ($title && $author && $content) {
            // Check if an image was uploaded
            if ($image && $image['error'] === UPLOAD_ERR_OK) {
                // Define the upload folder
                $uploadDir = __DIR__ . '/uploads/';
                
                // Generate a new filename using the current timestamp
                $timestamp = time();  // Get the current timestamp
                $imageExtension = pathinfo($image['name'], PATHINFO_EXTENSION);  // Get the file extension
                $imageName = $timestamp . '.' . $imageExtension;  // New filename with timestamp

                // Define the full upload path
                $uploadPath = $uploadDir . $imageName;

                // Move the uploaded image to the uploads folder
                if (move_uploaded_file($image['tmp_name'], $uploadPath)) {
                    $imagePath = 'uploads/' . $imageName; // Relative path to store in the database
                } else {
                    echo json_encode(['error' => 'Failed to upload image']);
                    exit;
                }
            } else {
                $imagePath = null; // No image uploaded
            }

            // Insert data into the database
            $query = "INSERT INTO blogs (title, author, content, image_url) VALUES ('$title', '$author', '$content', '$imagePath')";
            
            if (mysqli_query($con, $query)) {
                echo json_encode(['message' => 'Blog created successfully']);
            } else {
                echo json_encode(['error' => 'Failed to create blog']);
            }
        } else {
            echo json_encode(['error' => 'Missing required fields']);
        }
        break;

    case 'PUT':
        // Get the ID from the query string
        parse_str(file_get_contents("php://input"), $_PUT);

        // Validate required fields
        $id = $_PUT['id'] ?? null;
        $title = $_PUT['title'] ?? null;
        $content = $_PUT['content'] ?? null;
        $author = $_PUT['author'] ?? null;
        $existingImage = $_PUT['existing_image'] ?? null;

        if (!$id || !$title || !$content || !$author) {
            echo json_encode(['message' => 'Please fill in all required fields']);
            exit;
        }

        // Prepare SQL query to update blog post
        $sql = "UPDATE blogs SET title=?, content=?, author=? WHERE id=?";
        $stmt = $conn->prepare($sql);
        $stmt->bind_param("sssi", $title, $content, $author, $id);

        if ($stmt->execute()) {
            // Handle image upload if a new image is provided
            if (isset($_FILES['image']) && $_FILES['image']['error'] === UPLOAD_ERR_OK) {
                $targetDir = "uploads/"; // Directory where images will be stored
                
                // Get the original file extension
                $fileName = basename($_FILES["image"]["name"]);
                $fileExtension = pathinfo($fileName, PATHINFO_EXTENSION);
                
                // Create a unique filename using the ID and original extension
                $newFileName = uniqid("blog_{$id}_") . '.' . $fileExtension;
                $targetFilePath = $targetDir . $newFileName;

                // Move uploaded file to target directory
                if (move_uploaded_file($_FILES["image"]["tmp_name"], $targetFilePath)) {
                    // Update the image path in the database if upload was successful
                    $sqlUpdateImage = "UPDATE blogs SET image=? WHERE id=?";
                    $stmtUpdateImage = $conn->prepare($sqlUpdateImage);
                    $stmtUpdateImage->bind_param("si", $newFileName, $id);
                    $stmtUpdateImage->execute();
                } else {
                    echo json_encode(['message' => 'Failed to upload new image']);
                    exit;
                }
            }

            echo json_encode(['message' => 'Blog updated successfully']);
        } else {
            echo json_encode(['message' => 'Error updating blog']);
        }
        break;

    case 'DELETE':
        if ($id) {
            // Delete the blog post
            $query = "DELETE FROM blogs WHERE id = $id";
            
            if (mysqli_query($con, $query)) {
                echo json_encode(['message' => 'Blog deleted successfully']);
            } else {
                echo json_encode(['error' => 'Failed to delete blog']);
            }
        } else {
            echo json_encode(['error' => 'Invalid ID']);
        }
        break;

    default:
        echo json_encode(['error' => 'Method not allowed']);
        break;
}
?>
