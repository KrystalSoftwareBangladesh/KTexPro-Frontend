from django.shortcuts import render, redirect
from .models import Student
from .forms import StudentForm
from django.contrib import messages

def home(request):
	all_students = Student.objects.all
	return render(request, 'home.html', {'all_students': all_students})

def add_student(request):
	if request.method == 'POST':
		form = StudentForm(request.POST or None)
		if form.is_valid():
			form.save()
			messages.success(request, ('Student Added'))
			return render(request, 'form.html')
	else:
		return render(request, 'form.html')

def list_student(request):
	all_students = Student.objects.all
	return render(request, 'list.html', {'all_students': all_students})

def delete_student(request, student_id):
	student = Student.objects.get(pk=student_id)
	student.delete()
	messages.success(request, ('Student Deleted'))
	return redirect('list_student')

def edit_student(request, student_id):
	if request.method == 'POST':
		student = Student.objects.get(pk=student_id)
		form = StudentForm(request.POST or None, instance=student)
		if form.is_valid():
			form.save()
			messages.success(request, ('Student Has Been Edited'))
			return redirect('list_student')
	else:
		student = Student.objects.get(pk=student_id)
		# print(student)
		return render(request, 'edit.html', {'student': student})

def student_profile(request, student_id):
	student = Student.objects.get(pk=student_id)
	return render(request, 'profile.html', {'student': student})