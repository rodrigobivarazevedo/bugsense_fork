from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework import serializers
from .models import CustomUser

# Our existing UserSerializer


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomUser
        fields = [
            'id', 'email', 'full_name', 'gender', 'dob', 'phone_number',
            'street', 'city', 'postcode', 'country', 'date_joined'
        ]
        read_only_fields = ['id']

# Extend the JWT pair serializer to embed user info


class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)
        token['full_name'] = user.full_name
        return token

    def validate(self, attrs):
        attrs['email'] = attrs.get('email', '').lower()
        data = super().validate(attrs)
        data['user'] = UserSerializer(self.user).data
        return data


class LogoutSerializer(serializers.Serializer):
    refresh = serializers.CharField()
