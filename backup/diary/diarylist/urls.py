from django.urls import path
from . import views

urlpatterns = [
    path('', views.home, name="home"),
    path('add', views.add_student, name="add_student"),
    path('list', views.list_student, name="list_student"),
    path('delete/<student_id>', views.delete_student, name="delete_student"),
    path('edit/<student_id>', views.edit_student, name="edit_student"),
    path('profile/<student_id>', views.student_profile, name="student_profile")
]
