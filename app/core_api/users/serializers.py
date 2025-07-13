from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework import serializers
from .models import CustomUser, QRCode, Results
from django.utils import timezone

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomUser
        fields = [
            "id",
            "email",
            "full_name",
            "gender",
            "dob",
            "phone_number",
            "street",
            "city",
            "postcode",
            "country",
            "date_joined",
            "security_question_1",
            "security_answer_1",
            "security_question_2",
            "security_answer_2",
            "security_question_3",
            "security_answer_3",
        ]
        read_only_fields = ["id"]
        extra_kwargs = {
            "email": {"required": False},
            "full_name": {"required": False},
            "gender": {"required": False},
            "dob": {"required": False},
            "phone_number": {"required": False},
            "street": {"required": False},
            "city": {"required": False},
            "postcode": {"required": False},
            "country": {"required": False},
            "security_question_1": {"required": False},
            "security_answer_1": {"required": False, "write_only": True},
            "security_question_2": {"required": False},
            "security_answer_2": {"required": False, "write_only": True},
            "security_question_3": {"required": False},
            "security_answer_3": {"required": False, "write_only": True},
        }

    def update(self, instance, validated_data):
        security_answers = {}
        for i in range(1, 4):
            answer_field = f"security_answer_{i}"
            if answer_field in validated_data:
                security_answers[answer_field] = validated_data.pop(
                    answer_field)

        for attr, value in validated_data.items():
            setattr(instance, attr, value)

        for field, value in security_answers.items():
            setattr(instance, field, value)

        instance.save()
        return instance


class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)
        token["full_name"] = user.full_name
        return token

    def validate(self, attrs):
        attrs["email"] = attrs.get("email", "").lower()
        data = super().validate(attrs)
        data["user"] = UserSerializer(self.user).data
        return data


class LogoutSerializer(serializers.Serializer):
    refresh = serializers.CharField()


class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, min_length=8)
    email = serializers.EmailField(required=True)
    full_name = serializers.CharField(required=True)

    class Meta:
        model = CustomUser
        fields = [
            "email",
            "full_name",
            "password",
            "security_question_1",
            "security_answer_1",
            "security_question_2",
            "security_answer_2",
            "security_question_3",
            "security_answer_3",
        ]
        extra_kwargs = {
            "security_question_1": {"required": True},
            "security_answer_1": {"required": True},
            "security_question_2": {"required": True},
            "security_answer_2": {"required": True},
            "security_question_3": {"required": True},
            "security_answer_3": {"required": True},
        }

    def create(self, validated_data):
        user = CustomUser.objects.create_user(
            email=validated_data["email"],
            password=validated_data["password"],
            full_name=validated_data["full_name"],
            date_joined=timezone.now().date()
        )

        for i in range(1, 4):
            question_field = f"security_question_{i}"
            answer_field = f"security_answer_{i}"
            setattr(user, question_field, validated_data[question_field])
            setattr(user, answer_field, validated_data[answer_field])

        user.save()
        return user


class QRCodeSerializer(serializers.ModelSerializer):
    result_status = serializers.CharField(
        source='results.first.status', read_only=True)
    result_id = serializers.IntegerField(
        source='results.first.id', read_only=True)

    class Meta:
        model = QRCode
        fields = [
            'id',
            'user',
            'qr_data',
            'created_at',
            'closed_at',
            'result_status',
            'result_id'
        ]
        read_only_fields = ['id', 'created_at', 'result_status', 'result_id']


class QRCodeCreateSerializer(serializers.ModelSerializer):
    user_id = serializers.IntegerField(write_only=True)

    class Meta:
        model = QRCode
        fields = ['user_id', 'qr_data']

    def create(self, validated_data):
        user_id = validated_data.pop('user_id')
        try:
            user = CustomUser.objects.get(id=user_id)
        except CustomUser.DoesNotExist:
            raise serializers.ValidationError(
                {'user_id': 'User with this ID does not exist.'})

        qr_code = QRCode.objects.create(user=user, **validated_data)

        Results.objects.create(
            user=user,
            qr_code=qr_code,
            status='ongoing'
        )

        return qr_code


