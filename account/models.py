from django.db import models
from django.contrib.auth.base_user import AbstractBaseUser, BaseUserManager
from django.utils import timezone

# Create your models here.
class MyAccountManager(BaseUserManager):
    def create_user(self,email,password=None, **extra_fields):
        if not email:
            raise ValueError("user must have a email account !")

        user = self.model(
            email= self.normalize_email(email), **extra_fields
        )
        user.set_password(password)
        user.save(using = self._db)
        return user


    def create_superuser(self,email,password,**extra_fields):
        user=self.create_user(email,password,**extra_fields)
        user.is_admin=True
        user.is_active=True
        user.is_staff=True
        user.is_superadmin=True
        user.is_superuser = True  # Updated field
        user.save(using=self._db)
        return user




class AuthModel(AbstractBaseUser):
    name = models.CharField(max_length=200)
    email= models.EmailField(max_length=100,unique=True)

    date_joined  = models.DateTimeField(auto_now_add=True)
    last_login   = models.DateTimeField(auto_now_add=True)
    is_admin     = models.BooleanField(default=False)
    is_staff     = models.BooleanField(default=False)
    is_active    = models.BooleanField(default=False)
    is_superadmin= models.BooleanField(default=False)

    # USERNAME_FIELD 
    USERNAME_FIELD  ="email"
    REQUIRED_FIELDS =["name"]

    objects= MyAccountManager()

    def __str__(self):
        return self.email
    
    def has_perm(self,perm,obj=None):
        return self.is_admin
    
    def has_module_perms(self,add_label):
        return True
    
    
    
class OtpEmail(models.Model):
    otp = models.IntegerField()
    user= models.ForeignKey(AuthModel, on_delete=models.CASCADE)
    created_at = models.DateTimeField(default=timezone.now)

    def __str__(self):
        return str(self.otp)