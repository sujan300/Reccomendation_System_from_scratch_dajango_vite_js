from django.http import HttpResponse
from django.utils.decorators import method_decorator
from django.views.decorators.csrf import csrf_exempt
from django.core.exceptions import ObjectDoesNotExist
from django.contrib.auth import authenticate,login,logout
from django.contrib.auth.hashers import check_password



from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.decorators import api_view
from rest_framework.permissions import AllowAny
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.permissions import IsAuthenticated
from rest_framework_simplejwt.tokens import RefreshToken, AccessToken
from django.contrib.auth.hashers import make_password
from rest_framework_simplejwt.authentication import JWTAuthentication


from django.contrib.auth.tokens import default_token_generator
from django.contrib.sites.shortcuts import get_current_site
from django.template.loader import render_to_string
from django.core.mail import EmailMultiAlternatives
from django.contrib import messages 
import random
from django.shortcuts import get_object_or_404



from .serializer import SignUpSerializer
from .models import OtpEmail,AuthModel



from django.views.decorators.csrf import ensure_csrf_cookie
from django.http import JsonResponse


from .JwtTokenDecode import decode_jwt

@ensure_csrf_cookie
def get_csrf_token(request):
    print("it is inside get_csrf_token()")
    return JsonResponse({'csrfToken': request.META.get('CSRF_COOKIE')})

@api_view(['GET'])
def check_login_status(request):
    if request.user.is_authenticated:
        print("User is logged in")
        return JsonResponse({'loggedIn': True, 'email': request.user.email})
    print("User is not logged in ")
    return JsonResponse({'loggedIn': False})
     
    

def send_custom_mail(request,user,text):
    otp = random.randint(100000, 500000)
    otp_create = OtpEmail.objects.create(otp=otp,user=user)
    otp_create.save()
    mail_subject = text
    message      = render_to_string(
        "email/email_verification.html",
        {
            "otp":otp,
            "user":user,
        }
    )
    to_email=user.email
    send_mail = EmailMultiAlternatives(mail_subject,message,to=[to_email])
    send_mail.attach_alternative(message,"text/html")
    send_mail.send()
    messages.success(request, "please check your email box")
    return True

@method_decorator(csrf_exempt, name='dispatch')
class UserLoginView(APIView):
    permission_classes = [AllowAny]
    def post(self, request, format=None):
        print("the requested data is = ",request.data)
        email = request.data.get('email')
        password = request.data.get('password')
        if AuthModel.objects.filter(email__exact=email).exists():
            user = authenticate(username=email,password=password)
            if user:
                login(request, user)
                refresh = RefreshToken.for_user(user)
                return Response({
                    'refresh': str(refresh),
                    'access': str(refresh.access_token),
                    'message': 'Login Success !',
                    'loggedIn': True,
                })
            else:
                return Response({
                    "message":'password not match try Again !'
                    },
                status=status.HTTP_400_BAD_REQUEST
                )
        else:
            return Response({"message":"Email does't have an Account !"},status=status.HTTP_400_BAD_REQUEST)



def logout_user(request):
    logout(request)
    return HttpResponse("logout function")

@method_decorator(csrf_exempt, name='dispatch')
class UserSignup(APIView):
     def post(self, request, format=None):
        serializer = SignUpSerializer(data=request.data)
        if serializer.is_valid():
            user=serializer.save()
            request.session['uid'] = user.pk
            request.session.save()
            print(user.pk,"user id is >>>>>>>>>>>>>> and session ", request.session['uid'],"all the session",)
            text = "Verify your account on E-shop"
            token = default_token_generator.make_token(user)
            send_custom_mail(request, user, text)
            return Response({"message": "Account successfully","token":token,"uid":user.pk}, status=status.HTTP_201_CREATED)
        else:
            return Response({"message":serializer.errors}, status=status.HTTP_400_BAD_REQUEST)
        
        
