from django.contrib import admin
from django.urls import path, include
from diarylist import views

urlpatterns = [
    path('admin/', admin.site.urls),
    path('', include('diarylist.urls'))
]
