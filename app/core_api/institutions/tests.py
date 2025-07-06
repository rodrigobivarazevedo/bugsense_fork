from django.urls import reverse
from rest_framework.test import APITestCase
from rest_framework import status
from .models import Institution, Doctor
from django.contrib.auth import get_user_model
from rest_framework_simplejwt.tokens import RefreshToken

User = get_user_model()


class InstitutionTests(APITestCase):
    def setUp(self):
        # Create test institution directly in the DB
        self.institution = Institution.objects.create(
            name="Test Hospital",
            address="123 Test St",
            phone="1234567890",
            email="test@hospital.com",
        )

        # Create a regular user (needed to authenticate for POST/GET detail, though GET list/detail are AllowAny)
        self.user = User.objects.create_user(
            email="testuser@example.com",
            password="testpass123",
            full_name="Test User",
            phone_number="0000000000",
        )

        # Issue a token so that any endpoint requiring IsAuthenticated will work
        refresh = RefreshToken.for_user(self.user)
        self.client.credentials(HTTP_AUTHORIZATION=f"Bearer {refresh.access_token}")

    def test_list_institutions(self):
        """GET /api/institutions/ should return the one institution we created."""
        url = reverse("institution-list")
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        # We created exactly one institution in setUp
        self.assertEqual(len(response.data), 1)

    def test_create_institution(self):
        """POST /api/institutions/ should create a new institution."""
        url = reverse("institution-list")
        data = {
            "name": "New Hospital",
            "email": "new@hospital.com",
            "phone": "0987654321",
            # Note: 'address' is omitted because InstitutionSerializer only has ['id','name','email','phone']
        }
        response = self.client.post(url, data, format="json")
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(Institution.objects.count(), 2)

    def test_retrieve_institution(self):
        """GET /api/institutions/{id}/ should return that institution's details."""
        url = reverse("institution-detail", args=[self.institution.id])
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["name"], "Test Hospital")


class DoctorTests(APITestCase):
    def setUp(self):
        # Create a test institution for doctors to belong to
        self.institution = Institution.objects.create(
            name="Test Hospital",
            address="123 Test St",
            phone="1234567890",
            email="test@hospital.com",
        )

        # Create one doctor via the custom manager
        self.doctor = Doctor.objects.create_user(
            email="doctor@test.com",
            password="testpass123",
            full_name="Dr. Test Doctor",
            phone_number="1234567890",
            institution=self.institution,
        )

    def test_doctor_registration(self):
        """POST /api/doctor-register/ should register a new doctor."""
        url = reverse("doctor-register")
        data = {
            "email": "newdoctor@test.com",
            "password": "newpass123",
            "full_name": "Dr. New Doctor",
            "phone_number": "0987654321",
            "institution": self.institution.id,
        }
        response = self.client.post(url, data, format="json")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn("access", response.data)
        self.assertIn("refresh", response.data)
        self.assertIn("doctor", response.data)

    def test_doctor_login(self):
        """POST /api/doctor-login/ should return tokens for an existing doctor."""
        url = reverse("doctor-login")
        data = {
            "institution_id": self.institution.id,
            "doctor_id": self.doctor.doctor_id,
            "password": "testpass123",
        }
        response = self.client.post(url, data, format="json")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn("access", response.data)
        self.assertIn("refresh", response.data)
        self.assertIn("doctor", response.data)

    def test_list_doctors(self):
        """
        GET /api/doctors/ should return a list containing the one doctor we created.
        Requires authentication, so we create a separate user and obtain a token.
        """
        # Create a regular user to authenticate
        user = User.objects.create_user(
            email="listuser@example.com",
            password="testpass123",
            full_name="List User",
            phone_number="1111111111",
        )
        refresh = RefreshToken.for_user(user)
        self.client.credentials(HTTP_AUTHORIZATION=f"Bearer {refresh.access_token}")

        url = reverse("doctor-list")
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        # Exactly one doctor exists in the DB
        self.assertEqual(len(response.data), 1)

    def test_list_doctors_by_institution(self):
        """
        GET /api/doctors/?institution_id={id} should return doctors for that institution.
        Here, exactly one doctor belongs to self.institution.
        """
        # Authenticate again as a regular user
        user = User.objects.create_user(
            email="filteruser@example.com",
            password="testpass123",
            full_name="Filter User",
            phone_number="2222222222",
        )
        refresh = RefreshToken.for_user(user)
        self.client.credentials(HTTP_AUTHORIZATION=f"Bearer {refresh.access_token}")

        url = f"{reverse('doctor-list')}?institution_id={self.institution.id}"
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        # Only one doctor has institution = self.institution
        self.assertEqual(len(response.data), 1)

    def test_retrieve_doctor(self):
        """
        GET /api/doctors/{doctor_id}/ should return that doctor's details.
        Authenticate as any user (permission is IsAuthenticated).
        """
        # Authenticate
        user = User.objects.create_user(
            email="retrieveuser@example.com",
            password="testpass123",
            full_name="Retrieve User",
            phone_number="3333333333",
        )
        refresh = RefreshToken.for_user(user)
        self.client.credentials(HTTP_AUTHORIZATION=f"Bearer {refresh.access_token}")

        url = reverse("doctor-detail", args=[self.doctor.doctor_id])
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["email"], "doctor@test.com")