class ResultsSerializer(serializers.ModelSerializer):
    qr_data = serializers.CharField(source='qr_code.qr_data', read_only=True)
    closed_at = serializers.DateTimeField(source='qr_code.closed_at', read_only=True)

    class Meta:
        model = Results
        fields = [
            'id',
            'user',
            'qr_code',
            'qr_data',
            'status',
            'infection_detected',
            'species',
            'concentration',
            'antibiotic',
            'created_at',
            'closed_at'
        ]
        read_only_fields = ['id', 'created_at', 'qr_data', 'closed_at']


class ResultsCreateSerializer(serializers.ModelSerializer):
    qr_data = serializers.CharField(
        write_only=True, help_text='QR code string to find the associated user')

    class Meta:
        model = Results
        fields = [
            'qr_data',
            'status',
            'infection_detected',
            'species',
            'concentration',
            'antibiotic'
        ]
        extra_kwargs = {
            'status': {'required': False},
            'infection_detected': {'required': False},
            'species': {'required': False},
            'concentration': {'required': False},
            'antibiotic': {'required': False}
        }

    def create(self, validated_data):
        qr_data = validated_data.pop('qr_data')

        try:
            qr_code = QRCode.objects.get(qr_data=qr_data)
            user = qr_code.user
        except QRCode.DoesNotExist:
            raise serializers.ValidationError(
                {'qr_data': 'QR code not found.'})

        try:
            result = Results.objects.get(qr_code=qr_code)
            for field, value in validated_data.items():
                setattr(result, field, value)

            if validated_data:
                if 'infection_detected' in validated_data and validated_data['infection_detected'] is False:
                    result.status = 'ready'
                    result.species = 'sterile'
                    result.concentration = ''
                    result.antibiotic = ''
                    if not qr_code.closed_at:
                        qr_code.closed_at = timezone.now()
                        qr_code.save()
                elif 'infection_detected' in validated_data and validated_data['infection_detected'] is True:
                    if result.species and result.concentration:
                        result.status = 'ready'
                        if not qr_code.closed_at:
                            qr_code.closed_at = timezone.now()
                            qr_code.save()
                    else:
                        result.status = 'preliminary_assessment'
                else:
                    if result.infection_detected and result.species and result.concentration:
                        result.status = 'ready'
                        if not qr_code.closed_at:
                            qr_code.closed_at = timezone.now()
                            qr_code.save()
                    else:
                        result.status = 'preliminary_assessment'

            result.save()
            return result
        except Results.DoesNotExist:
            if 'status' not in validated_data:
                validated_data['status'] = 'ongoing'

            if 'infection_detected' in validated_data and validated_data['infection_detected'] is False:
                validated_data['species'] = 'sterile'
                validated_data['concentration'] = ''
                validated_data['antibiotic'] = ''

            if ('infection_detected' in validated_data and validated_data['infection_detected'] is True and
                'species' in validated_data and validated_data['species'] and
                    'concentration' in validated_data and validated_data['concentration']):
                validated_data['status'] = 'ready'
                if not qr_code.closed_at:
                    qr_code.closed_at = timezone.now()
                    qr_code.save()

            return Results.objects.create(
                user=user,
                qr_code=qr_code,
                **validated_data
            )


class PasswordChangeSerializer(serializers.Serializer):
    old_password = serializers.CharField(write_only=True, required=True)
    new_password = serializers.CharField(
        write_only=True, min_length=8, required=True)

    def validate_old_password(self, value):
        user = self.context['request'].user
        if not user.check_password(value):
            raise serializers.ValidationError("Current password is incorrect.")
        return value

    def validate_new_password(self, value):
        user = self.context['request'].user
        if user.check_password(value):
            raise serializers.ValidationError(
                "New password must be different from current password.")
        return value

    def save(self):
        user = self.context['request'].user
        user.set_password(self.validated_data['new_password'])
        user.save()
        return user
