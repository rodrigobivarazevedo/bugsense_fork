from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework.generics import RetrieveUpdateAPIView
from rest_framework.permissions import IsAuthenticated
from .serializers import CustomTokenObtainPairSerializer, UserSerializer


class LoginView(TokenObtainPairView):
    """
    POST /api/login/  with { email, password }
    returns { access, refresh, user: { … } }
    """
    serializer_class = CustomTokenObtainPairSerializer


class CurrentUserView(RetrieveUpdateAPIView):
    """
    GET  /api/users/me/       → returns the logged-in user’s profile
    PUT  /api/users/me/       → update profile
    """
    serializer_class = UserSerializer
    permission_classes = [IsAuthenticated]

    def get_object(self):
        # simply return the User instance for the current token
        return self.request.user
