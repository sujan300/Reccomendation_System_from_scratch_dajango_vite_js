# appname/urls.py
from django.urls import path
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from . import views

urlpatterns = [
    path('login', views.UserLoginView.as_view(), name='login'),
    path('logout', views.logout_user, name='logout'),
    path('csrf-token-get', views.get_csrf_token, name='csrf_get'),
    path('validate-email/<str:token>/<int:uid>/', views.ValidateUserView.as_view(), name="validate_email"),
    path('forgetpassword',views.ForgetPasswordView.as_view(),name="forgetpassword"),
    path('change-validate/<str:token>/',views.ChangeValidatePasswordView.as_view(),name='validate'),
    path('change-password/<str:token>/',views.ChangePasswordView.as_view(),name="change_password"),
    path('signup', views.UserSignup.as_view(), name='signup'),
    path('status/', views.check_login_status, name='check_login_status'),
    path('token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('user-dashoard',views.GetUserDashBoardView.as_view(),name="user_dashboard"),
    
]