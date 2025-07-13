from django.shortcuts import render
from rest_framework import viewsets, status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny, BasePermission
from rest_framework_simplejwt.tokens import RefreshToken
from django.shortcuts import get_object_or_404
from rest_framework.views import APIView
from rest_framework.generics import ListAPIView
from .models import Institution, Doctor
from .serializers import (
    InstitutionSerializer,
    DoctorSerializer,
    DoctorLoginSerializer,
    DoctorRegistrationSerializer,
)
from users.serializers import UserSerializer
from drf_spectacular.utils import extend_schema, OpenApiExample, OpenApiParameter


class IsDoctor(BasePermission):
    def has_permission(self, request, view):
        return hasattr(request, "auth") and "doctor_id" in request.auth


class InstitutionViewSet(viewsets.ModelViewSet):
    """
    GET /api/institutions/ → returns list of institutions for dropdown
    GET /api/institutions/{id}/ → returns specific institution details
    POST /api/institutions/ → create a new institution
    """

    queryset = Institution.objects.all()
    serializer_class = InstitutionSerializer

    permission_classes = [AllowAny]
    http_method_names = ["get", "post"]

    @extend_schema(
        tags=["institutions"],
        summary="List Institutions",
        description="Retrieve a list of all institutions. This endpoint is publicly accessible.",
        responses={200: InstitutionSerializer(many=True)},
    )
    def list(self, request, *args, **kwargs):
        return super().list(request, *args, **kwargs)

    @extend_schema(
        tags=["institutions"],
        summary="Get Institution Details",
        description="Retrieve details of a specific institution by ID.",
        responses={200: InstitutionSerializer},
    )
    def retrieve(self, request, *args, **kwargs):
        return super().retrieve(request, *args, **kwargs)

    @extend_schema(
        tags=["institutions"],
        summary="Create Institution",
        description="Create a new institution with the provided information.",
        request=InstitutionSerializer,
        responses={201: InstitutionSerializer},
    )
    def create(self, request, *args, **kwargs):
        return super().create(request, *args, **kwargs)


class DoctorViewSet(viewsets.ReadOnlyModelViewSet):
    """
    GET /api/doctors/ → returns list of all active doctors
    GET /api/doctors/?institution_id={id} → returns doctors for specific institution
    GET /api/doctors/{id}/ → returns specific doctor details
    """

    lookup_field = "doctor_id"
    queryset = Doctor.objects.filter(is_active=True)
    serializer_class = DoctorSerializer
    permission_classes = [IsAuthenticated]

    @extend_schema(
        tags=["doctors"],
        summary="List Doctors",
        description="Retrieve a list of all active doctors. Can be filtered by institution_id query parameter.",
        parameters=[
            OpenApiParameter(
                name="institution_id",
                type=int,
                location=OpenApiParameter.QUERY,
                description="Filter doctors by institution ID",
                required=False,
            )
        ],
        responses={200: DoctorSerializer(many=True)},
    )
    def list(self, request, *args, **kwargs):
        return super().list(request, *args, **kwargs)

    @extend_schema(
        tags=["doctors"],
        summary="Get Doctor Details",
        description="Retrieve details of a specific doctor by doctor_id.",
        responses={200: DoctorSerializer},
    )
    def retrieve(self, request, *args, **kwargs):
        return super().retrieve(request, *args, **kwargs)

    def get_queryset(self):
        institution_id = self.request.query_params.get("institution_id")
        if institution_id:
            return Doctor.objects.filter(institution_id=institution_id, is_active=True)
        return Doctor.objects.filter(is_active=True)