@method_decorator(csrf_exempt, name='dispatch')
class ValidateUserView(APIView):
    def post(self, request, token,uid,format=None):
        otp_submit = request.data.get('otp', '').strip()
        print("user is ",request.user)
        if uid is None:
            return Response({"error": "User ID not found in session."}, status=status.HTTP_400_BAD_REQUEST)
        try:
            print("Session data available in ValidateUserView:", request.session.items())
            print("uid is ==== ",uid,otp_submit)
            user = AuthModel.objects.get(pk=uid)
            otp_instance = OtpEmail.objects.filter(user=user).latest('created_at')
        except ObjectDoesNotExist:
            return Response({"error": "Invalid user or OTP."}, status=status.HTTP_400_BAD_REQUEST)
        if default_token_generator.check_token(user, token) and otp_instance is not None:
            if otp_submit == str(otp_instance):
                user.is_active = True
                user.save()
                otp_instance.delete()
                return Response({"message": "Account activated successfully.","user_validate":True}, status=status.HTTP_200_OK)
            else:
                return Response({"error": "OTP does not match. Please try again."}, status=status.HTTP_400_BAD_REQUEST)
        else:
            return Response({"error": "Invalid token or session."}, status=status.HTTP_400_BAD_REQUEST)
        
@method_decorator(csrf_exempt, name='dispatch')       
class ForgetPasswordView(APIView):
    def post(self,request,format=None):
        email = request.data.get('email').strip()
        if AuthModel.objects.filter(email=email).exists():
            user = AuthModel.objects.get(email=email)
            refresh = RefreshToken.for_user(user)
            reset_token = str(refresh.access_token)
            text = "Password recovery code !"
            send_custom_mail(request, user, text)
            return Response({"message":"Valid Email !",'token':reset_token},status=status.HTTP_200_OK)
        else:
            return Response({"message":"Email Dont Have Account !"},status=status.HTTP_400_BAD_REQUEST)
        
        
@method_decorator(csrf_exempt, name='dispatch')       
class ChangeValidatePasswordView(APIView):
    authentication_classes = [JWTAuthentication]
    permission_classes = [AllowAny]
    def post(self,request,token,format=None):
        otp_submit = request.data.get('otp').strip(" ")
        try:
            user = AuthModel.objects.get(pk=int(AccessToken(token)['user_id']))
            otp = OtpEmail.objects.filter(user=user).latest('created_at')
        except (AuthModel.DoesNotExist, OtpEmail.DoesNotExist):
            return Response({"message": "Invalid OTP or user ID!"}, status=status.HTTP_404_NOT_FOUND)
        if otp_submit == str(otp):
            otp.delete()
            print("ussssssssssssssssssssssssssssssssssssssssssssssssssssssssss-------------------------------------->>>>>>>>>>>>>>>>>")
            return Response({"message": "User verified. Proceed to change password.", "password_change": True, 'token': token}, status=status.HTTP_200_OK)
        else:
            return Response({"message": "Invalid OTP or token!"}, status=status.HTTP_400_BAD_REQUEST)
@method_decorator(csrf_exempt, name='dispatch')       
class ChangePasswordView(APIView):
    authentication_classes = [JWTAuthentication]
    permission_classes = [AllowAny]
    def post(self,request,token,format=None):
        password = request.data.get('password')
        try:
            user = AuthModel.objects.get(pk=int(AccessToken(token)['user_id']))
            if user:
                user.set_password(password)
                user.save()
                return Response({'message':"successfully password changed !"},status=status.HTTP_200_OK)
        except:
            return Response({"message":'invalid request !'},status=status.HTTP_400_BAD_REQUEST)
        
        
        
@method_decorator(csrf_exempt, name='dispatch')       
class GetUserDashBoardView(APIView):
    permission_classes = [IsAuthenticated]
    def post(self,request,format=None):
        user_email = request.user.email
        user_full_name = request.user.name
        return Response({"message":"User Found","email":user_email,"name":user_full_name})
    
    