"""
ADHD Productivity App - Prescription Upload Backend
Flask application with Gemini AI integration
Multi-service ready initialization
No werkzeug dependency
"""

import os
import logging
from datetime import datetime
from pathlib import Path
import re

from flask import Flask, request, jsonify
from flask_cors import CORS

# Import all services
from services.prescriptionUploadService import PrescriptionService
from services.taskBreakerService import TaskBreakerService

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

# Create Flask app
app = Flask(__name__)
CORS(app)

# Configuration
app.config['MAX_CONTENT_LENGTH'] = 10 * 1024 * 1024  # 10MB
app.config['JSON_SORT_KEYS'] = False

ALLOWED_EXTENSIONS = {'txt', 'pdf', 'png', 'jpg', 'jpeg'}


# ============================================================================
# HELPER FUNCTIONS
# ============================================================================

def secure_filename(filename: str) -> str:
    """
    Make filename safe for filesystem
    Remove special characters and path traversal attempts
    """
    # Remove path separators and special characters
    filename = re.sub(r'[^\w\s.-]', '', filename)
    # Remove leading dots and slashes
    filename = re.sub(r'^[./\\]+', '', filename)
    # Replace spaces with underscores
    filename = filename.replace(' ', '_')
    # Limit length
    filename = filename[:255]
    return filename if filename else 'file'


def allowed_file(filename: str) -> bool:
    """Check if file extension is allowed"""
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS


def get_service(service_name: str):
    """Get service and check if available"""
    service = services.get(service_name)
    if not service:
        return None, (jsonify({
            "status": "error",
            "message": f"{service_name} service not available"
        }), 503)
    return service, None


# ============================================================================
# INITIALIZE SERVICES
# ============================================================================

def initialize_services():
    """Initialize all services and log status"""
    services = {}
    
    # Initialize prescription service
    try:
        services['prescription'] = PrescriptionService()
        logger.info("✓ PrescriptionService initialized")
    except ValueError as e:
        logger.error(f"✗ PrescriptionService failed: {e}")
        services['prescription'] = None
    except Exception as e:
        logger.error(f"✗ PrescriptionService unexpected error: {e}")
        services['prescription'] = None
    
    # Initialize task breaker service
    try:
        services['task_breaker'] = TaskBreakerService()
        logger.info("✓ TaskBreakerService initialized")
    except ValueError as e:
        logger.error(f"✗ TaskBreakerService failed: {e}")
        services['task_breaker'] = None
    except Exception as e:
        logger.error(f"✗ TaskBreakerService unexpected error: {e}")
        services['task_breaker'] = None
    
    # Add more services here as needed
    # try:
    #     services['focus'] = FocusService()
    #     logger.info("✓ FocusService initialized")
    # except Exception as e:
    #     logger.error(f"✗ FocusService failed: {e}")
    #     services['focus'] = None
    
    # try:
    #     services['task'] = TaskService()
    #     logger.info("✓ TaskService initialized")
    # except Exception as e:
    #     logger.error(f"✗ TaskService failed: {e}")
    #     services['task'] = None
    
    return services


# Initialize all services once at startup
services = initialize_services()


# ============================================================================
# API ENDPOINTS - PRESCRIPTION UPLOAD
# ============================================================================

@app.route('/api/prescription/upload-text', methods=['POST'])
def upload_text():
    """
    Upload prescription as plain text
    
    Request:
        {
            "prescription_text": "Adderall XR 20mg daily",
            "user_id": "user_123" (optional)
        }
    
    Response:
        {
            "status": "success",
            "user_id": "user_123",
            "analysis": {...},
            "timestamp": "2024-03-07T..."
        }
    """
    service, error = get_service('prescription')
    if error:
        return error

    try:
        data = request.get_json()

        if not data or 'prescription_text' not in data:
            return jsonify({
                "status": "error",
                "message": "Missing 'prescription_text' in request"
            }), 400

        text = data['prescription_text'].strip()
        user_id = data.get('user_id', f"user_{datetime.now().timestamp()}")

        if not text:
            return jsonify({
                "status": "error",
                "message": "Prescription text cannot be empty"
            }), 400

        logger.info(f"Processing text prescription for user: {user_id}")

        # Analyze with Gemini
        analysis = service.analyze_text(text)

        # Save prescription
        service.save_prescription(user_id, analysis)

        return jsonify({
            "status": "success",
            "user_id": user_id,
            "analysis": analysis,
            "timestamp": datetime.now().isoformat()
        }), 201

    except Exception as e:
        logger.error(f"Error uploading text: {e}")
        return jsonify({
            "status": "error",
            "message": str(e)
        }), 500


