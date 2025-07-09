"""
URL configuration for core_api project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/5.2/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path, include
from users.views import LoginView, CurrentUserView, LogoutView, RegisterView, QRCodeCreateView, QRCodeListView, QRCodeDetailView, ResultsCreateView, ResultsListView, ResultsDetailView, PasswordRecoveryQuestionsView, PasswordRecoveryValidateView, PasswordRecoveryResetView, PasswordChangeView
from institutions.views import DoctorLoginView, DoctorRegistrationView, DoctorPatientsListView
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)
from drf_spectacular.views import SpectacularAPIView, SpectacularSwaggerView, SpectacularRedocView

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/login/', LoginView.as_view(), name='login'),
    path('api/doctor-login/', DoctorLoginView.as_view(), name='doctor-login'),
    path('api/doctor-register/', DoctorRegistrationView.as_view(),
         name='doctor-register'),
    path('api/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('api/users/me/', CurrentUserView.as_view(), name='current-user'),
    path('api/logout/', LogoutView.as_view(), name='logout'),
    path('api/register/', RegisterView.as_view(), name='register'),
    path('api/qr-codes/', QRCodeCreateView.as_view(), name='qr-code-create'),
    path('api/qr-codes/list/', QRCodeListView.as_view(), name='qr-code-list'),
    path('api/qr-codes/<int:pk>/',
         QRCodeDetailView.as_view(), name='qr-code-detail'),
    path('api/results/', ResultsCreateView.as_view(), name='results-create'),
    path('api/results/list/', ResultsListView.as_view(), name='results-list'),
    path('api/results/<int:pk>/', ResultsDetailView.as_view(), name='results-detail'),
    path('api/password-recovery/questions/',
         PasswordRecoveryQuestionsView.as_view(), name='password-recovery-questions'),
    path('api/password-recovery/validate/',
         PasswordRecoveryValidateView.as_view(), name='password-recovery-validate'),
    path('api/password-recovery/reset/',
         PasswordRecoveryResetView.as_view(), name='password-recovery-reset'),
    path('api/change-password/',
         PasswordChangeView.as_view(), name='change-password'),
    path('api/', include('institutions.urls')),
    path('api/doctor/patients/', DoctorPatientsListView.as_view(),
         name='doctor-patients'),

    # API Documentation
    path('api/schema/', SpectacularAPIView.as_view(), name='schema'),
    path('api/docs/', SpectacularSwaggerView.as_view(url_name='schema'),
         name='swagger-ui'),
    path('api/redoc/', SpectacularRedocView.as_view(url_name='schema'), name='redoc'),
]
