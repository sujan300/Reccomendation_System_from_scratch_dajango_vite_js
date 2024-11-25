from rest_framework import serializers
from .models import AuthModel 


class SignUpSerializer(serializers.ModelSerializer):
    class Meta:
        model = AuthModel
        fields = ['name', 'email', 'password']
        
    def validate_email(self, value):
        if AuthModel.objects.filter(email=value).exists():
            raise serializers.ValidationError("User Already Exists with this email !")
        return value

    def create(self, validated_data):
        user = AuthModel(**validated_data)
        user.set_password(validated_data['password'])
        user.is_active = False
        user.save()
        return user
