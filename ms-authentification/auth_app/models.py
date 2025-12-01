from django.contrib.auth.models import AbstractUser
from django.db import models

class User(AbstractUser):
    email = models.EmailField(unique=True)
    username = models.CharField(max_length=50, unique=True)
    is_verified = models.BooleanField(default=False)
    tel = models.CharField(max_length=10, null=True, blank=True)
    adresse = models.CharField(max_length=80, null=True, blank=True)
    bloque = models.BooleanField(default=False)

    ROLE_CHOICES = (
        ('admin', 'Admin'),
        ('client', 'Client'),
        ('vendeur', 'Vendeur'),
    )
    role = models.CharField(max_length=15, choices=ROLE_CHOICES)

    # Fields specific to Vendeur
    entreprise = models.CharField(max_length=255, null=True, blank=True)
    type_entreprise = models.CharField(max_length=100, null=True, blank=True)
    wilaya = models.CharField(max_length=80, null=True, blank=True)
    registre_commerce = models.CharField(max_length=100, null=True, blank=True)
    nin = models.CharField(max_length=50, null=True, blank=True)

    REQUIRED_FIELDS = ["email", "role"]

    def __str__(self):
        return self.username
