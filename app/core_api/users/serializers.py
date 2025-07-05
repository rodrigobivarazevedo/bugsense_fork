from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework import serializers
from .models import CustomUser, QRCode, Results
from django.utils import timezone


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomUser
        fields = [
            "id",
            "email",
            "full_name",
            "gender",
            "dob",
            "phone_number",
            "street",
            "city",
            "postcode",
            "country",
            "date_joined",
        ]
        read_only_fields = ["id"]
        extra_kwargs = {
            "email": {"required": False},
            "full_name": {"required": False},
            "gender": {"required": False},
            "dob": {"required": False},
            "phone_number": {"required": False},
            "street": {"required": False},
            "city": {"required": False},
            "postcode": {"required": False},
            "country": {"required": False},
        }


class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)
        token["full_name"] = user.full_name
        return token

    def validate(self, attrs):
        attrs["email"] = attrs.get("email", "").lower()
        data = super().validate(attrs)
        data["user"] = UserSerializer(self.user).data
        return data


class LogoutSerializer(serializers.Serializer):
    refresh = serializers.CharField()


class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, min_length=8)
    email = serializers.EmailField(required=True)
    full_name = serializers.CharField(required=True)

    class Meta:
        model = CustomUser
        fields = [
            "email",
            "full_name",
            "password",
        ]

    def create(self, validated_data):
        user = CustomUser.objects.create_user(
            email=validated_data["email"],
            password=validated_data["password"],
            full_name=validated_data["full_name"],
            date_joined=timezone.now().date()
        )
        return user


class QRCodeSerializer(serializers.ModelSerializer):
    result_status = serializers.CharField(
        source='results.first.status', read_only=True)
    result_id = serializers.IntegerField(
        source='results.first.id', read_only=True)

    class Meta:
        model = QRCode
        fields = [
            'id',
            'user',
            'qr_data',
            'created_at',
            'closed_at',
            'result_status',
            'result_id'
        ]
        read_only_fields = ['id', 'created_at', 'result_status', 'result_id']


class QRCodeCreateSerializer(serializers.ModelSerializer):
    user_id = serializers.IntegerField(write_only=True)

    class Meta:
        model = QRCode
        fields = ['user_id', 'qr_data']

    def create(self, validated_data):
        user_id = validated_data.pop('user_id')
        try:
            user = CustomUser.objects.get(id=user_id)
        except CustomUser.DoesNotExist:
            raise serializers.ValidationError(
                {'user_id': 'User with this ID does not exist.'})

        # Create the QR code
        qr_code = QRCode.objects.create(user=user, **validated_data)

        # Automatically create an empty result with status 'ongoing'
        Results.objects.create(
            user=user,
            qr_code=qr_code,
            status='ongoing'
        )

        return qr_code


class ResultsSerializer(serializers.ModelSerializer):
    qr_data = serializers.CharField(source='qr_code.qr_data', read_only=True)

    class Meta:
        model = Results
        fields = [
            'id',
            'user',
            'qr_code',
            'qr_data',
            'status',
            'infection_detected',
            'species',
            'concentration',
            'antibiotic',
            'created_at'
        ]
        read_only_fields = ['id', 'created_at', 'qr_data']


class ResultsCreateSerializer(serializers.ModelSerializer):
    qr_data = serializers.CharField(
        write_only=True, help_text='QR code string to find the associated user')

    class Meta:
        model = Results
        fields = [
            'qr_data',
            'status',
            'infection_detected',
            'species',
            'concentration',
            'antibiotic'
        ]
        extra_kwargs = {
            'status': {'required': False},
            'infection_detected': {'required': False},
            'species': {'required': False},
            'concentration': {'required': False},
            'antibiotic': {'required': False},
        }

    def create(self, validated_data):
        qr_data = validated_data.pop('qr_data')

        # Find the QR code by its data string
        try:
            qr_code = QRCode.objects.get(qr_data=qr_data)
        except QRCode.DoesNotExist:
            raise serializers.ValidationError({
                'qr_data': f'No QR code found with data: {qr_data}'
            })

        # Get the user from the QR code
        user = qr_code.user

        # Check if a result already exists for this QR code
        existing_result = Results.objects.filter(qr_code=qr_code).first()

        if existing_result:
            # Update the existing result with new data
            for field, value in validated_data.items():
                if value is not None:  # Only update if value is provided
                    setattr(existing_result, field, value)

            # Auto-update status based on what was updated
            if validated_data:  # If any fields were updated
                if 'infection_detected' in validated_data and validated_data['infection_detected'] is False:
                    # If infection_detected was set to False, change status to 'ready' and clear other fields
                    existing_result.status = 'ready'
                    existing_result.species = ''
                    existing_result.concentration = ''
                    existing_result.antibiotic = ''
                elif 'infection_detected' in validated_data and validated_data['infection_detected'] is True:
                    # If infection_detected was set to True, check if all required fields are filled
                    if existing_result.species and existing_result.concentration:
                        existing_result.status = 'ready'
                    else:
                        existing_result.status = 'preliminary_assessment'
                else:
                    # For other updates, check if infection is true and all required fields are filled
                    if existing_result.infection_detected and existing_result.species and existing_result.concentration:
                        existing_result.status = 'ready'
                    else:
                        existing_result.status = 'preliminary_assessment'

            existing_result.save()
            return existing_result
        else:
            # Create a new result with the found user and QR code
            # Set default status if not provided
            if 'status' not in validated_data:
                validated_data['status'] = 'ongoing'

            # If infection_detected is False in new creation, clear other fields
            if 'infection_detected' in validated_data and validated_data['infection_detected'] is False:
                validated_data['species'] = ''
                validated_data['concentration'] = ''
                validated_data['antibiotic'] = ''

            # If infection_detected is True and all required fields are provided, set status to ready
            if ('infection_detected' in validated_data and validated_data['infection_detected'] is True and
                'species' in validated_data and validated_data['species'] and
                    'concentration' in validated_data and validated_data['concentration']):
                validated_data['status'] = 'ready'

            return Results.objects.create(
                user=user,
                qr_code=qr_code,
                **validated_data
            )
