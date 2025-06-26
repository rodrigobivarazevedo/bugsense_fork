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
    ResultsSerializer,
    ResultsCreateSerializer,
)
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework_simplejwt.tokens import RefreshToken, TokenError
from .models import QRCode, Results
from drf_spectacular.utils import extend_schema, OpenApiParameter, OpenApiExample


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

    @extend_schema(
        tags=['qr-codes'],
        summary="Create QR Code",
        description="Create a new QR code entry for a user. The QR code data is stored as a string and linked to the specified user ID.",
        request=QRCodeCreateSerializer,
        responses={201: QRCodeSerializer},
        examples=[
            OpenApiExample(
                'Valid QR Code Creation',
                value={
                    'user_id': 8,
                    'qr_data': 'https://example.com/sample-qr-data'
                },
                description='Example of creating a QR code for user ID 8'
            )
        ]
    )
    def post(self, request, *args, **kwargs):
        return super().post(request, *args, **kwargs)

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        qr_code = serializer.save()

        # Return the created QR code with full details
        response_serializer = QRCodeSerializer(qr_code)
        return Response(response_serializer.data, status=status.HTTP_201_CREATED)


class QRCodeListView(ListAPIView):
    """
    GET /api/qr-codes/list/ - List all QR codes for the authenticated user
    GET /api/qr-codes/list/?user_id=X - List QR codes for a specific user (admin only)
    """
    serializer_class = QRCodeSerializer
    permission_classes = [IsAuthenticated]

    @extend_schema(
        tags=['qr-codes'],
        summary="List QR Codes",
        description="Retrieve a list of QR codes. Regular users can only see their own QR codes. Staff users can optionally filter by user_id parameter.",
        parameters=[
            OpenApiParameter(
                name='user_id',
                type=int,
                location=OpenApiParameter.QUERY,
                description='Filter QR codes by user ID (staff only)',
                required=False
            )
        ],
        responses={200: QRCodeSerializer(many=True)}
    )
    def get(self, request, *args, **kwargs):
        return super().get(request, *args, **kwargs)

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

    @extend_schema(
        tags=['qr-codes'],
        summary="Get QR Code Details",
        description="Retrieve details of a specific QR code. Users can only access their own QR codes unless they are staff.",
        responses={200: QRCodeSerializer}
    )
    def get(self, request, *args, **kwargs):
        return super().get(request, *args, **kwargs)

    @extend_schema(
        tags=['qr-codes'],
        summary="Update QR Code",
        description="Update an existing QR code. Users can only update their own QR codes unless they are staff.",
        request=QRCodeSerializer,
        responses={200: QRCodeSerializer}
    )
    def put(self, request, *args, **kwargs):
        return super().put(request, *args, **kwargs)

    @extend_schema(
        tags=['qr-codes'],
        summary="Delete QR Code",
        description="Delete a QR code. Users can only delete their own QR codes unless they are staff.",
        responses={204: None}
    )
    def delete(self, request, *args, **kwargs):
        return super().delete(request, *args, **kwargs)

    def get_queryset(self):
        # Staff can access any QR code, regular users only their own
        if self.request.user.is_staff:
            return QRCode.objects.all()
        return QRCode.objects.filter(user=self.request.user)


class ResultsCreateView(CreateAPIView):
    """
    POST /api/results/ with { qr_data, infection_detected, species, concentration, antibiotic }
    Creates a new result entry by finding the user linked to the QR code string
    """
    serializer_class = ResultsCreateSerializer
    permission_classes = [IsAuthenticated]

    @extend_schema(
        tags=['results'],
        summary="Create Analysis Result",
        description="Create a new analysis result by providing the QR code string and analysis data. The system will automatically find the user linked to the QR code.",
        request=ResultsCreateSerializer,
        responses={201: ResultsSerializer},
        examples=[
            OpenApiExample(
                'Infection Detected',
                value={
                    'qr_data': 'https://example.com/sample-qr-data',
                    'infection_detected': True,
                    'species': 'Escherichia coli',
                    'concentration': 'High',
                    'antibiotic': 'Ciprofloxacin'
                },
                description='Example of creating a result for detected infection'
            ),
            OpenApiExample(
                'No Infection',
                value={
                    'qr_data': 'https://example.com/sample-qr-data',
                    'infection_detected': False,
                    'species': '',
                    'concentration': '',
                    'antibiotic': ''
                },
                description='Example of creating a result for no infection detected'
            )
        ]
    )
    def post(self, request, *args, **kwargs):
        return super().post(request, *args, **kwargs)

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        result = serializer.save()

        # Return the created result with full details
        response_serializer = ResultsSerializer(result)
        return Response(response_serializer.data, status=status.HTTP_201_CREATED)


class ResultsListView(ListAPIView):
    """
    GET /api/results/list/ - List all results for the authenticated user
    GET /api/results/list/?user_id=X - (Doctor only) List results for a specific patient by user ID

    - Regular users see only their own results.
    - Staff (doctors) can use the user_id query parameter to view any patient's results.
    """
    serializer_class = ResultsSerializer
    permission_classes = [IsAuthenticated]

    @extend_schema(
        tags=['results'],
        summary="List Analysis Results (Doctor/Patient) — /api/results/list/?user_id={patient_id}",
        description="Retrieve a list of analysis results.\n\n- Regular users see only their own results.\n- Staff (doctors) can use the user_id query parameter to view any patient's results.",
        parameters=[
            OpenApiParameter(
                name='user_id',
                type=int,
                location=OpenApiParameter.QUERY,
                description='(Doctor only) Filter results by patient user ID',
                required=False
            )
        ],
        responses={200: ResultsSerializer(many=True)}
    )
    def get(self, request, *args, **kwargs):
        return super().get(request, *args, **kwargs)

    def get_queryset(self):
        user_id = self.request.query_params.get('user_id')

        # If user_id is provided and user is staff, return results for that user
        if user_id and self.request.user.is_staff:
            return Results.objects.filter(user_id=user_id)

        # Otherwise, return results for the authenticated user
        return Results.objects.filter(user=self.request.user)


class ResultsDetailView(RetrieveUpdateDestroyAPIView):
    """
    GET /api/results/{id}/ - Get specific result details
    PUT /api/results/{id}/ - Update result
    DELETE /api/results/{id}/ - Delete result
    """
    serializer_class = ResultsSerializer
    permission_classes = [IsAuthenticated]

    @extend_schema(
        tags=['results'],
        summary="Get Result Details",
        description="Retrieve details of a specific analysis result. Users can only access their own results unless they are staff.",
        responses={200: ResultsSerializer}
    )
    def get(self, request, *args, **kwargs):
        return super().get(request, *args, **kwargs)

    @extend_schema(
        tags=['results'],
        summary="Update Result",
        description="Update an existing analysis result. Users can only update their own results unless they are staff.",
        request=ResultsSerializer,
        responses={200: ResultsSerializer}
    )
    def put(self, request, *args, **kwargs):
        return super().put(request, *args, **kwargs)

    @extend_schema(
        tags=['results'],
        summary="Delete Result",
        description="Delete an analysis result. Users can only delete their own results unless they are staff.",
        responses={204: None}
    )
    def delete(self, request, *args, **kwargs):
        return super().delete(request, *args, **kwargs)

    def get_queryset(self):
        # Staff can access any result, regular users only their own
        if self.request.user.is_staff:
            return Results.objects.all()
        return Results.objects.filter(user=self.request.user)
