# File Metadata Microservice

A modern, secure file upload service that analyzes and displays file metadata. Built as part of the [freeCodeCamp Back End Development and APIs Certification](https://www.freecodecamp.org/learn/back-end-development-and-apis/).

![File Metadata Microservice](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)
![Express.js](https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)

## Features

- 📤 **Drag & Drop Upload** - Intuitive file upload with visual feedback
- 🔍 **Metadata Analysis** - Displays file name, type, and size (in bytes and MB)
- 🖼️ **Image Preview** - Automatic thumbnail generation for uploaded images
- 📜 **Upload History** - Track all previously uploaded files with timestamps
- 🗑️ **File Management** - View and delete uploaded files with confirmation modals
- 🔒 **Security First** - File type validation and size limits to prevent malicious uploads
- 📱 **Responsive Design** - Works seamlessly on desktop, tablet, and mobile
- 🎨 **Modern UI** - Dark theme with smooth animations and loading states

## Technologies Used

- **Backend:** Node.js, Express.js
- **File Handling:** Multer
- **Frontend:** Vanilla JavaScript, HTML5, CSS3
- **Styling:** Custom CSS with modern dark theme
- **Security:** Client-side and server-side file validation

## Prerequisites

Before running this project, make sure you have:

- [Node.js](https://nodejs.org/) (v14 or higher)
- npm (comes with Node.js)

## Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/file-metadata-microservice.git
   cd file-metadata-microservice
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Create required directories**
   ```bash
   mkdir uploads
   mkdir views
   mkdir public
   ```

4. **Set up environment variables** (optional)
   ```bash
   echo "PORT=3000" > .env
   ```

5. **Start the server**
   ```bash
   npm start
   ```

6. **Open your browser**
   ```
   http://localhost:3000
   ```

## Project Structure

```
file-metadata-microservice/
├── index.js                 # Main server file
├── package.json            # Dependencies and scripts
├── .env                    # Environment variables (optional)
├── views/
│   └── index.html         # Frontend HTML
├── public/
│   └── style.css          # Styles
└── uploads/               # Uploaded files storage (auto-created)
```

## Security Features

This project implements multiple layers of security:

### File Type Restrictions
Blocks dangerous file types including:
- Executables (`.exe`, `.bat`, `.sh`, `.app`, `.dmg`, `.apk`)
- Scripts (`.vbs`, `.ps1`, `.php`, `.asp`, `.jsp`)
- System files (`.dll`, `.sys`, `.reg`)
- HTML files (`.html`, `.htm`)

### Size Limits
- Maximum file size: **10 MB**
- Client-side validation for instant feedback
- Server-side validation as backup

### Safe File Types
Allows common, safe file types:
- 🖼️ Images (`.jpg`, `.png`, `.gif`, `.svg`, `.webp`)
- 📄 Documents (`.pdf`, `.docx`, `.xlsx`, `.pptx`, `.txt`)
- 🎵 Media (`.mp3`, `.mp4`, `.avi`, `.mov`)
- 🗜️ Archives (`.zip`, `.rar`, `.tar`, `.gz`)
- 📊 Data files (`.csv`, `.json`, `.xml`)

## API Endpoints

### POST `/api/fileanalyse`
Upload a file and receive its metadata.

**Request:**
- Method: `POST`
- Content-Type: `multipart/form-data`
- Body: File with field name `upfile`

**Response:**
```json
{
  "name": "example.jpg",
  "type": "image/jpeg",
  "size": "245678 bytes (0.23 MB)"
}
```

### GET `/api/history`
Retrieve upload history.

**Response:**
```json
[
  {
    "name": "example.jpg",
    "type": "image/jpeg",
    "size": "245678 bytes (0.23 MB)",
    "filename": "a1b2c3d4e5f6",
    "uploadedAt": "2025-10-14T12:30:45.123Z",
    "path": "/uploads/a1b2c3d4e5f6"
  }
]
```

### DELETE `/api/delete/:filename`
Delete an uploaded file.

**Parameters:**
- `filename`: Internal filename of the file to delete

**Response:**
```json
{
  "success": true,
  "deleted": "a1b2c3d4e5f6"
}
```

## UI Features

- **Drag & Drop:** Drag files directly onto the upload area
- **Visual Feedback:** Pulsing glow effect when dragging files over the drop zone
- **Loading Animation:** Spinner displays during file upload
- **Image Thumbnails:** 50x50px previews in upload history
- **File Type Icons:** Emoji icons for different file types (videos, documents, etc.)
- **Modal Dialogs:** Confirmation for deletions, user-friendly error messages
- **Smooth Animations:** Slide-in effects and hover states throughout

## Error Handling

The application handles various error scenarios:

- **File too large:** Shows file size and 10 MB limit
- **Blocked file type:** Explains which extensions are not allowed
- **Upload failure:** Displays network or server errors
- **Delete failure:** Notifies if file doesn't exist
- **No file selected:** Disables upload button with tooltip

## Configuration

### Environment Variables

Create a `.env` file in the root directory:

```env
PORT=3000
```

### Customization

**Change file size limit:**
```javascript
// In index.js
fileSize: 20 * 1024 * 1024 // Change to 20MB
```

**Modify blocked extensions:**
```javascript
// In index.js fileFilter function
const dangerousExtensions = ['.exe', '.bat', /* add more */];
```

**Adjust history limit:**
```javascript
// In index.js POST /api/fileanalyse
if (metadataHistory.length > 100) { // Change from 50 to 100
```

## License

This project is open source and available under the [MIT License](LICENSE).

## Acknowledgments

- [freeCodeCamp](https://www.freecodecamp.org/) for the project requirements
- [Express.js](https://expressjs.com/) for the web framework
- [Multer](https://github.com/expressjs/multer) for file upload handling
