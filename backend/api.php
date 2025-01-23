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
        $putData = fopen("php://input", "r");
        $rawData = stream_get_contents($putData);
        fclose($putData);
    
        // Decode JSON payload
        $data = json_decode($rawData, true);
        if (json_last_error() !== JSON_ERROR_NONE) {
            throw new Exception("Invalid JSON payload: " . json_last_error_msg());
        }
    
        $title = mysqli_real_escape_string($con, isset($data['title']) ? $data['title'] : '');
        $author = mysqli_real_escape_string($con, isset($data['author']) ? $data['author'] : '');
        $content = mysqli_real_escape_string($con, isset($data['content']) ? $data['content'] : '');
        $id = isset($_GET['id']) ? intval($_GET['id']) : 0;
    
        if ($id <= 0 || !$title || !$author || !$content) {
            throw new Exception("Missing required fields or invalid ID");
        }
    
        // Check if a new image is provided
        $imagePath = null;
        if (isset($data['image'])) {
            // Fetch the existing blog entry to get the old image path
            $query = "SELECT image_url FROM blogs WHERE id = $id";
            $result = mysqli_query($con, $query);
            
            if ($result && mysqli_num_rows($result) > 0) {
                $blog = mysqli_fetch_assoc($result);
                $oldImagePath = $blog['image_url'];
            } else {
                throw new Exception("Blog not found");
            }
    
            // Decode and save the new image
            $base64Image = $data['image'];
            $imageData = base64_decode($base64Image);
            if ($imageData === false) {
                throw new Exception("Invalid image data");
            }
    
            $uploadDir = __DIR__ . '/uploads/';
            if (!is_dir($uploadDir) && !mkdir($uploadDir, 0755, true)) {
                throw new Exception("Failed to create uploads directory");
            }
    
            $timestamp = time();
            $imageName = $timestamp . '.png';
            $uploadPath = $uploadDir . $imageName;
    
            if (file_put_contents($uploadPath, $imageData) === false) {
                throw new Exception("Failed to save image file");
            }
    
            $imagePath = 'uploads/' . $imageName;
    
            // Remove the old image if it exists
            if (file_exists($oldImagePath)) {
                unlink($oldImagePath);
            }
        }
    
        // Update the database record
        $query = "UPDATE blogs 
                    SET title = '$title', author = '$author', content = '$content', image_url = " .
                    ($imagePath ? "'$imagePath'" : "image_url") . " 
                    WHERE id = $id";
    
        if (!mysqli_query($con, $query)) {
            throw new Exception("Failed to update blog: " . mysqli_error($con));
        }
    
        echo json_encode(['message' => 'Blog updated successfully']);
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
