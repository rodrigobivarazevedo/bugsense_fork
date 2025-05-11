from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework import serializers
from .models import CustomUser


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

    class Meta:
        model = CustomUser
        fields = [
            "email",
            "full_name",
            "gender",
            "dob",
            "phone_number",
            "street",
            "city",
            "postcode",
            "country",
            "password",
        ]

    def create(self, validated_data):
        user = CustomUser.objects.create_user(
            email=validated_data["email"],
            password=validated_data["password"],
            full_name=validated_data.get("full_name", ""),
            gender=validated_data.get("gender", ""),
            dob=validated_data.get("dob", None),
            phone_number=validated_data.get("phone_number", ""),
            street=validated_data.get("street", ""),
            city=validated_data.get("city", ""),
            postcode=validated_data.get("postcode", ""),
            country=validated_data.get("country", ""),
        )
        return user
