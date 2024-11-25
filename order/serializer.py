from rest_framework import serializers
from .models import Order

class OrderSerializer(serializers.ModelSerializer):
    updated = serializers.DateTimeField(format="%Y-%m-%d %I:%M:%S %p")
    class Meta:
        model = Order
        fields = ["order_id",'full_name', 'phone','total_paid','status','updated']