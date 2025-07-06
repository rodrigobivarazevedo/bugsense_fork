from django.db import models
from django.utils.translation import gettext_lazy as _
from users.models import CustomUser
from django.db.models import Max


class Institution(models.Model):
    id = models.AutoField(primary_key=True, null=False)
    name = models.CharField(_('Institution Name'), max_length=255)
    address = models.TextField(_('Address'))
    phone = models.CharField(_('Phone Number'), max_length=20)
    email = models.EmailField(_('Email Address'))
    website = models.URLField(_('Website'), blank=True, null=True)
    created_at = models.DateTimeField(_('Created At'), auto_now_add=True)
    updated_at = models.DateTimeField(_('Updated At'), auto_now=True)

    class Meta:
        verbose_name = _('Institution')
        verbose_name_plural = _('Institutions')
        ordering = ['-created_at']

    def __str__(self):
        return self.name


class DoctorManager(CustomUser.objects.__class__):
    def create_user(self, email, password=None, **extra_fields):
        print("DEBUG: create_user called with email:", email,
              "institution:", extra_fields.get('institution'))
        if not email:
            raise ValueError('The Email must be set')
        if 'institution' not in extra_fields:
            raise ValueError('Institution is required for Doctor')

        email = self.normalize_email(email).lower()
        user = Doctor(
            email=email,
            full_name=extra_fields.get('full_name'),
            phone_number=extra_fields.get('phone_number'),
            institution=extra_fields.get('institution'),
        )

        user.set_password(password)
        user.save(using=self._db)
        return user


class Doctor(CustomUser):
    doctor_id = models.CharField(
        _('Doctor ID'),
        max_length=50,
        unique=True,
        editable=False  # Make it non-editable since it's auto-generated
    )
    institution = models.ForeignKey(
        Institution,
        on_delete=models.CASCADE,
        related_name='doctors',
        verbose_name=_('Institution')
    )
    created_at = models.DateTimeField(_('Created At'), auto_now_add=True)
    updated_at = models.DateTimeField(_('Updated At'), auto_now=True)

    objects = DoctorManager()

    class Meta:
        verbose_name = _('Doctor')
        verbose_name_plural = _('Doctors')
        ordering = ['-created_at']

    def __str__(self):
        return self.full_name

    def save(self, *args, **kwargs):
        if not self.institution_id:
            raise ValueError("Institution is required for Doctor")

        if not self.doctor_id:
            # Get the highest existing doctor number
            max_doctor = Doctor.objects.aggregate(Max('doctor_id'))
            max_id = max_doctor['doctor_id__max']

            if max_id:
                try:
                    # Extract the number part and increment
                    current_num = int(max_id[3:])
                    new_num = current_num + 1
                except (ValueError, IndexError):
                    # If there's any issue with the format, start with 1
                    new_num = 1
            else:
                # If no doctors exist yet, start with 1
                new_num = 1

            # Format the new doctor ID
            self.doctor_id = f"DOC{new_num:04d}"

        self.is_doctor = True
        super().save(*args, **kwargs)
