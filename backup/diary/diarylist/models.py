from django.db import models

class Student(models.Model):
	studentFullName = models.CharField(max_length=200)
	studentDept = models.CharField(max_length=200)
	studentSession = models.CharField(max_length=200)
	studentSSC = models.CharField(max_length=5, default=0.00)
	studentHSC = models.CharField(max_length=5, default=0.00)
	studentFather = models.CharField(max_length=200)
	studentMother = models.CharField(max_length=200)
	studentPresentAddress = models.CharField(max_length=200)
	studentPermanentAddress = models.CharField(max_length=200)
	studentEmail = models.CharField(max_length=200)


		