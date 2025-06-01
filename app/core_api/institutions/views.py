from django.shortcuts import render
from rest_framework import viewsets, status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework_simplejwt.tokens import RefreshToken
from django.shortcuts import get_object_or_404
from rest_framework.views import APIView
from rest_framework.permissions import BasePermission
from .models import Institution, Doctor
from .serializers import (
    InstitutionSerializer,
    DoctorSerializer,
    DoctorLoginSerializer,
    DoctorRegistrationSerializer
)


class IsDoctor(BasePermission):
    def has_permission(self, request, view):
        return hasattr(request, 'auth') and 'doctor_id' in request.auth


class InstitutionViewSet(viewsets.ModelViewSet):
    """
    GET /api/institutions/ → returns list of institutions for dropdown
    GET /api/institutions/{id}/ → returns specific institution details
    POST /api/institutions/ → create a new institution
    """
    queryset = Institution.objects.all()
    serializer_class = InstitutionSerializer

    permission_classes = [AllowAny]
    http_method_names = ['get', 'post']


class DoctorViewSet(viewsets.ReadOnlyModelViewSet):
    """
    GET /api/doctors/ → returns list of all active doctors
    GET /api/doctors/?institution_id={id} → returns doctors for specific institution
    GET /api/doctors/{id}/ → returns specific doctor details
    """
    lookup_field = 'doctor_id'
    queryset = Doctor.objects.filter(is_active=True)
    serializer_class = DoctorSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        institution_id = self.request.query_params.get('institution_id')
        if institution_id:
            return Doctor.objects.filter(institution_id=institution_id, is_active=True)
        return Doctor.objects.filter(is_active=True)


class DoctorRegistrationView(APIView):
    """
    POST /api/doctor-register/ with doctor data
    returns { access, refresh, doctor: { … } }
    """
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = DoctorRegistrationSerializer(data=request.data)
        if serializer.is_valid():
            doctor = serializer.save()

            # Create a custom token payload
            refresh = RefreshToken.for_user(doctor)
            # Use normal id for user identification
            refresh['user_id'] = doctor.pk
            refresh['institution_id'] = doctor.institution.id
            refresh['full_name'] = doctor.full_name
            refresh['email'] = doctor.email

            return Response({
                'refresh': str(refresh),
                'access': str(refresh.access_token),
                'doctor': DoctorSerializer(doctor).data
            })

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class DoctorLoginView(APIView):
    """
    POST /api/doctor-login/ with { doctor_id, password }
    returns { access, refresh, doctor: { … } }
    """
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = DoctorLoginSerializer(data=request.data)
        if serializer.is_valid():
            doctor = serializer.validated_data['doctor']

            # Create a custom token payload
            refresh = RefreshToken.for_user(doctor)
            # Use normal id for user identification
            refresh['user_id'] = doctor.pk
            refresh['institution_id'] = doctor.institution.id
            refresh['full_name'] = doctor.full_name
            refresh['email'] = doctor.email

            return Response({
                'refresh': str(refresh),
                'access': str(refresh.access_token),
                'doctor': DoctorSerializer(doctor).data
            })

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
