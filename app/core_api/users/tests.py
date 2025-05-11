from django.test import TestCase
from django.urls import reverse
from rest_framework.test import APIClient
from rest_framework import status
from django.contrib.auth import get_user_model
from rest_framework_simplejwt.tokens import RefreshToken

User = get_user_model()


class AuthenticationAPITests(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.register_url = reverse('register')
        self.login_url = reverse('login')
        self.logout_url = reverse('logout')
        self.current_user_url = reverse('current-user')
        self.token_refresh_url = reverse('token_refresh')

        # Test user data
        self.user_data = {
            'email': 'test@example.com',
            'password': 'testpass123',
            'full_name': 'Test User',
        }

        # Create a test user
        self.user = User.objects.create_user(
            email=self.user_data['email'],
            password=self.user_data['password'],
            full_name=self.user_data['full_name'],
        )

    def test_register_user(self):
        """Test registering a new user"""
        new_user_data = {
            'email': 'new@example.com',
            'password': 'newpass123',
            'full_name': 'New User',
        }
        response = self.client.post(self.register_url, new_user_data)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertTrue(User.objects.filter(email='new@example.com').exists())

    def test_login_user(self):
        """Test user login"""
        response = self.client.post(self.login_url, {
            'email': self.user_data['email'],
            'password': self.user_data['password']
        })
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('access', response.data)
        self.assertIn('refresh', response.data)

    def test_get_current_user(self):
        """Test getting current user information"""
        # First login to get the token
        login_response = self.client.post(self.login_url, {
            'email': self.user_data['email'],
            'password': self.user_data['password']
        })
        token = login_response.data['access']

        # Set the token in the header
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {token}')

        # Get current user
        response = self.client.get(self.current_user_url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['email'], self.user_data['email'])

    def test_logout_user(self):
        """Test user logout"""
        # First login to get the token
        login_response = self.client.post(self.login_url, {
            'email': self.user_data['email'],
            'password': self.user_data['password']
        })
        token = login_response.data['access']
        refresh_token = login_response.data['refresh']

        # Set the token in the header
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {token}')

        # Send the refresh token in the logout request
        response = self.client.post(
            self.logout_url, {'refresh': refresh_token}, format='json')
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)

    def test_token_refresh(self):
        """Test refreshing the access token"""
        # First login to get the refresh token
        login_response = self.client.post(self.login_url, {
            'email': self.user_data['email'],
            'password': self.user_data['password']
        })
        refresh_token = login_response.data['refresh']

        # Refresh the token
        response = self.client.post(self.token_refresh_url, {
            'refresh': refresh_token,
            'email': self.user_data['email'],
            'password': self.user_data['password']
        }, format='json')
        print(response.data)  # Debug the response
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('access', response.data)
