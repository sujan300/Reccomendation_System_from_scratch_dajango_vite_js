from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static

urlpatterns = [
    path('admin/', admin.site.urls),
    path('account/', include('account.urls')),
    path('store/',include('store.urls')),
    path('cart/',include('cart.urls')),
    path('order/',include('order.urls')),
] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)

admin.site.site_title = "Admin Login Form"
admin.site.index_title ="E-Shop"
admin.site.site_header = "E-Shop Recommendation System"
