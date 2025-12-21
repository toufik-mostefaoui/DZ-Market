from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework import generics
from rest_framework.permissions import AllowAny
from rest_framework_simplejwt.tokens import RefreshToken

from .models import User
from .serializers import *
from .tokens import email_token
from .emails import send_verification_email

from rest_framework import generics, permissions
from dj_rest_auth.views import PasswordChangeView

from django.contrib.auth.tokens import default_token_generator
from django.contrib.auth import get_user_model
from django.utils.http import urlsafe_base64_decode
from django.utils.encoding import force_str
from rest_framework import status
from django.core.mail import send_mail
from rest_framework.permissions import IsAuthenticated

### REGISTER ###
class RegisterView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        ser = RegisterSerializer(data=request.data)
        ser.is_valid(raise_exception=True)
        user = ser.save()

        token = email_token.make_token(user)
        send_verification_email(user, token)

        return Response({"msg": "Account created. Verify your email."})


### EMAIL VERIFY ###
class VerifyEmail(APIView):
    def get(self, request, user_id, token):
        user = User.objects.get(pk=user_id)
        if email_token.check_token(user, token):
            user.is_verified = True
            user.save()
            return Response({"msg": "Email verified successfully"})
        return Response({"error": "Invalid/expired link"}, status=400)


### LOGIN ###
class LoginView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        ser = LoginSerializer(data=request.data)
        ser.is_valid(raise_exception=True)

        user = ser.validated_data

        refresh = RefreshToken.for_user(user)

        # ✅ ADD CUSTOM CLAIMS
        refresh["username"] = user.username
        refresh["email"] = user.email
        refresh["role"] = user.role
        refresh["is_verified"] = user.is_verified
        refresh["bloque"] = user.bloque

        return Response({
            "access": str(refresh.access_token),
            "refresh": str(refresh)
        })



User = get_user_model()
class CustomPasswordChangeView(PasswordChangeView):
    permission_classes = [permissions.IsAuthenticated]

# Mot de passe oublié → envoyer email avec token
class PasswordResetRequestView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        email = request.data.get("email")
        if not email:
            return Response({"error": "Email required"}, status=status.HTTP_400_BAD_REQUEST)

        try:
            user = User.objects.get(email=email)
        except User.DoesNotExist:
            return Response({"error": "User not found"}, status=status.HTTP_404_NOT_FOUND)

        token = default_token_generator.make_token(user)
        uid = user.pk
        reset_link = f"http://localhost:8000/custom-auth/password/reset/confirm/{uid}/{token}/"
        send_mail(
            "Password reset",
            f"Click the link to reset your password: {reset_link}",
            "noreply@example.com",
            [email],
            fail_silently=False,
        )
        return Response({"message": "Password reset link sent"})
        

# Confirmer le reset
class PasswordResetConfirmView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request, uid, token):
        password = request.data.get("password")
        if not password:
            return Response({"error": "Password required"}, status=status.HTTP_400_BAD_REQUEST)

        try:
            user = User.objects.get(pk=uid)
        except User.DoesNotExist:
            return Response({"error": "Invalid user"}, status=status.HTTP_400_BAD_REQUEST)

        if not default_token_generator.check_token(user, token):
            return Response({"error": "Invalid token"}, status=status.HTTP_400_BAD_REQUEST)

        user.set_password(password)
        user.save()
        return Response({"message": "Password reset successful"})
from rest_framework import generics
from .models import User
from .serializers import AdminSerializer, ClientSerializer, VendeurSerializer

# ---------------- ADMIN ---------------- #
class AdminCRUD(generics.ListCreateAPIView):
    serializer_class = AdminSerializer

    def get_queryset(self):
        return User.objects.filter(role="admin")


class AdminDetail(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = AdminSerializer

    def get_queryset(self):
        return User.objects.filter(role="admin")


# ---------------- CLIENT ---------------- #
class ClientCRUD(generics.ListCreateAPIView):
    serializer_class = ClientSerializer

    def get_queryset(self):
        return User.objects.filter(role="client")


class ClientDetail(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = ClientSerializer

    def get_queryset(self):
        return User.objects.filter(role="client")


# ---------------- VENDEUR ---------------- #
class VendeurCRUD(generics.ListCreateAPIView):
    serializer_class = VendeurSerializer

    def get_queryset(self):
        return User.objects.filter(role="vendeur")


class VendeurDetail(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = VendeurSerializer

    def get_queryset(self):
        return User.objects.filter(role="vendeur")



class VerifyUserStatus(APIView):
    permission_classes = [IsAuthenticated]  # Only authenticated users

    def get(self, request):
        user = request.user
        return Response({
            "username": user.username,
            "email": user.email,
            "role": user.role,
            "is_verified": user.is_verified
        })
