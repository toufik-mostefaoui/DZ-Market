from rest_framework import serializers
from django.contrib.auth import authenticate
from .models import User

# class UserSerializer(serializers.ModelSerializer):
#     class Meta:
#         model = User
#         fields = ["id", "username", "email", "tel", "adresse", "role", "bloque", "is_verified"]


### REGISTER ###
class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = ["username", "email", "password", "role"]

    def create(self, data):
        user = User.objects.create_user(
            username=data["username"],
            email=data["email"],
            password=data["password"],
            role=data["role"]
        )
        return user
        


### LOGIN ###
class LoginSerializer(serializers.Serializer):
    username = serializers.CharField()
    password = serializers.CharField(write_only=True)

    def validate(self, data):
        user = authenticate(username=data["username"], password=data["password"])
        if not user:
            raise serializers.ValidationError("Invalid credentials")
        if not user.is_verified:
            raise serializers.ValidationError("Email not verified")
        return user


### SPECIAL USER PROFILES ###

class AdminSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        # Only fields relevant to admin
        fields = ["id", "username", "email", "tel", "adresse", "role", "bloque", "is_verified"]

class ClientSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        # Only fields relevant to client
        fields = ["id", "username", "email", "tel", "adresse", "role", "bloque", "is_verified"]

class VendeurSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        # Include vendeur-specific fields
        fields = [
            "id", "username", "email", "tel", "adresse", "role", "bloque", "is_verified",
            "entreprise", "type_entreprise", "wilaya", "registre_commerce", "nin"
        ]