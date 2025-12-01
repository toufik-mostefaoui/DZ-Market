from django.urls import path
from .views import *

urlpatterns = [
    path("register/", RegisterView.as_view()),
    path("login/", LoginView.as_view()),
    path("verify/<int:user_id>/<str:token>/", VerifyEmail.as_view()),
    path("password/change/", CustomPasswordChangeView.as_view(), name="password_change"),
    path("password/reset/", PasswordResetRequestView.as_view(), name="password_reset"),
    path("password/reset/confirm/<int:uid>/<str:token>/", PasswordResetConfirmView.as_view(), name="password_reset_confirm"),

    path("admins/", AdminCRUD.as_view()),
    path("admins/<int:pk>/", AdminDetail.as_view()),

    path("clients/", ClientCRUD.as_view()),
    path("clients/<int:pk>/", ClientDetail.as_view()),

    path("vendeurs/", VendeurCRUD.as_view()),
    path("vendeurs/<int:pk>/", VendeurDetail.as_view()),
]
