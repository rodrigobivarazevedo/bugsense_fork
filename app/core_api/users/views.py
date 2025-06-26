from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework.generics import RetrieveUpdateDestroyAPIView, CreateAPIView, ListAPIView
from rest_framework.permissions import IsAuthenticated
from .serializers import (
    CustomTokenObtainPairSerializer,
    UserSerializer,
    LogoutSerializer,
    RegisterSerializer,
    QRCodeSerializer,
    QRCodeCreateSerializer,
)
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework_simplejwt.tokens import RefreshToken, TokenError
from .models import QRCode


class LoginView(TokenObtainPairView):
    """
    POST /api/login/  with { email, password }
    returns { access, refresh, user: { … } }
    """

    serializer_class = CustomTokenObtainPairSerializer

    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        try:
            serializer.is_valid(raise_exception=True)
        except Exception:
            raise

        user = getattr(serializer, 'user', None)
        if user is not None and getattr(user, 'is_doctor', False):
            return Response(
                {'detail': 'Invalid credentials.'},
                status=status.HTTP_400_BAD_REQUEST
            )

        return Response(serializer.validated_data, status=status.HTTP_200_OK)


class CurrentUserView(RetrieveUpdateDestroyAPIView):
    """
    GET  /api/users/me/       → returns the logged-in user's profile
    PUT  /api/users/me/       → update profile (partial updates allowed)
    DELETE /api/users/me/    → delete account
    """

    serializer_class = UserSerializer
    permission_classes = [IsAuthenticated]

    def get_object(self):
        return self.request.user

    def update(self, request, *args, **kwargs):
        partial = True
        instance = self.get_object()
        serializer = self.get_serializer(
            instance, data=request.data, partial=partial)
        serializer.is_valid(raise_exception=True)
        self.perform_update(serializer)
        return Response(serializer.data)


class LogoutView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        serializer = LogoutSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        try:
            RefreshToken(serializer.validated_data["refresh"]).blacklist()
        except TokenError:
            return Response(status=status.HTTP_400_BAD_REQUEST)
        return Response(status=status.HTTP_204_NO_CONTENT)


class RegisterView(CreateAPIView):
    """
    POST /api/register/ with user data
    """
    serializer_class = RegisterSerializer


class QRCodeCreateView(CreateAPIView):
    """
    POST /api/qr-codes/ with { user_id, qr_data }
    Creates a new QR code entry for the specified user
    """
    serializer_class = QRCodeCreateSerializer
    permission_classes = [IsAuthenticated]

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        qr_code = serializer.save()

        # Return the created QR code with full details
        response_serializer = QRCodeSerializer(qr_code)
        return Response(response_serializer.data, status=status.HTTP_201_CREATED)


class QRCodeListView(ListAPIView):
    """
    GET /api/qr-codes/ - List all QR codes for the authenticated user
    GET /api/qr-codes/?user_id=X - List QR codes for a specific user (admin only)
    """
    serializer_class = QRCodeSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user_id = self.request.query_params.get('user_id')

        # If user_id is provided and user is staff, return QR codes for that user
        if user_id and self.request.user.is_staff:
            return QRCode.objects.filter(user_id=user_id)

        # Otherwise, return QR codes for the authenticated user
        return QRCode.objects.filter(user=self.request.user)


class QRCodeDetailView(RetrieveUpdateDestroyAPIView):
    """
    GET /api/qr-codes/{id}/ - Get specific QR code details
    PUT /api/qr-codes/{id}/ - Update QR code
    DELETE /api/qr-codes/{id}/ - Delete QR code
    """
    serializer_class = QRCodeSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        # Staff can access any QR code, regular users only their own
        if self.request.user.is_staff:
            return QRCode.objects.all()
        return QRCode.objects.filter(user=self.request.user)
