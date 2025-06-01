from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import CustomUser


@admin.register(CustomUser)
class CustomUserAdmin(UserAdmin):
    ordering = ('email',)

    fieldsets = (
        (None, {'fields': ('email', 'password')}),
        ('Personal Info', {'fields': (
            'full_name', 'gender', 'dob', 'phone_number',
            'street', 'city', 'postcode', 'country'
        )}),
        ('Permissions', {'fields': (
            'is_active', 'is_staff', 'is_superuser', 'groups', 'user_permissions'
        )}),
        ('Important Dates', {'fields': ('last_login', 'date_joined')}),
    )

    add_fieldsets = (
        (None, {
            'classes': ('wide',),
            'fields': ('email', 'password1', 'password2'),
        }),
    )

    def assigned_doctor_id(self, obj):
        if obj.assigned_doctor:
            return obj.assigned_doctor.doctor_id
        return "-"
    assigned_doctor_id.short_description = "Assigned Doctor ID"

    list_display = ('email', 'full_name', 'is_active',
                    'is_staff', 'assigned_doctor_id')
    search_fields = ('email', 'full_name', 'phone_number')
    list_filter = ('is_staff', 'is_active', 'gender', 'country')

    def get_queryset(self, request):
        qs = super().get_queryset(request)
        return qs.filter(is_doctor=False)
