from django.contrib import admin
from .models import Institution, Doctor


@admin.register(Institution)
class InstitutionAdmin(admin.ModelAdmin):
    list_display = ('name', 'email', 'phone', 'created_at')
    search_fields = ('name', 'email', 'phone')
    list_filter = ('created_at',)


@admin.register(Doctor)
class DoctorAdmin(admin.ModelAdmin):
    list_display = ('full_name', 'email', 'specialization',
                    'institution', 'is_active')
    search_fields = ('full_name', 'email', 'specialization')
    list_filter = ('is_active', 'specialization', 'institution')
    raw_id_fields = ('institution',)
