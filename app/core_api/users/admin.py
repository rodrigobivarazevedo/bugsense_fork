from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import CustomUser


@admin.register(CustomUser)
class CustomUserAdmin(UserAdmin):
    # Use email for ordering instead of username
    ordering = ('email',)

    # Remove username field references, use email
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

    list_display = ('email', 'full_name', 'is_active', 'is_staff')
    search_fields = ('email', 'full_name', 'phone_number')
    list_filter = ('is_staff', 'is_active', 'gender', 'country')
    # Remove username from UserAdmin defaults entirely
