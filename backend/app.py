from flask import Flask, request, jsonify
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from flask_bcrypt import Bcrypt
from flask_jwt_extended import JWTManager, create_access_token, jwt_required, get_jwt_identity, get_jwt
from flask_cors import CORS
from datetime import datetime, timezone, timedelta
import os
from google.oauth2 import service_account
from googleapiclient.discovery import build

app = Flask(__name__)
CORS(app, origins=["http://localhost:3000", "http://127.0.0.1:3000"], methods=['GET', 'POST', 'PATCH', 'DELETE', 'OPTIONS'], supports_credentials=True, allow_headers=["Content-Type", "Authorization"])

app.config['SQLALCHEMY_DATABASE_URI'] = os.getenv('DATABASE_URL', 'sqlite:///app.db')
app.config['JWT_SECRET_KEY'] = 'super-secret'  # Cambia esto en producción
bcrypt = Bcrypt(app)
jwt = JWTManager(app)
db = SQLAlchemy(app)
migrate = Migrate(app, db)
from models import User, Appointment

# Google Calendar settings
SCOPES = ['https://www.googleapis.com/auth/calendar']
SERVICE_ACCOUNT_FILE = 'google-credentials.json'
if not os.path.exists(SERVICE_ACCOUNT_FILE):
    SERVICE_ACCOUNT_FILE = 'google-credentials.json.json'

def get_calendar_service():
    creds = None
    if os.path.exists(SERVICE_ACCOUNT_FILE):
        creds = service_account.Credentials.from_service_account_file(
            SERVICE_ACCOUNT_FILE, scopes=SCOPES)
    service = build('calendar', 'v3', credentials=creds)
    return service

@app.route('/register', methods=['POST'])
def register():
    data = request.get_json()
    hashed_password = bcrypt.generate_password_hash(data['password']).decode('utf-8')
    new_user = User(
        email=data['email'],
        name=data.get('nombre'),
        password=hashed_password,
        phone_number=data.get('telefono'),
        role='patient'
    )
    db.session.add(new_user)
    db.session.commit()
    return jsonify({"message": "User created successfully"}), 201

@app.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    user = User.query.filter_by(email=data['email']).first()
    if user and bcrypt.check_password_hash(user.password, data['password']):
        access_token = create_access_token(identity=user.email, additional_claims={'role': user.role})
        return jsonify({
            "access_token": access_token,
            "user": {
                "id": user.id,
                "name": user.name,
                "email": user.email,
                "role": user.role,
                "calendar_id": user.calendar_id
            }
        })
    return jsonify({"message": "Invalid credentials"}), 401

@app.route('/doctors', methods=['GET'])
def get_doctors():
    doctors = User.query.filter_by(role='doctor').all()
    output = []
    for doctor in doctors:
        doctor_data = {
            'id': doctor.id,
            'email': doctor.email
        }
        output.append(doctor_data)
    return jsonify({'doctors': output})

@app.route('/appointments', methods=['POST'])
@jwt_required()
def create_appointment():
    current_user_email = get_jwt_identity()
    current_user_role = get_jwt()['role']

    if current_user_role != 'patient':
        return jsonify({"message": "Only patients can create appointments"}), 403

    data = request.get_json()
    patient = User.query.filter_by(email=current_user_email).first()
    
    appointment_time_str = data['appointment_time']
    if appointment_time_str.endswith('Z'):
        appointment_time_str = appointment_time_str[:-1] + '+00:00'
    appointment_time_obj = datetime.fromisoformat(appointment_time_str)

    new_appointment = Appointment(
        patient_id=patient.id,
        doctor_id=data['doctor_id'],
        appointment_time=appointment_time_obj,
        reason=data.get('reason')
    )
    db.session.add(new_appointment)
    db.session.commit()

    try:
        doctor = User.query.get(data['doctor_id'])
        calendar_id = doctor.calendar_id or doctor.email

        if doctor and doctor.role == 'doctor':
            service = get_calendar_service()
            
            event = {
                'summary': f"Cita con {patient.name}",
                'description': data.get('reason', 'Sin motivo específico.'),
                'start': {
                    'dateTime': appointment_time_obj.isoformat(),
                    'timeZone': 'UTC',
                },
                'end': {
                    'dateTime': (appointment_time_obj + timedelta(hours=1)).isoformat(),
                    'timeZone': 'UTC',
                },
                'reminders': {
                    'useDefault': False,
                    'overrides': [
                        {'method': 'email', 'minutes': 24 * 60},
                        {'method': 'popup', 'minutes': 60},
                    ],
                },
            }
            
            service.events().insert(calendarId=calendar_id, body=event).execute()
    except Exception as e:
        app.logger.error(f"Failed to create Google Calendar event: {e}")

    return jsonify({"message": "Appointment created successfully"}), 201