class DoctorRegistrationView(APIView):
    """
    POST /api/doctor-register/ with doctor data
    returns { access, refresh, doctor: { … } }
    """

    permission_classes = [AllowAny]

    @extend_schema(
        tags=["authentication"],
        summary="Doctor Registration",
        description="Register a new doctor with their information and institution. Returns JWT tokens and doctor information upon successful registration.",
        request=DoctorRegistrationSerializer,
        responses={
            200: {
                "type": "object",
                "properties": {
                    "access": {"type": "string", "description": "JWT access token"},
                    "refresh": {"type": "string", "description": "JWT refresh token"},
                    "doctor": {"type": "object", "description": "Doctor information"},
                },
            },
            400: {
                "type": "object",
                "properties": {
                    "email": {"type": "array", "items": {"type": "string"}},
                    "password": {"type": "array", "items": {"type": "string"}},
                    "full_name": {"type": "array", "items": {"type": "string"}},
                    "institution": {"type": "array", "items": {"type": "string"}},
                },
            },
        },
        examples=[
            OpenApiExample(
                "Doctor Registration",
                value={
                    "email": "doctor@hospital.com",
                    "password": "securepassword123",
                    "full_name": "Dr. John Smith",
                    "phone_number": "+1234567890",
                    "institution": 1,
                },
                description="Example of doctor registration with all required fields",
            )
        ],
    )
    def post(self, request):
        serializer = DoctorRegistrationSerializer(data=request.data)
        if serializer.is_valid():
            doctor = serializer.save()

            # Create a custom token payload
            refresh = RefreshToken.for_user(doctor)
            # Use normal id for user identification
            refresh["user_id"] = doctor.pk
            refresh["institution_id"] = doctor.institution.id
            refresh["full_name"] = doctor.full_name
            refresh["email"] = doctor.email

            return Response(
                {
                    "refresh": str(refresh),
                    "access": str(refresh.access_token),
                    "doctor": DoctorSerializer(doctor).data,
                }
            )

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class DoctorLoginView(APIView):
    """
    POST /api/doctor-login/ with { doctor_id, password }
    returns { access, refresh, doctor: { … } }
    """

    permission_classes = [AllowAny]

    @extend_schema(
        tags=["authentication"],
        summary="Doctor Login",
        description="Authenticate a doctor using their institution ID, doctor ID and password. Returns JWT tokens and doctor information.",
        request=DoctorLoginSerializer,
        responses={
            200: {
                "type": "object",
                "properties": {
                    "access": {"type": "string", "description": "JWT access token"},
                    "refresh": {"type": "string", "description": "JWT refresh token"},
                    "doctor": {"type": "object", "description": "Doctor information"},
                },
            },
            400: {
                "type": "object",
                "properties": {
                    "institution_id": {"type": "array", "items": {"type": "string"}},
                    "doctor_id": {"type": "array", "items": {"type": "string"}},
                    "password": {"type": "array", "items": {"type": "string"}},
                },
            },
        },
        examples=[
            OpenApiExample(
                "Successful Login",
                value={
                    "institution_id": 1,
                    "doctor_id": "DOC0001",
                    "password": "securepassword123",
                },
                description="Example of successful doctor login",
            )
        ],
    )
    def post(self, request):
        serializer = DoctorLoginSerializer(data=request.data)
        if serializer.is_valid():
            doctor = serializer.validated_data["doctor"]

            # Create a custom token payload
            refresh = RefreshToken.for_user(doctor)
            # Use normal id for user identification
            refresh["user_id"] = doctor.pk
            refresh["institution_id"] = doctor.institution.id
            refresh["full_name"] = doctor.full_name
            refresh["email"] = doctor.email

            return Response(
                {
                    "refresh": str(refresh),
                    "access": str(refresh.access_token),
                    "doctor": DoctorSerializer(doctor).data,
                }
            )

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class IsDoctorPermission(BasePermission):
    def has_permission(self, request, view):
        return (
            request.user
            and request.user.is_authenticated
            and getattr(request.user, "is_doctor", False)
        )


