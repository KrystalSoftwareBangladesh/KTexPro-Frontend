from django.db import models

class List(models.Model):
	item = models.CharField(max_length=200)
	completed = models.BooleanField(default=False)
	def __str__(self):
		return self.item + ' | ' + str(self.completed)
	# def __init__(self, arg):
	# 	super(List, self).__init__()
	# 	self.arg = arg
		