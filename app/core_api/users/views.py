from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework.generics import RetrieveUpdateDestroyAPIView
from rest_framework.permissions import IsAuthenticated
from .serializers import CustomTokenObtainPairSerializer, UserSerializer, LogoutSerializer
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework_simplejwt.tokens import RefreshToken, TokenError


class LoginView(TokenObtainPairView):
    """
    POST /api/login/  with { email, password }
    returns { access, refresh, user: { … } }
    """
    serializer_class = CustomTokenObtainPairSerializer


class CurrentUserView(RetrieveUpdateDestroyAPIView):
    """
    GET  /api/users/me/       → returns the logged-in user’s profile
    PUT  /api/users/me/       → update profile
    DELETE /api/users/me/    → delete account
    """
    serializer_class = UserSerializer
    permission_classes = [IsAuthenticated]

    def get_object(self):
        # simply return the User instance for the current token
        return self.request.user


class LogoutView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        serializer = LogoutSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        try:
            RefreshToken(serializer.validated_data['refresh']).blacklist()
        except TokenError:
            return Response(status=status.HTTP_400_BAD_REQUEST)
        return Response(status=status.HTTP_204_NO_CONTENT)
