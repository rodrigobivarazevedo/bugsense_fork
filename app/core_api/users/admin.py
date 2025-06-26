from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import CustomUser, QRCode, Results


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

    list_display = ('id', 'email', 'full_name', 'is_active',
                    'is_staff', 'assigned_doctor_id')
    search_fields = ('id', 'email', 'full_name', 'phone_number')
    list_filter = ('is_staff', 'is_active', 'gender', 'country')

    def get_queryset(self, request):
        qs = super().get_queryset(request)
        return qs.filter(is_doctor=False)


@admin.register(QRCode)
class QRCodeAdmin(admin.ModelAdmin):
    list_display = ('id', 'user_id_display', 'user_email',
                    'qr_data_preview', 'created_at')
    list_filter = ('created_at',)
    search_fields = ('user__email', 'user__full_name', 'qr_data')
    readonly_fields = ('created_at',)
    ordering = ('-created_at',)

    fieldsets = (
        ('QR Code Information', {
            'fields': ('user', 'qr_data')
        }),
        ('Timestamps', {
            'fields': ('created_at',),
            'classes': ('collapse',)
        }),
    )

    def user_email(self, obj):
        return obj.user.email
    user_email.short_description = 'User Email'
    user_email.admin_order_field = 'user__email'

    def user_id_display(self, obj):
        return obj.user.id
    user_id_display.short_description = 'User ID'
    user_id_display.admin_order_field = 'user__id'

    def qr_data_preview(self, obj):
        """Show a preview of the QR data (first 50 characters)"""
        if len(obj.qr_data) > 50:
            return f"{obj.qr_data[:50]}..."
        return obj.qr_data
    qr_data_preview.short_description = 'QR Data Preview'


@admin.register(Results)
class ResultsAdmin(admin.ModelAdmin):
    list_display = ('id', 'user_id_display', 'user_email', 'infection_status',
                    'species_preview', 'antibiotic_preview', 'created_at')
    list_filter = ('infection_detected', 'created_at')
    search_fields = ('user__email', 'user__full_name', 'species', 'antibiotic')
    readonly_fields = ('created_at',)
    ordering = ('-created_at',)

    fieldsets = (
        ('Patient Information', {
            'fields': ('user', 'qr_code')
        }),
        ('Analysis Results', {
            'fields': ('infection_detected', 'species', 'concentration', 'antibiotic')
        }),
        ('Timestamps', {
            'fields': ('created_at',),
            'classes': ('collapse',)
        }),
    )

    def user_email(self, obj):
        return obj.user.email
    user_email.short_description = 'User Email'
    user_email.admin_order_field = 'user__email'

    def user_id_display(self, obj):
        return obj.user.id
    user_id_display.short_description = 'User ID'
    user_id_display.admin_order_field = 'user__id'

    def infection_status(self, obj):
        return "Infected" if obj.infection_detected else "No Infection"
    infection_status.short_description = 'Infection Status'
    infection_status.admin_order_field = 'infection_detected'

    def species_preview(self, obj):
        """Show a preview of the species (first 30 characters)"""
        if obj.species and len(obj.species) > 30:
            return f"{obj.species[:30]}..."
        return obj.species or "-"
    species_preview.short_description = 'Species'

    def antibiotic_preview(self, obj):
        """Show a preview of the antibiotic (first 30 characters)"""
        if obj.antibiotic and len(obj.antibiotic) > 30:
            return f"{obj.antibiotic[:30]}..."
        return obj.antibiotic or "-"
    antibiotic_preview.short_description = 'Antibiotic'
