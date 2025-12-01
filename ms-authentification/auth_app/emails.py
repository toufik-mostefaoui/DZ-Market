from django.core.mail import send_mail

def send_verification_email(user, token):
    link = f"http://127.0.0.1:8000/custom-auth/verify/{user.pk}/{token}/"
    send_mail(
        "Verify your email",
        f"Click to verify your account: {link}",
        "noreply@msauth.com",
        [user.email]
    )
