from django.contrib.auth.models import AbstractUser
from django.contrib.auth.base_user import BaseUserManager
from django.db import models
from django.contrib.auth.hashers import make_password, check_password


class CustomUserManager(BaseUserManager):
    """
    Custom user manager where email is the unique identifiers
    for authentication instead of usernames.
    """
    use_in_migrations = True

    def create_user(self, email, password=None, **extra_fields):
        """
        Create and save a User with the given email and password.
        """
        if not email:
            raise ValueError('The Email must be set')
        email = self.normalize_email(email).lower()
        user = self.model(email=email, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, email, password=None, **extra_fields):
        """
        Create and save a SuperUser with the given email and password.
        """
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)
        extra_fields.setdefault('is_active', True)

        if extra_fields.get('is_staff') is not True:
            raise ValueError('Superuser must have is_staff=True.')
        if extra_fields.get('is_superuser') is not True:
            raise ValueError('Superuser must have is_superuser=True.')

        return self.create_user(email, password, **extra_fields)


class CustomUser(AbstractUser):
    username = None

    email = models.EmailField('email address', unique=True)

    full_name = models.CharField(max_length=255)
    gender = models.CharField(
        max_length=10,
        choices=[('Male', 'Male'), ('Female', 'Female'), ('Other', 'Other')],
        blank=True
    )
    dob = models.DateField('date of birth', null=True, blank=True)
    phone_number = models.CharField(
        max_length=20, unique=False, null=True, blank=True)
    date_joined = models.DateField('joined date', null=True, blank=True)

    street = models.CharField(max_length=255, blank=True)
    city = models.CharField(max_length=100, blank=True)
    postcode = models.CharField(max_length=20, blank=True)
    country = models.CharField(max_length=100, blank=True)

    # Security Questions
    security_question_1 = models.CharField(
        max_length=255,
        verbose_name='Security Question 1',
        help_text='First security question for account recovery',
        blank=True
    )
    security_answer_1 = models.CharField(
        max_length=255,
        verbose_name='Security Answer 1',
        help_text='Answer to the first security question',
        blank=True
    )
    security_question_2 = models.CharField(
        max_length=255,
        verbose_name='Security Question 2',
        help_text='Second security question for account recovery',
        blank=True
    )
    security_answer_2 = models.CharField(
        max_length=255,
        verbose_name='Security Answer 2',
        help_text='Answer to the second security question',
        blank=True
    )
    security_question_3 = models.CharField(
        max_length=255,
        verbose_name='Security Question 3',
        help_text='Third security question for account recovery',
        blank=True
    )
    security_answer_3 = models.CharField(
        max_length=255,
        verbose_name='Security Answer 3',
        help_text='Answer to the third security question',
        blank=True
    )

    is_doctor = models.BooleanField(default=False)
    assigned_doctor = models.ForeignKey(
        'institutions.Doctor',
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='patients',
        verbose_name='Assigned Doctor'
    )

    # Password Reset Token
    password_reset_token = models.CharField(
        max_length=255,
        verbose_name='Password Reset Token',
        help_text='One-time token for password reset',
        blank=True,
        null=True
    )
    password_reset_token_created = models.DateTimeField(
        verbose_name='Password Reset Token Created',
        help_text='When the password reset token was created',
        null=True,
        blank=True
    )

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = []

    objects = CustomUserManager()

    def _hash_security_answers(self):
        """Hash security answers before saving"""
        if self.security_answer_1 and not self.security_answer_1.startswith('pbkdf2_sha256$'):
            self.security_answer_1 = make_password(self.security_answer_1)
        if self.security_answer_2 and not self.security_answer_2.startswith('pbkdf2_sha256$'):
            self.security_answer_2 = make_password(self.security_answer_2)
        if self.security_answer_3 and not self.security_answer_3.startswith('pbkdf2_sha256$'):
            self.security_answer_3 = make_password(self.security_answer_3)

    def save(self, *args, **kwargs):
        self._hash_security_answers()
        super().save(*args, **kwargs)

    def check_security_answer(self, answer_number, answer):
        """Check if a security answer is correct"""
        if answer_number == 1:
            return check_password(answer, self.security_answer_1)
        elif answer_number == 2:
            return check_password(answer, self.security_answer_2)
        elif answer_number == 3:
            return check_password(answer, self.security_answer_3)
        return False

    def __str__(self):
        return self.email


class QRCode(models.Model):
    """
    QR Code model linked to a user
    """
    user = models.ForeignKey(
        CustomUser,
        on_delete=models.CASCADE,
        related_name='qr_codes',
        verbose_name='User'
    )
    qr_data = models.TextField(
        verbose_name='QR Code Data',
        help_text='The string data contained in the scanned QR code'
    )
    created_at = models.DateTimeField(auto_now_add=True)
    closed_at = models.DateTimeField(
        null=True,
        blank=True,
        verbose_name='Closed At',
        help_text='Timestamp when the QR code analysis was closed'
    )

    class Meta:
        verbose_name = 'QR Code'
        verbose_name_plural = 'QR Codes'
        ordering = ['-created_at']

    def __str__(self):
        return f"QR Code for {self.user.email}"


class Results(models.Model):
    """
    Results model for QR code analysis
    """
    STATUS_CHOICES = [
        ('ongoing', 'Ongoing'),
        ('preliminary_assessment', 'Preliminary Assessment'),
        ('ready', 'Ready'),
        ('closed', 'Closed'),
    ]

    user = models.ForeignKey(
        CustomUser,
        on_delete=models.CASCADE,
        related_name='results',
        verbose_name='User'
    )
    qr_code = models.ForeignKey(
        QRCode,
        on_delete=models.CASCADE,
        related_name='results',
        verbose_name='QR Code'
    )
    status = models.CharField(
        max_length=25,
        choices=STATUS_CHOICES,
        default='ongoing',
        verbose_name='Status',
        help_text='Current status of the result analysis'
    )
    infection_detected = models.BooleanField(
        verbose_name='Infection Detected',
        help_text='Whether an infection is present (True) or not (False)',
        null=True,
        blank=True
    )
    species = models.CharField(
        max_length=255,
        verbose_name='Species',
        help_text='The species of bacteria or pathogen detected',
        blank=True
    )
    concentration = models.CharField(
        max_length=100,
        verbose_name='Concentration',
        help_text='The concentration level of the detected pathogen',
        blank=True
    )
    antibiotic = models.CharField(
        max_length=255,
        verbose_name='Antibiotic',
        help_text='Recommended antibiotic treatment',
        blank=True
    )
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        verbose_name = 'Result'
        verbose_name_plural = 'Results'
        ordering = ['-created_at']

    def __str__(self):
        infection_status = "Infected" if self.infection_detected else "No Infection"
        return f"Result for {self.user.email} - {infection_status} ({self.created_at.strftime('%Y-%m-%d %H:%M')})"
