from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework import serializers
from .models import CustomUser, QRCode
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
    class Meta:
        model = QRCode
        fields = [
            'id',
            'user',
            'qr_data',
            'created_at',
            'updated_at'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']


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

        return QRCode.objects.create(user=user, **validated_data)
