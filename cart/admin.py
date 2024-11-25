from django.contrib import admin
from .models import CartItem

# Register your models here.

class CartItemAdmin(admin.ModelAdmin):
    list_display = ("user","product","quantity","is_active")
    
    
admin.site.register(CartItem,CartItemAdmin)
