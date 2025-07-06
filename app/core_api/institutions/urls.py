from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views

router = DefaultRouter()
router.register('institutions', views.InstitutionViewSet,
                basename='institution')
router.register('doctors', views.DoctorViewSet, basename='doctor')

urlpatterns = [
    path('doctor-register/', views.DoctorRegistrationView.as_view(),
         name='doctor-register'),
    path('doctor-login/', views.DoctorLoginView.as_view(), name='doctor-login'),
    path('', include(router.urls)),
]
