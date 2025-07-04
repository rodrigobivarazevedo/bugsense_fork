from django.core.management.base import BaseCommand, CommandError
from users.models import CustomUser
from institutions.models import Doctor, Institution


class Command(BaseCommand):
    help = 'Link a doctor to an institution and a patient to a doctor.'

    def add_arguments(self, parser):
        parser.add_argument('--doctor_email', type=str,
                            required=True, help='Email of the doctor user')
        parser.add_argument('--patient_email', type=str,
                            required=True, help='Email of the patient user')
        parser.add_argument('--institution_id', type=int, required=True,
                            help='ID of the institution to link the doctor to')

    def handle(self, *args, **options):
        doctor_email = options['doctor_email']
        patient_email = options['patient_email']
        institution_id = options['institution_id']

        try:
            doctor_user = CustomUser.objects.get(email=doctor_email)
        except CustomUser.DoesNotExist:
            raise CommandError(
                f'Doctor user with email {doctor_email} does not exist.')

        try:
            patient_user = CustomUser.objects.get(email=patient_email)
        except CustomUser.DoesNotExist:
            raise CommandError(
                f'Patient user with email {patient_email} does not exist.')

        try:
            institution = Institution.objects.get(id=institution_id)
        except Institution.DoesNotExist:
            raise CommandError(
                f'Institution with id {institution_id} does not exist.')

        # Promote doctor_user to Doctor by creating a Doctor instance with the same PK
        if not Doctor.objects.filter(id=doctor_user.id).exists():
            doctor = Doctor(
                id=doctor_user.id,
                email=doctor_user.email,
                full_name=doctor_user.full_name,
                gender=doctor_user.gender,
                dob=doctor_user.dob,
                phone_number=doctor_user.phone_number,
                street=doctor_user.street,
                city=doctor_user.city,
                postcode=doctor_user.postcode,
                country=doctor_user.country,
                is_staff=True,
                is_doctor=True,
                institution=institution,
            )
            doctor.set_password(doctor_user.password)
            doctor.save()
        else:
            doctor = Doctor.objects.get(id=doctor_user.id)
            doctor.institution = institution
            doctor.is_staff = True
            doctor.is_doctor = True
            doctor.save()

        # Link patient to doctor
        patient_user.assigned_doctor = doctor
        patient_user.save()

        self.stdout.write(self.style.SUCCESS(
            f'Successfully linked doctor {doctor_email} to institution {institution_id} and patient {patient_email} to doctor {doctor_email}.'
        ))
