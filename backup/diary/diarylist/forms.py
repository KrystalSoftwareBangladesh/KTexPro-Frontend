from django import forms
from .models import Student

class StudentForm(forms.ModelForm):
	class Meta:
		model = Student
		fields = ["studentFullName",
			"studentDept",
			"studentSession",
			"studentSSC",
			"studentHSC",
			"studentFather",
			"studentMother",
			"studentPresentAddress",
			"studentPermanentAddress",
			"studentEmail"]