from django.contrib import admin
from .models import Institution, Doctor


@admin.register(Institution)
class InstitutionAdmin(admin.ModelAdmin):
    list_display = ('id', 'name', 'email', 'phone', 'created_at')
    search_fields = ('name', 'email', 'phone')
    list_filter = ('created_at',)


@admin.register(Doctor)
class DoctorAdmin(admin.ModelAdmin):
    list_display = ('doctor_id', 'full_name', 'email',
                    'institution', 'is_active', 'is_doctor')
    search_fields = ('full_name', 'email', 'doctor_id')
    list_filter = ('is_active', 'institution')
    raw_id_fields = ('institution',)
    fieldsets = (
        (None, {
            'fields': ('doctor_id', 'full_name', 'email', 'phone_number', 'institution', 'is_active', 'is_doctor')
        }),
    )
    readonly_fields = ('doctor_id',)
