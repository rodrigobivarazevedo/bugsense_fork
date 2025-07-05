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
from institutions.models import Doctor


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
    Creates a new QR code entry for the specified user and automatically creates an empty result with status 'ongoing'
    """
    serializer_class = QRCodeCreateSerializer
    permission_classes = [IsAuthenticated]

    @extend_schema(
        tags=['qr-codes'],
        summary="Create QR Code",
        description="Create a new QR code entry for a user. The QR code data is stored as a string and linked to the specified user ID. An empty result with status 'ongoing' is automatically created for this QR code.",
        request=QRCodeCreateSerializer,
        responses={201: QRCodeSerializer},
        examples=[
            OpenApiExample(
                'Valid QR Code Creation',
                value={
                    'user_id': 8,
                    'qr_data': 'https://example.com/sample-qr-data'
                },
                description='Example of creating a QR code for user ID 8. This will also create an empty result with status "ongoing".'
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
    POST /api/results/ with { qr_data, status?, infection_detected?, species?, concentration?, antibiotic? }
    Creates a new result entry or updates existing one by finding the user linked to the QR code string.
    All fields except qr_data are optional. If a result already exists for the QR code, it will be updated.
    Note: Results are automatically created with status 'ongoing' when QR codes are created via /api/qr-codes/.

    Automatic Status Updates:
    - When updating an existing result with any field, status automatically changes to 'preliminary_assessment'
    - When updating infection_detected to False, status automatically changes to 'ready'
    - When infection_detected is True and all required fields (species, concentration) are filled, status changes to 'ready'
    - When retrieving a result with status 'ready' via GET request, status automatically changes to 'closed'

    Field Clearing:
    - When infection_detected is set to False, species, concentration, and antibiotic fields are automatically cleared

    Required Fields for Ready Status:
    - When infection_detected is True, both species and concentration must be filled to set status to 'ready'
    - Antibiotic field is optional and does not affect the ready status
    """
    serializer_class = ResultsCreateSerializer
    permission_classes = [IsAuthenticated]

    @extend_schema(
        tags=['results'],
        summary="Create or Update Analysis Result",
        description="Create a new analysis result or update an existing one by providing the QR code string and any analysis data. The system will automatically find the user linked to the QR code. If a result already exists for this QR code, it will be updated with the new data. All fields except qr_data are optional. Note: Results are automatically created with status 'ongoing' when QR codes are created via /api/qr-codes/. When updating existing results, the status automatically changes to 'preliminary_assessment' for any field update, or 'ready' if infection_detected is set to False. When infection_detected is set to False, the species, concentration, and antibiotic fields are automatically cleared. When infection_detected is True and both species and concentration are filled, the status automatically changes to 'ready' (antibiotic is optional). When retrieving a result with status 'ready' via GET request, the status automatically changes to 'closed'.",
        request=ResultsCreateSerializer,
        responses={
            201: ResultsSerializer,
            200: ResultsSerializer
        },
        examples=[
            OpenApiExample(
                'Create New Result',
                value={
                    'qr_data': 'https://example.com/sample-qr-data',
                    'status': 'ongoing'
                },
                description='Example of creating a new result with minimal data'
            ),
            OpenApiExample(
                'Update with Species (Status → preliminary_assessment)',
                value={
                    'qr_data': 'https://example.com/sample-qr-data',
                    'species': 'Escherichia coli'
                },
                description='Example of updating with species - status automatically changes to preliminary_assessment'
            ),
            OpenApiExample(
                'Update with Infection Detected (Status → preliminary_assessment)',
                value={
                    'qr_data': 'https://example.com/sample-qr-data',
                    'infection_detected': True,
                    'species': 'Salmonella'
                },
                description='Example of updating with infection detected - status automatically changes to preliminary_assessment'
            ),
            OpenApiExample(
                'Complete Required Fields (Status → ready)',
                value={
                    'qr_data': 'https://example.com/sample-qr-data',
                    'infection_detected': True,
                    'species': 'E. coli',
                    'concentration': 'High'
                },
                description='Example of completing required fields - status automatically changes to ready (antibiotic optional)'
            ),
            OpenApiExample(
                'Update with No Infection (Status → ready, Fields Cleared)',
                value={
                    'qr_data': 'https://example.com/sample-qr-data',
                    'infection_detected': False
                },
                description='Example of updating with no infection detected - status automatically changes to ready and species/concentration/antibiotic fields are cleared'
            )
        ]
    )
    def post(self, request, *args, **kwargs):
        return super().post(request, *args, **kwargs)

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        # Check if a result already exists for this QR code
        qr_data = request.data.get('qr_data')
        try:
            qr_code = QRCode.objects.get(qr_data=qr_data)
            existing_result = Results.objects.filter(qr_code=qr_code).first()
        except QRCode.DoesNotExist:
            existing_result = None

        result = serializer.save()

        # Return the created/updated result with full details
        response_serializer = ResultsSerializer(result)

        # Return 200 for updates, 201 for new creations
        status_code = status.HTTP_200_OK if existing_result else status.HTTP_201_CREATED
        return Response(response_serializer.data, status=status_code)


