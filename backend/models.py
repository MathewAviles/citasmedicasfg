from app import db
from datetime import datetime

class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(120), unique=True, nullable=False)
    name = db.Column(db.String(120), nullable=True)
    password = db.Column(db.String(120), nullable=False)
    phone_number = db.Column(db.String(20), nullable=True)
    role = db.Column(db.String(80), nullable=False, default='patient')
    calendar_id = db.Column(db.String(200), nullable=True)

    # Relationships
    appointments_as_patient = db.relationship('Appointment', foreign_keys='Appointment.patient_id', backref='patient', lazy=True)
    appointments_as_doctor = db.relationship('Appointment', foreign_keys='Appointment.doctor_id', backref='doctor', lazy=True)

class Appointment(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    patient_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    doctor_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    appointment_time = db.Column(db.DateTime, nullable=False, default=datetime.utcnow)
    reason = db.Column(db.String(200), nullable=True)
    status = db.Column(db.String(20), nullable=False, default='Confirmada')
