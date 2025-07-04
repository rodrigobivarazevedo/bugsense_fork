from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import Institution, Doctor


@admin.register(Institution)
class InstitutionAdmin(admin.ModelAdmin):
    list_display = ('id', 'name', 'email', 'phone', 'created_at')
    search_fields = ('name', 'email', 'phone')
    list_filter = ('created_at',)


@admin.register(Doctor)
class DoctorAdmin(UserAdmin):
    list_display = ('doctor_id', 'full_name', 'email',
                    'institution', 'is_active', 'is_doctor')
    search_fields = ('full_name', 'email', 'doctor_id')
    list_filter = ('is_active', 'institution')
    raw_id_fields = ('institution',)

    fieldsets = (
        (None, {
            'fields': ('doctor_id', 'email', 'password')
        }),
        ('Personal Info', {
            'fields': ('full_name', 'phone_number', 'gender', 'dob')
        }),
        ('Institution', {
            'fields': ('institution',)
        }),
        ('Permissions', {
            'fields': ('is_active', 'is_staff', 'is_superuser', 'is_doctor', 'groups', 'user_permissions')
        }),
        ('Important Dates', {
            'fields': ('last_login', 'date_joined')
        }),
    )

    add_fieldsets = (
        (None, {
            'classes': ('wide',),
            'fields': ('email', 'password1', 'password2', 'full_name', 'phone_number', 'institution'),
        }),
    )

    readonly_fields = ('doctor_id',)

    def save_model(self, request, obj, form, change):
        if not change:  # Creating a new doctor
            obj.is_doctor = True
        super().save_model(request, obj, form, change)