class DoctorPatientsListView(ListAPIView):
    """
    GET /api/doctor/patients/ - List all users (patients) assigned to the authenticated doctor.
    GET /api/doctor/patients/?patient_id={id} - Get specific patient by ID
    GET /api/doctor/patients/?limit=1 - Get only the first patient
    GET /api/doctor/patients/?email={email} - Get patient by email
    GET /api/doctor/patients/?patient_id={id}&limit=1 - Get specific patient with limit

    This endpoint returns all users (patients) whose `assigned_doctor` is the currently authenticated doctor. 
    The doctor must be authenticated and have `is_doctor=True`.

    **Query Parameters:**
    - `patient_id` (int): Filter by specific patient ID
    - `email` (string): Filter by patient email (case-insensitive)
    - `limit` (int): Limit number of results (e.g., 1 for single patient)

    **Authentication:** Bearer JWT token (doctor)
    **Response:** List of user objects (id, email, full_name, etc.)

    **Examples:**
    - GET /api/doctor/patients/?patient_id=3 → Returns Sarah Johnson
    - GET /api/doctor/patients/?email=sarah.johnson@email.com → Returns Sarah Johnson
    - GET /api/doctor/patients/?limit=1 → Returns first patient only
    - GET /api/doctor/patients/?patient_id=999 → Returns empty array (patient not assigned)
    """

    serializer_class = UserSerializer
    permission_classes = [IsDoctorPermission]

    @extend_schema(
        tags=["doctor"],
        summary="List Patients Linked to Doctor",
        description="Returns all users (patients) whose assigned_doctor is the currently authenticated doctor. Only accessible to authenticated doctors. Use query parameters to filter results and get specific patients.",
        parameters=[
            OpenApiParameter(
                name="patient_id",
                type=int,
                location=OpenApiParameter.QUERY,
                description="Filter by specific patient ID. Returns only the patient with this ID if they are assigned to the authenticated doctor.",
                required=False,
                examples=[
                    OpenApiExample("Get patient by ID", value=3),
                    OpenApiExample("Get patient by ID", value=5),
                ],
            ),
            OpenApiParameter(
                name="email",
                type=str,
                location=OpenApiParameter.QUERY,
                description="Filter by patient email (case-insensitive). Returns only the patient with this email if they are assigned to the authenticated doctor.",
                required=False,
                examples=[
                    OpenApiExample("Get patient by email",
                                   value="sarah.johnson@email.com"),
                    OpenApiExample("Get patient by email",
                                   value="michael.chen@email.com"),
                ],
            ),
            OpenApiParameter(
                name="limit",
                type=int,
                location=OpenApiParameter.QUERY,
                description="Limit number of results. Use 1 to get only the first patient, or any number to limit the total results returned.",
                required=False,
                examples=[
                    OpenApiExample("Get single patient", value=1),
                    OpenApiExample("Get first 2 patients", value=2),
                ],
            ),
        ],
        responses={200: UserSerializer(many=True)},
        examples=[
            OpenApiExample(
                "All Patients Response",
                value=[
                    {
                        "id": 5,
                        "email": "emily.rodriguez@email.com",
                        "full_name": "Emily Rodriguez",
                        "gender": "Female",
                        "dob": "1995-11-08",
                        "phone_number": "+49-40-11223344",
                        "street": "Teststraße 789",
                        "city": "Hamburg",
                        "postcode": "20095",
                        "country": "Germany",
                        "date_joined": "2025-07-07",
                    },
                    {
                        "id": 4,
                        "email": "michael.chen@email.com",
                        "full_name": "Michael Chen",
                        "gender": "Male",
                        "dob": "1988-07-22",
                        "phone_number": "018987654321",
                        "street": "Beispielweg 456",
                        "city": "Munich",
                        "postcode": "80331",
                        "country": "Germany",
                        "date_joined": "2025-07-07",
                    }
                ],
                description="Example response with multiple patients linked to the doctor.",
            ),
            OpenApiExample(
                "Single Patient Response",
                value=[
                    {
                        "id": 3,
                        "email": "sarah.johnson@email.com",
                        "full_name": "Sarah Johnson",
                        "gender": "Female",
                        "dob": "1992-03-15",
                        "phone_number": "015550123",
                        "street": "Musterstrasse 123",
                        "city": "Berlin",
                        "postcode": "10115",
                        "country": "Germany",
                        "date_joined": "2025-07-07",
                    }
                ],
                description="Example response when filtering for a specific patient.",
            ),
            OpenApiExample(
                "Empty Response",
                value=[],
                description="Example response when no patients match the filter criteria or when accessing a patient not assigned to the doctor.",
            ),
        ],
    )
    def get(self, request, *args, **kwargs):
        return super().get(request, *args, **kwargs)

    def get_queryset(self):
        queryset = self.serializer_class.Meta.model.objects.filter(
            assigned_doctor=self.request.user
        )

        # Filter by patient ID
        patient_id = self.request.query_params.get("patient_id")
        if patient_id:
            queryset = queryset.filter(id=patient_id)

        # Filter by email
        email = self.request.query_params.get("email")
        if email:
            queryset = queryset.filter(email__iexact=email)

        # Limit results
        limit = self.request.query_params.get("limit")
        if limit:
            try:
                limit_int = int(limit)
                queryset = queryset[:limit_int]
            except ValueError:
                pass  # Invalid limit parameter, ignore

        return queryset