class ResultsListView(ListAPIView):
    """
    GET /api/results/list/ - List all results for the authenticated user
    GET /api/results/list/?user_id=X - (Doctor only) List results for a specific patient by user ID

    - Regular users see only their own results.
    - Staff (doctors) can use the user_id query parameter to view any patient's results.
    - Use pending=true to filter results that need attention (status 'ready' or 'preliminary_assessment').
    - Note: When retrieving individual results via GET /api/results/{id}/, results with status 'ready' automatically change to 'closed'.
    """
    serializer_class = ResultsSerializer
    permission_classes = [IsAuthenticated]

    @extend_schema(
        tags=['results'],
        summary="List Analysis Results (Doctor/Patient) — /api/results/list/?user_id={patient_id}",
        description="Retrieve a list of analysis results.\n\n- Regular users see only their own results.\n- Staff (doctors) can use the user_id query parameter to view any patient's results.\n- Use pending=true to filter results that need attention (status 'ready' or 'preliminary_assessment').\n- Note: When retrieving individual results via GET /api/results/{id}/, results with status 'ready' automatically change to 'closed'.",
        parameters=[
            OpenApiParameter(
                name='user_id',
                type=int,
                location=OpenApiParameter.QUERY,
                description='(Doctor only) Filter results by patient user ID',
                required=False
            ),
            OpenApiParameter(
                name='pending',
                type=bool,
                location=OpenApiParameter.QUERY,
                description='Filter to show only results with status "ready" or "preliminary_assessment" (results that need attention)',
                required=False
            ),
            OpenApiParameter(
                name='qr_data',
                type=str,
                location=OpenApiParameter.QUERY,
                description='Filter results by QR code data string',
                required=False
            )
        ],
        responses={200: ResultsSerializer(many=True)},
        examples=[
            OpenApiExample(
                'List All Results (Doctor)',
                value=[
                    {
                        "user_id": 38,
                        "qr_data": "QR_TEST_DATA_001",
                        "status": "closed"
                    },
                    {
                        "user_id": 38,
                        "qr_data": "test-test-test",
                        "status": "preliminary_assessment"
                    }
                ],
                description='Doctor view showing all results for assigned patients (summary format)'
            ),
            OpenApiExample(
                'List Pending Results Only',
                value=[
                    {
                        "user_id": 38,
                        "qr_data": "test-test-test",
                        "status": "preliminary_assessment"
                    }
                ],
                description='Filtered view showing only results that need attention (pending=true)'
            ),
            OpenApiExample(
                'Patient Results (Full Details)',
                value=[
                    {
                        "id": 23,
                        "user": 38,
                        "qr_code": 22,
                        "qr_data": "QR_TEST_DATA_001",
                        "status": "closed",
                        "infection_detected": True,
                        "species": "E. coli",
                        "concentration": "10^6 CFU/ml",
                        "antibiotic": "",
                        "created_at": "2025-07-05T15:02:35.347783Z"
                    }
                ],
                description='Full result details when using qr_data or user_id filters'
            )
        ]
    )
    def get(self, request, *args, **kwargs):
        # If doctor and no qr_data/user_id, return summary for all patients
        qr_data = request.query_params.get('qr_data')
        user_id = request.query_params.get('user_id')
        pending = request.query_params.get('pending', '').lower() == 'true'

        if not qr_data and not user_id and hasattr(request.user, 'is_doctor') and request.user.is_doctor:
            # Get all patients assigned to this doctor
            patients = Doctor.objects.get(id=request.user.id).patients.all()
            # Get all QR codes for these patients
            qr_codes = QRCode.objects.filter(user__in=patients)
            # Get all results for these QR codes
            results = Results.objects.filter(qr_code__in=qr_codes)
            # Filter by pending status if requested
            if pending:
                results = results.filter(
                    status__in=['ready', 'preliminary_assessment'])
            # Return only user_id, qr_data, and result status
            data = [
                {
                    'user_id': r.user.id,
                    'qr_data': r.qr_code.qr_data,
                    'status': r.status
                }
                for r in results
            ]
            return Response(data, status=200)
        # Otherwise, default behavior
        response = super().get(request, *args, **kwargs)

        # If status is 'ready', change it to 'closed' for all results in the response
        if response.status_code == 200 and response.data:
            for result_data in response.data:
                if result_data.get('status') == 'ready':
                    result_id = result_data.get('id')
                    try:
                        result = Results.objects.get(id=result_id)
                        result.status = 'closed'
                        result.save()
                        result_data['status'] = 'closed'
                    except Results.DoesNotExist:
                        pass

        return response

    def get_queryset(self):
        qr_data = self.request.query_params.get('qr_data')
        pending = self.request.query_params.get(
            'pending', '').lower() == 'true'

        if qr_data:
            try:
                qr_code = QRCode.objects.get(qr_data=qr_data)
                queryset = Results.objects.filter(qr_code=qr_code)
                if pending:
                    queryset = queryset.filter(
                        status__in=['ready', 'preliminary_assessment'])
                return queryset
            except QRCode.DoesNotExist:
                return Results.objects.none()

        user_id = self.request.query_params.get('user_id')

        # If user_id is provided and user is staff, return results for that user
        if user_id and self.request.user.is_staff:
            queryset = Results.objects.filter(user_id=user_id)
            if pending:
                queryset = queryset.filter(
                    status__in=['ready', 'preliminary_assessment'])
            return queryset

        # Otherwise, return results for the authenticated user
        queryset = Results.objects.filter(user=self.request.user)
        if pending:
            queryset = queryset.filter(
                status__in=['ready', 'preliminary_assessment'])
        return queryset


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
        description="Retrieve details of a specific analysis result. Users can only access their own results unless they are staff. If the result status is 'ready', it will automatically be changed to 'closed' when retrieved.",
        responses={200: ResultsSerializer}
    )
    def get(self, request, *args, **kwargs):
        # Get the result first
        result = self.get_object()

        # If status is 'ready', change it to 'closed'
        if result.status == 'ready':
            result.status = 'closed'
            result.save()

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
