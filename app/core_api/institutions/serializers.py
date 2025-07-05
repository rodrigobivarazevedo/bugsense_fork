from rest_framework import serializers
from .models import Institution, Doctor
from users.serializers import UserSerializer


class InstitutionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Institution
        fields = ["id", "name", "email", "phone"]


class DoctorSerializer(serializers.ModelSerializer):
    institution_name = serializers.CharField(source="institution.name", read_only=True)

    class Meta:
        model = Doctor
        fields = [
            "doctor_id",
            "full_name",
            "email",
            "phone_number",
            "institution",
            "institution_name",
            "is_active",
        ]
        read_only_fields = ["doctor_id"]


class DoctorRegistrationSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, required=True)
    email = serializers.EmailField(required=True)
    full_name = serializers.CharField(required=True)
    phone_number = serializers.CharField(required=False, allow_blank=True)
    institution = serializers.PrimaryKeyRelatedField(
        queryset=Institution.objects.all(), required=True
    )
    doctor_id = serializers.CharField(read_only=True)

    class Meta:
        model = Doctor
        fields = [
            "doctor_id",
            "email",
            "password",
            "full_name",
            "phone_number",
            "institution",
        ]
        read_only_fields = ["doctor_id"]

    def validate_email(self, value):
        if Doctor.objects.filter(email=value).exists():
            raise serializers.ValidationError(
                "A doctor with this email already exists."
            )
        return value

    def create(self, validated_data):
        password = validated_data.pop("password")
        institution = validated_data.pop("institution")
        phone_number = validated_data.pop("phone_number", None)

        doctor = Doctor.objects.create_user(
            email=validated_data["email"],
            password=password,
            full_name=validated_data["full_name"],
            phone_number=phone_number,
            institution=institution,
        )

        return doctor


class DoctorLoginSerializer(serializers.Serializer):
    institution_id = serializers.IntegerField()
    doctor_id = serializers.CharField()
    password = serializers.CharField(write_only=True)

    def validate(self, data):
        institution_id = data.get("institution_id")
        doctor_id = data.get("doctor_id")
        password = data.get("password")

        try:
            doctor = Doctor.objects.get(
                doctor_id=doctor_id, institution_id=institution_id
            )
            if not doctor.check_password(password):
                raise serializers.ValidationError("Invalid credentials")
        except Doctor.DoesNotExist:
            raise serializers.ValidationError("Invalid credentials")

        return {"doctor": doctor}
