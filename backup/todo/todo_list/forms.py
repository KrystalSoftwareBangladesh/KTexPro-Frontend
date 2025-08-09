from django import forms
from .models import List

class ListForm(forms.ModelForm):
	class Meta:
		model = List
		fields = ["item", "completed"]
	# def __init__(self, arg):
	# 	super(ListForm, self).__init__()
	# 	self.arg = arg
		