@app.route('/appointments/<int:id>/status', methods=['PATCH'])
@jwt_required()
def update_appointment_status(id):
    current_user_email = get_jwt_identity()
    current_user_role = get_jwt()['role']
    user = User.query.filter_by(email=current_user_email).first()

    appointment = Appointment.query.get_or_404(id)

    if current_user_role != 'doctor' or appointment.doctor_id != user.id:
        return jsonify({"message": "Unauthorized"}), 403

    data = request.get_json()
    new_status = data.get('status')

    if new_status not in ['Atendida', 'No Asistió']:
        return jsonify({"message": "Invalid status"}), 400

    appointment.status = new_status
    db.session.commit()

    return jsonify({"message": "Appointment status updated successfully"})


@app.route('/doctors/<int:id>/calendar', methods=['PATCH'])
@jwt_required()
def update_doctor_calendar(id):
    current_user_email = get_jwt_identity()
    user = User.query.filter_by(email=current_user_email).first()

    # Check if the logged-in user is the doctor they are trying to update
    if user.id != id or user.role != 'doctor':
        return jsonify({"message": "Unauthorized"}), 403

    data = request.get_json()
    new_calendar_id = data.get('calendar_id')

    if not new_calendar_id:
        return jsonify({"message": "calendar_id is required"}), 400

    user.calendar_id = new_calendar_id
    db.session.commit()

    return jsonify({"message": f"Calendar ID for doctor {user.email} updated successfully."})


@app.route('/appointments', methods=['GET'])
@jwt_required()
def get_appointments():
    current_user_email = get_jwt_identity()
    current_user_role = get_jwt()['role']
    user = User.query.filter_by(email=current_user_email).first()

    if current_user_role == 'patient':
        appointments = Appointment.query.filter_by(patient_id=user.id).all()
    elif current_user_role == 'doctor':
        appointments = Appointment.query.filter_by(doctor_id=user.id).all()
    else:
        return jsonify({"message": "Invalid role"}), 403

    output = []
    for appointment in appointments:
        utc_time = appointment.appointment_time.replace(tzinfo=timezone.utc)
        appointment_data = {
            'id': appointment.id,
            'patient_id': appointment.patient_id,
            'doctor_id': appointment.doctor_id,
            'appointment_time': utc_time.isoformat(),
            'reason': appointment.reason,
            'status': appointment.status,
            'patient_name': appointment.patient.name,
            'patient_email': appointment.patient.email,
            'doctor_email': appointment.doctor.email
        }
        output.append(appointment_data)

    return jsonify({'appointments': output})

@app.route('/users/<int:id>/profile', methods=['PATCH'])
@jwt_required()
def update_user_profile(id):
    current_user_email = get_jwt_identity()
    user = User.query.filter_by(email=current_user_email).first()

    # Security check: Ensure users can only update their own profile
    if user.id != id:
        return jsonify({"message": "Unauthorized to update this profile"}), 403

    data = request.get_json()
    if 'name' in data:
        user.name = data['name']
    
    db.session.commit()

    return jsonify({"message": "Profile updated successfully"})


@app.route('/')
def index():
    return "¡Hola, mundo! Esta es la API para el agendamiento de citas."

if __name__ == '__main__':
    app.run(debug=True)