@app.route('/api/prescription/upload-file', methods=['POST'])
def upload_file():
    """
    Upload prescription file (PDF, image, or text)
    
    Form Data:
        file: Binary file (PDF, JPG, PNG, TXT)
        user_id: (optional) User identifier
    
    Response:
        {
            "status": "success",
            "user_id": "user_123",
            "filename": "prescription.pdf",
            "analysis": {...},
            "timestamp": "2024-03-07T..."
        }
    """
    service, error = get_service('prescription')
    if error:
        return error

    try:
        # Check file presence
        if 'file' not in request.files:
            return jsonify({
                "status": "error",
                "message": "No file provided. Use 'file' form field"
            }), 400

        file = request.files['file']

        if file.filename == '':
            return jsonify({
                "status": "error",
                "message": "No file selected"
            }), 400

        # Validate file type
        if not allowed_file(file.filename):
            return jsonify({
                "status": "error",
                "message": f"File type not allowed. Allowed: {', '.join(ALLOWED_EXTENSIONS)}"
            }), 400

        # Save file temporarily with secure filename
        filename = secure_filename(file.filename)
        filepath = service.upload_dir / filename
        file.save(filepath)

        logger.info(f"File uploaded: {filename}")

        # Extract text from file
        file_ext = filename.rsplit('.', 1)[1].lower()
        try:
            text = service.extract_text_from_file(str(filepath), file_ext)
        except Exception as e:
            logger.error(f"File extraction failed: {e}")
            return jsonify({
                "status": "error",
                "message": f"Failed to extract text from file: {str(e)}"
            }), 400

        user_id = request.form.get('user_id', f"user_{datetime.now().timestamp()}")

        logger.info(f"Processing file prescription for user: {user_id}")

        # Analyze with Gemini
        analysis = service.analyze_text(text)

        # Save prescription
        service.save_prescription(user_id, analysis)

        return jsonify({
            "status": "success",
            "user_id": user_id,
            "filename": filename,
            "analysis": analysis,
            "timestamp": datetime.now().isoformat()
        }), 201

    except Exception as e:
        logger.error(f"Error uploading file: {e}")
        return jsonify({
            "status": "error",
            "message": str(e)
        }), 500


@app.route('/api/prescription/<user_id>', methods=['GET'])
def get_prescription(user_id: str):
    """
    Retrieve user's prescription
    
    Response:
        {
            "status": "success",
            "prescription": {...}
        }
    """
    service, error = get_service('prescription')
    if error:
        return error

    try:
        prescription = service.get_prescription(user_id)

        if not prescription:
            return jsonify({
                "status": "error",
                "message": "No prescription found for this user"
            }), 404

        return jsonify({
            "status": "success",
            "prescription": prescription
        }), 200

    except Exception as e:
        logger.error(f"Error retrieving prescription: {e}")
        return jsonify({
            "status": "error",
            "message": str(e)
        }), 500


# ============================================================================
# API ENDPOINTS - TASK BREAKING
# ============================================================================

@app.route('/api/task/break', methods=['POST'])
def break_task():
    """
    Break a goal into manageable subtasks using AI
    
    Request:
        {
            "goal": "Clean my chaotic kitchen",
            "prescription_info": "User is on 20mg Adderall; needs high-dopamine, very short bursts of activity." (optional)
        }
    
    Response:
        {
            "status": "success",
            "result": {
                "goal": "Clean my chaotic kitchen",
                "subtasks": [...],
                "total_points": 100,
                "estimated_total_time": "45-75 minutes"
            },
            "timestamp": "2024-03-07T..."
        }
    """
    service, error = get_service('task_breaker')
    if error:
        return error

    try:
        data = request.get_json()

        if not data or 'goal' not in data:
            return jsonify({
                "status": "error",
                "message": "Missing 'goal' in request"
            }), 400

        goal = data['goal'].strip()
        prescription_info = data.get('prescription_info', "Needs high-stimulation, 10-15 min bursts")

        if not goal:
            return jsonify({
                "status": "error",
                "message": "Goal cannot be empty"
            }), 400

        logger.info(f"Breaking task: {goal[:50]}...")

        # Break the goal into tasks
        result = service.break_goal_into_tasks(goal, prescription_info)

        return jsonify({
            "status": "success",
            "result": result,
            "timestamp": datetime.now().isoformat()
        }), 200

    except Exception as e:
        logger.error(f"Error breaking task: {e}")
        return jsonify({
            "status": "error",
            "message": str(e)
        }), 500


# ============================================================================
# HEALTH CHECK ENDPOINT
# ============================================================================

@app.route("/", methods=["GET"])
def home():
    return jsonify({
        "service": "cmd-f Project",
        "status": "running",
        "timestamp": datetime.now().isoformat()
    })


# ============================================================================
# ERROR HANDLERS
# ============================================================================

@app.errorhandler(413)
def request_too_large(error):
    """Handle file too large"""
    return jsonify({
        "status": "error",
        "message": "File too large (max 10MB)"
    }), 413


@app.errorhandler(404)
def not_found(error):
    """Handle 404 errors"""
    return jsonify({
        "status": "error",
        "message": "Endpoint not found"
    }), 404


@app.errorhandler(500)
def internal_error(error):
    """Handle 500 errors"""
    logger.error(f"Internal error: {error}")
    return jsonify({
        "status": "error",
        "message": "Internal server error"
    }), 500


# ============================================================================
# MAIN
# ============================================================================

if __name__ == '__main__':
    logger.info("=" * 60)
    logger.info("Starting cmd-f 2026 project...")
    logger.info("=" * 60)
    logger.info("Initialized services:")
    for service_name, service_obj in services.items():
        status = "✓" if service_obj else "✗"
        logger.info(f"  {status} {service_name}")
    logger.info("")
    logger.info("Available endpoints:")
    logger.info("  POST   /api/prescription/upload-text  - Upload text")
    logger.info("  POST   /api/prescription/upload-file  - Upload file")
    logger.info("  GET    /api/prescription/<user_id>    - Get prescription")
    logger.info("  POST   /api/task/break                 - Break goal into tasks")
    logger.info("  GET    /api/health                    - Health check")
    logger.info("")
    logger.info("Server running on http://0.0.0.0:5000")
    logger.info("=" * 60)


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)