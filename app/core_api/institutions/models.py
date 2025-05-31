from django.db import models
from django.utils.translation import gettext_lazy as _


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


class Doctor(models.Model):
    id = models.AutoField(primary_key=True, null=False)
    full_name = models.CharField(_('Full Name'), max_length=200)
    email = models.EmailField(_('Email Address'), unique=True)
    phone = models.CharField(_('Phone Number'), max_length=20)
    specialization = models.CharField(_('Specialization'), max_length=100)
    institution = models.ForeignKey(
        Institution,
        on_delete=models.CASCADE,
        related_name='doctors',
        verbose_name=_('Institution')
    )
    is_active = models.BooleanField(_('Is Active'), default=True)
    created_at = models.DateTimeField(_('Created At'), auto_now_add=True)
    updated_at = models.DateTimeField(_('Updated At'), auto_now=True)

    class Meta:
        verbose_name = _('Doctor')
        verbose_name_plural = _('Doctors')
        ordering = ['-created_at']

    def __str__(self):
        return self.full_name
