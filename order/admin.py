from django.contrib import admin
from .models import  Order,OrderItem
# Register your models here.
class OrderProductInline(admin.TabularInline):
    model = OrderItem
    readonly_fields = ('order', 'product', 'price', 'quantity')
    extra = 0
    fields = ('product', 'price', 'quantity')  # Optional: Only allow these fields to be edited

class OrderAdmin(admin.ModelAdmin):
    list_display = [
        'order_id', 'full_name', 'address1', 'state', 'city', 'phone', 'post_code', 
        'created', 'updated', 'total_paid', 'billing_status', 'is_ordered',
    ]
    list_filter = ['status', 'is_ordered']
    search_fields = ['full_name', 'phone']  # Updated to 'full_name' instead of 'first_name'
    list_per_page = 20
    inlines = [OrderProductInline]

# Register the models
admin.site.register(Order, OrderAdmin)
